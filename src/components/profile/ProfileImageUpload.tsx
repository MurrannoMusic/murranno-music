import { useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';

interface ProfileImageUploadProps {
  imageUrl: string | null;
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export const ProfileImageUpload = ({ imageUrl, onImageSelect, disabled }: ProfileImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  // Extract public ID from Cloudinary URL if present
  const getPublicIdFromUrl = (url: string | null) => {
    if (!url) return null;
    if (url.includes('cloudinary.com')) {
      const parts = url.split('/upload/');
      if (parts.length > 1) {
        const pathParts = parts[1].split('/');
        // Remove version (v1234567890) and get the rest
        const publicIdParts = pathParts.filter(p => !p.startsWith('v'));
        return publicIdParts.join('/').replace(/\.[^/.]+$/, ''); // Remove file extension
      }
    }
    return null;
  };

  const publicId = getPublicIdFromUrl(imageUrl);

  return (
    <div className="relative group">
      <div 
        onClick={handleClick}
        className={`relative w-32 h-32 ${!disabled && 'cursor-pointer'}`}
      >
        <Avatar className="w-32 h-32 border-2 border-border">
          {publicId ? (
            <div className="w-full h-full overflow-hidden rounded-full">
              <CloudinaryImage 
                publicId={publicId} 
                alt="Profile" 
                width={128} 
                height={128} 
                crop="fill" 
                gravity="face"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <>
              <AvatarImage src={imageUrl || undefined} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
                <User className="w-16 h-16 text-muted-foreground" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        
        {!disabled && (
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};
