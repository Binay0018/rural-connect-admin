// Mock data for SwastyaConnect Dashboard

export interface Doctor {
  id: string;
  name: string;
  registrationNumber: string;
  council: string;
  specialization: string;
  status: 'pending' | 'verified' | 'rejected';
  lat: number;
  lng: number;
  assignedVillages: string[];
  phone: string;
  certificateUrl?: string;
}

export interface Village {
  id: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  assignedDoctorId: string | null;
  distanceToDoctor: number | null; // km
  coverageStatus: 'covered' | 'limited' | 'uncovered';
  nearestPharmacyId: string | null;
}

export interface Pharmacy {
  id: string;
  name: string;
  lat: number;
  lng: number;
  village: string;
  medicines: MedicineStock[];
}

export interface MedicineStock {
  name: string;
  available: boolean;
  quantity: number;
  lowStock: boolean;
}

export interface Notification {
  id: string;
  type: 'coverage' | 'emergency' | 'pharmacy';
  message: string;
  time: string;
  read: boolean;
}

// Nabha region center: ~30.37°N, 76.15°E
const NABHA_CENTER = { lat: 30.37, lng: 76.15 };

function offset(baseLat: number, baseLng: number, dLat: number, dLng: number) {
  return { lat: baseLat + dLat, lng: baseLng + dLng };
}

export const doctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Harpreet Singh', registrationNumber: 'PMC-2019-4521', council: 'Punjab Medical Council', specialization: 'General Medicine', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0, 0), assignedVillages: [], phone: '+91-98765-43210' },
  { id: 'd2', name: 'Dr. Amandeep Kaur', registrationNumber: 'PMC-2020-3312', council: 'Punjab Medical Council', specialization: 'Pediatrics', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0.05, 0.04), assignedVillages: [], phone: '+91-98765-43211' },
  { id: 'd3', name: 'Dr. Rajinder Sharma', registrationNumber: 'PMC-2018-7891', council: 'Punjab Medical Council', specialization: 'Orthopedics', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, -0.04, 0.06), assignedVillages: [], phone: '+91-98765-43212' },
  { id: 'd4', name: 'Dr. Simran Dhillon', registrationNumber: 'PMC-2021-1245', council: 'Punjab Medical Council', specialization: 'Gynecology', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0.08, -0.03), assignedVillages: [], phone: '+91-98765-43213' },
  { id: 'd5', name: 'Dr. Gurpreet Brar', registrationNumber: 'PMC-2017-6678', council: 'Punjab Medical Council', specialization: 'General Medicine', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, -0.06, -0.05), assignedVillages: [], phone: '+91-98765-43214' },
  { id: 'd6', name: 'Dr. Navjot Sandhu', registrationNumber: 'PMC-2022-9034', council: 'Punjab Medical Council', specialization: 'Dermatology', status: 'pending', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0.03, -0.07), assignedVillages: [], phone: '+91-98765-43215' },
  { id: 'd7', name: 'Dr. Prabhjot Mann', registrationNumber: 'PMC-2019-5567', council: 'Punjab Medical Council', specialization: 'ENT', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, -0.02, 0.09), assignedVillages: [], phone: '+91-98765-43216' },
  { id: 'd8', name: 'Dr. Kamaljit Gill', registrationNumber: 'PMC-2020-2234', council: 'Punjab Medical Council', specialization: 'Ophthalmology', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0.07, 0.07), assignedVillages: [], phone: '+91-98765-43217' },
  { id: 'd9', name: 'Dr. Balwinder Sidhu', registrationNumber: 'PMC-2016-8901', council: 'Punjab Medical Council', specialization: 'Cardiology', status: 'rejected', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, -0.08, 0.02), assignedVillages: [], phone: '+91-98765-43218' },
  { id: 'd10', name: 'Dr. Manpreet Atwal', registrationNumber: 'PMC-2021-3456', council: 'Punjab Medical Council', specialization: 'General Medicine', status: 'verified', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, 0.01, -0.09), assignedVillages: [], phone: '+91-98765-43219' },
  { id: 'd11', name: 'Dr. Jaspreet Hundal', registrationNumber: 'PMC-2023-1122', council: 'Punjab Medical Council', specialization: 'Psychiatry', status: 'pending', ...offset(NABHA_CENTER.lat, NABHA_CENTER.lng, -0.09, -0.04), assignedVillages: [], phone: '+91-98765-43220' },
];

