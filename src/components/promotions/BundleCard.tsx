import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CloudinaryImage } from '@/components/ui/cloudinary-image';
import { PromotionBundle } from '@/types/promotion';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface BundleCardProps {
  bundle: PromotionBundle;
  onSelect: (bundle: PromotionBundle) => void;
  isRecommended?: boolean;
}

export const BundleCard = ({ bundle, onSelect, isRecommended }: BundleCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTierColor = (tierLevel: number) => {
    switch (tierLevel) {
      case 1: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 2: return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 3: return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 4: return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={`flex flex-col h-full relative overflow-hidden ${isRecommended ? 'border-primary shadow-lg' : 'hover:shadow-lg'} transition-all`}>
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3 mr-1" />
            Recommended
          </Badge>
        </div>
      )}

      {bundle.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <CloudinaryImage
            publicId={bundle.imageUrl}
            alt={bundle.name}
            width={600}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className={getTierColor(bundle.tierLevel)}>
            Tier {bundle.tierLevel}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {bundle.includedServices?.length || 0} Services
          </span>
        </div>
        <CardTitle className="text-2xl">{bundle.name}</CardTitle>
        {bundle.description && (
          <CardDescription>{bundle.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div>
          <div className="text-4xl font-bold text-primary">
            {formatPrice(bundle.price)}
          </div>
        </div>

        {bundle.targetDescription && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
            <span className="text-lg">🎯</span>
            <p className="text-sm font-medium">{bundle.targetDescription}</p>
          </div>
        )}

        {bundle.includedServices && bundle.includedServices.length > 0 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium">
              Included Services
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {bundle.includedServices.map((service) => (
                  <li key={service.id} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{service.name}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>

      <CardFooter>
        <Button 
          onClick={() => onSelect(bundle)} 
          className="w-full"
          variant={isRecommended ? 'default' : 'outline'}
        >
          Select {bundle.name}
        </Button>
      </CardFooter>
    </Card>
  );
};
