import { useRef } from 'react';
import { Camera, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

  return (
    <div className="relative group">
      <div 
        onClick={handleClick}
        className={`relative w-32 h-32 ${!disabled && 'cursor-pointer'}`}
      >
        <Avatar className="w-32 h-32 border-2 border-white/20">
          <AvatarImage src={imageUrl || undefined} alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20">
            <User className="w-16 h-16 text-white/50" />
          </AvatarFallback>
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
