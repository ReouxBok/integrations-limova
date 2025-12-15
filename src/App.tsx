import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import NewFeedback from "./pages/NewFeedback";
import FeedbacksList from "./pages/FeedbacksList";
import FeedbackDetail from "./pages/FeedbackDetail";
import TeamSAV from "./pages/TeamSAV";
import TeamOnboarding from "./pages/TeamOnboarding";
import Auth from "./pages/Auth";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminImportExcel from "./pages/admin/AdminImportExcel";
import Integrations from "./pages/Integrations";
import IntegrationDetail from "./pages/IntegrationDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/feedback/new" element={<NewFeedback />} />
                <Route path="/feedbacks" element={<FeedbacksList />} />
                <Route path="/feedbacks/:id" element={<FeedbackDetail />} />
                <Route path="/team/sav" element={<TeamSAV />} />
                <Route path="/team/onboarding" element={<TeamOnboarding />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/import" element={<AdminImportExcel />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/integrations/:slug" element={<IntegrationDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
