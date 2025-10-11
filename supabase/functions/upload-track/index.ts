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

    const {
      releaseData,
      tracks,
      coverArtFile,
      audioFiles,
    } = await req.json();

    console.log('Upload request from user:', user.id);
    console.log('Release data:', releaseData);
    console.log('Tracks:', tracks?.length);

    // Get or create artist profile
    let { data: artist, error: artistError } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (artistError && artistError.code !== 'PGRST116') {
      throw artistError;
    }

    // Create artist if doesn't exist
    if (!artist) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      const { data: newArtist, error: createError } = await supabase
        .from('artists')
        .insert({
          user_id: user.id,
          stage_name: profile?.full_name || 'Artist',
        })
        .select()
        .single();

      if (createError) throw createError;
      artist = newArtist;
    }

    // Upload cover art if provided
    let coverArtUrl = null;
    if (coverArtFile) {
      const { base64, fileName, contentType } = coverArtFile;
      const fileExt = fileName.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Convert base64 to blob
      const binaryData = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('cover-art')
        .upload(filePath, binaryData, {
          contentType: contentType,
          upsert: false,
        });

      if (uploadError) {
        console.error('Cover art upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('cover-art')
        .getPublicUrl(filePath);

      coverArtUrl = publicUrl;
    }

    // Create release
    const { data: release, error: releaseError } = await supabase
      .from('releases')
      .insert({
        artist_id: artist.id,
        title: releaseData.title,
        release_type: releaseData.type,
        release_date: releaseData.releaseDate,
        cover_art_url: coverArtUrl,
        status: 'Draft',
        genre: releaseData.genre,
        language: releaseData.language,
        label: releaseData.label,
        copyright: releaseData.copyright,
      })
      .select()
      .single();

    if (releaseError) {
      console.error('Release creation error:', releaseError);
      throw releaseError;
    }

    console.log('Release created:', release.id);

    // Upload tracks
    const createdTracks = [];
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      const audioFile = audioFiles?.[i];

      let audioFileUrl = null;
      if (audioFile) {
        const { base64, fileName, contentType } = audioFile;
        const fileExt = fileName.split('.').pop();
        const filePath = `${user.id}/${release.id}/${Date.now()}_${i}.${fileExt}`;

        const binaryData = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('track-uploads')
          .upload(filePath, binaryData, {
            contentType: contentType,
            upsert: false,
          });

        if (uploadError) {
          console.error('Audio file upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('track-uploads')
          .getPublicUrl(filePath);

        audioFileUrl = publicUrl;
      }

      const { data: createdTrack, error: trackError } = await supabase
        .from('tracks')
        .insert({
          release_id: release.id,
          title: track.title,
          duration: track.duration || 0,
          track_number: i + 1,
          audio_file_url: audioFileUrl,
        })
        .select()
        .single();

      if (trackError) {
        console.error('Track creation error:', trackError);
        throw trackError;
      }

      createdTracks.push(createdTrack);
    }

    console.log('Tracks created:', createdTracks.length);

    return new Response(
      JSON.stringify({
        success: true,
        release,
        tracks: createdTracks,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
