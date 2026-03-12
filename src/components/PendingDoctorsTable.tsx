import { PendingDoctor } from '@/services/adminService';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingDoctorsTableProps {
  doctors: PendingDoctor[];
  isLoading: boolean;
  error: string;
  onApprove: (id: string, name: string) => void;
  onReject: (id: string, name: string) => void;
}

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

export function PendingDoctorsTable({
  doctors,
  isLoading,
  error,
  onApprove,
  onReject,
}: PendingDoctorsTableProps) {
  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-card">
        <div className="flex flex-col items-center justify-center py-14 gap-3">
          <Loader2 className="h-7 w-7 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Loading pending doctors…</p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 shadow-card">
        <div className="flex flex-col items-center justify-center py-14 gap-2">
          <span className="text-3xl">⚠️</span>
          <p className="text-sm font-medium text-destructive">Failed to load pending doctors.</p>
          <p className="text-xs text-muted-foreground max-w-xs text-center">{error}</p>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────
  if (doctors.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card shadow-card">
        <div className="flex flex-col items-center justify-center py-14 gap-2">
          <span className="text-3xl">✅</span>
          <p className="text-sm font-medium text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground">No doctors are pending verification right now.</p>
        </div>
      </div>
    );
  }

  // ── Table ──────────────────────────────────────────────────────────
  return (
    <div className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground whitespace-nowrap">Doctor ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Phone</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground hidden lg:table-cell whitespace-nowrap">Registered At</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {doctors.map((doc, i) => (
                <motion.tr
                  key={doc.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors bg-warning/3"
                >
                  <td className="py-3 px-4">
                    <code className="text-xs bg-muted rounded px-1.5 py-0.5 text-foreground font-mono">
                      {doc.doctorId}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-card-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground sm:hidden">{doc.phone}</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell whitespace-nowrap">
                    {doc.phone}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell text-xs whitespace-nowrap">
                    {formatDate(doc.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 border border-warning/20 px-2.5 py-1 text-[11px] font-semibold text-warning whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" />
                      Pending Verification
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onApprove(doc.id, doc.name)}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-success hover:bg-success/10 transition-colors border border-success/20 hover:border-success/40"
                        title={`Approve ${doc.name}`}
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                      <button
                        onClick={() => onReject(doc.id, doc.name)}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors border border-destructive/20 hover:border-destructive/40"
                        title={`Reject ${doc.name}`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
