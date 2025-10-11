import { EarningsTransaction, PayoutMethod, WalletBalance, EarningsSource } from '@/types/wallet';

export const mockWalletBalance: WalletBalance = {
  totalEarnings: 2847,
  availableBalance: 298.50,
  pendingBalance: 125.00,
  thisMonth: 245,
  lastMonth: 219,
  percentageChange: 12
};

export const mockTransactions: EarningsTransaction[] = [
  {
    id: 'tx_001',
    amount: 105.00,
    currency: '₦',
    type: 'withdrawal',
    method: 'bank',
    status: 'paid',
    requestedDate: '2025-08-01',
    completedDate: '2025-08-02',
    description: 'Withdrawal to Bank Account',
    transactionId: 'WD-2025-08-001',
    fee: 2.50,
    netAmount: 102.50
  },
  {
    id: 'tx_002',
    amount: 58.00,
    currency: '₦',
    type: 'withdrawal',
    method: 'bank',
    status: 'paid',
    requestedDate: '2024-04-08',
    completedDate: '2024-04-09',
    description: 'Withdrawal to Bank Account',
    transactionId: 'WD-2024-04-002',
    fee: 2.00,
    netAmount: 56.00
  },
  {
    id: 'tx_003',
    amount: 164.80,
    currency: '₦',
    type: 'earning',
    method: 'bank',
    status: 'paid',
    requestedDate: '2025-07-28',
    completedDate: '2025-07-30',
    description: 'Spotify Streaming Revenue',
    source: 'Spotify',
    transactionId: 'ER-2025-07-003',
    netAmount: 164.80
  },
  {
    id: 'tx_004',
    amount: 89.30,
    currency: '₦',
    type: 'earning',
    method: 'bank',
    status: 'paid',
    requestedDate: '2025-07-25',
    completedDate: '2025-07-27',
    description: 'Apple Music Streaming',
    source: 'Apple Music',
    transactionId: 'ER-2025-07-004',
    netAmount: 89.30
  },
  {
    id: 'tx_005',
    amount: 125.00,
    currency: '₦',
    type: 'withdrawal',
    method: 'mobile_money',
    status: 'pending',
    requestedDate: '2025-08-10',
    description: 'Withdrawal to Mobile Money',
    transactionId: 'WD-2025-08-005',
    fee: 3.00,
    netAmount: 122.00
  },
  {
    id: 'tx_006',
    amount: 42.50,
    currency: '₦',
    type: 'earning',
    method: 'bank',
    status: 'processing',
    requestedDate: '2025-08-09',
    description: 'YouTube Music Revenue',
    source: 'YouTube Music',
    transactionId: 'ER-2025-08-006',
    netAmount: 42.50
  }
];

export const mockPayoutMethods: PayoutMethod[] = [
  {
    id: 'pm_001',
    type: 'bank',
    name: 'Bank Account',
    details: 'Account ending ****3953',
    verified: true,
    isPrimary: true,
    icon: 'Building2',
    lastUsed: '2025-08-01'
  },
  {
    id: 'pm_002',
    type: 'mobile_money',
    name: 'Mobile Money',
    details: '+234 *** *** **56',
    verified: true,
    isPrimary: false,
    icon: 'Smartphone'
  }
];

export const mockEarningsSources: EarningsSource[] = [
  {
    id: 'src_001',
    platform: 'Spotify',
    amount: 164.80,
    percentage: 42,
    growth: 15,
    icon: 'Music',
    streams: 8200
  },
  {
    id: 'src_002',
    platform: 'Apple Music',
    amount: 89.30,
    percentage: 23,
    growth: 8,
    icon: 'Music2',
    streams: 3100
  },
  {
    id: 'src_003',
    platform: 'YouTube Music',
    amount: 42.50,
    percentage: 11,
    growth: -3,
    icon: 'Video',
    streams: 1500
  },
  {
    id: 'src_004',
    platform: 'Other Platforms',
    amount: 51.40,
    percentage: 24,
    growth: 5,
    icon: 'Music4',
    streams: 2100
  }
];
