import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WelcomeCarousel } from '@/components/mobile/WelcomeCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Megaphone, ChevronRight } from 'lucide-react';
import { UserType } from '@/types/user';

export const Welcome = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const userTypes: { 
    type: UserType; 
    label: string; 
    icon: any; 
    description: string;
    color: string;
  }[] = [
    { 
      type: 'artist', 
      label: 'Artist', 
      icon: User, 
      description: 'Manage your music, track streams, and earnings',
      color: 'bg-primary'
    },
    { 
      type: 'label', 
      label: 'Record Label', 
      icon: Building2, 
      description: 'Manage artists, campaigns, and label analytics',
      color: 'bg-secondary'
    },
    { 
      type: 'agency', 
      label: 'Marketing Agency', 
      icon: Megaphone, 
      description: 'Run promotional campaigns for your clients',
      color: 'bg-accent'
    }
  ];

  const handleCreateAccount = () => {
    if (selectedUserType) {
      navigate('/signup', { state: { tier: selectedUserType } });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact carousel at top */}
      <WelcomeCarousel compact />

      {/* User type selection section */}
      <div className="flex-1 bg-background">
        <div className="mobile-container py-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">Choose Your Account Type</h2>
            <p className="text-muted-foreground text-sm">Select how you'll be using Murranno Music</p>
          </div>

          <div className="space-y-3 mb-6">
            {userTypes.map(({ type, label, icon: Icon, description, color }) => (
              <Card 
                key={type} 
                className={`cursor-pointer transition-all ${
                  selectedUserType === type 
                    ? 'ring-2 ring-primary shadow-lg scale-[1.02]' 
                    : 'hover:shadow-md hover:scale-[1.01]'
                }`}
                onClick={() => setSelectedUserType(type)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${color} text-white`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{label}</CardTitle>
                    </div>
                    {selectedUserType === type && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <ChevronRight className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <p className="text-muted-foreground text-sm">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={handleCreateAccount}
            disabled={!selectedUserType}
            className="w-full gradient-primary music-button shadow-primary"
            size="lg"
          >
            Create Account
          </Button>

          {/* Login link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground">
              You can change your account type later in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
