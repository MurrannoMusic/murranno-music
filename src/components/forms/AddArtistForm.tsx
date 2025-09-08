import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewArtist {
  name: string;
  stageName: string;
  email: string;
}

interface AddArtistFormProps {
  onAdd: (artist: Omit<NewArtist, 'email'> & { email?: string }) => void;
  onCancel: () => void;
}

export const AddArtistForm = ({ onAdd, onCancel }: AddArtistFormProps) => {
  const [newArtist, setNewArtist] = useState<NewArtist>({ 
    name: '', 
    stageName: '', 
    email: '' 
  });

  const handleSubmit = () => {
    if (newArtist.name && newArtist.stageName) {
      onAdd({
        name: newArtist.name,
        stageName: newArtist.stageName,
        email: newArtist.email || undefined
      });
      setNewArtist({ name: '', stageName: '', email: '' });
    }
  };

  return (
    <DialogContent className="mobile-container glass-card border-border/20">
      <DialogHeader>
        <DialogTitle>Add New Artist</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div>
          <Label htmlFor="artistName">Artist Name</Label>
          <Input
            id="artistName"
            placeholder="Real name"
            value={newArtist.name}
            onChange={(e) => setNewArtist({...newArtist, name: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="stageName">Stage Name</Label>
          <Input
            id="stageName"
            placeholder="Performance name"
            value={newArtist.stageName}
            onChange={(e) => setNewArtist({...newArtist, stageName: e.target.value})}
          />
        </div>
        <div>
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="artist@example.com"
            value={newArtist.email}
            onChange={(e) => setNewArtist({...newArtist, email: e.target.value})}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handleSubmit}
            className="flex-1 gradient-primary"
          >
            Add Artist
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};