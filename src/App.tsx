import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Admin pages
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import MapDashboard from "./pages/MapDashboard.tsx";
import DoctorVerification from "./pages/DoctorVerification.tsx";
import DoctorVerificationPanel from "./pages/admin/DoctorVerificationPanel.tsx";
import PharmacyInventory from "./pages/PharmacyInventory.tsx";
import CoverageAnalytics from "./pages/CoverageAnalytics.tsx";
import Notifications from "./pages/Notifications.tsx";

// Auth pages
import Login from "./pages/Login.tsx";
import DoctorRegister from "./pages/DoctorRegister.tsx";
import DoctorOtpSignup from "./pages/DoctorOtpSignup.tsx";
import DoctorOtpVerify from "./pages/DoctorOtpVerify.tsx";
import DoctorApprovalPending from "./pages/DoctorApprovalPending.tsx";

// Doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard.tsx";
import PatientQueue from "./pages/doctor/PatientQueue.tsx";
import PrescriptionPanel from "./pages/doctor/PrescriptionPanel.tsx";
import DoctorVillageMap from "./pages/doctor/VillageMap.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<DoctorRegister />} />
            <Route path="/doctor-signup" element={<DoctorOtpSignup />} />
            <Route path="/doctor-verify" element={<DoctorOtpVerify />} />
            {/* Shown to doctors whose isActive=false — accessible without full auth */}
            <Route path="/doctor/pending-approval" element={<DoctorApprovalPending />} />

            {/* Admin-only routes */}
            <Route path="/" element={<ProtectedRoute allowedRoles={["admin"]}><Index /></ProtectedRoute>} />
            <Route path="/map" element={<ProtectedRoute allowedRoles={["admin"]}><MapDashboard /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute allowedRoles={["admin"]}><DoctorVerification /></ProtectedRoute>} />
            <Route path="/admin/pending-doctors" element={<ProtectedRoute allowedRoles={["admin"]}><DoctorVerificationPanel /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute allowedRoles={["admin"]}><PharmacyInventory /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><CoverageAnalytics /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute allowedRoles={["admin"]}><Notifications /></ProtectedRoute>} />

            {/* Doctor-only routes */}
            <Route path="/doctor" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/queue" element={<ProtectedRoute allowedRoles={["doctor"]}><PatientQueue /></ProtectedRoute>} />
            <Route path="/doctor/prescriptions" element={<ProtectedRoute allowedRoles={["doctor"]}><PrescriptionPanel /></ProtectedRoute>} />
            <Route path="/doctor/map" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorVillageMap /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
