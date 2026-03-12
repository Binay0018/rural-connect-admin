import React, { useState, useMemo } from 'react';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { CoverageMap } from '@/components/rural-coverage/CoverageMap';
import { WorkloadCharts } from '@/components/rural-coverage/WorkloadCharts';
import { ScheduleTable } from '@/components/rural-coverage/ScheduleTable';
import { VillageDetailsPanel } from '@/components/rural-coverage/VillageDetailsPanel';
import { initialVillages, doctors, Village } from '@/data/ruralCoverageData';

export default function RuralCoverageDashboard() {
  const [villages, setVillages] = useState<Village[]>(initialVillages);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);

  const selectedVillage = useMemo(() => 
    villages.find(v => v.id === selectedVillageId) || null,
  [villages, selectedVillageId]);

  const handleUpdateVillage = (villageId: string, updates: Partial<Village>) => {
    setVillages(prev => prev.map(v => v.id === villageId ? { ...v, ...updates } : v));
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <h1 className="text-xl font-semibold tracking-tight">Rural Doctor Coverage Dashboard – Nabha</h1>
        </header>
        
        <main className="flex-1 overflow-auto p-6 flex flex-col gap-6">
          {/* Top Row: Map and KPI/Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[500px]">
            <div className="lg:col-span-2 flex flex-col bg-card rounded-xl border shadow-sm p-4 relative">
              <h2 className="text-lg font-semibold mb-4">Coverage Map (173 Villages)</h2>
              <div className="flex-1 rounded-md overflow-hidden bg-muted">
                <CoverageMap 
                  villages={villages} 
                  doctors={doctors}
                  onMarkerClick={(id) => setSelectedVillageId(id)}
                />
              </div>
            </div>
            
            <div className="flex flex-col bg-card rounded-xl border shadow-sm p-4 overflow-y-auto">
              <WorkloadCharts villages={villages} doctors={doctors} />
            </div>
          </div>

          {/* Bottom Row: Schedule Table */}
          <div className="bg-card rounded-xl border shadow-sm p-4">
            <h2 className="text-lg font-semibold mb-4">Weekly Schedule</h2>
            <ScheduleTable villages={villages} doctors={doctors} />
          </div>
        </main>

        <VillageDetailsPanel 
          village={selectedVillage} 
          doctors={doctors}
          onClose={() => setSelectedVillageId(null)}
          onUpdate={handleUpdateVillage}
        />
      </div>
    </div>
  );
}
