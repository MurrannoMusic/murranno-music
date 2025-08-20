import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export const StatCard = ({ icon: Icon, title, value, change, changeType = 'neutral' }: StatCardProps) => {
  return (
    <Card className="stat-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-semibold text-foreground">{value}</p>
            </div>
          </div>
          {change && (
            <div className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-success' :
              changeType === 'negative' ? 'text-destructive' :
              'text-muted-foreground'
            }`}>
              {change}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};