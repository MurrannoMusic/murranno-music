import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useReleases } from '@/hooks/useReleases';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageId: string;
  packageTitle: string;
  packagePrice: string;
}

export const CampaignDialog = ({ open, onOpenChange, packageId, packageTitle, packagePrice }: CampaignDialogProps) => {
  const { toast } = useToast();
  const { releases } = useReleases();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    releaseId: '',
    budget: packagePrice.replace('₦', ''),
    platform: packageId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.releaseId) {
      toast({
        title: "Please select a release",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-campaign', {
        body: {
          name: formData.name || `${packageTitle} Campaign`,
          type: packageId,
          platform: packageId,
          release_id: formData.releaseId,
          budget: parseFloat(formData.budget),
          start_date: new Date().toISOString().split('T')[0],
          status: 'Draft',
        }
      });

      if (error) throw error;

      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully. Proceed to payment to activate.",
      });

      onOpenChange(false);
      setFormData({ name: '', releaseId: '', budget: packagePrice.replace('₦', ''), platform: packageId });
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Failed to create campaign",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Start {packageTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-card-foreground">Campaign Name (Optional)</Label>
            <Input
              id="name"
              placeholder={`${packageTitle} Campaign`}
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="release" className="text-card-foreground">Select Release *</Label>
            <Select value={formData.releaseId} onValueChange={(value) => setFormData(prev => ({ ...prev, releaseId: value }))}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Choose a release" />
              </SelectTrigger>
              <SelectContent>
                {releases.length === 0 ? (
                  <SelectItem value="none" disabled>No releases available</SelectItem>
                ) : (
                  releases.map(release => (
                    <SelectItem key={release.id} value={release.id}>
                      {release.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget" className="text-card-foreground">Budget (₦)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
              className="bg-background border-border"
              min="1"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" disabled={loading || releases.length === 0}>
              {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
