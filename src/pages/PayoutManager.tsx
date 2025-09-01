import { useState } from 'react';
import { ArrowLeft, DollarSign, Download, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { useUserType } from '@/hooks/useUserType';

export const PayoutManager = () => {
  const { currentUser, isLabel } = useUserType();
  
  const [payouts] = useState([
    {
      id: 1,
      artist: 'Luna Sol',
      amount: '$87.50',
      period: 'August 2024',
      status: 'Pending',
      requestDate: '2024-09-01',
      streams: '3,250',
      type: 'Monthly'
    },
    {
      id: 2,
      artist: 'The Echoes', 
      amount: '$62.30',
      period: 'August 2024',
      status: 'Approved',
      requestDate: '2024-09-01',
      streams: '2,180',
      type: 'Monthly'
    },
    {
      id: 3,
      artist: 'Midnight Drive',
      amount: '$45.80',
      period: 'August 2024', 
      status: 'Completed',
      requestDate: '2024-08-31',
      streams: '1,620',
      type: 'Monthly'
    }
  ]);

  const [selectedArtist, setSelectedArtist] = useState('all');

  const filteredPayouts = selectedArtist === 'all' 
    ? payouts 
    : payouts.filter(p => p.artist === selectedArtist);

  const totalPending = payouts
    .filter(p => p.status === 'Pending')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '')), 0);

  const getStatusBadge = (status: string) => {
    const variants = {
      'Pending': 'default',
      'Approved': 'secondary',
      'Completed': 'outline'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  const requestBulkPayout = () => {
    console.log('Requesting bulk payout for all pending amounts...');
  };

  return (
    <div className="min-h-screen bg-gradient-mesh mobile-safe-bottom">
      {/* Header */}
      <div className="gradient-primary p-6 text-white mobile-safe-top">
        <div className="flex items-center gap-4 mb-4">
          <Link to={isLabel ? "/artist-management" : "/earnings"}>
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div className="flex-1">
            <h1 className="mobile-heading">Payout Manager</h1>
            <p className="text-white/80 text-base">
              {isLabel ? 'Manage artist payouts' : 'Request payouts'}
            </p>
          </div>
        </div>
      </div>

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
          <Card className="glass-card">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedArtist} onValueChange={setSelectedArtist}>
                  <SelectTrigger className="flex-1 bg-muted/20 border-border/20">
                    <SelectValue placeholder="Filter by artist" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/20">
                    <SelectItem value="all">All Artists</SelectItem>
                    <SelectItem value="Luna Sol">Luna Sol</SelectItem>
                    <SelectItem value="The Echoes">The Echoes</SelectItem>
                    <SelectItem value="Midnight Drive">Midnight Drive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payout Requests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="mobile-subheading">Payout Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPayouts.map((payout) => (
              <div key={payout.id} className="interactive-element p-4 bg-muted/20 rounded-xl border border-border/10">
                <div className="space-y-3">
                  {/* Payout Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{payout.artist}</h3>
                        <Badge variant={getStatusBadge(payout.status) as any} className="text-xs">
                          {payout.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{payout.period}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{payout.amount}</p>
                      <p className="text-xs text-muted-foreground">{payout.streams} streams</p>
                    </div>
                  </div>

                  {/* Payout Details */}
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/10 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Request Date</p>
                      <p className="font-semibold">{new Date(payout.requestDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Type</p>
                      <p className="font-semibold">{payout.type}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {payout.status === 'Pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                        View Details
                      </Button>
                      {isLabel && (
                        <Button size="sm" className="flex-1 text-xs h-8 gradient-primary">
                          Approve
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
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

      <BottomNavigation />
    </div>
  );
};