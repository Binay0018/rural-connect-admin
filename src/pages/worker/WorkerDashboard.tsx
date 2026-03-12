import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { 
  Users, Activity, Thermometer, UserPlus, Phone, Calendar, Stethoscope, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { patients as initialPatients, Patient } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function WorkerDashboard() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app we would fetch the patients specifically registered by this worker.
    // For the mock, we'll just show the last 8 patients registered globally today.
    setPatients(initialPatients.slice(0, 8));
  }, []);

  const severeCount = patients.filter(p => p.severity === 'severe' || p.severity === 'emergency').length;

  return (
    <DashboardLayout 
      title="Health Worker Dashboard" 
      subtitle="Overview of your registered patients and daily activities."
    >
      <div className="space-y-6">
        {/* Top Action & Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground">{patients.length}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Registered Today</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-xl bg-destructive/10">
                  <Activity className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-foreground">{severeCount}</h3>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Critical Cases</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-1 flex items-stretch">
            <button 
              onClick={() => navigate('/worker/register')}
              className="flex-1 rounded-2xl p-6 gradient-primary shadow-elevated hover:opacity-90 transition-opacity flex flex-col items-center justify-center gap-3 text-white focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <div className="p-3 bg-white/20 rounded-full">
                <UserPlus size={28} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-lg leading-tight">Register<br/>New Patient</h3>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Registrations List */}
        <div>
          <div className="flex items-center justify-between mb-4 mt-2">
            <h2 className="text-lg font-bold text-foreground">Recent Registrations</h2>
            <Button variant="outline" size="sm" className="text-xs h-8">View All</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {patients.map((patient, i) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden shadow-sm flex flex-col"
                >
                  <div className="p-4 border-b border-border flex items-start justify-between bg-muted/20">
                    <div>
                      <h4 className="font-bold text-foreground leading-tight">{patient.name}</h4>
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-1">
                        {patient.age}y • {patient.gender} • {patient.village}
                      </p>
                    </div>
                    <Badge variant={patient.severity === 'emergency' ? 'destructive' : patient.severity === 'severe' ? 'secondary' : 'default'} className="uppercase px-2 text-[9px] shadow-sm">
                      {patient.severity}
                    </Badge>
                  </div>
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      <Stethoscope className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-sm font-medium text-card-foreground leading-snug">{patient.symptoms}</p>
                    </div>
                    
                    {patient.vitals && (
                      <div className="bg-muted/40 rounded-lg p-3 grid grid-cols-2 gap-3 mt-auto border border-border/50">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-semibold">Blood Pressure</p>
                            <p className="text-xs font-bold text-foreground">{patient.vitals.bp}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-4 w-4 text-warning" />
                          <div>
                            <p className="text-[9px] text-muted-foreground uppercase font-semibold">Body Temp</p>
                            <p className="text-xs font-bold text-foreground">{patient.vitals.temp}°F</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {patient.time}</span>
                    <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {patient.contact?.split('-').slice(1).join('-') || 'N/A'}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
