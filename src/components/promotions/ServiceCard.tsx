import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { PromotionService } from '@/types/promotion';
import { Check, ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ServiceCardProps {
  service: PromotionService;
  onSelect: (service: PromotionService) => void;
}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(service.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
      {service.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <CloudinaryImage
            publicId={service.imageUrl}
            alt={service.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      )}
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

      <CardFooter className="flex gap-2">
        {inCart ? (
          <Button 
            onClick={() => removeFromCart(service.id)} 
            variant="outline"
            className="flex-1"
          >
            <Check className="h-4 w-4 mr-2" />
            In Cart
          </Button>
        ) : (
          <Button 
            onClick={() => addToCart(service)} 
            variant="secondary"
            className="flex-1"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        )}
        <Button 
          onClick={() => onSelect(service)} 
          variant="default"
          className="flex-1"
        >
          <Zap className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};
