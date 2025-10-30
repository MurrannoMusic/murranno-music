import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/admin/AdminRoute";
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
              <Route path="/user-type-selection" element={<ProtectedRoute><UserTypeSelection /></ProtectedRoute>} />
              <Route path="/user-type-switcher" element={<ProtectedRoute><UserTypeSwitcher /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/artist-dashboard" element={<ProtectedRoute><ArtistDashboard /></ProtectedRoute>} />
              <Route path="/label-dashboard" element={<ProtectedRoute><LabelDashboard /></ProtectedRoute>} />
              <Route path="/agency-dashboard" element={<ProtectedRoute><AgencyDashboard /></ProtectedRoute>} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/promotions" element={<ProtectedRoute><Promotions /></ProtectedRoute>} />
              <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/label-analytics" element={<ProtectedRoute><LabelAnalytics /></ProtectedRoute>} />
              <Route path="/artist-management" element={<ProtectedRoute><ArtistManagement /></ProtectedRoute>} />
              <Route path="/campaign-manager" element={<ProtectedRoute><CampaignManager /></ProtectedRoute>} />
              <Route path="/payout-manager" element={<ProtectedRoute><PayoutManager /></ProtectedRoute>} />
              <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/artist-profile" element={<ProtectedRoute><ArtistProfile /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/releases" element={<ProtectedRoute><Releases /></ProtectedRoute>} />
              <Route path="/releases/:id" element={<ProtectedRoute><ReleaseDetail /></ProtectedRoute>} />
              <Route path="/news/:id" element={<ProtectedRoute><NewsDetail /></ProtectedRoute>} />
              <Route path="/subscription/plans" element={<ProtectedRoute><SubscriptionPlans /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="/admin/content" element={<AdminRoute><AdminContent /></AdminRoute>} />
              <Route path="/admin/financials" element={<AdminRoute><AdminFinancials /></AdminRoute>} />
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
