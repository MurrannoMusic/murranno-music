import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PromotionService } from '@/types/promotion';
import { Check } from 'lucide-react';

interface ServiceCardProps {
  service: PromotionService;
  onSelect: (service: PromotionService) => void;
}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {service.category}
          </Badge>
        </div>
        <CardTitle className="text-xl">{service.name}</CardTitle>
        {service.description && (
          <CardDescription>{service.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary">
            {formatPrice(service.price)}
          </div>
          {service.duration && (
            <p className="text-sm text-muted-foreground mt-1">{service.duration}</p>
          )}
        </div>

        {service.features && service.features.length > 0 && (
          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter>
        <Button onClick={() => onSelect(service)} className="w-full">
          Select Service
        </Button>
      </CardFooter>
    </Card>
  );
};
