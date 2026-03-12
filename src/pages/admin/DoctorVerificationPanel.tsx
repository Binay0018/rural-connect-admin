import { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PendingDoctor } from '@/services/adminService';
import { useAuth } from '@/context/AuthContext';
import {
  UserCheck, RefreshCw, AlertCircle, CheckCircle, XCircle,
  Loader2, Clock, Phone, Calendar, Hash, FileText,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DocumentModal } from '@/components/admin/DocumentModal';
import { toast } from 'sonner';

type ActionState = { id: string; action: 'approving' | 'rejecting' } | null;

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function DoctorVerificationPanel() {
  const [pending, setPending] = useState<PendingDoctor[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionState, setActionState] = useState<ActionState>(null);
  const [actionError, setActionError] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [recentActions, setRecentActions] = useState<{ msg: string; ok: boolean }[]>([]);

  // Document Viewer State
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docType, setDocType] = useState<'medical-cert' | 'govt-id' | null>(null);
  const [docDoctorName, setDocDoctorName] = useState('');

  const openDocument = (type: 'medical-cert' | 'govt-id', doctorName: string) => {
    setDocType(type);
    setDocDoctorName(doctorName);
    setDocModalOpen(true);
  };

  const { getPendingDoctors, approveDoctorByEmail, rejectDoctorByEmail } = useAuth();

  const fetchPending = useCallback(async () => {
    setIsLoading(true);
    setFetchError('');
    setActionError('');
    try {
      // Simulate network delay
      await new Promise(r => setTimeout(r, 400));
      const mockPending = getPendingDoctors();
      
      // Map MockUser to PendingDoctor shape expected by UI
      const mapped: PendingDoctor[] = mockPending.map(u => ({
        id: u.id,
        doctorId: u.doctorId || 'Pending...',
        name: u.name,
        phone: u.email, // using email as phone/contact identifier in this view
        createdAt: new Date().toISOString(), // mock data doesn't have dates
      }));

      setPending(mapped);
      setCount(mapped.length);
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load pending doctors.';
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [getPendingDoctors]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleApprove = async (doc: PendingDoctor) => {
    setActionState({ id: doc.id, action: 'approving' });
    setActionError('');
    try {
      await new Promise(r => setTimeout(r, 500));
      approveDoctorByEmail(doc.phone); // email is stored in phone field in mapping
      setPending(prev => prev.filter(d => d.id !== doc.id));
      setCount(c => Math.max(0, c - 1));
      toast.success('Doctor Approved Successfully', { description: `${doc.name} (${doc.doctorId}) is now verified.` });
      setRecentActions(prev => [
        { msg: `✓ Approved: ${doc.name} (${doc.doctorId})`, ok: true },
        ...prev.slice(0, 4),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve doctor.';
      toast.error('Approval Failed', { description: msg });
      setActionError(`Approve failed for ${doc.name}: ${msg}`);
    } finally {
      setActionState(null);
    }
  };

  const handleReject = async (doc: PendingDoctor) => {
    setActionState({ id: doc.id, action: 'rejecting' });
    setActionError('');
    try {
      await new Promise(r => setTimeout(r, 500));
      rejectDoctorByEmail(doc.phone);
      setPending(prev => prev.filter(d => d.id !== doc.id));
      setCount(c => Math.max(0, c - 1));
      toast.info('Doctor Rejected', { description: `${doc.name} has been rejected from the platform.` });
      setRecentActions(prev => [
        { msg: `✗ Rejected: ${doc.name} (${doc.doctorId})`, ok: false },
        ...prev.slice(0, 4),
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject doctor.';
      toast.error('Rejection Failed', { description: msg });
      setActionError(`Reject failed for ${doc.name}: ${msg}`);
    } finally {
      setActionState(null);
    }
  };

  return (
    <DashboardLayout
      title="Doctor Verification Panel"
      subtitle="Approve or reject doctors awaiting verification"
    >
      <div className="space-y-5">

        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 border border-warning/20">
              <UserCheck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Pending Doctor Approvals:{' '}
                <span className="text-warning font-bold">{isLoading ? '…' : count}</span>
              </p>
              {lastRefreshed && (
                <p className="text-[10px] text-muted-foreground">
                  Last refreshed: {lastRefreshed.toLocaleTimeString('en-IN')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={fetchPending}
            disabled={isLoading}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* ── Fetch error ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {fetchError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">Failed to load pending doctors.</p>
                <p className="text-xs text-muted-foreground mt-0.5">{fetchError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Action error ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {actionError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2.5 rounded-lg bg-destructive/8 border border-destructive/20 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{actionError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Table ────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="h-7 w-7 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Loading pending doctors…</p>
            </div>
          ) : pending.length === 0 && !fetchError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 border-2 border-success">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <p className="text-sm font-semibold text-foreground mt-2">All caught up!</p>
              <p className="text-xs text-muted-foreground">No doctors are pending verification.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-1"><Hash className="h-3 w-3" />Doctor ID</span>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">
                      <span className="flex items-center gap-1"><Phone className="h-3 w-3" />Phone</span>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden lg:table-cell">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Registered</span>
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {pending.map((doc, i) => {
                      const isActing = actionState?.id === doc.id;
                      const isApproving = isActing && actionState?.action === 'approving';
                      const isRejecting = isActing && actionState?.action === 'rejecting';

                      return (
                        <motion.tr
                          key={doc.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: i * 0.04 }}
                          className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                        >
                          {/* Doctor ID */}
                          <td className="py-3 px-4">
                            <code className="text-xs bg-muted rounded-md px-2 py-1 text-foreground font-mono font-semibold">
                              {doc.doctorId}
                            </code>
                          </td>

                          {/* Name */}
                          <td className="py-3 px-4">
                            <p className="font-medium text-card-foreground">{doc.name}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{doc.phone}</p>
                          </td>

                          {/* Phone */}
                          <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell text-xs">
                            {doc.phone}
                          </td>

                          {/* Registered */}
                          <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs whitespace-nowrap">
                            {formatDate(doc.createdAt)}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/20 px-2.5 py-1 text-[11px] font-semibold text-warning whitespace-nowrap">
                              <Clock className="h-3 w-3" />
                              Pending Verification
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve */}
                              <button
                                onClick={() => handleApprove(doc)}
                                disabled={!!actionState}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-success bg-success/10 hover:bg-success/20 border border-success/20 hover:border-success/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isApproving ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3.5 w-3.5" />
                                )}
                                <span className="hidden sm:inline">
                                  {isApproving ? 'Approving…' : 'Approve Doctor'}
                                </span>
                              </button>

                              {/* Reject */}
                              <button
                                onClick={() => handleReject(doc)}
                                disabled={!!actionState}
                                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                              >
                                {isRejecting ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5" />
                                )}
                                <span className="hidden sm:inline">
                                  {isRejecting ? 'Rejecting…' : 'Reject Doctor'}
                                </span>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Action Log ───────────────────────────────────────────────── */}
        <AnimatePresence>
          {recentActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Recent Actions (this session)
              </p>
              <ul className="space-y-1.5">
                {recentActions.map((a, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`text-xs font-medium ${a.ok ? 'text-success' : 'text-destructive'}`}
                  >
                    {a.msg}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      
      <DocumentModal 
        isOpen={docModalOpen} 
        onClose={() => setDocModalOpen(false)} 
        documentType={docType} 
        doctorName={docDoctorName} 
      />
    </DashboardLayout>
  );
}
