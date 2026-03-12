import { useState } from 'react';
import { DoctorLayout } from '@/components/doctor/DoctorLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useAuth } from '@/context/AuthContext';
import { doctors, patients, villages, Patient } from '@/data/mockData';
import { Users, MapPin, AlertTriangle, Activity, Eye, X, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const severityConfig = {
  normal: { label: 'Normal', className: 'bg-success/10 text-success border border-success/20' },
  severe: { label: 'Severe', className: 'bg-warning/10 text-warning border border-warning/20' },
  emergency: { label: 'Emergency', className: 'bg-destructive/10 text-destructive border border-destructive/20' },
};

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const navigate = useNavigate();

  // Find doctor data
  const doctor = doctors.find(d => d.id === user?.doctorId);
  const myPatients = patients.filter(p => p.doctorId === user?.doctorId);
  const assignedVillages = doctor?.assignedVillages?.length ?? 0;
  const emergencyCount = myPatients.filter(p => p.severity === 'emergency').length;
  const severeCount = myPatients.filter(p => p.severity === 'severe').length;

  return (
    <DoctorLayout title="Doctor Dashboard" subtitle={`Welcome back, ${user?.name}`}>
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Assigned Villages" value={assignedVillages} icon={MapPin} variant="info" />
          <StatsCard title="Active Patients" value={myPatients.length} icon={Users} variant="success" />
          <StatsCard title="Severe Cases" value={severeCount} icon={AlertTriangle} variant="warning" />
          <StatsCard title="Emergencies" value={emergencyCount} icon={Activity} variant="danger" />
        </div>

        {/* Emergency Alert Banner */}
        {emergencyCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-destructive/30 bg-destructive/8 px-4 py-3 flex items-center gap-3"
          >
            <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <p className="text-sm font-medium text-destructive">
              {emergencyCount} emergency case{emergencyCount > 1 ? 's' : ''} require{emergencyCount === 1 ? 's' : ''} immediate attention
            </p>
          </motion.div>
        )}

        {/* Patient Queue Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Today's Patient Queue</h2>
            <span className="text-xs text-muted-foreground">{myPatients.length} patients</span>
          </div>
          <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Patient</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">Symptoms</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Severity</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Time</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myPatients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-sm text-muted-foreground">No patients in queue today</td>
                    </tr>
                  ) : (
                    myPatients.map((patient, i) => (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-card-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">{patient.village} · Age {patient.age}</p>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell max-w-[200px]">
                          <p className="truncate">{patient.symptoms}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityConfig[patient.severity].className}`}>
                            {severityConfig[patient.severity].label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs hidden sm:table-cell">{patient.time}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedPatient(patient)}
                              className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5 inline mr-1" />
                              View
                            </button>
                            <button
                              onClick={() => navigate(`/doctor/consultation/${patient.id}`)}
                              className="rounded-md px-3 py-1 text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
                            >
                              <Video className="h-3.5 w-3.5 inline mr-1" />
                              Consult
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Patient Case Modal */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedPatient.village} · Age {selectedPatient.age}</p>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Severity</p>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityConfig[selectedPatient.severity].className}`}>
                      {severityConfig[selectedPatient.severity].label}
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground mb-1">Time</p>
                    <p className="text-sm font-medium text-foreground">{selectedPatient.time}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-[10px] text-muted-foreground mb-1">Symptoms</p>
                  <p className="text-sm text-foreground">{selectedPatient.symptoms}</p>
                </div>
                {selectedPatient.notes && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                    <p className="text-[10px] text-primary font-semibold mb-1">Doctor Notes</p>
                    <p className="text-sm text-foreground">{selectedPatient.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DoctorLayout>
  );
}