// Generate 173 villages around Nabha
const villageNames = [
  'Bhadson', 'Amloh', 'Bhikhi', 'Dhuri', 'Moonak', 'Lehra', 'Sunam', 'Sangrur', 'Malerkotla',
  'Longowal', 'Dirba', 'Sherpur', 'Nandgarh', 'Kotra', 'Phul', 'Rampura', 'Talwandi Sabo',
  'Sardulgarh', 'Jakhal', 'Ratia', 'Kalanwali', 'Tohana', 'Fatehabad', 'Narwana', 'Uchana',
  'Assandh', 'Safidon', 'Julana', 'Hansi', 'Barwala', 'Hisar', 'Adampur', 'Uklana',
  'Khanauri', 'Lehragaga', 'Ahmedgarh', 'Jagraon', 'Raikot', 'Payal', 'Doraha', 'Khanna',
  'Samrala', 'Machhiwara', 'Sahnewal', 'Mullanpur', 'Kharar', 'Nayagaon', 'Zirakpur',
  'Rajpura', 'Patiala', 'Ghanaur', 'Sirhind', 'Bassi Pathana', 'Fatehgarh Sahib',
  'Mandi Gobindgarh', 'Khanna Kalan', 'Gobindgarh', 'Morinda', 'Chamkaur Sahib',
  'Nangal', 'Anandpur Sahib', 'Kiratpur Sahib', 'Ropar', 'Nurpur Bedi', 'Balachaur',
  'Garhshankar', 'Dasuya', 'Mukerian', 'Talwara', 'Hariana', 'Bhawanigarh', 'Bareta',
  'Barnala', 'Tapa', 'Dhanaula', 'Bhadaur', 'Mehal Kalan', 'Budhlada', 'Mansa',
  'Joga', 'Sardulgarh', 'Bhikhi Kalan', 'Maur', 'Bathinda', 'Raman', 'Talwandi',
  'Goniana', 'Sangat', 'Kot Kapura', 'Faridkot', 'Jaitu', 'Kotakpura', 'Zira',
  'Makhu', 'Dharamkot', 'Moga', 'Badhni Kalan', 'Nihal Singh Wala', 'Bagha Purana',
  'Muktsar', 'Malout', 'Gidderbaha', 'Lambi', 'Fazilka', 'Abohar', 'Jalalabad',
  'Arniwala', 'Balluana', 'Guru Har Sahai', 'Ferozepur', 'Ghall Khurd', 'Mamdot',
  'Hussainiwala', 'Ajnala', 'Baba Bakala', 'Ramdas', 'Lopoke', 'Rayya', 'Jandiala Guru',
  'Beas', 'Hajipur', 'Kartarpur', 'Phagwara', 'Nakodar', 'Shahkot', 'Lohian',
  'Mehatpur', 'Bhogpur', 'Jalandhar', 'Goraya', 'Phillaur', 'Nurmahal', 'Nawanshahr',
  'Rahon', 'Nawan Pind', 'Kapurthala', 'Sultanpur Lodhi', 'Dhilwan', 'Begowal',
  'Tarn Taran', 'Patti', 'Bhikhiwind', 'Khem Karan', 'Valtoha', 'Sur Singh',
  'Harike', 'Jhabal', 'Chogawan', 'Buttar', 'Randhawa', 'Bhullar', 'Cheema',
  'Gill', 'Grewal', 'Dhaliwal', 'Bajwa', 'Bhatti', 'Virk', 'Sohal',
  'Sandhu', 'Sidhu', 'Mann', 'Brar', 'Dhillon', 'Sekhon', 'Hundal',
  'Saini', 'Chahal', 'Kahlon', 'Aulakh', 'Randhawa Jattan', 'Bilga', 'Banga',
  'Mahilpur', 'Mukandpur', 'Chamkaur', 'Khamanon', 'Payal Kalan',
];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function generateVillages(): Village[] {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  return villageNames.slice(0, 173).map((name, i) => {
    const angle = seededRandom(i * 137) * Math.PI * 2;
    const radius = seededRandom(i * 237) * 0.12 + 0.01;
    const lat = NABHA_CENTER.lat + Math.cos(angle) * radius;
    const lng = NABHA_CENTER.lng + Math.sin(angle) * radius;

    // Find nearest doctor
    let nearestDoc: Doctor | null = null;
    let minDist = Infinity;
    for (const doc of doctors) {
      if (doc.status !== 'verified') continue;
      const d = getDistance(lat, lng, doc.lat, doc.lng);
      if (d < minDist) {
        minDist = d;
        nearestDoc = doc;
      }
    }

    const coverageStatus: Village['coverageStatus'] = minDist < 5 ? 'covered' : minDist < 10 ? 'limited' : 'uncovered';

    return {
      id: `v${i + 1}`,
      name,
      lat,
      lng,
      population: Math.floor(seededRandom(i * 337) * 4000 + 500),
      assignedDoctorId: coverageStatus !== 'uncovered' ? nearestDoc?.id ?? null : null,
      distanceToDoctor: nearestDoc ? Math.round(minDist * 10) / 10 : null,
      coverageStatus,
      nearestPharmacyId: null,
    };
  });
}

