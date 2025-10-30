import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { supabase } from '@/integrations/supabase/client';
import { Check, Loader2, AlertCircle, ArrowLeft, Zap } from 'lucide-react';
import { toast } from 'sonner';

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { user, subscription, userRole, refreshUserData } = useAuth();
  const { data: plans, isLoading } = useSubscriptionPlans();
  const [upgradingTo, setUpgradingTo] = useState<string | null>(null);

  const currentTier = userRole?.tier || 'artist';
  
  // Determine correct dashboard path based on user tier
  const getDashboardPath = () => {
    switch (currentTier) {
      case 'label':
        return '/label-dashboard';
      case 'agency':
        return '/agency-dashboard';
      case 'artist':
      default:
        return '/artist-dashboard';
    }
  };
  const isTrialEnded = subscription?.status === 'trial' && subscription?.trial_ends_at && new Date(subscription.trial_ends_at) < new Date();
  const isExpired = subscription?.status === 'expired' || subscription?.status === 'cancelled';

  const handleUpgrade = async (tier: string) => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    setUpgradingTo(tier);

    try {
      const { data, error } = await supabase.functions.invoke('paystack-upgrade-subscription', {
        body: { new_tier: tier, email: user.email }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.authorization_url;
      } else if (data?.redirect_url) {
        // Free upgrade completed
        toast.success(data.message || 'Upgrade successful!');
        await refreshUserData();
        navigate(data.redirect_url);
      }
    } catch (error: any) {
      console.error('Upgrade error:', error);
      toast.error(error.message || 'Failed to initiate upgrade');
      setUpgradingTo(null);
    }
  };

  const handleInitializeSubscription = async (tier: string) => {
    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    setUpgradingTo(tier);

    try {
      const { data, error } = await supabase.functions.invoke('paystack-initialize-subscription', {
        body: { 
          tier, 
          email: user.email,
          full_name: user.user_metadata?.full_name || ''
        }
      });

      if (error) throw error;

      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data?.redirect_url) {
        // Free subscription activated
        toast.success(data.message || 'Subscription activated!');
        await refreshUserData();
        navigate(data.redirect_url);
      }
    } catch (error: any) {
      console.error('Subscription initialization error:', error);
      toast.error(error.message || 'Failed to initialize subscription');
      setUpgradingTo(null);
    }
  };

  const getStatusMessage = () => {
    if (isTrialEnded) {
      return {
        title: 'Your trial has ended',
        description: 'Continue enjoying all features by subscribing to a paid plan.',
        variant: 'destructive' as const
      };
    }
    if (isExpired) {
      return {
        title: 'Your subscription has expired',
        description: 'Renew your subscription to continue using all features.',
        variant: 'destructive' as const
      };
    }
    return {
      title: 'Upgrade your plan',
      description: 'Get access to more features by upgrading to a higher tier.',
      variant: 'default' as const
    };
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="dark min-h-screen bg-gradient-mesh overflow-y-auto">
      <div className="w-full max-w-6xl mx-auto p-4 space-y-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(getDashboardPath())}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
        </div>

        {/* Status Alert */}
        <Alert variant={statusMessage.variant}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-semibold">{statusMessage.title}</p>
              <p className="text-sm">{statusMessage.description}</p>
            </div>
          </AlertDescription>
        </Alert>

        {/* Current Plan Info */}
        {subscription && (
          <Card className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="text-2xl font-bold capitalize">{currentTier}</p>
                  {subscription.status === 'trial' && subscription.trial_ends_at && (
                    <p className="text-sm text-muted-foreground">
                      Trial {isTrialEnded ? 'ended' : 'ends'}: {new Date(subscription.trial_ends_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={isTrialEnded || isExpired ? 'destructive' : 'default'}
                  className="capitalize"
                >
                  {subscription.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
            <p className="text-sm text-muted-foreground">Select the plan that best fits your needs</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans?.map((plan) => {
                const isCurrentPlan = plan.tier === currentTier;
                const isPopular = plan.tier === 'label';
                const isUpgrading = upgradingTo === plan.tier;

                return (
                  <Card
                    key={plan.id}
                    className={`border-2 overflow-hidden relative ${
                      isCurrentPlan
                        ? 'border-primary/60 bg-primary/5'
                        : isPopular
                        ? 'border-primary/40 shadow-lg shadow-primary/20'
                        : 'border-border/40'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <Badge className="bg-gradient-to-r from-primary to-accent border-0 shadow-lg">
                          <Zap className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <CardTitle className="text-xl capitalize">{plan.tier}</CardTitle>
                      <div className="flex items-baseline justify-center gap-1 mt-2">
                        <span className="text-3xl font-bold text-foreground">
                          ₦{plan.price_monthly.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features?.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className="w-full"
                        variant={isCurrentPlan ? 'outline' : 'default'}
                        disabled={isCurrentPlan || isUpgrading}
                        onClick={() => {
                          if (isTrialEnded || isExpired) {
                            handleInitializeSubscription(plan.tier);
                          } else {
                            handleUpgrade(plan.tier);
                          }
                        }}
                      >
                        {isUpgrading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {isCurrentPlan 
                          ? 'Current Plan'
                          : isUpgrading
                          ? 'Processing...'
                          : isTrialEnded || isExpired
                          ? 'Subscribe'
                          : 'Upgrade'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="border-border/40 bg-secondary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Need help choosing a plan? <Button variant="link" className="p-0 h-auto text-primary">Contact support</Button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}