import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Megaphone } from 'lucide-react';
import { useUserType } from '@/hooks/useUserType';
import { UserType } from '@/types/user';

export const UserTypeSelection = () => {
  const navigate = useNavigate();
  const { switchUserType } = useUserType();

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

  const handleUserTypeSelect = (type: UserType) => {
    switchUserType(type);
    
    // Navigate to user-specific dashboard
    switch(type) {
      case 'artist':
        navigate('/artist-dashboard');
        break;
      case 'label':
        navigate('/label-dashboard');
        break;
      case 'agency':
        navigate('/agency-dashboard');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mobile-container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Murranno</h1>
          <p className="text-muted-foreground">Choose your account type to get started</p>
        </div>

        <div className="space-y-4">
          {userTypes.map(({ type, label, icon: Icon, description, color }) => (
            <Card 
              key={type} 
              className="glass-card cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => handleUserTypeSelect(type)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${color} text-white`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-4">{description}</p>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserTypeSelect(type);
                  }}
                >
                  Continue as {label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can change your account type later in settings
          </p>
        </div>
      </div>
    </div>
  );
};