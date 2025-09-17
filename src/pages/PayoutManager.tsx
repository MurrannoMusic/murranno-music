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
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-white">${totalPending.toFixed(2)}</p>
                <p className="text-xs text-[#8b8ba3]">Pending Payouts</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">3</p>
                <p className="text-xs text-[#8b8ba3]">This Month</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">$195.60</p>
                <p className="text-xs text-[#8b8ba3]">Total Available</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Artist Filter (for labels) */}
        {isLabel && (
          <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
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
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Payout Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredPayouts.map((payout) => (
              <div key={payout.id} className="flex items-center gap-4 p-4 bg-[#0d0d1b] rounded-[16px] border border-[#2d2d44]">
                <div className="w-10 h-10 bg-[#6c5ce7]/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-[#6c5ce7]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{payout.artist}</h3>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          payout.status === 'Pending' ? 'bg-[#f39c12]/20 text-[#f39c12]' :
                          payout.status === 'Completed' ? 'bg-[#00b894]/20 text-[#00b894]' :
                          'bg-[#e74c3c]/20 text-[#e74c3c]'
                        }`}
                      >
                        {payout.status}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-white">{payout.amount}</span>
                  </div>
                  <p className="text-xs text-[#8b8ba3]">{payout.streams} streams • {payout.requestDate}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#2d2d44]">
                    <span className="text-xs text-[#8b8ba3]">Type: {payout.type}</span>
                    {payout.status === 'Pending' && isLabel && (
                      <div className="flex gap-2">
                        <button 
                          className="text-xs bg-[#00b894] text-white px-3 py-1 rounded-[8px] hover:bg-[#00a085]"
                          onClick={() => handleApprove(payout.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-xs bg-[#2d2d44] text-white px-3 py-1 rounded-[8px] hover:bg-[#3a3a55]"
                          onClick={() => handleViewDetails(payout.id)}
                        >
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-[#1a1a2e] border border-[#2d2d44] rounded-[20px] shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-white">Payout Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                className="w-full bg-[#6c5ce7] hover:bg-[#5a4fcf] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                onClick={requestBulkPayout}
              >
                Request Bulk Payout (${totalPending.toFixed(2)})
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Export All Records
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Schedule Payouts
              </button>
              
              <button className="w-full bg-[#2d2d44] hover:bg-[#3a3a55] text-white font-semibold py-4 px-6 rounded-[16px] transition-all duration-200 border border-[#3a3a55] hover:border-[#4a4a66]">
                Payout Settings
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};