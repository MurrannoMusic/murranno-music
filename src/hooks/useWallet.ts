import { useState, useMemo } from 'react';
import { mockWalletBalance, mockTransactions, mockPayoutMethods, mockEarningsSources } from '@/utils/mockWallet';
import { EarningsTransaction, PayoutMethod, WalletBalance, EarningsSource } from '@/types/wallet';

export const useWallet = () => {
  const [balance] = useState<WalletBalance>(mockWalletBalance);
  const [transactions] = useState<EarningsTransaction[]>(mockTransactions);
  const [payoutMethods] = useState<PayoutMethod[]>(mockPayoutMethods);
  const [earningsSources] = useState<EarningsSource[]>(mockEarningsSources);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesType = typeFilter === 'all' || tx.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [transactions, statusFilter, typeFilter]);

  return {
    balance,
    transactions: filteredTransactions,
    allTransactions: transactions,
    payoutMethods,
    earningsSources,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
  };
};
