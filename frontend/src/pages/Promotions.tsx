import { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import mmLogo from "@/assets/mm_logo.png";
import promotionsHeroBg from '@/assets/promotions-hero-bg.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { ServiceCard } from '@/components/promotions/ServiceCard';
import { BundleCard } from '@/components/promotions/BundleCard';
import { CategoryFilter } from '@/components/promotions/CategoryFilter';
import { CampaignCreationWizard } from '@/components/promotions/CampaignCreationWizard';
import { CartButton } from '@/components/promotions/CartButton';
import { CartDrawer } from '@/components/promotions/CartDrawer';
import { usePromotionServices } from '@/hooks/usePromotionServices';
import { usePromotionBundles } from '@/hooks/usePromotionBundles';
import { CartProvider } from '@/contexts/CartContext';
import { useCart } from '@/hooks/useCart';
import { PromotionService, PromotionBundle, PromotionCategory } from '@/types/promotion';

const PromotionsContent = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<PromotionCategory | 'all'>('all');
  const [selectedService, setSelectedService] = useState<PromotionService | null>(null);
  const [selectedBundle, setSelectedBundle] = useState<PromotionBundle | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCampaignDialogOpen, setCartCampaignDialogOpen] = useState(false);

  const { services, loading: servicesLoading, categories } = usePromotionServices();
  const { bundles, loading: bundlesLoading } = usePromotionBundles();
  const { items: cartItems } = useCart();

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const serviceCounts = {
    all: services.length,
    ...categories.reduce((acc, cat) => ({
      ...acc,
      [cat]: services.filter(s => s.category === cat).length
    }), {})
  };

  const handleServiceSelect = (service: PromotionService) => {
    setSelectedService(service);
  };

  const handleBundleSelect = (bundle: PromotionBundle) => {
    setSelectedBundle(bundle);
  };

  const handleCartCreateCampaign = () => {
    setCartCampaignDialogOpen(true);
  };

  const handleSelectBundleFromCart = (bundle: PromotionBundle) => {
    setCartOpen(false);
    setSelectedBundle(bundle);
  };

  return (
    <>
      <CartButton onClick={() => setCartOpen(true)} />
      <CartDrawer
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCreateCampaign={handleCartCreateCampaign}
        onSelectBundle={handleSelectBundleFromCart}
      />

      <div className="smooth-scroll">
        {/* Top Bar removed - using UnifiedTopBar */}

        <div className="mobile-container space-y-4 mt-2">
          {/* Hero Section */}
          <Card className="overflow-hidden relative rounded-xl border-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${promotionsHeroBg})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-primary/40 to-accent/40 backdrop-blur-[2px]" />
            <CardContent className="relative p-6 text-center space-y-2 text-white">
              <h1 className="text-2xl font-bold mb-1 drop-shadow-lg">Promotion Catalog</h1>
              <p className="text-white/90 text-sm drop-shadow-md max-w-[240px] mx-auto">
                Premium services to amplify your reach
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/app/campaign-tracking')}
                className="mt-2 shadow-lg h-9 rounded-lg font-bold"
              >
                Track Campaigns
              </Button>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="bundles" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-9 p-1 bg-secondary/20 rounded-lg">
              <TabsTrigger value="bundles" className="text-xs py-1.5 rounded-md">Junkets</TabsTrigger>
              <TabsTrigger value="services" className="text-xs py-1.5 rounded-md">Services</TabsTrigger>
            </TabsList>

            {/* Promotional Junkets Tab */}
            <TabsContent value="bundles" className="space-y-3 mt-3">
              <div className="text-center mb-1">
                <h2 className="text-base font-bold mb-0.5">Curated Bundles</h2>
                <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest leading-none">
                  Impact Packages
                </p>
              </div>

              {bundlesLoading ? (
                <div className="grid gap-3">
                  {[1, 2].map(i => (
                    <Card key={i} className="h-48 animate-pulse bg-muted rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  {bundles.map((bundle, index) => (
                    <BundleCard
                      key={bundle.id}
                      bundle={bundle}
                      onSelect={handleBundleSelect}
                      isRecommended={index === 1} // Recommend Growth Junket
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Individual Services Tab */}
            <TabsContent value="services" className="space-y-3 mt-3">
              <div className="mb-2">
                <h2 className="text-base font-bold mb-0.5">Individual Services</h2>
                <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest mb-3 leading-none">
                  Custom Strategy
                </p>

                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  serviceCounts={serviceCounts}
                />
              </div>

              {servicesLoading ? (
                <div className="grid gap-3 grid-cols-1">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="h-64 animate-pulse bg-muted rounded-xl" />
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <Card className="p-8 text-center rounded-xl bg-secondary/5">
                  <p className="text-xs text-muted-foreground">No services found</p>
                </Card>
              ) : (
                <div className="grid gap-3 grid-cols-1">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={handleServiceSelect}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Campaign Creation Wizard */}
        {selectedService && (
          <CampaignCreationWizard
            open={!!selectedService}
            onOpenChange={(open) => !open && setSelectedService(null)}
            service={selectedService}
            onSuccess={() => setSelectedService(null)}
          />
        )}

        {selectedBundle && (
          <CampaignCreationWizard
            open={!!selectedBundle}
            onOpenChange={(open) => !open && setSelectedBundle(null)}
            bundle={selectedBundle}
            onSuccess={() => setSelectedBundle(null)}
          />
        )}

        {cartCampaignDialogOpen && (
          <CampaignCreationWizard
            open={cartCampaignDialogOpen}
            onOpenChange={setCartCampaignDialogOpen}
            services={cartItems.map(item => item.service)}
            onSuccess={() => {
              setCartCampaignDialogOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export const Promotions = () => {
  return (
    <CartProvider>
      <PromotionsContent />
    </CartProvider>
  );
};
