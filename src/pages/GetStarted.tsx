import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { Music, Users, Building2, Check, Loader2, BarChart3, Wallet, Globe, Zap, Shield } from 'lucide-react';
import prototype1 from '@/assets/prototype-1.jpg';
import prototype2 from '@/assets/prototype-2.jpg';
import prototype3 from '@/assets/prototype-3.jpg';

export default function GetStarted() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const [selectedAccountType, setSelectedAccountType] = useState<'artist' | 'label' | 'agency' | null>(null);
  const subscriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAccountTypeSelect = (type: 'artist' | 'label' | 'agency') => {
    setSelectedAccountType(type);
    // Smooth scroll to subscription section
    setTimeout(() => {
      subscriptionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const selectedPlan = plans?.find(plan => plan.tier === selectedAccountType);

  const handleSelectPlan = (tier: string) => {
    navigate('/signup', { state: { selectedTier: tier } });
  };

  const accountTypes = [
    {
      icon: Music,
      type: 'Artist',
      description: 'Distribute music and track earnings',
      color: 'from-primary to-primary/60',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      icon: Building2,
      type: 'Label',
      description: 'Manage multiple artists and releases',
      color: 'from-accent to-accent/60',
      bgPattern: 'bg-gradient-to-br',
    },
    {
      icon: Users,
      type: 'Agency',
      description: 'Handle campaigns and promotions',
      color: 'from-success to-success/60',
      bgPattern: 'bg-gradient-to-br',
    },
  ];

  const features = [
    {
      icon: Globe,
      title: 'Global Distribution',
      description: 'Reach 150+ streaming platforms worldwide',
      image: prototype1,
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track streams, earnings, and audience insights',
      image: prototype2,
    },
    {
      icon: Wallet,
      title: 'Fast Payouts',
      description: 'Get paid quickly with transparent earnings',
      image: prototype3,
    },
  ];

  const platforms = [
    { name: 'Spotify', icon: Music },
    { name: 'Apple Music', icon: Music },
    { name: 'Boomplay', icon: Music },
    { name: 'YouTube', icon: Music },
  ];

  return (
    <div className="dark min-h-screen bg-gradient-mesh overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Music Distribution Platform</span>
          </div>
          <h1 className="heading-xl bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Distribute, Promote & Track Your Music
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Professional music distribution with real-time analytics, campaign management, and transparent earnings tracking.
          </p>
        </div>

        {/* Features Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
          {features.map(({ icon: Icon, title, description, image }, idx) => (
            <Card 
              key={title} 
              className="border-border/40 overflow-hidden group hover:shadow-primary/20 hover:border-primary/40 transition-all duration-300 hover-scale"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="aspect-video overflow-hidden bg-secondary/30">
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm">{title}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Account Types */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-center text-foreground">Choose Your Account Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {accountTypes.map(({ icon: Icon, type, description, color, bgPattern }) => {
              const accountTypeLower = type.toLowerCase() as 'artist' | 'label' | 'agency';
              const isSelected = selectedAccountType === accountTypeLower;
              const hasSelection = selectedAccountType !== null;
              
              return (
                <Card 
                  key={type} 
                  onClick={() => handleAccountTypeSelect(accountTypeLower)}
                  className={`border-2 overflow-hidden group transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-primary shadow-lg shadow-primary/30 scale-105' 
                      : hasSelection 
                        ? 'border-border/20 opacity-50 hover:opacity-70' 
                        : 'border-border/40 hover:border-primary/40 hover-scale hover:shadow-primary/20'
                  }`}
                >
                  <CardContent className="p-6 relative">
                    <div className={`absolute inset-0 ${bgPattern} ${color} ${isSelected ? 'opacity-20' : 'opacity-5'} group-hover:opacity-10 transition-opacity`} />
                    <div className="relative space-y-3">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} w-fit ${isSelected ? 'shadow-lg' : ''}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">{type}</h3>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
                      {isSelected && (
                        <div className="flex items-center gap-1 text-primary text-xs font-medium">
                          <Check className="w-4 h-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Trusted Platforms */}
        <div className="text-center space-y-3 py-4">
          <p className="text-xs text-muted-foreground font-medium">Distribute to 150+ platforms including</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {platforms.map(({ name, icon: Icon }) => (
              <div 
                key={name} 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-border/20 hover:border-primary/40 transition-colors"
              >
                <Icon className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div ref={subscriptionRef} className="space-y-4 scroll-mt-8">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              {selectedAccountType ? `${selectedAccountType.charAt(0).toUpperCase() + selectedAccountType.slice(1)} Subscription` : 'Subscription Plans'}
            </h2>
            <p className="text-xs text-muted-foreground">14-day free trial • No credit card required</p>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : selectedPlan ? (
            // Show selected plan in expanded view
            <div className="max-w-md mx-auto space-y-4 animate-scale-in">
              <Card className="border-2 border-primary shadow-2xl shadow-primary/30 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
                <CardHeader className="text-center bg-gradient-to-br from-primary/5 to-accent/5 pb-4">
                  <Badge className="bg-gradient-to-r from-primary to-accent border-0 shadow-lg w-fit mx-auto mb-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Recommended
                  </Badge>
                  <CardTitle className="text-2xl capitalize">{selectedPlan.tier} Plan</CardTitle>
                  <div className="flex items-baseline justify-center gap-1 mt-2">
                    <span className="text-4xl font-bold text-foreground">
                      ${selectedPlan.price_monthly}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-3">
                    {selectedPlan.features?.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-success/10 mt-0.5">
                          <Check className="w-3 h-3 text-success flex-shrink-0" />
                        </div>
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 pt-2">
                    <Button
                      size="lg"
                      className="w-full rounded-full shadow-lg shadow-primary/30 hover:shadow-primary/50"
                      onClick={() => handleSelectPlan(selectedPlan.tier)}
                    >
                      Get Started with {selectedPlan.tier.charAt(0).toUpperCase() + selectedPlan.tier.slice(1)}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setSelectedAccountType(null)}
                    >
                      View All Plans
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Show all plans
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans?.map((plan) => {
                const isPopular = plan.tier === 'label';
                return (
                  <Card
                    key={plan.id}
                    className={`border-2 overflow-hidden group hover-scale transition-all duration-300 cursor-pointer ${
                      isPopular 
                        ? 'border-primary/60 shadow-lg shadow-primary/20 relative' 
                        : 'border-border/40 hover:border-primary/40 hover:shadow-primary/20'
                    }`}
                    onClick={() => handleAccountTypeSelect(plan.tier as 'artist' | 'label' | 'agency')}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-primary to-accent border-0 shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-bold text-foreground capitalize text-lg">{plan.tier}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-foreground">
                            ${plan.price_monthly}
                          </span>
                          <span className="text-sm text-muted-foreground">/month</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {plan.features?.slice(0, 4).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-primary/40 hover:bg-primary/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccountTypeSelect(plan.tier as 'artist' | 'label' | 'agency');
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* CTAs */}
        {!selectedAccountType && (
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                onClick={() => navigate('/signup')}
              >
                <Music className="w-4 h-4 mr-2" />
                Create Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 rounded-full border-2 border-primary/60 bg-primary/5 hover:bg-primary/10 hover:border-primary text-foreground"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>Instant Setup</span>
              </div>
              <span>•</span>
              <span>Cancel Anytime</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
