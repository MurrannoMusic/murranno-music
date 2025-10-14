const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const AUDIO_FORMATS = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
const IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export const validateAudioFile = (file: File): { valid: boolean; error?: string } => {
  if (!AUDIO_FORMATS.includes(file.type)) {
    return { valid: false, error: 'Please upload an MP3, WAV, or FLAC file' };
  }
  
  if (file.size > MAX_AUDIO_SIZE) {
    return { valid: false, error: 'Audio file must be less than 100MB' };
  }
  
  return { valid: true };
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  if (!IMAGE_FORMATS.includes(file.type)) {
    return { valid: false, error: 'Please upload a JPG, PNG, or WEBP image' };
  }
  
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, error: 'Image must be less than 10MB' };
  }
  
  return { valid: true };
};

export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio');
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(Math.round(audio.duration));
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });
    
    audio.src = url;
  });
};
