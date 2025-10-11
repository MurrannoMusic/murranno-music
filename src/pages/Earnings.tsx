import { useState } from 'react';
import { ArrowLeft, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { WalletTabs } from '@/components/wallet/WalletTabs';
import { BalanceTab } from '@/components/wallet/BalanceTab';
import { PayoutMethodsTab } from '@/components/wallet/PayoutMethodsTab';
import { HistoryTab } from '@/components/wallet/HistoryTab';
import { WithdrawSheet } from '@/components/wallet/WithdrawSheet';
import { useWallet } from '@/hooks/useWallet';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { mockEarningsSources } from '@/utils/mockWallet';

export const Earnings = () => {
  const [activeTab, setActiveTab] = useState('balance');
  const [showWithdrawSheet, setShowWithdrawSheet] = useState(false);
  
  const {
    transactions,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
  } = useWallet();

  const { balance, refetch: refetchBalance } = useWalletBalance();

  const handleWithdraw = () => {
    setShowWithdrawSheet(true);
  };

  return (
    <PageContainer>
      {/* Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              <Wallet className="h-3 w-3 mr-1 inline" />
              WALLET
            </Badge>
          </div>
          
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        {/* Tab Navigation */}
        <WalletTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'balance' && balance && (
          <BalanceTab 
            balance={balance}
            earningsSources={mockEarningsSources}
            onWithdraw={handleWithdraw}
          />
        )}

        {activeTab === 'methods' && (
          <PayoutMethodsTab />
        )}

        {activeTab === 'history' && (
          <HistoryTab 
            transactions={transactions}
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
          />
        )}
      </div>

      {/* Withdraw Sheet */}
      {balance && (
        <WithdrawSheet 
          open={showWithdrawSheet}
          onClose={() => setShowWithdrawSheet(false)}
          availableBalance={balance.available_balance}
          onSuccess={refetchBalance}
        />
      )}
    </PageContainer>
  );
};