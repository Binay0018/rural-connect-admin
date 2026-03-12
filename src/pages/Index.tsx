import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { coverageStats, doctors, villages, notifications } from '@/data/mockData';
import { getPendingDoctors } from '@/services/adminService';
import { Users, UserCheck, MapPin, Building2, AlertTriangle, Clock, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const coveragePieData = [
  { name: 'Covered', value: coverageStats.covered, color: 'hsl(142, 71%, 45%)' },
  { name: 'Limited', value: coverageStats.limited, color: 'hsl(38, 92%, 50%)' },
  { name: 'Uncovered', value: coverageStats.uncovered, color: 'hsl(0, 72%, 51%)' },
];

const doctorWorkloadData = doctors
  .filter(d => d.status === 'verified')
  .map(d => ({
    name: d.name.replace('Dr. ', '').split(' ')[0],
    villages: d.assignedVillages.length,
  }))
  .sort((a, b) => b.villages - a.villages);

const Index = () => {
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  // Fetch pending doctor count from backend
  useEffect(() => {
    getPendingDoctors()
      .then(res => setPendingCount(res.count ?? res.pending?.length ?? 0))
      .catch(() => setPendingCount(null)); // Silently fail — count just won't show
  }, []);

  return (
    <DashboardLayout title="Dashboard" subtitle="Overview of SwastyaConnect operations">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          <StatsCard title="Total Doctors" value={coverageStats.totalDoctors} icon={Users} variant="info" trend={{ value: 8, positive: true }} />
          <StatsCard title="Verified" value={coverageStats.verifiedDoctors} icon={UserCheck} variant="success" />
          {/* Live pending count card from backend */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/admin/pending-doctors')}
            className="cursor-pointer rounded-lg border border-warning/30 bg-warning/5 hover:bg-warning/10 p-4 shadow-card transition-colors group"
            title="Click to review pending doctors"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Pending Approvals</p>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-4 w-4 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold text-warning">
              {pendingCount === null ? '—' : pendingCount}
            </p>
            <p className="text-[10px] text-muted-foreground mt-1 group-hover:text-warning transition-colors">
              {pendingCount === null ? 'Connecting…' : `Doctor${pendingCount !== 1 ? 's' : ''} awaiting review`}
            </p>
          </motion.div>
          <StatsCard title="Villages Covered" value={coverageStats.covered} subtitle={`of ${coverageStats.totalVillages}`} icon={MapPin} variant="success" />
          <StatsCard title="Limited Coverage" value={coverageStats.limited} icon={AlertTriangle} variant="warning" />
          <StatsCard title="No Coverage" value={coverageStats.uncovered} icon={MapPin} variant="danger" />
          <StatsCard title="Pharmacies" value={coverageStats.pharmaciesAvailable} subtitle={`${coverageStats.lowStockPharmacies} low stock`} icon={Building2} variant="info" />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Coverage Pie */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Village Coverage Distribution</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={coveragePieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {coveragePieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-5 mt-2">
              {coveragePieData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Doctor Workload */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Doctor Workload (Villages Assigned)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={doctorWorkloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)', fontSize: '12px' }} />
                <Bar dataKey="villages" fill="hsl(221, 83%, 53%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Doctors */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Doctor Status</h3>
            <div className="space-y-2.5">
              {doctors.slice(0, 6).map(doc => (
                <div key={doc.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                  </div>
                  <StatusBadge status={doc.status} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-3">Recent Alerts</h3>
            <div className="space-y-2.5">
              {notifications.map(n => (
                <div key={n.id} className={`flex items-start gap-3 py-2 border-b border-border last:border-0 ${!n.read ? 'bg-primary/5 -mx-2 px-2 rounded-md' : ''}`}>
                  <Activity className={`h-4 w-4 mt-0.5 shrink-0 ${n.type === 'emergency' ? 'text-destructive' : n.type === 'pharmacy' ? 'text-warning' : 'text-info'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-card-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
