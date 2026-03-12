import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { mockUserStore, MockUser, UserRole } from './mockUsers';
import {
  getDoctorToken, getDoctorUser, clearDoctorToken,
  DOCTOR_TOKEN_KEY, DOCTOR_USER_KEY, VerifyOtpResponse,
} from '@/services/authService';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'pending' | 'rejected';
  doctorId?: string;
  specialization?: string;
  registrationNumber?: string;
  token: string;
  /** true = logged in via real backend OTP (not mock) */
  otpAuthenticated?: boolean;
  /** approval flag from backend response */
  approved?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; status?: string }>;
  logout: () => void;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  approveDoctorByEmail: (email: string) => void;
  rejectDoctorByEmail: (email: string) => void;
  getPendingDoctors: () => MockUser[];
  /** Called after successful OTP verification to set the doctor session */
  loginWithOtpToken: (token: string, backendUser: VerifyOtpResponse['user']) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  registrationNumber: string;
  council: string;
  specialization: string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const SESSION_KEY = 'swastya_session';

function makeToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}`);
}

/** Build an AuthUser from an OTP-verified backend response */
function buildOtpUser(token: string, backendUser: VerifyOtpResponse['user']): AuthUser {
  // If the backend returns isActive, use it. Otherwise, assume false unless explicitly approved.
  const isApproved = backendUser?.isActive === true || backendUser?.approved === true;
  return {
    id: String(backendUser?.id || backendUser?.doctorId || 'otp_doctor'),
    name: String(backendUser?.name || 'Doctor'),
    email: String(backendUser?.phone || ''),
    role: 'doctor',
    status: isApproved ? 'active' : 'pending',
    doctorId: String(backendUser?.doctorId || ''),
    token,
    otpAuthenticated: true,
    approved: isApproved,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Restore session on mount ─────────────────────────────────────────
  useEffect(() => {
    try {
      // 1. Try mock session first
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed: AuthUser = JSON.parse(stored);
        const found = mockUserStore.find(u => u.id === parsed.id);
        if (found) {
          setUser({ ...parsed, status: found.status });
          setIsLoading(false);
          return;
        }
      }

      // 2. Try OTP token (real backend session)
      const otpToken = getDoctorToken();
      const otpUserRaw = getDoctorUser();
      if (otpToken && otpUserRaw) {
        setUser(buildOtpUser(otpToken, otpUserRaw));
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    setIsLoading(false);
  }, []);

  // ── Mock login ────────────────────────────────────────────────────────
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; status?: string }> => {
    await new Promise(r => setTimeout(r, 500));

    const found = mockUserStore.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );

    if (!found) return { success: false, error: 'Invalid email or password.' };
    if (found.status === 'rejected') {
      return {
        success: false,
        error: 'Your registration has been rejected. Please contact support.',
        status: 'rejected',
      };
    }

    const authUser: AuthUser = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      status: found.status,
      doctorId: found.doctorId,
      specialization: found.specialization,
      registrationNumber: found.registrationNumber,
      token: makeToken(found.id),
    };

    setUser(authUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    return { success: true, status: found.status };
  };

  // ── OTP Token login (called after /verify-otp success) ──────────────
  const loginWithOtpToken = useCallback(
    (token: string, backendUser: VerifyOtpResponse['user']) => {
      const authUser = buildOtpUser(token, backendUser);
      setUser(authUser);
      // Don't save to SESSION_KEY — OTP token storage is handled by authService helpers
    },
    [],
  );

  // ── Logout ────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    clearDoctorToken();
  };

  // ── Mock Register ─────────────────────────────────────────────────────
  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    await new Promise(r => setTimeout(r, 600));
    const exists = mockUserStore.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) return { success: false, error: 'An account with this email already exists.' };

    const newUser: MockUser = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      role: 'doctor',
      status: 'pending',
      specialization: data.specialization,
      registrationNumber: data.registrationNumber,
    };
    mockUserStore.push(newUser);
    return { success: true };
  };

  // ── Admin approve/reject ──────────────────────────────────────────────
  const approveDoctorByEmail = (email: string) => {
    const idx = mockUserStore.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) {
      mockUserStore[idx].status = 'active';
      if (user && user.email.toLowerCase() === email.toLowerCase()) {
        const updated = { ...user, status: 'active' as const };
        setUser(updated);
        localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      }
    }
  };

  const rejectDoctorByEmail = (email: string) => {
    const idx = mockUserStore.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx !== -1) mockUserStore[idx].status = 'rejected';
  };

  const getPendingDoctors = () => {
    return mockUserStore.filter(u => u.role === 'doctor' && u.status === 'pending');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        register,
        approveDoctorByEmail,
        rejectDoctorByEmail,
        getPendingDoctors,
        loginWithOtpToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
