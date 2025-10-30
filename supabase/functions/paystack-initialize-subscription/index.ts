import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY');
    if (!paystackSecretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { tier, email, full_name } = await req.json();

    if (!['label', 'agency'].includes(tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier. Only label and agency require subscription.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get subscription plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('tier', tier)
      .single();

    if (planError || !plan) {
      console.error('Plan fetch error:', planError);
      return new Response(
        JSON.stringify({ error: 'Subscription plan not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle free subscriptions (for development)
    if (plan.price_monthly === 0) {
      console.log('Free subscription detected, activating directly');
      
      // Update user role
      const { error: roleError } = await supabaseClient
        .from('user_roles')
        .update({ tier })
        .eq('user_id', user.id);

      if (roleError) {
        console.error('Role update error:', roleError);
        return new Response(
          JSON.stringify({ error: 'Failed to update user role' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update subscription to active
      const { error: subError } = await supabaseClient
        .from('subscriptions')
        .update({
          tier,
          status: 'active',
          trial_ends_at: null,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq('user_id', user.id);

      if (subError) {
        console.error('Subscription update error:', subError);
        return new Response(
          JSON.stringify({ error: 'Failed to update subscription' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Free subscription activated',
          redirect_url: tier === 'label' ? '/label-dashboard' : '/agency-dashboard'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Paystack subscription for paid plans
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || user.email,
        amount: plan.price_monthly * 100, // Convert to kobo
        currency: plan.currency,
        metadata: {
          user_id: user.id,
          tier: tier,
          full_name: full_name,
          subscription: true,
        },
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-verify-subscription`,
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log('Paystack response:', paystackData);

    if (!paystackData.status) {
      return new Response(
        JSON.stringify({ error: paystackData.message || 'Payment initialization failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference: paystackData.data.reference,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in paystack-initialize-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
