import { useState } from 'react';
import { ExternalLink, Plus, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StreamingPlatformCardProps {
  name: string;
  icon: React.ReactNode;
  url: string | null;
  onUpdate: (url: string | null) => void;
  isEditing: boolean;
  placeholder: string;
}

export const StreamingPlatformCard = ({
  name,
  icon,
  url,
  onUpdate,
  isEditing,
  placeholder,
}: StreamingPlatformCardProps) => {
  const [editValue, setEditValue] = useState(url || '');
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  const handleSave = () => {
    onUpdate(editValue.trim() || null);
    setIsLocalEditing(false);
  };

  const handleCancel = () => {
    setEditValue(url || '');
    setIsLocalEditing(false);
  };

  if (isEditing || isLocalEditing) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-white/90">{icon}</div>
            <span className="text-sm font-medium text-white/90">{name}</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="bg-white/10 border-white/30 text-white text-sm placeholder:text-white/40"
            />
            <Button size="sm" onClick={handleSave} className="shrink-0">
              <Check className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="shrink-0">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/[0.15] transition-all">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-white/90">{icon}</div>
            <div>
              <div className="text-sm font-medium text-white/90">{name}</div>
              {url ? (
                <div className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-green-400" />
                  Connected
                </div>
              ) : (
                <div className="text-xs text-white/30 mt-0.5">Not connected</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsLocalEditing(true)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
