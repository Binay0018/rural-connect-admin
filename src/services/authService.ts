// =====================================================================
// SwastyaConnect — Auth API Service
// Integrates real backend OTP endpoints for doctor authentication.
// Change BASE_URL to match your backend server.
// =====================================================================

// BASE_URL uses Vite's dev proxy (/api → proxied to backend in vite.config.ts)
// To change the backend address, update the proxy.target in vite.config.ts
const BASE_URL = 'https://swastyaconnect-1.onrender.com';

// ── Types ─────────────────────────────────────────────────────────────

export interface SendOtpRequest {
  doctorId: string;
  name: string;
  phone: string;
}

export interface SendOtpResponse {
  ok: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  phone: string;
  code: string;
}

export interface VerifyOtpResponse {
  ok: boolean;
  message: string;
  token: string;
  tokenType: string;
  expiresIn: string;
  user: {
    id?: string;
    name?: string;
    phone?: string;
    doctorId?: string;
    approved?: boolean;
    role?: string;
    [key: string]: unknown;
  };
}

export interface ApiError {
  error: string;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────

async function apiPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const url = `${BASE_URL}${path}`;
  console.log(`[authService] POST ${url}`, body);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  // Log raw response to help debug API issues — check browser DevTools Console
  console.log(`[authService] Response ${response.status}:`, data);

  if (!response.ok) {
    // Try every common error field shape from various backends
    const d = data as Record<string, unknown>;
    const msg =
      (d.error as string) ||
      (d.message as string) ||
      (d.detail as string) ||
      (d.msg as string) ||
      // express-validator style: { errors: [{ msg: '...' }] }
      ((d.errors as { msg: string }[])?.[0]?.msg) ||
      `Request failed — HTTP ${response.status}`;
    throw new Error(msg);
  }

  return data as T;
}

// ── Auth API functions ─────────────────────────────────────────────────

/**
 * Sends an OTP to the doctor's phone number via the backend.
 * POST /auth/doctor/send-otp
 */
export async function sendDoctorOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
  return apiPost<SendOtpResponse>('/auth/doctor/send-otp', {
    doctorId: payload.doctorId,
    name: payload.name,
    phone: payload.phone,
  });
}

/**
 * Verifies the OTP code and returns a JWT token.
 * POST /auth/doctor/verify-otp
 */
export async function verifyDoctorOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  return apiPost<VerifyOtpResponse>('/auth/doctor/verify-otp', {
    phone: payload.phone,
    code: payload.code,
  });
}

// ── Token storage helpers ──────────────────────────────────────────────

export const DOCTOR_TOKEN_KEY = 'doctorToken';
export const DOCTOR_USER_KEY = 'doctorUser';

export function saveDoctorToken(token: string, user: VerifyOtpResponse['user']): void {
  localStorage.setItem(DOCTOR_TOKEN_KEY, token);
  localStorage.setItem(DOCTOR_USER_KEY, JSON.stringify(user));
}

export function getDoctorToken(): string | null {
  return localStorage.getItem(DOCTOR_TOKEN_KEY);
}

export function getDoctorUser(): VerifyOtpResponse['user'] | null {
  try {
    const raw = localStorage.getItem(DOCTOR_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDoctorToken(): void {
  localStorage.removeItem(DOCTOR_TOKEN_KEY);
  localStorage.removeItem(DOCTOR_USER_KEY);
}
