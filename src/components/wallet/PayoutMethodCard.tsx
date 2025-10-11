import { Building2, Smartphone, CreditCard, CheckCircle2, Star } from 'lucide-react';
import { PayoutMethod } from '@/types/wallet';
import { cn } from '@/lib/utils';

interface PayoutMethodCardProps {
  method: PayoutMethod;
}

const iconMap = {
  Building2,
  Smartphone,
  CreditCard,
};

const methodColors = {
  bank: 'from-blue-50 to-blue-100 border-blue-200',
  mobile_money: 'from-green-50 to-green-100 border-green-200',
  payoneer: 'from-orange-50 to-orange-100 border-orange-200',
  paypal: 'from-purple-50 to-purple-100 border-purple-200',
};

const iconColors = {
  bank: 'bg-blue-100 text-blue-600',
  mobile_money: 'bg-green-100 text-green-600',
  payoneer: 'bg-orange-100 text-orange-600',
  paypal: 'bg-purple-100 text-purple-600',
};

const verifiedColors = {
  bank: 'text-blue-600',
  mobile_money: 'text-green-600',
  payoneer: 'text-orange-600',
  paypal: 'text-purple-600',
};

export const PayoutMethodCard = ({ method }: PayoutMethodCardProps) => {
  const Icon = iconMap[method.icon as keyof typeof iconMap] || Building2;

  return (
    <div className={cn(
      "bg-gradient-to-br border-2 rounded-[16px] p-4",
      methodColors[method.type]
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          iconColors[method.type]
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-bold text-card-foreground">{method.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{method.details}</p>
            </div>
            {method.isPrimary && (
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <CheckCircle2 className={cn("h-4 w-4", verifiedColors[method.type])} />
            <span className={cn("text-sm font-semibold", verifiedColors[method.type])}>
              {method.verified ? 'Confirmed' : 'Pending Verification'}
            </span>
          </div>
          {method.lastUsed && (
            <p className="text-xs text-muted-foreground mt-1">
              Last used: {new Date(method.lastUsed).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
