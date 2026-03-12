import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { doctors, Doctor } from '@/data/mockData';
import { Search, Eye, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function DoctorVerification() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorList, setDoctorList] = useState(doctors);

  const filtered = doctorList.filter(d => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.registrationNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleVerify = (id: string, status: 'verified' | 'rejected') => {
    setDoctorList(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    setSelectedDoctor(null);
  };

  const statusTabs = [
    { key: 'all' as const, label: 'All', count: doctorList.length },
    { key: 'pending' as const, label: 'Pending', count: doctorList.filter(d => d.status === 'pending').length },
    { key: 'verified' as const, label: 'Verified', count: doctorList.filter(d => d.status === 'verified').length },
    { key: 'rejected' as const, label: 'Rejected', count: doctorList.filter(d => d.status === 'rejected').length },
  ];

  return (
    <DashboardLayout title="Doctor Verification" subtitle="Review and verify doctor registrations">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {statusTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === tab.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 flex-1 max-w-xs">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or reg. number..."
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
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Doctor Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">Reg. Number</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden lg:table-cell">Specialization</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Villages</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map(doc => (
                    <motion.tr
                      key={doc.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-card-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{doc.registrationNumber}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{doc.registrationNumber}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{doc.specialization}</td>
                      <td className="py-3 px-4"><StatusBadge status={doc.status} /></td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{doc.assignedVillages.length}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedDoctor(doc)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 inline mr-1" />
                          Review
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Doctor Detail Dialog */}
        <Dialog open={!!selectedDoctor} onOpenChange={() => setSelectedDoctor(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedDoctor?.name}</DialogTitle>
              <DialogDescription>Review doctor registration details</DialogDescription>
            </DialogHeader>
            {selectedDoctor && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Registration Number</p>
                    <p className="font-medium text-foreground">{selectedDoctor.registrationNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Medical Council</p>
                    <p className="font-medium text-foreground">{selectedDoctor.council}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Specialization</p>
                    <p className="font-medium text-foreground">{selectedDoctor.specialization}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Contact</p>
                    <p className="font-medium text-foreground">{selectedDoctor.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Current Status</p>
                    <StatusBadge status={selectedDoctor.status} />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Assigned Villages</p>
                    <p className="font-medium text-foreground">{selectedDoctor.assignedVillages.length}</p>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Registration Format Validation</p>
                  <p className="text-sm font-medium text-foreground">
                    {/^PMC-\d{4}-\d{4}$/.test(selectedDoctor.registrationNumber)
                      ? '✓ Valid Punjab Medical Council format'
                      : '✗ Invalid registration format'}
                  </p>
                </div>

                {selectedDoctor.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleVerify(selectedDoctor.id, 'verified')} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Approve
                    </Button>
                    <Button onClick={() => handleVerify(selectedDoctor.id, 'rejected')} variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
