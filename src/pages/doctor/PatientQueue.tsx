import { useState } from 'react';
import { DoctorLayout } from '@/components/doctor/DoctorLayout';
import { useAuth } from '@/context/AuthContext';
import { patients, Patient } from '@/data/mockData';
import { Search, Eye, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SeverityFilter = 'all' | 'normal' | 'severe' | 'emergency';

const severityConfig = {
  normal: { label: 'Normal', className: 'bg-success/10 text-success border border-success/20' },
  severe: { label: 'Severe', className: 'bg-warning/10 text-warning border border-warning/20' },
  emergency: { label: 'Emergency', className: 'bg-destructive/10 text-destructive border border-destructive/20' },
};

export default function PatientQueue() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const myPatients = patients.filter(p => p.doctorId === user?.doctorId);
  const filtered = myPatients.filter(p => {
    if (severityFilter !== 'all' && p.severity !== severityFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.village.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: myPatients.length,
    emergency: myPatients.filter(p => p.severity === 'emergency').length,
    severe: myPatients.filter(p => p.severity === 'severe').length,
    normal: myPatients.filter(p => p.severity === 'normal').length,
  };

  return (
    <DoctorLayout title="Patient Queue" subtitle="Manage today's patient consultations">
      <div className="space-y-4">
        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Severity Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(['all', 'emergency', 'severe', 'normal'] as SeverityFilter[]).map(key => (
              <button
                key={key}
                onClick={() => setSeverityFilter(key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors capitalize ${
                  severityFilter === key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {key === 'all' ? 'All' : key} ({counts[key]})
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 flex-1 max-w-xs">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patient or village..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">Symptoms</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Severity</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Village</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Time</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">View Case</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        <Filter className="h-8 w-8 mx-auto mb-2 opacity-30" />
                        No patients match your filters
                      </td>
                    </tr>
                  ) : (
                    filtered.map((patient, i) => (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-card-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">Age {patient.age}</p>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden md:table-cell max-w-[200px]">
                          <p className="truncate">{patient.symptoms}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${severityConfig[patient.severity].className}`}>
                            {severityConfig[patient.severity].label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell text-xs">{patient.village}</td>
                        <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs">{patient.time}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedPatient(patient)}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1" />
                            View Case
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Case Detail Modal */}
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
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedPatient.village} · Age {selectedPatient.age} · {selectedPatient.time}
                  </p>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Severity</p>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${severityConfig[selectedPatient.severity].className}`}>
                    {severityConfig[selectedPatient.severity].label}
                  </span>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Symptoms</p>
                  <p className="text-sm text-foreground leading-relaxed">{selectedPatient.symptoms}</p>
                </div>
                {selectedPatient.notes && (
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1.5">Clinical Notes</p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedPatient.notes}</p>
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
