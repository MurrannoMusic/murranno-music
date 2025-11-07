import { useState } from 'react';
import { Plus, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PageContainer } from '@/components/layout/PageContainer';
import { ArtistCard } from '@/components/cards/ArtistCard';
import { AddArtistForm } from '@/components/forms/AddArtistForm';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { useArtists } from '@/hooks/useArtists';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const ArtistManagement = () => {
  const { artists, loading, refetch } = useArtists();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddArtist = async (artist: { name: string; stageName: string; email?: string }) => {
    try {
      setAdding(true);
      
      const { data, error } = await supabase.functions.invoke('add-artist-to-label', {
        body: {
          stage_name: artist.stageName,
          email: artist.email,
        }
      });

      if (error) throw error;

      toast.success('Artist added successfully');
      setShowAddDialog(false);
      refetch();
    } catch (error: any) {
      console.error('Error adding artist:', error);
      toast.error(error.message || 'Failed to add artist');
    } finally {
      setAdding(false);
    }
  };

  const headerActions = (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-secondary/30 hover:bg-secondary/40 border-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Artist
        </Button>
      </DialogTrigger>
      <AddArtistForm 
        onAdd={handleAddArtist}
        onCancel={() => setShowAddDialog(false)}
      />
    </Dialog>
  );

  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to="/app/label-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 px-4 py-1">
              ARTIST MANAGEMENT
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <AvatarDropdown />
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-4">
          {headerActions}
        </div>
      </div>

      <div className="mobile-container space-y-4 -mt-2">
        {/* Artist Stats */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-card-foreground">{artists.length}</p>
                <p className="text-xs text-muted-foreground">Artists</p>
              </div>
              <div>
                <p className="text-xl font-bold text-card-foreground">
                  {artists.reduce((sum, a) => sum + (a.releases || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Releases</p>
              </div>
              <div>
                <p className="text-xl font-bold text-card-foreground">
                  ₦{artists.reduce((sum, a) => sum + parseFloat(a.revenue || '0'), 0).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Combined Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist List */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground">Your Artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground text-sm">Loading artists...</div>
            ) : artists.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No artists yet. Add your first artist to get started.
              </div>
            ) : (
              artists.map((artist) => (
                <div key={artist.id} className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border hover:bg-secondary/30 transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-card-foreground truncate">{artist.stage_name}</p>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-semibold">{artist.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{artist.releases} releases • {artist.streams} streams</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-card-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 shadow-primary hover:shadow-glow transform hover:scale-[1.02] active:scale-[0.98] text-xs break-words">
                Bulk Payout
              </button>
              
              <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-border text-xs break-words">
                Analytics
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-border text-xs break-words">
                Export Reports
              </button>
              
              <button className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-4 px-3 rounded-[16px] transition-all duration-200 border border-border text-xs break-words">
                Upload Track
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};