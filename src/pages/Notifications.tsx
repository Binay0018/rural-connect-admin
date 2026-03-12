import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { notifications as initialNotifications } from '@/data/mockData';
import { AlertTriangle, MapPin, Package, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const typeIcons = {
  emergency: AlertTriangle,
  coverage: MapPin,
  pharmacy: Package,
};

const typeStyles = {
  emergency: 'text-destructive bg-destructive/10',
  coverage: 'text-info bg-info/10',
  pharmacy: 'text-warning bg-warning/10',
};

export default function Notifications() {
  const [items, setItems] = useState(initialNotifications);

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const unreadCount = items.filter(n => !n.read).length;

  return (
    <DashboardLayout title="Notifications" subtitle={`${unreadCount} unread alerts`}>
      <div className="max-w-2xl space-y-4">
        <div className="flex justify-end">
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </button>
        </div>

        <div className="space-y-2">
          {items.map((n, i) => {
            const Icon = typeIcons[n.type];
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-lg border p-4 flex items-start gap-3 transition-colors ${
                  n.read ? 'border-border bg-card' : 'border-primary/20 bg-primary/5'
                }`}
              >
                <div className={`rounded-lg p-2 shrink-0 ${typeStyles[n.type]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-card-foreground">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full gradient-primary shrink-0 mt-1.5" />}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