export const villages: Village[] = generateVillages();

// Assign villages to doctors
doctors.forEach(doc => {
  doc.assignedVillages = villages.filter(v => v.assignedDoctorId === doc.id).map(v => v.id);
});

const medicineNames = ['Paracetamol', 'Amoxicillin', 'Metformin', 'Amlodipine', 'Omeprazole', 'Ciprofloxacin', 'Ibuprofen', 'Cetirizine', 'ORS Packets', 'Insulin'];

export const pharmacies: Pharmacy[] = Array.from({ length: 15 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `${villages[i * 10]?.name || 'Nabha'} Pharmacy`,
  lat: NABHA_CENTER.lat + (Math.sin(i * 2.4) * 0.08),
  lng: NABHA_CENTER.lng + (Math.cos(i * 2.4) * 0.08),
  village: villages[i * 10]?.name || 'Nabha',
  medicines: medicineNames.map(name => ({
    name,
    quantity: Math.floor(Math.random() * 200),
    available: Math.random() > 0.15,
    lowStock: Math.random() > 0.6,
  })),
}));

// Link pharmacies to villages
villages.forEach(v => {
  let nearestPharm: Pharmacy | null = null;
  let minDist = Infinity;
  for (const p of pharmacies) {
    const d = getDistance(v.lat, v.lng, p.lat, p.lng);
    if (d < minDist) {
      minDist = d;
      nearestPharm = p;
    }
  }
  v.nearestPharmacyId = nearestPharm?.id ?? null;
});

export const notifications: Notification[] = [
  { id: 'n1', type: 'coverage', message: '12 villages in eastern Nabha have no doctor coverage', time: '2 hours ago', read: false },
  { id: 'n2', type: 'emergency', message: 'Emergency patient case reported from Bhadson village', time: '4 hours ago', read: false },
  { id: 'n3', type: 'pharmacy', message: 'Low stock alert: Insulin unavailable at 3 pharmacies', time: '6 hours ago', read: false },
  { id: 'n4', type: 'coverage', message: 'Dr. Navjot Sandhu verification pending for 5 days', time: '1 day ago', read: true },
  { id: 'n5', type: 'pharmacy', message: 'ORS Packets running low across 7 pharmacies', time: '1 day ago', read: true },
  { id: 'n6', type: 'emergency', message: 'Cardiac emergency in Amloh - nearest cardiologist 15km away', time: '2 days ago', read: true },
];

export const coverageStats = {
  totalVillages: 173,
  covered: villages.filter(v => v.coverageStatus === 'covered').length,
  limited: villages.filter(v => v.coverageStatus === 'limited').length,
  uncovered: villages.filter(v => v.coverageStatus === 'uncovered').length,
  totalDoctors: 11,
  verifiedDoctors: doctors.filter(d => d.status === 'verified').length,
  pharmaciesAvailable: pharmacies.length,
  lowStockPharmacies: pharmacies.filter(p => p.medicines.some(m => m.lowStock)).length,
};
