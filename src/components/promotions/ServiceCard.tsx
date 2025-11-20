import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { PromotionService } from '@/types/promotion';
import { Check, ShoppingCart, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ServiceCardProps {
  service: PromotionService;
  onSelect: (service: PromotionService) => void;
}

export const ServiceCard = ({ service, onSelect }: ServiceCardProps) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const inCart = isInCart(service.id);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isProcessing = isBuyingNow || isAddingToCart;

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      await onSelect(service);
      toast.success('Proceeding to checkout', {
        description: `${service.name} - ${formatPrice(service.price)}`,
      });
    } catch (error) {
      toast.error('Failed to process purchase');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(service);
      toast.success('Added to cart', {
        description: service.name,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsAddingToCart(true);
    try {
      await removeFromCart(service.id);
      toast.success('Removed from cart', {
        description: service.name,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const displayImages = service.images && service.images.length > 0 
    ? service.images 
    : service.imageUrl 
    ? [service.imageUrl] 
    : [];

  const displayVideos = service.videos || [];
  const hasMedia = displayImages.length > 0 || displayVideos.length > 0;
  const allMedia = [...displayImages, ...displayVideos];

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
      {hasMedia && (
        <div className="w-full h-48 overflow-hidden relative">
          {allMedia.length === 1 ? (
            displayVideos.length > 0 ? (
              <video
                src={displayVideos[0]}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <CloudinaryImage
                publicId={displayImages[0]}
                alt={service.name}
                width={400}
                height={300}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <Carousel className="w-full h-full">
              <CarouselContent>
                {displayImages.map((image, index) => (
                  <CarouselItem key={`img-${index}`}>
                    <CloudinaryImage
                      publicId={image}
                      alt={`${service.name} - Image ${index + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                  </CarouselItem>
                ))}
                {displayVideos.map((video, index) => (
                  <CarouselItem key={`vid-${index}`}>
                    <video
                      src={video}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-48 object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          )}
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
            onClick={handleRemoveFromCart}
            variant="outline"
            className="flex-1"
            disabled={isProcessing}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                In Cart
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleAddToCart}
            variant="secondary"
            className="flex-1"
            disabled={isProcessing}
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        )}
        <Button 
          onClick={handleBuyNow}
          variant="default"
          className="flex-1"
          disabled={isProcessing}
        >
          {isBuyingNow ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4 mr-2" />
              Buy Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
