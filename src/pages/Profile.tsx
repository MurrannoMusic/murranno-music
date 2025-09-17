import { ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { useUserType } from '@/hooks/useUserType';

export const Profile = () => {
  const { currentUser } = useUserType();

  return (
    <PageContainer>
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              PROFILE
            </Badge>
          </div>
          
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4">
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-[16px] border border-border">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-xl">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-card-foreground">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground">{currentUser.accountType.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardContent className="p-4">
            <p className="text-center text-muted-foreground">
              Profile editing features coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};