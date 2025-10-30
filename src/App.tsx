import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/admin/AdminRoute";
import { AppLayout } from "./layouts/AppLayout";
import GetStarted from "./pages/GetStarted";
import { Splash } from "./pages/Splash";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { UserTypeSelection } from "./pages/UserTypeSelection";
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
import { Profile } from "./pages/Profile";
import { ArtistProfile } from "./pages/ArtistProfile";
import { Settings } from "./pages/Settings";
import NotFound from "./pages/NotFound";
import NewsDetail from "./pages/NewsDetail";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminContent from "./pages/admin/AdminContent";
import AdminFinancials from "./pages/admin/AdminFinancials";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAuditLogs from "./pages/admin/AdminAuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="murranno-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/splash" replace />} />
              <Route path="/splash" element={<Splash />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/get-started" element={<GetStarted />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
              </Route>

              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
              <Route path="/admin/financials" element={<AdminRoute><AdminFinancials /></AdminRoute>} />
              <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
              <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
              <Route path="/admin/audit-logs" element={<AdminRoute><AdminAuditLogs /></AdminRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
