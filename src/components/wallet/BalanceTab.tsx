import { DollarSign, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EarningsSource } from '@/types/wallet';
import { WalletBalance } from '@/hooks/useWalletBalance';
import { EarningsSourceCard } from './EarningsSourceCard';

interface BalanceTabProps {
  balance: WalletBalance;
  earningsSources: EarningsSource[];
  onWithdraw: () => void;
}

export const BalanceTab = ({ balance, earningsSources, onWithdraw }: BalanceTabProps) => {
  const percentageChange = balance.total_earnings > 0 
    ? ((balance.available_balance / balance.total_earnings) * 100).toFixed(1)
    : 0;
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card border border-border rounded-[20px] p-4 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right">
              <div className="text-xs text-success font-medium">+{percentageChange}%</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-card-foreground">₦{balance.total_earnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-medium">Total Earnings</div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-[20px] p-4 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-right">
              <div className="text-xs text-success font-medium">+8%</div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xl font-bold text-card-foreground">₦{(balance.total_earnings * 0.15).toFixed(2)}</div>
            <div className="text-xs text-muted-foreground font-medium">This Month</div>
          </div>
        </div>
      </div>

      {/* Available Balance Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Available to Withdraw</p>
              <p className="text-3xl font-bold text-card-foreground">₦{Number(balance.available_balance).toFixed(2)}</p>
              {Number(balance.pending_balance) > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">₦{Number(balance.pending_balance).toFixed(2)} pending</span>
                </div>
              )}
            </div>
            <Button 
              onClick={onWithdraw}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-primary"
            >
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Earnings Sources */}
      <Card className="bg-card border border-border rounded-[20px] shadow-soft">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-card-foreground">Earnings by Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {earningsSources.map((source) => (
            <EarningsSourceCard key={source.id} source={source} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
