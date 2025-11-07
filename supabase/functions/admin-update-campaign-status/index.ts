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

    // Check if user has admin role
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_admin_role', {
      _user_id: user.id
    });

    if (roleError || !isAdmin) {
      console.error('Authorization error:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { campaignId, status, adminNotes, rejectionReason } = await req.json();

    if (!campaignId || !status) {
      return new Response(
        JSON.stringify({ error: 'Campaign ID and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Updating campaign status:', { campaignId, status });

    // Build update object
    const updates: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (adminNotes !== undefined) {
      updates.admin_notes = adminNotes;
    }

    if (rejectionReason !== undefined) {
      updates.rejection_reason = rejectionReason;
    }

    // Update campaign
    const { data: campaign, error: updateError } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', campaignId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Log admin action
    await supabase
      .from('admin_audit_logs')
      .insert({
        admin_id: user.id,
        action: 'update_campaign_status',
        target_type: 'campaign',
        target_id: campaignId,
        metadata: {
          old_status: campaign.status,
          new_status: status,
          admin_notes: adminNotes,
          rejection_reason: rejectionReason,
        },
      });

    console.log('Campaign status updated successfully:', campaign.id);

    return new Response(
      JSON.stringify({ success: true, campaign }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Update campaign status error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
