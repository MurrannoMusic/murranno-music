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
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { new_tier, email } = await req.json();

    if (!['label', 'agency'].includes(new_tier)) {
      return new Response(
        JSON.stringify({ error: 'Invalid tier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get new plan details
    const { data: plan, error: planError } = await supabaseClient
      .from('subscription_plans')
      .select('*')
      .eq('tier', new_tier)
      .single();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: 'Subscription plan not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize payment for upgrade
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || user.email,
        amount: plan.price_monthly * 100,
        currency: plan.currency,
        metadata: {
          user_id: user.id,
          tier: new_tier,
          subscription: true,
          upgrade: true,
        },
        callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/paystack-verify-subscription`,
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log('Upgrade payment initialization:', paystackData);

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
    console.error('Error in paystack-upgrade-subscription:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
