import { Music, Users, Zap, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/layout/PageHeader';
import { useUserType } from '@/hooks/useUserType';
import { UserType } from '@/types/user';

export const UserTypeSwitcher = () => {
  const { currentUserType, switchUserType } = useUserType();

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
      <PageHeader
        title="Switch User Type"
        subtitle="Experience the platform from different perspectives"
        backTo="/"
      />

      <div className="mobile-container space-y-6 -mt-8">
        {/* Current User Type Indicator */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently viewing as</p>
                <p className="font-semibold text-lg">{currentUserType.charAt(0).toUpperCase() + currentUserType.slice(1)}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                ACTIVE
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Type Cards */}
        <div className="space-y-4">
          {userTypes.map(({ type, title, description, icon: Icon, gradient, features }) => {
            const isActive = currentUserType === type;
            
            return (
              <Card key={type} className={`glass-card transition-all duration-300 ${isActive ? 'ring-2 ring-primary/20' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${gradient} rounded-xl flex items-center justify-center shadow-soft`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{title}</h3>
                          {isActive && (
                            <Badge variant="secondary" className="text-xs">
                              CURRENT
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">{description}</p>
                      </div>

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-2">
                        {features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        {isActive ? (
                          <Link to={getRedirectPath(type)}>
                            <Button variant="outline" className="w-full">
                              Go to {title} Dashboard
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            onClick={() => handleUserTypeSwitch(type)}
                            className={`w-full ${gradient} text-white hover:opacity-90`}
                          >
                            Switch to {title}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Notice */}
        <Card className="glass-card border-amber-200/20 bg-amber-50/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Demo Mode</h4>
                <p className="text-xs text-muted-foreground">
                  This is a demo feature to showcase different user perspectives. 
                  In a production app, user types would be set during account creation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};