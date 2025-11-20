import { useState } from 'react';
import { ArrowLeft, Megaphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import promotionsHeroBg from '@/assets/promotions-hero-bg.jpg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
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
      
      <PageContainer>
      {/* Top Bar */}
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/app/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              PROMOTIONS
            </Badge>
          </div>
          
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-6 mt-4">
        {/* Hero Section */}
        <Card className="overflow-hidden relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${promotionsHeroBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-primary/85 to-accent/80" />
          <CardContent className="relative p-8 text-center space-y-4 text-white">
            <Megaphone className="h-12 w-12 mx-auto mb-4 drop-shadow-lg" />
            <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">Full-Service Promotional Catalog</h1>
            <p className="text-white text-lg drop-shadow-md">
              Premium music promotion services and strategic bundles to amplify your reach
            </p>
            <Button
              variant="secondary"
              onClick={() => navigate('/app/campaign-tracking')}
              className="mt-4 shadow-xl"
            >
              View My Campaigns
            </Button>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="bundles" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bundles">Promotional Junkets</TabsTrigger>
            <TabsTrigger value="services">Individual Services</TabsTrigger>
          </TabsList>

          {/* Promotional Junkets Tab */}
          <TabsContent value="bundles" className="space-y-4 mt-4">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold mb-2">Strategically Curated Bundles</h2>
              <p className="text-muted-foreground text-sm">
                Complete promotional packages designed for maximum impact
              </p>
            </div>

            {bundlesLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="h-64 animate-pulse bg-muted" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6">
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
          <TabsContent value="services" className="space-y-4 mt-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Individual Services</h2>
              <p className="text-muted-foreground text-sm mb-4">
                Build your own custom promotional strategy
              </p>
              
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                serviceCounts={serviceCounts}
              />
            </div>

            {servicesLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="h-80 animate-pulse bg-muted" />
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No services found in this category</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
    </PageContainer>
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
