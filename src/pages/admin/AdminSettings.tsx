import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Settings, 
  Shield, 
  Mail, 
  CreditCard, 
  Bell,
  Globe,
  Save
} from 'lucide-react';

interface PlatformSettings {
  platform_name: string;
  support_email: string;
  max_upload_size_mb: number;
  enable_auto_approve: boolean;
  maintenance_mode: boolean;
  default_currency: string;
  commission_rate: number;
  minimum_payout: number;
}

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<PlatformSettings>({
    platform_name: 'Murranno Music',
    support_email: 'support@murranno.com',
    max_upload_size_mb: 200,
    enable_auto_approve: false,
    maintenance_mode: false,
    default_currency: 'NGN',
    commission_rate: 15,
    minimum_payout: 5000,
  });

  const saveSettings = useMutation({
    mutationFn: async (newSettings: PlatformSettings) => {
      // In a real app, this would save to a settings table
      console.log('Saving settings:', newSettings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return newSettings;
    },
    onSuccess: () => {
      toast.success('Settings saved successfully');
      queryClient.invalidateQueries({ queryKey: ['platform-settings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to save settings');
    },
  });

  const handleSave = () => {
    saveSettings.mutate(settings);
  };

  const updateSetting = <K extends keyof PlatformSettings>(
    key: K,
    value: PlatformSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Platform Settings</h2>
            <p className="text-muted-foreground">Manage platform configuration and preferences</p>
          </div>
          <Button onClick={handleSave} disabled={saveSettings.isPending} className="gap-2">
            <Save className="h-4 w-4" />
            {saveSettings.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Platform Information
                </CardTitle>
                <CardDescription>
                  Basic platform settings and configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={settings.platform_name}
                    onChange={(e) => updateSetting('platform_name', e.target.value)}
                    placeholder="Enter platform name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.support_email}
                    onChange={(e) => updateSetting('support_email', e.target.value)}
                    placeholder="support@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-upload">Max Upload Size (MB)</Label>
                  <Input
                    id="max-upload"
                    type="number"
                    value={settings.max_upload_size_mb}
                    onChange={(e) => updateSetting('max_upload_size_mb', parseInt(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum file size for audio uploads
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to temporarily disable public access
                    </p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={settings.maintenance_mode}
                    onCheckedChange={(checked) => updateSetting('maintenance_mode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Content Moderation
                </CardTitle>
                <CardDescription>
                  Configure content review and moderation settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approve">Auto-Approve Releases</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve new releases without manual review
                    </p>
                  </div>
                  <Switch
                    id="auto-approve"
                    checked={settings.enable_auto_approve}
                    onCheckedChange={(checked) => updateSetting('enable_auto_approve', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Restricted Words</Label>
                  <Textarea
                    placeholder="Enter restricted words (one per line)"
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Content containing these words will be flagged for review
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limiting</CardTitle>
                <CardDescription>
                  Configure API and upload rate limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-limit">API Requests per Hour</Label>
                  <Input
                    id="api-limit"
                    type="number"
                    defaultValue="1000"
                    placeholder="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upload-limit">Uploads per Day</Label>
                  <Input
                    id="upload-limit"
                    type="number"
                    defaultValue="10"
                    placeholder="10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Configuration
                </CardTitle>
                <CardDescription>
                  Manage payment processing and payout settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select 
                    value={settings.default_currency}
                    onValueChange={(value) => updateSetting('default_currency', value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commission">Platform Commission (%)</Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    value={settings.commission_rate}
                    onChange={(e) => updateSetting('commission_rate', parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Percentage taken from artist earnings
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-payout">Minimum Payout Amount</Label>
                  <Input
                    id="min-payout"
                    type="number"
                    value={settings.minimum_payout}
                    onChange={(e) => updateSetting('minimum_payout', parseFloat(e.target.value))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum balance required for withdrawal
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payout-schedule">Payout Schedule</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="payout-schedule">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
                <CardDescription>
                  Configure payment processor settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gateway">Payment Gateway</Label>
                  <Select defaultValue="paystack">
                    <SelectTrigger id="gateway">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paystack">Paystack</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="flutterwave">Flutterwave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <p className="text-sm font-medium">Payment Gateway Status</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    <span className="text-sm text-muted-foreground">Connected</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure when to send email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>New User Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins when new users sign up
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>New Release Submissions</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins when releases are submitted
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Payout Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins when users request payouts
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Content Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Notify admins when content is reported
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>
                  Customize email notification templates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="welcome-template">Welcome Email</Label>
                  <Textarea
                    id="welcome-template"
                    placeholder="Enter welcome email template..."
                    rows={4}
                    className="resize-none"
                    defaultValue="Welcome to Murranno Music! We're excited to have you join our platform..."
                  />
                </div>

                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Test Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
