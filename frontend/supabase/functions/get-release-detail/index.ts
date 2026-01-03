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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const releaseId = url.searchParams.get('id');

    if (!releaseId) {
      return new Response(
        JSON.stringify({ error: 'Release ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching release detail:', releaseId);

    // Fetch release with tracks and streaming data
    const { data: release, error: releaseError } = await supabase
      .from('releases')
      .select(`
        *,
        artist:artists!inner(stage_name, user_id),
        tracks(
          *,
          streaming_data(*)
        )
      `)
      .eq('id', releaseId)
      .single();

    if (releaseError) {
      console.error('Release fetch error:', releaseError);
      throw releaseError;
    }

    // Verify user has access to this release
    const { data: artist } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const hasAccess = release.artist.user_id === user.id;

    if (!hasAccess) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Transform to match frontend format
    const transformedRelease = {
      id: release.id,
      title: release.title,
      artist: release.artist.stage_name,
      type: release.release_type,
      year: new Date(release.release_date).getFullYear(),
      releaseDate: release.release_date,
      coverArt: release.cover_art_url || '/placeholder.svg',
      status: release.status,
      metadata: {
        genre: release.genre || '',
        language: release.language || '',
        label: release.label || '',
        copyright: release.copyright || '',
        upcEan: release.upc_ean || '',
      },
      smartlink: release.smartlink || '',
      tracks: release.tracks?.map((track: any) => ({
        id: track.id,
        title: track.title,
        duration: track.duration,
        isrc: track.isrc,
        trackNumber: track.track_number,
        audioFileUrl: track.audio_file_url,
        streamingData: track.streaming_data || [],
      })) || [],
    };

    console.log('Release detail fetched successfully');

    return new Response(
      JSON.stringify({ release: transformedRelease }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Get release detail error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
