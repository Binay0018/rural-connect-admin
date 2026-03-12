import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { coverageStats, doctors, villages } from '@/data/mockData';
import { MapPin, Users, AlertTriangle, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';

const coveragePieData = [
  { name: 'Covered', value: coverageStats.covered, color: 'hsl(142, 71%, 45%)' },
  { name: 'Limited', value: coverageStats.limited, color: 'hsl(38, 92%, 50%)' },
  { name: 'Uncovered', value: coverageStats.uncovered, color: 'hsl(0, 72%, 51%)' },
];

const doctorWorkloadData = doctors
  .filter(d => d.status === 'verified')
  .map(d => {
    const assignedPop = villages
      .filter(v => v.assignedDoctorId === d.id)
      .reduce((sum, v) => sum + v.population, 0);
    return {
      name: d.name.replace('Dr. ', '').split(' ')[0],
      villages: d.assignedVillages.length,
      population: assignedPop,
    };
  })
  .sort((a, b) => b.villages - a.villages);

const distanceDistribution = [
  { range: '0-2 km', count: villages.filter(v => v.distanceToDoctor !== null && v.distanceToDoctor <= 2).length },
  { range: '2-5 km', count: villages.filter(v => v.distanceToDoctor !== null && v.distanceToDoctor > 2 && v.distanceToDoctor <= 5).length },
  { range: '5-10 km', count: villages.filter(v => v.distanceToDoctor !== null && v.distanceToDoctor > 5 && v.distanceToDoctor <= 10).length },
  { range: '10-15 km', count: villages.filter(v => v.distanceToDoctor !== null && v.distanceToDoctor > 10 && v.distanceToDoctor <= 15).length },
  { range: '15+ km', count: villages.filter(v => v.distanceToDoctor !== null && v.distanceToDoctor > 15).length },
];

export default function CoverageAnalytics() {
  const coveragePercent = Math.round((coverageStats.covered / coverageStats.totalVillages) * 100);

  return (
    <DashboardLayout title="Coverage Analytics" subtitle="Village healthcare access analysis">
      <div className="space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Coverage Rate" value={`${coveragePercent}%`} subtitle={`${coverageStats.covered} of ${coverageStats.totalVillages}`} icon={Shield} variant="success" />
          <StatsCard title="Avg Villages/Doctor" value={Math.round(coverageStats.totalVillages / coverageStats.verifiedDoctors)} icon={Users} variant="info" />
          <StatsCard title="No Medical Access" value={coverageStats.uncovered} subtitle="villages" icon={AlertTriangle} variant="danger" />
          <StatsCard title="Population Uncovered" value={villages.filter(v => v.coverageStatus === 'uncovered').reduce((s, v) => s + v.population, 0).toLocaleString()} icon={MapPin} variant="warning" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Coverage Breakdown</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={coveragePieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {coveragePieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Doctor Workload Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={doctorWorkloadData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(215, 16%, 47%)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(215, 16%, 47%)' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="villages" name="Villages" fill="hsl(221, 83%, 53%)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Distance Distribution */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Village Distance to Nearest Doctor</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distanceDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(215, 16%, 47%)' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(214, 20%, 90%)', fontSize: '12px' }} />
              <Bar dataKey="count" name="Villages" fill="hsl(199, 89%, 48%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Uncovered Villages Table */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-lg border border-border bg-card shadow-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold text-card-foreground">Villages Without Medical Access</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Requires immediate attention for doctor allocation</p>
          </div>
          <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-muted-foreground">Village</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground">Population</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-muted-foreground">Nearest Doctor (km)</th>
                </tr>
              </thead>
              <tbody>
                {villages.filter(v => v.coverageStatus === 'uncovered').slice(0, 20).map(v => (
                  <tr key={v.id} className="border-t border-border hover:bg-muted/30">
                    <td className="py-2 px-4 text-card-foreground">{v.name}</td>
                    <td className="py-2 px-4 text-right text-muted-foreground">{v.population.toLocaleString()}</td>
                    <td className="py-2 px-4 text-right text-destructive font-medium">{v.distanceToDoctor ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
