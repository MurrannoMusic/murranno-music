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
          <div className="w-10 h-10 bg-secondary/30 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end mt-4">
          {headerActions}
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        {/* Summary Stats */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{artists.length}</p>
                <p className="text-xs text-muted-foreground">Total Artists</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">18</p>
                <p className="text-xs text-muted-foreground">Total Releases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">$754</p>
                <p className="text-xs text-muted-foreground">Combined Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist List */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Your Artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onEdit={(id) => console.log('Edit artist:', id)}
                onViewReleases={(id) => console.log('View releases:', id)}
                onViewAnalytics={(id) => console.log('View analytics:', id)}
                onManagePayouts={(id) => console.log('Manage payouts:', id)}
              />
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Link to="/payout-manager">
              <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold">
                Bulk Payout Request
              </Button>
            </Link>
            <Link to="/label-analytics">
              <Button className="w-full gradient-secondary music-button h-12 rounded-xl font-semibold">
                Label Analytics
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
              Export Reports
            </Button>
            <Link to="/upload">
              <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
                Upload for Artist
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};