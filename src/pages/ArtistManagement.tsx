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

export const ArtistManagement = () => {
  const [artists, setArtists] = useState([
    { id: 'a1', name: 'Luna Sol', stageName: 'Luna Sol', status: 'Active', releases: 8, streams: '12.5K', revenue: '$342' },
    { id: 'a2', name: 'The Echoes', stageName: 'The Echoes', status: 'Active', releases: 6, streams: '8.9K', revenue: '$234' },
    { id: 'a3', name: 'Midnight Drive', stageName: 'Midnight Drive', status: 'Active', releases: 4, streams: '6.2K', revenue: '$178' }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddArtist = (newArtist: { name: string; stageName: string; email?: string }) => {
    const artist = {
      id: `a${Date.now()}`,
      name: newArtist.name,
      stageName: newArtist.stageName,
      status: 'Active',
      releases: 0,
      streams: '0',
      revenue: '$0'
    };
    setArtists([...artists, artist]);
    setShowAddDialog(false);
  };

  const headerActions = (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
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
          <Link to="/label-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
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

      <div className="mobile-container space-y-6 mt-6">
        {/* Artist Stats */}
        <Card className="modern-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-foreground">{artists.length}</p>
                <p className="text-xs text-muted-foreground">Artists</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">18</p>
                <p className="text-xs text-muted-foreground">Total Releases</p>
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">$754</p>
                <p className="text-xs text-muted-foreground">Combined Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist List */}
        <Card className="modern-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-foreground">Your Artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {artists.map((artist) => (
              <div key={artist.id} className="flex items-center gap-4 p-4 bg-card/50 rounded-[16px] border border-border">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground truncate">{artist.stageName}</p>
                    <span className="px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs">{artist.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{artist.releases} tracks • {artist.streams} streams</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="modern-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-6 rounded-[16px] transition-smooth shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                Bulk Payout Request
              </button>
              
              <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 px-6 rounded-[16px] transition-smooth border border-border">
                Label Analytics
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 px-6 rounded-[16px] transition-smooth border border-border">
                Export Reports
              </button>
              
              <button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-4 px-6 rounded-[16px] transition-smooth border border-border">
                Upload for Artist
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};