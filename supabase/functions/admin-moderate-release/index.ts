import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get('Authorization')!;
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: isAdmin } = await supabase.rpc('has_admin_role', { _user_id: user.id });
    if (!isAdmin) {
      return new Response(JSON.stringify({ success: false, error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { releaseId, status, reason } = await req.json();

    if (!releaseId || !status) {
      return new Response(JSON.stringify({ success: false, error: 'releaseId and status are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update release status
    const { error: updateError } = await supabase
      .from('releases')
      .update({ status })
      .eq('id', releaseId);

    if (updateError) throw updateError;

    // Log admin action
    await supabase.from('admin_audit_logs').insert({
      admin_id: user.id,
      action: 'MODERATE_RELEASE',
      target_type: 'release',
      target_id: releaseId,
      metadata: { status, reason },
    });

    // Send release status email notification
    try {
      const { error: emailError } = await supabase.functions.invoke('send-release-status-email', {
        body: {
          releaseId,
          status,
          rejectionReason: reason
        }
      });

      if (emailError) {
        console.error('Failed to send release status email:', emailError);
        // Don't fail the whole operation if email fails
      }
    } catch (emailErr) {
      console.error('Error invoking send-release-status-email:', emailErr);
    }

    console.log(`Admin ${user.email} moderated release ${releaseId} to status ${status}`);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error moderating release:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});