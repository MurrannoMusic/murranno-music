import { useState } from 'react';
import { DollarSign, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
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
      <PageHeader 
        title="Payout Manager"
        subtitle={isLabel ? 'Manage artist payouts' : 'Request payouts'}
        backTo={isLabel ? "/artist-management" : "/earnings"}
      />

      <div className="mobile-container space-y-6 -mt-8">
        {/* Payout Summary */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">${totalPending.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Pending Payouts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">$195.60</p>
                <p className="text-xs text-muted-foreground">Total Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist Filter (for labels) */}
        {isLabel && (
          <ArtistFilter 
            selectedArtist={selectedArtist}
            onArtistChange={setSelectedArtist}
            artists={artists}
          />
        )}

        {/* Payout Requests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Payout Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPayouts.map((payout) => (
              <PayoutCard
                key={payout.id}
                payout={payout}
                getStatusBadgeVariant={getStatusBadgeVariant}
                isLabel={isLabel}
                onApprove={handleApprove}
                onViewDetails={handleViewDetails}
              />
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Payout Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted/20">
                <TabsTrigger value="individual" className="text-xs">Individual</TabsTrigger>
                <TabsTrigger value="bulk" className="text-xs">Bulk</TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual" className="space-y-3 mt-4">
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Payout
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
                  <Download className="h-4 w-4 mr-2" />
                  Download Statement
                </Button>
              </TabsContent>
              
              <TabsContent value="bulk" className="space-y-3 mt-4">
                <Button 
                  className="w-full gradient-primary music-button h-12 rounded-xl font-semibold"
                  onClick={requestBulkPayout}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Bulk Payout (${totalPending.toFixed(2)})
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-border/30">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Records
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};