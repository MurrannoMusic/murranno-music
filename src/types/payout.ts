export interface Payout {
  id: number;
  artist: string;
  amount: string;
  period: string;
  status: 'Pending' | 'Approved' | 'Completed';
  requestDate: string;
  streams: string;
  type: 'Monthly' | 'Quarterly' | 'Annual';
}

export interface PayoutSummary {
  totalPending: number;
  thisMonth: number;
  totalAvailable: string;
}