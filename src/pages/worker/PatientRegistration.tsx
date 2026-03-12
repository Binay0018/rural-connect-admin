import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Phone, MapPin, Activity, AlertCircle, Save, Calendar, Thermometer, ShieldAlert, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { doctors, patients, Patient } from '@/data/mockData';

export default function PatientRegistrationForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male'|'Female'|'Other'>('Female');
  const [contact, setContact] = useState('');
  const [village, setVillage] = useState('Bhadson');
  
  // Clinical Info
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<'normal'|'severe'|'emergency'>('normal');
  const [doctorId, setDoctorId] = useState(doctors[0]?.id || '');
  
  // Vitals
  const [bp, setBp] = useState('');
  const [temp, setTemp] = useState('');
  const [spo2, setSpo2] = useState('');
  const [heartRate, setHeartRate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    
    const newPatient: Patient = {
      id: `p_${Date.now()}`,
      name,
      age: parseInt(age) || 0,
      gender,
      village,
      symptoms,
      severity,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      doctorId,
      contact,
      vitals: {
        bp: bp || '120/80',
        temp: parseFloat(temp) || 98.6,
        spo2: parseInt(spo2) || 98,
        heartRate: parseInt(heartRate) || 72,
        weight: 60, // Default weight for mock
      }
    };
    
    // In a real app we would POST this to backend. For demo, push to mock array (memory only)
    patients.unshift(newPatient);
    
    toast.success('Patient Registered', {
      description: `${name} has been added to Dr. ${doctors.find(d => d.id === doctorId)?.name}'s queue.`,
    });
    
    setIsSubmitting(false);
    navigate('/worker');
  };

  return (
    <DashboardLayout 
      title="Register New Patient" 
      subtitle="Enter patient details and capture live vitals for the doctor."
    >
      <div className="max-w-4xl max-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ── Patient Demographics ────────────────────────────────────────────────── */}
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Patient Information</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Full Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Navjot Kaur" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Age *</label>
                    <input required type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="Years" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Gender *</label>
                    <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Contact Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input value={contact} onChange={e => setContact(e.target.value)} className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="10-digit number" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Village</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input required value={village} onChange={e => setVillage(e.target.value)} className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring" placeholder="Village Name" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Capturing Vitals ────────────────────────────────────────────────────── */}
            <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.1}} className="rounded-2xl border border-border bg-card shadow-sm p-6 space-y-4">
               <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-info/10">
                      <Activity className="h-5 w-5 text-info" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Live Vitals</h3>
                  </div>
                  <Badge variant="outline" className="text-[10px] bg-muted uppercase font-semibold">Remote Device Connect</Badge>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 rounded-xl border border-border bg-background">
                   <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5"><Activity className="h-3 w-3 text-primary"/> Blood Pressure</label>
                   <input value={bp} onChange={e => setBp(e.target.value)} placeholder="120/80" className="w-full bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/50" />
                 </div>
                 
                 <div className="p-3 rounded-xl border border-border bg-background">
                   <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5"><Thermometer className="h-3 w-3 text-warning"/> Temperature (°F)</label>
                   <input type="number" step="0.1" value={temp} onChange={e => setTemp(e.target.value)} placeholder="98.6" className="w-full bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/50" />
                 </div>
                 
                 <div className="p-3 rounded-xl border border-border bg-background">
                   <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5"><ShieldAlert className="h-3 w-3 text-info"/> SpO2 (%)</label>
                   <input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} placeholder="98" className="w-full bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/50" />
                 </div>
                 
                 <div className="p-3 rounded-xl border border-border bg-background">
                   <label className="text-[10px] uppercase font-bold text-muted-foreground mb-1 flex items-center gap-1.5"><Heart className="h-3 w-3 text-destructive"/> Heart Rate (bpm)</label>
                   <input type="number" value={heartRate} onChange={e => setHeartRate(e.target.value)} placeholder="72" className="w-full bg-transparent text-lg font-bold text-foreground outline-none placeholder:text-muted-foreground/50" />
                 </div>
               </div>
            </motion.div>
          </div>

          {/* ── Clinical Notes & Doctor Routing ─────────────────────────────────────── */}
          <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} transition={{delay: 0.2}} className="rounded-2xl border border-border bg-card shadow-sm p-6">
             <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-warning/10">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Clinical Details & Routing</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Chief Complaint *</label>
                  <textarea 
                    required 
                    value={symptoms} 
                    onChange={e => setSymptoms(e.target.value)} 
                    rows={4} 
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none" 
                    placeholder="Describe the patient's symptoms..." 
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Condition Severity *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['normal', 'severe', 'emergency'] as const).map(sev => (
                        <button
                          key={sev}
                          type="button"
                          onClick={() => setSeverity(sev)}
                          className={`flex items-center justify-center py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-colors ${
                            severity === sev 
                              ? sev === 'emergency' ? 'bg-destructive/20 border-destructive text-destructive' 
                                : sev === 'severe' ? 'bg-warning/20 border-warning text-warning' 
                                : 'bg-success/20 border-success text-success'
                              : 'bg-muted/30 border-input text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {sev}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Assign to Tele-Doctor *</label>
                    <select 
                      required 
                      value={doctorId} 
                      onChange={e => setDoctorId(e.target.value)} 
                      className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                    >
                      {doctors.filter(d => d.status === 'verified').map(doc => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} - {doc.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
          </motion.div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/worker')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gradient-primary text-primary-foreground min-w-[200px]"
            >
              {isSubmitting ? 'Registering...' : <><Save className="h-4 w-4 mr-2" /> Complete Registration</>}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
