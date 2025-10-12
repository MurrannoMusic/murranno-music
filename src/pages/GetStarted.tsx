import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { Music, Users, Building2, Check, Loader2 } from 'lucide-react';

export default function GetStarted() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: plans, isLoading } = useSubscriptionPlans();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const accountTypes = [
    {
      icon: Music,
      type: 'Artist',
      description: 'Distribute music and track earnings',
      color: 'text-primary',
    },
    {
      icon: Building2,
      type: 'Label',
      description: 'Manage multiple artists and releases',
      color: 'text-accent',
    },
    {
      icon: Users,
      type: 'Agency',
      description: 'Handle campaigns and promotions',
      color: 'text-success',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Music Distribution Platform</span>
          </div>
          <h1 className="heading-xl">Distribute, Promote & Track Your Music</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional music distribution with real-time analytics, campaign management, and transparent earnings tracking.
          </p>
        </div>

        {/* Account Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {accountTypes.map(({ icon: Icon, type, description, color }) => (
            <Card key={type} className="border-border/40">
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-xl bg-secondary/50 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{type}</h3>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Subscription Plans</CardTitle>
            <CardDescription>14-day free trial included</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {plans?.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-2xl bg-secondary/30 border border-border/30 space-y-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground capitalize">{plan.tier}</h4>
                        {plan.tier === 'label' && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-foreground">
                          ${plan.price_monthly}
                        </span>
                        <span className="text-xs text-muted-foreground">/month</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {plan.features?.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <Check className="w-3 h-3 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            className="flex-1 rounded-full"
            onClick={() => navigate('/signup')}
          >
            Create Account
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          No credit card required • Cancel anytime
        </p>
      </div>
    </div>
  );
}
