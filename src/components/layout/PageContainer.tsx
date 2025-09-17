import { BottomNavigation } from '@/components/mobile/BottomNavigation';
import { StatusBar } from '@/components/ui/status-bar';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`min-h-screen bg-gradient-mesh mobile-safe-bottom ${className}`}>
      <StatusBar />
      {children}
      <BottomNavigation />
    </div>
  );
};