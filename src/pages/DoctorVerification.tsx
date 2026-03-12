import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { doctors, Doctor } from '@/data/mockData';
import { Search, Eye, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export default function DoctorVerification() {
  const { approveDoctorByEmail, rejectDoctorByEmail } = useAuth();
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
    setDoctorList(prev => prev.map(d => {
      if (d.id === id) {
        // Sync with auth store
        if (status === 'verified') approveDoctorByEmail(d.email);
        else rejectDoctorByEmail(d.email);
        return { ...d, status };
      }
      return d;
    }));
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
        {/* Pending Alert */}
        {doctorList.filter(d => d.status === 'pending').length > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-warning/8 border border-warning/20 px-4 py-2.5">
            <AlertCircle className="h-4 w-4 text-warning shrink-0" />
            <p className="text-xs text-warning font-medium">
              {doctorList.filter(d => d.status === 'pending').length} doctor{doctorList.filter(d => d.status === 'pending').length > 1 ? 's' : ''} pending review
            </p>
          </div>
        )}

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
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden xl:table-cell">Certificates</th>
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
                      className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${doc.status === 'pending' ? 'bg-warning/4' : ''}`}
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-card-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{doc.registrationNumber}</p>
                        <p className="text-xs text-muted-foreground">{doc.email}</p>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{doc.registrationNumber}</td>
                      <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{doc.specialization}</td>
                      <td className="py-3 px-4 hidden xl:table-cell">
                        <div className="flex gap-1.5">
                          <span className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                            <FileText className="h-3 w-3" />Medical Cert
                          </span>
                          <span className="text-muted-foreground">·</span>
                          <span className="flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                            <FileText className="h-3 w-3" />Govt ID
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={doc.status} /></td>
                      <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{doc.assignedVillages.length}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedDoctor(doc)}
                            className="rounded-md px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 inline mr-1" />
                            Review
                          </button>
                          {doc.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleVerify(doc.id, 'verified')}
                                className="rounded-md px-2 py-1 text-xs font-medium text-success hover:bg-success/10 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleVerify(doc.id, 'rejected')}
                                className="rounded-md px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedDoctor?.name}</DialogTitle>
              <DialogDescription>Review doctor registration details and documents</DialogDescription>
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
                    <p className="text-muted-foreground text-xs">Email</p>
                    <p className="font-medium text-foreground">{selectedDoctor.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Current Status</p>
                    <StatusBadge status={selectedDoctor.status} />
                  </div>
                </div>

                {/* Documents */}
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Uploaded Documents</p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:underline">
                      <FileText className="h-3.5 w-3.5" />
                      Medical Certificate (mock-certificate.pdf)
                    </div>
                    <div className="flex items-center gap-2 text-xs text-primary cursor-pointer hover:underline">
                      <FileText className="h-3.5 w-3.5" />
                      Government ID (mock-govt-id.pdf)
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-1">Registration Format Validation</p>
                  <p className="text-sm font-medium text-foreground">
                    {/^PMC-\d{4}-\d{4}$/.test(selectedDoctor.registrationNumber)
                      ? '✓ Valid Punjab Medical Council format'
                      : '⚠ Format may need manual review'}
                  </p>
                </div>

                {selectedDoctor.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleVerify(selectedDoctor.id, 'verified')} className="flex-1 bg-success hover:bg-success/90 text-success-foreground">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Approve Doctor
                    </Button>
                    <Button onClick={() => handleVerify(selectedDoctor.id, 'rejected')} variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-1.5" /> Reject
                    </Button>
                  </div>
                )}
                {selectedDoctor.status === 'verified' && (
                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleVerify(selectedDoctor.id, 'rejected')} variant="destructive" className="flex-1">
                      <XCircle className="h-4 w-4 mr-1.5" /> Revoke Approval
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
