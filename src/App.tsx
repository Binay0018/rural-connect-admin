import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import MapDashboard from "./pages/MapDashboard.tsx";
import DoctorVerification from "./pages/DoctorVerification.tsx";
import PharmacyInventory from "./pages/PharmacyInventory.tsx";
import CoverageAnalytics from "./pages/CoverageAnalytics.tsx";
import Notifications from "./pages/Notifications.tsx";
import Login from "./pages/Login.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Index />} />
          <Route path="/map" element={<MapDashboard />} />
          <Route path="/doctors" element={<DoctorVerification />} />
          <Route path="/pharmacy" element={<PharmacyInventory />} />
          <Route path="/analytics" element={<CoverageAnalytics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
