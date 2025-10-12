import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching subscription status for user:', user.id);

    // Get user subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          price_monthly,
          currency,
          max_artists,
          features
        )
      `)
      .eq('user_id', user.id)
      .maybeSingle();

    if (subError) throw subError;

    if (!subscription) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          subscription: null,
          message: 'No subscription found'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if trial has expired
    const now = new Date();
    const trialEnded = subscription.trial_ends_at && new Date(subscription.trial_ends_at) < now;
    const isActive = subscription.status === 'active' || subscription.status === 'trial';
    const isTrial = subscription.status === 'trial' && !trialEnded;

    // Calculate days remaining in trial
    let trialDaysRemaining = 0;
    if (isTrial && subscription.trial_ends_at) {
      const trialEnd = new Date(subscription.trial_ends_at);
      const diffTime = trialEnd.getTime() - now.getTime();
      trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    console.log('Subscription status fetched successfully');

    return new Response(
      JSON.stringify({
        success: true,
        subscription: {
          ...subscription,
          isActive,
          isTrial,
          trialEnded,
          trialDaysRemaining,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get subscription status error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
