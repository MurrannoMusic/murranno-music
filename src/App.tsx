import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { UserTypeSelection } from "./pages/UserTypeSelection";
import { Dashboard } from "./pages/Dashboard";
import { ArtistDashboard } from "./pages/ArtistDashboard";
import { LabelDashboard } from "./pages/LabelDashboard";
import { Upload } from "./pages/Upload";
import { Promotions } from "./pages/Promotions";
import { Earnings } from "./pages/Earnings";
import { Analytics } from "./pages/Analytics";
import { LabelAnalytics } from "./pages/LabelAnalytics";
import { AgencyDashboard } from "./pages/AgencyDashboard";
import { ArtistManagement } from "./pages/ArtistManagement";
import { CampaignManager } from "./pages/CampaignManager";
import { PayoutManager } from "./pages/PayoutManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="murranno-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artist-dashboard" element={<ArtistDashboard />} />
            <Route path="/label-dashboard" element={<LabelDashboard />} />
            <Route path="/agency-dashboard" element={<AgencyDashboard />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-type-selection" element={<UserTypeSelection />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/promotions" element={<Promotions />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/label-analytics" element={<LabelAnalytics />} />
            <Route path="/artist-management" element={<ArtistManagement />} />
            <Route path="/campaign-manager" element={<CampaignManager />} />
            <Route path="/payout-manager" element={<PayoutManager />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
