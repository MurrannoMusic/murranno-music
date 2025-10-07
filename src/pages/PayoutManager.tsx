import { useState } from 'react';
import { DollarSign, Download, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { ArtistFilter } from '@/components/filters/ArtistFilter';
import { PayoutCard } from '@/components/cards/PayoutCard';
import { useUserType } from '@/hooks/useUserType';
import { usePayouts } from '@/hooks/usePayouts';

export const PayoutManager = () => {
  const { currentUser, isLabel } = useUserType();
  const { payouts, getFilteredPayouts, getTotalPending, getStatusBadgeVariant } = usePayouts();
  
  const [selectedArtist, setSelectedArtist] = useState('all');

  const filteredPayouts = getFilteredPayouts(selectedArtist);
  const totalPending = getTotalPending();

  const artists = [
    { id: 'a1', name: 'Luna Sol', stageName: 'Luna Sol' },
    { id: 'a2', name: 'The Echoes', stageName: 'The Echoes' },
    { id: 'a3', name: 'Midnight Drive', stageName: 'Midnight Drive' }
  ];

  const requestBulkPayout = () => {
    console.log('Requesting bulk payout for all pending amounts...');
  };

  const handleApprove = (id: number) => {
    console.log('Approving payout:', id);
  };

  const handleViewDetails = (id: number) => {
    console.log('Viewing details for payout:', id);
  };

  return (
    <PageContainer>
      {/* Consistent Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          {/* Menu Icon (Left) */}
          <Link to={isLabel ? "/artist-management" : "/earnings"} className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          {/* User Type (Center) */}
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              PAYOUT MANAGER
            </Badge>
          </div>
          
          {/* Avatar (Right) */}
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-6">
        {/* Payout Stats */}
        <Card className="glass-card border border-border/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base font-bold text-foreground truncate">${totalPending.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
              <div>
                <p className="text-base font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div>
                <p className="text-base font-bold text-foreground truncate">$195.60</p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist Filter (for labels) */}
        {isLabel && (
          <Card className="glass-card border border-border/20">
            <CardContent className="p-4">
              <ArtistFilter 
                selectedArtist={selectedArtist}
                onArtistChange={setSelectedArtist}
                artists={artists}
              />
            </CardContent>
          </Card>
        )}

        {/* Payout Requests */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Payout Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center gap-4 p-4 bg-muted/20 rounded-xl border border-border/10">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{payout.artist}</h3>
                      <Badge 
                        variant={
                          payout.status === 'Pending' ? 'secondary' :
                          payout.status === 'Completed' ? 'default' :
                          'destructive'
                        }
                        className="text-xs"
                      >
                        {payout.status}
                      </Badge>
                    </div>
                    <span className="text-sm font-bold text-foreground">{payout.amount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{payout.streams} streams • {payout.requestDate}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10">
                    <span className="text-xs text-muted-foreground">Type: {payout.type}</span>
                    {payout.status === 'Pending' && isLabel && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleApprove(payout.id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handleViewDetails(payout.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card border border-border/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">Payout Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full gradient-primary font-semibold py-6 px-4 text-sm"
              onClick={requestBulkPayout}
            >
              <span className="flex flex-col items-center">
                Request Bulk Payout
                <span className="text-xs mt-1 opacity-90">(${totalPending.toFixed(2)})</span>
              </span>
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full font-semibold py-6 px-3 text-xs border-border/20">
                Export Records
              </Button>
              
              <Button variant="outline" className="w-full font-semibold py-6 px-3 text-xs border-border/20">
                Schedule Payouts
              </Button>
            </div>
            
            <Button variant="outline" className="w-full font-semibold py-6 px-4 text-xs border-border/20">
              Payout Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};