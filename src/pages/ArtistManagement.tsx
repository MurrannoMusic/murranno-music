import { useState } from 'react';
import { ArrowLeft, Plus, Edit, MoreVertical, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ArtistManagement = () => {
  const [artists, setArtists] = useState([
    { id: 'a1', name: 'Luna Sol', stageName: 'Luna Sol', status: 'Active', releases: 8, streams: '12.5K', revenue: '$342' },
    { id: 'a2', name: 'The Echoes', stageName: 'The Echoes', status: 'Active', releases: 6, streams: '8.9K', revenue: '$234' },
    { id: 'a3', name: 'Midnight Drive', stageName: 'Midnight Drive', status: 'Active', releases: 4, streams: '6.2K', revenue: '$178' }
  ]);

  const [newArtist, setNewArtist] = useState({ name: '', stageName: '', email: '' });
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleAddArtist = () => {
    if (newArtist.name && newArtist.stageName) {
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
      setNewArtist({ name: '', stageName: '', email: '' });
      setShowAddDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mobile-heading">Artist Management</h1>
            <p className="text-white/80 text-base">Manage your label's artists</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Plus className="h-4 w-4 mr-1" />
                Add Artist
              </Button>
            </DialogTrigger>
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
                    onClick={handleAddArtist}
                    className="flex-1 gradient-primary"
                  >
                    Add Artist
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-8">
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
              <div key={artist.id} className="interactive-element p-4 bg-muted/20 rounded-xl border border-border/10">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                      {artist.stageName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{artist.stageName}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {artist.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{artist.name}</p>
                    
                    <div className="flex gap-4 mt-2 text-xs">
                      <span><strong>{artist.releases}</strong> releases</span>
                      <span><strong>{artist.streams}</strong> streams</span>
                      <span className="text-primary font-semibold">{artist.revenue}</span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-border/20">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Music className="h-4 w-4 mr-2" />
                        View Releases
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        Manage Payouts
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="mobile-card-grid">
            <Button className="w-full gradient-primary music-button h-12 rounded-xl font-semibold">
              Bulk Payout Request
            </Button>
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

      <BottomNavigation />
    </div>
  );
};