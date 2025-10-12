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
      <Card className="bg-secondary/20 border border-border rounded-[12px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-foreground">{icon}</div>
            <span className="text-sm font-medium text-card-foreground">{name}</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder={placeholder}
              className="bg-background border-border text-sm"
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
    <Card className="bg-secondary/20 border border-border rounded-[12px] hover:bg-secondary/30 transition-smooth">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-foreground">{icon}</div>
            <div>
              <div className="text-sm font-medium text-card-foreground">{name}</div>
              {url ? (
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-success" />
                  Connected
                </div>
              ) : (
                <div className="text-xs text-muted-foreground/50 mt-0.5">Not connected</div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-smooth"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsLocalEditing(true)}
                className="hover:bg-secondary/30"
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
