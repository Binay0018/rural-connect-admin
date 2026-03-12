import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { pharmacies } from '@/data/mockData';
import { Search, AlertTriangle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PharmacyInventory() {
  const [search, setSearch] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [expandedPharmacy, setExpandedPharmacy] = useState<string | null>(null);

  const filtered = pharmacies.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.village.toLowerCase().includes(search.toLowerCase())) return false;
    if (showLowStockOnly && !p.medicines.some(m => m.lowStock)) return false;
    return true;
  });

  return (
    <DashboardLayout title="Pharmacy Inventory" subtitle="Monitor medicine availability across the region">
      <div className="space-y-4">
        {/* Alert Banner */}
        {pharmacies.some(p => p.medicines.some(m => !m.available)) && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-warning/10 border border-warning/20 p-3 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
            <p className="text-xs text-foreground">
              <span className="font-semibold">Stock Alert:</span> Some medicines are unavailable in certain pharmacies. Review inventory below.
            </p>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 flex-1 max-w-xs">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pharmacies..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
            />
          </div>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showLowStockOnly} onChange={e => setShowLowStockOnly(e.target.checked)} className="rounded" />
            Low stock only
          </label>
        </div>

        {/* Pharmacy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(pharmacy => {
            const lowStockCount = pharmacy.medicines.filter(m => m.lowStock).length;
            const unavailableCount = pharmacy.medicines.filter(m => !m.available).length;
            const isExpanded = expandedPharmacy === pharmacy.id;

            return (
              <motion.div
                key={pharmacy.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-border bg-card shadow-card overflow-hidden"
              >
                <div
                  className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedPharmacy(isExpanded ? null : pharmacy.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-semibold text-card-foreground">{pharmacy.name}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{pharmacy.village}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {lowStockCount > 0 && (
                        <span className="rounded-full bg-warning/15 text-warning text-[10px] font-semibold px-2 py-0.5">{lowStockCount} low</span>
                      )}
                      {unavailableCount > 0 && (
                        <span className="rounded-full bg-destructive/15 text-destructive text-[10px] font-semibold px-2 py-0.5">{unavailableCount} out</span>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left py-2 px-4 font-semibold text-muted-foreground">Medicine</th>
                          <th className="text-right py-2 px-4 font-semibold text-muted-foreground">Qty</th>
                          <th className="text-right py-2 px-4 font-semibold text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pharmacy.medicines.map(med => (
                          <tr key={med.name} className="border-t border-border">
                            <td className="py-1.5 px-4 text-card-foreground">{med.name}</td>
                            <td className="py-1.5 px-4 text-right text-muted-foreground">{med.quantity}</td>
                            <td className="py-1.5 px-4 text-right">
                              {!med.available ? (
                                <span className="text-destructive font-semibold">Out of Stock</span>
                              ) : med.lowStock ? (
                                <span className="text-warning font-semibold">Low</span>
                              ) : (
                                <span className="text-success font-semibold">OK</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
