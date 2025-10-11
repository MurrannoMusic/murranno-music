import { Plus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PayoutMethod } from '@/types/wallet';
import { PayoutMethodCard } from './PayoutMethodCard';

interface PayoutMethodsTabProps {
  payoutMethods: PayoutMethod[];
  onAddMethod: () => void;
}

export const PayoutMethodsTab = ({ payoutMethods, onAddMethod }: PayoutMethodsTabProps) => {
  return (
    <div className="space-y-4">
      {/* Payout Methods List */}
      <Card className="bg-card border border-border rounded-[20px] shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-card-foreground">Your Payout Methods</CardTitle>
            <Button 
              size="sm"
              onClick={onAddMethod}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {payoutMethods.map((method) => (
            <PayoutMethodCard key={method.id} method={method} />
          ))}
        </CardContent>
      </Card>

      {/* Manage Section */}
      <Card className="bg-card border border-border rounded-[20px] shadow-soft">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground mb-1">Manage your payout methods?</h3>
              <p className="text-sm text-muted-foreground">Update details, verify accounts, or add new methods</p>
            </div>
            <Button variant="outline" size="icon" className="rounded-full">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
