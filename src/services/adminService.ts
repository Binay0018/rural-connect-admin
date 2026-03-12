// =====================================================================
// SwastyaConnect — Admin API Service
// Calls the deployed backend at Render.
// =====================================================================

const BASE_URL = 'https://swastyaconnect-1.onrender.com';

// ── Types ─────────────────────────────────────────────────────────────

export interface PendingDoctor {
  id: string;           // MongoDB/DB unique _id
  doctorId: string;     // Human-readable Doctor ID (DOC101)
  name: string;
  phone: string;
  createdAt: string;
}

export interface PendingDoctorsResponse {
  count: number;
  pending: PendingDoctor[];
}

export interface ActionResponse {
  ok?: boolean;
  success?: boolean;
  message?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────

function getAdminEmail(): string | undefined {
  try {
    const sessionStr = localStorage.getItem('swastya_session');
    if (sessionStr) {
      const user = JSON.parse(sessionStr);
      // Ensure we only send an email if the user is actually logged in as admin
      if (user?.role === 'admin' && user?.email) {
        return user.email;
      }
    }
  } catch (e) {
    // ignore parse errors
  }
  return undefined;
}

function extractError(data: unknown, status: number): string {
  const d = data as Record<string, unknown>;
  return (
    (d?.error as string) ||
    (d?.message as string) ||
    (d?.detail as string) ||
    ((d?.errors as { msg: string }[])?.[0]?.msg) ||
    `Request failed — HTTP ${status}`
  );
}

async function apiGet<T>(path: string, token?: string): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const adminEmail = getAdminEmail();
  if (adminEmail) headers['x-admin-email'] = adminEmail;

  console.log(`[adminService] GET ${BASE_URL}${path}`);
  const response = await fetch(`${BASE_URL}${path}`, { method: 'GET', headers });
  const data = await response.json().catch(() => ({}));
  console.log(`[adminService] Response ${response.status}:`, data);

  if (!response.ok) throw new Error(extractError(data, response.status));
  return data as T;
}

async function apiPost<T>(path: string, body?: Record<string, unknown>, token?: string): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  const adminEmail = getAdminEmail();
  if (adminEmail) headers['x-admin-email'] = adminEmail;

  console.log(`[adminService] POST ${BASE_URL}${path}`, body ?? '(no body)');
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  console.log(`[adminService] Response ${response.status}:`, data);

  if (!response.ok) throw new Error(extractError(data, response.status));
  return data as T;
}

// ── Admin API Functions ───────────────────────────────────────────────

/**
 * Fetch all doctors pending admin approval.
 * GET /auth/doctors/pending
 */
export async function getPendingDoctors(): Promise<PendingDoctorsResponse> {
  return apiGet<PendingDoctorsResponse>('/auth/doctors/pending');
}

/**
 * Approve a doctor by their unique DB id → sets isActive = true.
 * POST /auth/doctors/approve/:id
 */
export async function approveDoctor(id: string): Promise<ActionResponse> {
  return apiPost<ActionResponse>(`/auth/doctors/approve/${id}`);
}

/**
 * Reject a doctor by their unique DB id.
 * POST /auth/doctors/reject/:id
 */
export async function rejectDoctor(id: string): Promise<ActionResponse> {
  return apiPost<ActionResponse>(`/auth/doctors/reject/${id}`);
}
