import { Music, Users, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';
import { UserType } from '@/types/user';

export const UserTypeSwitcher = () => {
  const { currentUserType, switchUserType } = useUserType();
  const navigate = useNavigate();

  const userTypes = [
    {
      type: 'artist' as UserType,
      title: 'Artist',
      description: 'Upload music, track streams, manage promotions and earnings',
      icon: Music,
      gradient: 'gradient-primary',
      features: ['Upload tracks', 'Track streams', 'Promotion campaigns', 'Earnings analytics']
    },
    {
      type: 'label' as UserType,
      title: 'Label',
      description: 'Manage artists, handle payouts, oversee multiple releases',
      icon: Users,
      gradient: 'gradient-secondary',
      features: ['Artist management', 'Payout handling', 'Multi-artist analytics', 'Label dashboard']
    },
    {
      type: 'agency' as UserType,
      title: 'Agency',
      description: 'Create marketing campaigns, track performance, manage client artists',
      icon: Zap,
      gradient: 'gradient-accent',
      features: ['Campaign creation', 'Performance tracking', 'Client management', 'ROI analytics']
    }
  ];

  const handleUserTypeSwitch = (type: UserType) => {
    switchUserType(type);
    // Navigate to the appropriate dashboard
    const redirectPath = getRedirectPath(type);
    navigate(redirectPath);
  };

  const getRedirectPath = (type: UserType) => {
    switch (type) {
      case 'artist':
        return '/artist-dashboard';
      case 'label':
        return '/label-dashboard';
      case 'agency':
        return '/agency-dashboard';
      default:
        return '/dashboard';
    }
  };

  return (
    <PageContainer>
      {/* Modern Header */}
      <div className="bg-gradient-dark backdrop-blur-xl p-6 text-foreground mobile-safe-top">
        <div className="text-center">
          <h1 className="heading-xl mb-2">Choose Your Experience</h1>
          <p className="body-lg text-muted-foreground">Select how you want to use the platform</p>
        </div>
      </div>

      <div className="mobile-container space-y-6 -mt-4">
        {/* User Type Cards */}
        <div className="space-y-4">
          {userTypes.map(({ type, title, description, icon: Icon, gradient, features }) => {
            const isActive = currentUserType === type;
            
            return (
              <Card key={type} className={`modern-card interactive-element ${isActive ? 'ring-2 ring-primary/30 shadow-glow' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${gradient} rounded-2xl flex items-center justify-center shadow-primary`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="heading-md">{title}</h3>
                          {isActive && (
                            <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">
                              CURRENT
                            </Badge>
                          )}
                        </div>
                        <p className="body-md text-muted-foreground">{description}</p>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-1 gap-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="body-sm text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Button 
                          onClick={() => handleUserTypeSwitch(type)}
                          variant={isActive ? "ghost" : "pill"}
                          className={`w-full ${!isActive ? gradient : ''}`}
                          disabled={isActive}
                        >
                          {isActive ? 'Currently Selected' : `Select ${title}`}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Notice */}
        <Card className="modern-card border-warning/30 bg-warning/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-warning/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-warning text-lg">💡</span>
              </div>
              <div>
                <h4 className="body-lg font-semibold mb-1">Demo Platform</h4>
                <p className="body-sm text-muted-foreground">
                  Experience different user perspectives. Select a role above to explore the platform's features.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};