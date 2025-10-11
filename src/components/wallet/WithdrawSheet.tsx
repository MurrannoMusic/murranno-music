import { useState } from 'react';
import { X, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PayoutMethod } from '@/types/wallet';
import { toast } from 'sonner';

interface WithdrawSheetProps {
  open: boolean;
  onClose: () => void;
  availableBalance: number;
  payoutMethods: PayoutMethod[];
}

export const WithdrawSheet = ({ open, onClose, availableBalance, payoutMethods }: WithdrawSheetProps) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>(
    payoutMethods.find(m => m.isPrimary)?.id || payoutMethods[0]?.id || ''
  );

  const withdrawalAmount = parseFloat(amount) || 0;
  const fee = withdrawalAmount * 0.025; // 2.5% fee
  const netAmount = withdrawalAmount - fee;

  const handleWithdraw = () => {
    if (!amount || withdrawalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (withdrawalAmount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }
    if (!selectedMethod) {
      toast.error('Please select a payout method');
      return;
    }

    // TODO: Implement actual withdrawal logic
    toast.success('Withdrawal request submitted successfully!');
    onClose();
    setAmount('');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-[24px]">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">Withdraw Funds</SheetTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-primary/10 rounded-[16px] p-4 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-card-foreground">₦{availableBalance.toFixed(2)}</p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-sm font-semibold text-card-foreground mb-2 block">
              Withdrawal Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10 text-lg font-semibold"
              />
            </div>
            {withdrawalAmount > availableBalance && (
              <div className="flex items-center gap-2 mt-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">Amount exceeds available balance</span>
              </div>
            )}
          </div>

          {/* Payout Method Selection */}
          <div>
            <label className="text-sm font-semibold text-card-foreground mb-2 block">
              Payout Method
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-4 py-3 rounded-[16px] bg-secondary/30 border border-border text-foreground font-medium"
            >
              {payoutMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name} - {method.details}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Breakdown */}
          {withdrawalAmount > 0 && (
            <div className="bg-secondary/20 rounded-[16px] p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-card-foreground">₦{withdrawalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processing Fee (2.5%)</span>
                <span className="font-semibold text-destructive">-₦{fee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2"></div>
              <div className="flex justify-between">
                <span className="font-semibold text-card-foreground">You'll Receive</span>
                <span className="font-bold text-success text-lg">₦{netAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Processing Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/20 rounded-[16px] p-3">
            <Clock className="h-4 w-4" />
            <span>Processing time: 1-3 business days</span>
          </div>

          {/* Withdraw Button */}
          <Button 
            onClick={handleWithdraw}
            disabled={!amount || withdrawalAmount <= 0 || withdrawalAmount > availableBalance}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
          >
            Confirm Withdrawal
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
