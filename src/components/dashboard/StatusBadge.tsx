import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'verified' | 'pending' | 'rejected' | 'covered' | 'limited' | 'uncovered';

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  verified: { label: 'Verified', className: 'bg-success/15 text-success border-success/20 hover:bg-success/20' },
  pending: { label: 'Pending', className: 'bg-warning/15 text-warning border-warning/20 hover:bg-warning/20' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20' },
  covered: { label: 'Covered', className: 'bg-success/15 text-success border-success/20 hover:bg-success/20' },
  limited: { label: 'Limited', className: 'bg-warning/15 text-warning border-warning/20 hover:bg-warning/20' },
  uncovered: { label: 'No Coverage', className: 'bg-destructive/15 text-destructive border-destructive/20 hover:bg-destructive/20' },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('text-[10px] font-semibold', config.className)}>
      {config.label}
    </Badge>
  );
}
