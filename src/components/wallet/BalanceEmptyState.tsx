import { Wallet, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const BalanceEmptyState = () => {
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-card-foreground">
                Your Wallet is Ready!
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start earning to see your balance here. Your wallet has been initialized with ₦0.00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border border-border rounded-[20px] shadow-soft">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-card-foreground">
                Start Earning Today
              </h4>
              <p className="text-sm text-muted-foreground max-w-sm">
                Upload your music, run campaigns, and watch your earnings grow!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
