import { useState } from 'react';
import { Payout, PayoutSummary } from '@/types/payout';
import { mockPayouts, mockPayoutSummary } from '@/utils/mockData';

export const usePayouts = () => {
  const [payouts] = useState<Payout[]>(mockPayouts);
  const [summary] = useState<PayoutSummary>(mockPayoutSummary);

  const getFilteredPayouts = (artistFilter: string = 'all'): Payout[] => {
    if (artistFilter === 'all') return payouts;
    return payouts.filter(p => p.artist === artistFilter);
  };

  const getTotalPending = (): number => {
    return payouts
      .filter(p => p.status === 'Pending')
      .reduce((sum, p) => sum + parseFloat(p.amount.replace('₦', '')), 0);
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants = {
      'Pending': 'default',
      'Approved': 'secondary', 
      'Completed': 'outline'
    };
    return variants[status as keyof typeof variants] || 'secondary';
  };

  return {
    payouts,
    summary,
    getFilteredPayouts,
    getTotalPending,
    getStatusBadgeVariant
  };
};