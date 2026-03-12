import { useState } from 'react';
import { DoctorLayout } from '@/components/doctor/DoctorLayout';
import { useAuth } from '@/context/AuthContext';
import { patients } from '@/data/mockData';
import { Send, CheckCircle, ClipboardList, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
  sentAt: string;
}

const frequencies = ['Once a day', 'Twice a day', 'Three times a day', 'Every 6 hours', 'Every 8 hours', 'As needed'];
const durations = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month'];

export default function PrescriptionPanel() {
  const { user } = useAuth();
  const myPatients = patients.filter(p => p.doctorId === user?.doctorId);

  const [form, setForm] = useState({
    patientId: '',
    medicine: '',
    dosage: '',
    frequency: '',
    duration: '',
    notes: '',
  });
  const [sent, setSent] = useState(false);
  const [history, setHistory] = useState<Prescription[]>([
    {
      id: 'rx1',
      patientName: 'Gurjeet Kaur',
      patientId: 'p1',
      medicine: 'Chloroquine',
      dosage: '250mg',
      frequency: 'Twice a day',
      duration: '5 days',
      notes: 'Take after meals. Monitor for fever.',
      sentAt: 'Today, 8:45 AM',
    },
  ]);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setSent(false);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = myPatients.find(p => p.id === form.patientId);
    if (!patient) return;

    const newRx: Prescription = {
      id: `rx${Date.now()}`,
      patientName: patient.name,
      patientId: form.patientId,
      medicine: form.medicine,
      dosage: form.dosage,
      frequency: form.frequency,
      duration: form.duration,
      notes: form.notes,
      sentAt: 'Just now',
    };
    setHistory(prev => [newRx, ...prev]);
    setForm({ patientId: '', medicine: '', dosage: '', frequency: '', duration: '', notes: '' });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const deleteRx = (id: string) => setHistory(prev => prev.filter(r => r.id !== id));

  return (
    <DoctorLayout title="Prescription Panel" subtitle="Send and manage patient prescriptions">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card shadow-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">New Prescription</h2>

            {/* Success Banner */}
            <AnimatePresence>
              {sent && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 flex items-center gap-2 rounded-lg bg-success/10 border border-success/20 px-3 py-2.5"
                >
                  <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  <p className="text-xs text-success font-medium">Prescription sent successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSend} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Select Patient *</label>
                <select value={form.patientId} onChange={update('patientId')} required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Choose patient...</option>
                  {myPatients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.village}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Medicine Name *</label>
                <input value={form.medicine} onChange={update('medicine')} placeholder="e.g. Paracetamol" required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Dosage *</label>
                <input value={form.dosage} onChange={update('dosage')} placeholder="e.g. 500mg" required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Frequency *</label>
                <select value={form.frequency} onChange={update('frequency')} required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select frequency</option>
                  {frequencies.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Duration *</label>
                <select value={form.duration} onChange={update('duration')} required
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select duration</option>
                  {durations.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1.5 block">Notes</label>
                <textarea value={form.notes} onChange={update('notes')} placeholder="Special instructions, warnings..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-elevated hover:opacity-90">
                <Send className="h-4 w-4 mr-2" />
                Send Prescription
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Prescription History</h2>
              <span className="ml-auto text-xs text-muted-foreground">{history.length} records</span>
            </div>
            <div className="space-y-3">
              <AnimatePresence>
                {history.length === 0 ? (
                  <div className="rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                    No prescriptions sent yet
                  </div>
                ) : (
                  history.map((rx) => (
                    <motion.div
                      key={rx.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="rounded-lg border border-border bg-card shadow-card p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{rx.medicine} <span className="font-normal text-muted-foreground">— {rx.dosage}</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5">For: {rx.patientName}</p>
                        </div>
                        <button onClick={() => deleteRx(rx.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">{rx.frequency}</span>
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] text-muted-foreground">{rx.duration}</span>
                      </div>
                      {rx.notes && <p className="text-xs text-muted-foreground italic">{rx.notes}</p>}
                      <p className="text-[10px] text-muted-foreground mt-2">{rx.sentAt}</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </DoctorLayout>
  );
}
