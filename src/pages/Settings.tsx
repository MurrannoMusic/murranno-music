import { useState } from 'react';
import { ArrowLeft, Moon, Sun, Monitor, Bell, User, Lock, HelpCircle, CreditCard, LogOut, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { AvatarDropdown } from '@/components/layout/AvatarDropdown';
import { PageContainer } from '@/components/layout/PageContainer';
import { useTheme } from '@/components/ThemeProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChangeEmailDialog } from '@/components/settings/ChangeEmailDialog';
import { ChangePasswordDialog } from '@/components/settings/ChangePasswordDialog';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Loader2 } from 'lucide-react';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { preferences, isLoading, updatePreference } = useNotificationPreferences();
  
  // Dialog states
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <PageContainer>
      <div className="bg-gradient-dark backdrop-blur-xl p-4 text-foreground mobile-safe-top">
        <div className="flex items-center justify-between">
          <Link to="/app/artist-dashboard" className="p-2 hover:bg-secondary/30 rounded-xl transition-smooth">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          
          <div className="flex-1 text-center">
            <Badge className="bg-primary/15 text-primary border-primary/30 px-4 py-1">
              SETTINGS
            </Badge>
          </div>
          
          <AvatarDropdown />
        </div>
      </div>

      <div className="mobile-container space-y-4 mt-4 pb-20">
        {/* Theme Settings */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Moon className="h-5 w-5 text-primary" />
              Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={() => setTheme('light')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'light' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Sun className="h-5 w-5" />
              <span>Light Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('dark')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'dark' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </button>
            
            <button
              onClick={() => setTheme('system')}
              className={`w-full flex items-center gap-3 p-4 rounded-[16px] border transition-all ${
                theme === 'system' 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-secondary/20 border-border text-card-foreground hover:bg-secondary/40'
              }`}
            >
              <Monitor className="h-5 w-5" />
              <span>System Default</span>
            </button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Email Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={preferences?.email_notifications ?? true} 
                    onCheckedChange={(checked) => updatePreference('email_notifications', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Get real-time alerts on your device</p>
                  </div>
                  <Switch 
                    checked={preferences?.push_notifications ?? true} 
                    onCheckedChange={(checked) => updatePreference('push_notifications', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">In-App Notifications</p>
                    <p className="text-xs text-muted-foreground">Show notifications in the app</p>
                  </div>
                  <Switch 
                    checked={preferences?.in_app_notifications ?? true} 
                    onCheckedChange={(checked) => updatePreference('in_app_notifications', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Release Updates</p>
                    <p className="text-xs text-muted-foreground">Track status changes</p>
                  </div>
                  <Switch 
                    checked={preferences?.release_updates ?? true} 
                    onCheckedChange={(checked) => updatePreference('release_updates', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Campaign Updates</p>
                    <p className="text-xs text-muted-foreground">Promotion campaign notifications</p>
                  </div>
                  <Switch 
                    checked={preferences?.campaign_updates ?? true} 
                    onCheckedChange={(checked) => updatePreference('campaign_updates', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Earnings Alerts</p>
                    <p className="text-xs text-muted-foreground">Payment notifications</p>
                  </div>
                  <Switch 
                    checked={preferences?.earnings_alerts ?? true} 
                    onCheckedChange={(checked) => updatePreference('earnings_alerts', checked)} 
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-[12px]">
                  <div className="flex-1">
                    <p className="font-semibold text-card-foreground">Marketing Emails</p>
                    <p className="text-xs text-muted-foreground">Product updates and offers</p>
                  </div>
                  <Switch 
                    checked={preferences?.marketing_emails ?? false} 
                    onCheckedChange={(checked) => updatePreference('marketing_emails', checked)} 
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account Management */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/app/profile">
              <button className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left">
                <User className="h-5 w-5 text-primary" />
                <span className="text-card-foreground font-medium">Edit Profile</span>
              </button>
            </Link>

            <button 
              onClick={() => setEmailDialogOpen(true)}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <Mail className="h-5 w-5 text-primary" />
              <span className="text-card-foreground font-medium">Change Email</span>
            </button>

            <button 
              onClick={() => setPasswordDialogOpen(true)}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <Lock className="h-5 w-5 text-primary" />
              <span className="text-card-foreground font-medium">Change Password</span>
            </button>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/app/subscription/plans">
              <button className="w-full flex items-center justify-between p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all">
                <span className="text-card-foreground font-medium">Manage Subscription</span>
                <Badge variant="secondary">Active</Badge>
              </button>
            </Link>
          </CardContent>
        </Card>

        {/* Help & Support */}
        <Card className="bg-card border border-border rounded-[20px] shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-card-foreground flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button 
              onClick={() => navigate('/faq')}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <span className="text-card-foreground font-medium">FAQs</span>
            </button>

            <button 
              onClick={() => navigate('/support')}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <span className="text-card-foreground font-medium">Contact Support</span>
            </button>

            <button 
              onClick={() => navigate('/terms')}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <span className="text-card-foreground font-medium">Terms of Service</span>
            </button>

            <button 
              onClick={() => navigate('/privacy')}
              className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-[12px] border border-border hover:bg-secondary/30 transition-all text-left"
            >
              <span className="text-card-foreground font-medium">Privacy Policy</span>
            </button>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button 
          onClick={handleSignOut}
          variant="outline" 
          className="w-full bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 rounded-[16px] h-12"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <ChangeEmailDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen} />
      <ChangePasswordDialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} />
    </PageContainer>
  );
};