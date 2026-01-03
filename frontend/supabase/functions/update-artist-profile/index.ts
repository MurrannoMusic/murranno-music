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

    const { 
      stage_name, 
      bio, 
      profile_image, 
      spotify_id, 
      apple_music_id,
      spotify_url,
      youtube_url,
      audiomack_url,
      soundcloud_url,
      apple_music_url,
      deezer_url,
      tidal_url,
      instagram_url,
      facebook_url,
      tiktok_url,
      twitter_url
    } = await req.json();

    console.log('Updating artist profile for user:', user.id);

    // Get artist profile
    const { data: artist, error: fetchError } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (fetchError || !artist) {
      console.error('Artist profile not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Artist profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build update object with only provided fields
    const updates: any = {};
    if (stage_name !== undefined) updates.stage_name = stage_name;
    if (bio !== undefined) updates.bio = bio;
    if (profile_image !== undefined) updates.profile_image = profile_image;
    if (spotify_id !== undefined) updates.spotify_id = spotify_id;
    if (apple_music_id !== undefined) updates.apple_music_id = apple_music_id;
    if (spotify_url !== undefined) updates.spotify_url = spotify_url;
    if (youtube_url !== undefined) updates.youtube_url = youtube_url;
    if (audiomack_url !== undefined) updates.audiomack_url = audiomack_url;
    if (soundcloud_url !== undefined) updates.soundcloud_url = soundcloud_url;
    if (apple_music_url !== undefined) updates.apple_music_url = apple_music_url;
    if (deezer_url !== undefined) updates.deezer_url = deezer_url;
    if (tidal_url !== undefined) updates.tidal_url = tidal_url;
    if (instagram_url !== undefined) updates.instagram_url = instagram_url;
    if (facebook_url !== undefined) updates.facebook_url = facebook_url;
    if (tiktok_url !== undefined) updates.tiktok_url = tiktok_url;
    if (twitter_url !== undefined) updates.twitter_url = twitter_url;

    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No fields to update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update artist profile
    const { data: updatedArtist, error: updateError } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', artist.id)
      .select()
      .single();

    if (updateError) throw updateError;

    console.log('Artist profile updated successfully');

    return new Response(
      JSON.stringify({ success: true, artist: updatedArtist }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Update artist profile error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
