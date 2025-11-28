import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WelcomeCarousel } from '@/components/mobile/WelcomeCarousel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { User, Building2, Megaphone, ChevronRight } from 'lucide-react';
import { UserType } from '@/types/user';

export const Welcome = () => {
  const navigate = useNavigate();
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Full carousel */}
      <WelcomeCarousel />

      {/* Fixed bottom CTA area */}
      <div className="fixed bottom-0 inset-x-0 p-6 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
        <div className="pointer-events-auto space-y-4">
          <Button 
            onClick={() => setDrawerOpen(true)}
            className="w-full gradient-primary music-button shadow-primary"
            size="lg"
          >
            Get Started
          </Button>
          
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Account type selection drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader>
            <DrawerTitle>Choose Your Account Type</DrawerTitle>
            <DrawerDescription>Select how you'll be using Murranno Music</DrawerDescription>
          </DrawerHeader>

          <div className="px-4 space-y-3 overflow-y-auto flex-1">
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

          <DrawerFooter>
            <Button 
              onClick={handleCreateAccount}
              disabled={!selectedUserType}
              className="w-full gradient-primary music-button shadow-primary"
              size="lg"
            >
              Create Account
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
              You can change your account type later in settings
            </p>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
