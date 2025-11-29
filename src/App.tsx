import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { PushNotificationProvider } from "./components/app/PushNotificationProvider";
import { NetworkStatus } from "./components/app/NetworkStatus";
import { AppUpdateBanner } from "./components/app/AppUpdateBanner";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { MobileOnlyRoute } from "./components/auth/MobileOnlyRoute";
import { AdminRoute } from "./components/admin/AdminRoute";
import { DashboardRedirect } from "./components/auth/DashboardRedirect";
import { AppLayout } from "./layouts/AppLayout";
import GetStarted from "./pages/GetStarted";
import { Splash } from "./pages/Splash";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { VerifyEmail } from "./pages/VerifyEmail";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { UserTypeSelection } from "./pages/UserTypeSelection";
import { DesktopLanding } from "./pages/DesktopLanding";
import { Dashboard } from "./pages/Dashboard";
import { ArtistDashboard } from "./pages/ArtistDashboard";
import { LabelDashboard } from "./pages/LabelDashboard";
import { UserTypeSwitcher } from "./pages/UserTypeSwitcher";
import Releases from "./pages/Releases";
import ReleaseDetail from "./pages/ReleaseDetail";
import Upload from "./pages/Upload";
import { Promotions } from "./pages/Promotions";
import { Earnings } from "./pages/Earnings";
import { Analytics } from "./pages/Analytics";
import { LabelAnalytics } from "./pages/LabelAnalytics";
import { AgencyDashboard } from "./pages/AgencyDashboard";
import { ArtistManagement } from "./pages/ArtistManagement";
import { CampaignManager } from "./pages/CampaignManager";
import { PayoutManager } from "./pages/PayoutManager";
import { Results } from "./pages/Results";
import ArtistDetail from "./pages/ArtistDetail";
import ClientManagement from "./pages/ClientManagement";
import AgencyAnalyticsDashboard from "./pages/AgencyAnalyticsDashboard";
import { Profile } from "./pages/Profile";
import { ArtistProfile } from "./pages/ArtistProfile";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NewsDetail from "./pages/NewsDetail";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import { TermsOfService } from "./pages/TermsOfService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { FAQ } from "./pages/FAQ";
import { Support } from "./pages/Support";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import AdminPromotions from "./pages/admin/AdminPromotions";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminFinancials from "./pages/admin/AdminFinancials";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";
import AudioDemo from "./pages/AudioDemo";
import CampaignPaymentSuccess from "./pages/CampaignPaymentSuccess";
import CampaignTracking from "./pages/CampaignTracking";
import PreflightCheck from "./pages/PreflightCheck";
import DeveloperSettings from "./pages/DeveloperSettings";
import { DashboardPreviewLayout } from "./components/admin/DashboardPreviewLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="murranno-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <NetworkStatus />
        <AppUpdateBanner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <PushNotificationProvider>
              <Routes>
              <Route path="/" element={<Navigate to="/splash" replace />} />
              <Route path="/desktop" element={<DesktopLanding />} />
              <Route path="/splash" element={<MobileOnlyRoute><Splash /></MobileOnlyRoute>} />
              <Route path="/welcome" element={<MobileOnlyRoute><Welcome /></MobileOnlyRoute>} />
              <Route path="/get-started" element={<MobileOnlyRoute><GetStarted /></MobileOnlyRoute>} />
              <Route path="/login" element={<MobileOnlyRoute><Login /></MobileOnlyRoute>} />
              <Route path="/signup" element={<MobileOnlyRoute><Signup /></MobileOnlyRoute>} />
              <Route path="/verify-email" element={<MobileOnlyRoute><VerifyEmail /></MobileOnlyRoute>} />
              <Route path="/forgot-password" element={<MobileOnlyRoute><ForgotPassword /></MobileOnlyRoute>} />
              <Route path="/reset-password" element={<MobileOnlyRoute><ResetPassword /></MobileOnlyRoute>} />
              
              {/* Legal & Support Pages */}
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/support" element={<Support />} />
              <Route path="/preflight-check" element={<PreflightCheck />} />
              <Route path="/developer-settings" element={<DeveloperSettings />} />
              
              <Route path="/app" element={<MobileOnlyRoute><ProtectedRoute><AppLayout /></ProtectedRoute></MobileOnlyRoute>}>
                <Route index element={<DashboardRedirect />} />
                <Route path="user-type-selection" element={<UserTypeSelection />} />
                <Route path="user-type-switcher" element={<UserTypeSwitcher />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="artist-dashboard" element={<ArtistDashboard />} />
                <Route path="label-dashboard" element={<LabelDashboard />} />
                <Route path="agency-dashboard" element={<AgencyDashboard />} />
                <Route path="upload" element={<Upload />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="earnings" element={<Earnings />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="label-analytics" element={<LabelAnalytics />} />
                <Route path="artist-management" element={<ArtistManagement />} />
                <Route path="artist-management/:artistId" element={<ArtistDetail />} />
                <Route path="client-management" element={<ClientManagement />} />
                <Route path="agency-analytics" element={<AgencyAnalyticsDashboard />} />
                <Route path="campaign-manager" element={<CampaignManager />} />
                <Route path="payout-manager" element={<PayoutManager />} />
                <Route path="results" element={<Results />} />
                <Route path="profile" element={<Profile />} />
                <Route path="artist-profile" element={<ArtistProfile />} />
                <Route path="settings" element={<Settings />} />
                <Route path="releases" element={<Releases />} />
                <Route path="releases/:id" element={<ReleaseDetail />} />
                <Route path="news/:id" element={<NewsDetail />} />
                <Route path="subscription/plans" element={<SubscriptionPlans />} />
                <Route path="audio-demo" element={<AudioDemo />} />
                <Route path="campaign-payment-success" element={<CampaignPaymentSuccess />} />
                <Route path="campaign-tracking" element={<CampaignTracking />} />
              </Route>

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
              <Route path="/admin/campaigns" element={<AdminRoute><AdminCampaigns /></AdminRoute>} />
              <Route path="/admin/promotions" element={<AdminRoute><AdminPromotions /></AdminRoute>} />
              <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />
              <Route path="/admin/financials" element={<AdminRoute><AdminFinancials /></AdminRoute>} />
              <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogs /></AdminRoute>} />
              
              {/* Admin preview routes - access all dashboard types */}
              <Route path="/admin/preview/artist" element={<AdminRoute><DashboardPreviewLayout dashboardType="Artist"><ArtistDashboard /></DashboardPreviewLayout></AdminRoute>} />
              <Route path="/admin/preview/label" element={<AdminRoute><DashboardPreviewLayout dashboardType="Label"><LabelDashboard /></DashboardPreviewLayout></AdminRoute>} />
              <Route path="/admin/preview/agency" element={<AdminRoute><DashboardPreviewLayout dashboardType="Agency"><AgencyDashboard /></DashboardPreviewLayout></AdminRoute>} />
              
              {/* Legacy route redirects */}
              <Route path="/artist-dashboard" element={<Navigate to="/app/artist-dashboard" replace />} />
              <Route path="/label-dashboard" element={<Navigate to="/app/label-dashboard" replace />} />
              <Route path="/agency-dashboard" element={<Navigate to="/app/agency-dashboard" replace />} />
              <Route path="/upload" element={<Navigate to="/app/upload" replace />} />
              <Route path="/promotions" element={<Navigate to="/app/promotions" replace />} />
              <Route path="/earnings" element={<Navigate to="/app/earnings" replace />} />
              <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
              <Route path="/label-analytics" element={<Navigate to="/app/label-analytics" replace />} />
              <Route path="/artist-management" element={<Navigate to="/app/artist-management" replace />} />
              <Route path="/campaign-manager" element={<Navigate to="/app/campaign-manager" replace />} />
              <Route path="/payout-manager" element={<Navigate to="/app/payout-manager" replace />} />
              <Route path="/results" element={<Navigate to="/app/results" replace />} />
              <Route path="/profile" element={<Navigate to="/app/profile" replace />} />
              <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
              <Route path="/releases" element={<Navigate to="/app/releases" replace />} />
              <Route path="/releases/:id" element={<Navigate to="/app/releases/:id" replace />} />
              <Route path="/subscription/plans" element={<Navigate to="/app/subscription/plans" replace />} />
              
              <Route path="*" element={<NotFound />} />
              </Routes>
            </PushNotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
