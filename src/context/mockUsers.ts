// Mock user store for SwastyaConnect auth simulation

export type UserRole = 'admin' | 'doctor';

export interface MockUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: 'active' | 'pending' | 'rejected';
  doctorId?: string; // links to mockData doctor
  specialization?: string;
  registrationNumber?: string;
}

// Singleton store so mutations (register, approve) persist in-memory during session
export const mockUserStore: MockUser[] = [
  // Admin
  {
    id: 'u0',
    name: 'Admin',
    email: 'admin@swastyaconnect.in',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  },
  // Verified doctors
  {
    id: 'u1',
    name: 'Dr. Harpreet Singh',
    email: 'harpreet@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'active',
    doctorId: 'd1',
    specialization: 'General Medicine',
    registrationNumber: 'PMC-2019-4521',
  },
  {
    id: 'u2',
    name: 'Dr. Amandeep Kaur',
    email: 'amandeep@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'active',
    doctorId: 'd2',
    specialization: 'Pediatrics',
    registrationNumber: 'PMC-2020-3312',
  },
  {
    id: 'u3',
    name: 'Dr. Rajinder Sharma',
    email: 'rajinder@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'active',
    doctorId: 'd3',
    specialization: 'Orthopedics',
    registrationNumber: 'PMC-2018-7891',
  },
  {
    id: 'u4',
    name: 'Dr. Simran Dhillon',
    email: 'simran@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'active',
    doctorId: 'd4',
    specialization: 'Gynecology',
    registrationNumber: 'PMC-2021-1245',
  },
  // Pending doctor
  {
    id: 'u6',
    name: 'Dr. Navjot Sandhu',
    email: 'navjot@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'pending',
    doctorId: 'd6',
    specialization: 'Dermatology',
    registrationNumber: 'PMC-2022-9034',
  },
  // Rejected doctor
  {
    id: 'u9',
    name: 'Dr. Balwinder Sidhu',
    email: 'balwinder@swastyaconnect.in',
    password: 'doctor123',
    role: 'doctor',
    status: 'rejected',
    doctorId: 'd9',
    specialization: 'Cardiology',
    registrationNumber: 'PMC-2016-8901',
  },
];
