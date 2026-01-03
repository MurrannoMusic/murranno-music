import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file: File, folder: string = 'uploads') => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data: { session } } = await supabase.auth.getSession();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-image-cloudinary`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ''}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (!data?.url) throw new Error('No URL returned from upload');

      setProgress(100);
      return { url: data.url, publicId: data.publicId };
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadAudio = async (file: File, folder: string = 'audio') => {
    try {
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data: { session } } = await supabase.auth.getSession();
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-audio-cloudinary`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.access_token ?? ''}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Upload failed (${res.status}): ${errText}`);
      }

      const data = await res.json();
      if (!data?.url) throw new Error('No URL returned from upload');

      setProgress(100);
      return { url: data.url, publicId: data.publicId };
    } catch (error: any) {
      console.error('Error uploading audio:', error);
      throw error;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return {
    uploadImage,
    uploadAudio,
    uploading,
    progress,
  };
};
