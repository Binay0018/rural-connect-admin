export interface Doctor {
  id: string;
  name: string;
  color: string;
}

export interface Village {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  assignedDoctorId: string;
  visitDay: string; // "Monday" | "Tuesday" ...
  shift: string; // "Morning" | "Afternoon"
  serviceHistory: string[];
}

export interface Schedule {
  id: string;
  doctorId: string;
  day: string;
  shift: string;
  villageId: string;
}

const NABHA_CENTER = { lat: 30.3752, lng: 76.1481 };

// List of some real/mock Nabha villages for flavor
const VILLAGE_NAMES = [
  "Bhojomajri", "Rohti Chhanna", "Binaheri", "Kakrala", "Thuhi", "Bhadson",
  "Dandrala Dhindsa", "Agoul", "Alhoran", "Bauran Kalan", "Bauran Khurd", "Dhingi",
  "Galliti", "Lohar Majra", "Sakrauli", "Sudal"
];

const DOCTOR_NAMES = [
  "Dr. Amit Sharma", "Dr. Priya Kaur", "Dr. Rajinder Singh", "Dr. Manpreet Kaur",
  "Dr. Vikram Singh", "Dr. Harjit Singh", "Dr. Anu Verma", "Dr. Kamaljit",
  "Dr. Sandeep", "Dr. Simran", "Dr. Gurpreet"
];

const COLORS = [
  "#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#6366f1",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316", "#06b6d4", "#eab308"
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const SHIFTS = ["Morning", "Afternoon"];

export const doctors: Doctor[] = DOCTOR_NAMES.map((name, i) => ({
  id: `doc-${i + 1}`,
  name,
  color: COLORS[i]
}));

// Generate 173 villages
export const initialVillages: Village[] = Array.from({ length: 173 }).map((_, i) => {
  const baseName = VILLAGE_NAMES[i % VILLAGE_NAMES.length];
  const suffix = i >= VILLAGE_NAMES.length ? ` ${Math.floor(i / VILLAGE_NAMES.length) + 1}` : "";
  const doctor = doctors[i % doctors.length];
  
  // Random position around Nabha (roughly 15km radius)
  const latOffset = (Math.random() - 0.5) * 0.25;
  const lngOffset = (Math.random() - 0.5) * 0.25;
  
  const day = DAYS[Math.floor(Math.random() * DAYS.length)];
  const shift = SHIFTS[Math.floor(Math.random() * SHIFTS.length)];
  
  return {
    id: `vil-${i + 1}`,
    name: `${baseName}${suffix}`,
    lat: NABHA_CENTER.lat + latOffset,
    lng: NABHA_CENTER.lng + lngOffset,
    population: Math.floor(Math.random() * 4000) + 500, // 500 to 4500
    assignedDoctorId: doctor.id,
    visitDay: day,
    shift: shift,
    serviceHistory: [
      `Last visit completed on ${new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()}`,
      `Medicines restocked on ${new Date(Date.now() - Math.random() * 15000000000).toLocaleDateString()}`
    ]
  };
});
