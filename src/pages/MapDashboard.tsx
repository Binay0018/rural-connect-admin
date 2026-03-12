import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { villages, doctors, pharmacies } from '@/data/mockData';
import { motion } from 'framer-motion';

const NABHA_CENTER: [number, number] = [76.15, 30.37];

const coverageColors = {
  covered: '#22c55e',
  limited: '#eab308',
  uncovered: '#ef4444',
};

export default function MapDashboard() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'covered' | 'limited' | 'uncovered'>('all');
  const [showDoctors, setShowDoctors] = useState(true);
  const [showPharmacies, setShowPharmacies] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: NABHA_CENTER,
      zoom: 10.5,
      attributionControl: false,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => setMapLoaded(true));

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    document.querySelectorAll('.custom-marker').forEach(el => el.remove());

    // Village markers
    const filteredVillages = filter === 'all' ? villages : villages.filter(v => v.coverageStatus === filter);
    filteredVillages.forEach(village => {
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.cssText = `width:10px;height:10px;border-radius:50%;background:${coverageColors[village.coverageStatus]};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;`;

      const assignedDoc = doctors.find(d => d.id === village.assignedDoctorId);
      const nearestPharm = pharmacies.find(p => p.id === village.nearestPharmacyId);

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '240px' }).setHTML(`
        <div style="padding:12px;font-family:Inter,sans-serif;">
          <h4 style="font-size:13px;font-weight:600;margin:0 0 6px;">${village.name}</h4>
          <p style="font-size:11px;color:#6b7280;margin:0 0 4px;">Pop: ${village.population.toLocaleString()}</p>
          <div style="display:inline-block;padding:2px 8px;border-radius:9999px;font-size:10px;font-weight:600;color:white;background:${coverageColors[village.coverageStatus]};">
            ${village.coverageStatus === 'covered' ? 'Covered' : village.coverageStatus === 'limited' ? 'Limited' : 'No Coverage'}
          </div>
          ${assignedDoc ? `<p style="font-size:11px;margin:6px 0 2px;"><strong>Doctor:</strong> ${assignedDoc.name}</p><p style="font-size:11px;color:#6b7280;margin:0;">${village.distanceToDoctor} km away</p>` : '<p style="font-size:11px;color:#ef4444;margin:6px 0 0;">No doctor assigned</p>'}
          ${nearestPharm ? `<p style="font-size:11px;margin:4px 0 0;"><strong>Pharmacy:</strong> ${nearestPharm.name}</p>` : ''}
        </div>
      `);

      new maplibregl.Marker({ element: el })
        .setLngLat([village.lng, village.lat])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Doctor markers
    if (showDoctors) {
      doctors.filter(d => d.status === 'verified').forEach(doc => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `width:22px;height:22px;border-radius:50%;background:hsl(221,83%,53%);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;display:flex;align-items:center;justify-content:center;`;
        el.innerHTML = `<span style="color:white;font-size:10px;font-weight:700;">D</span>`;

        const popup = new maplibregl.Popup({ offset: 14, maxWidth: '220px' }).setHTML(`
          <div style="padding:12px;font-family:Inter,sans-serif;">
            <h4 style="font-size:13px;font-weight:600;margin:0 0 4px;">${doc.name}</h4>
            <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">${doc.specialization}</p>
            <p style="font-size:11px;margin:0;">Villages: ${doc.assignedVillages.length}</p>
          </div>
        `);

        new maplibregl.Marker({ element: el })
          .setLngLat([doc.lng, doc.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }

    // Pharmacy markers
    if (showPharmacies) {
      pharmacies.forEach(pharm => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `width:18px;height:18px;border-radius:4px;background:hsl(142,71%,45%);border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.2);cursor:pointer;display:flex;align-items:center;justify-content:center;`;
        el.innerHTML = `<span style="color:white;font-size:9px;font-weight:700;">P</span>`;

        const lowStockMeds = pharm.medicines.filter(m => m.lowStock).length;
        const popup = new maplibregl.Popup({ offset: 12, maxWidth: '220px' }).setHTML(`
          <div style="padding:12px;font-family:Inter,sans-serif;">
            <h4 style="font-size:13px;font-weight:600;margin:0 0 4px;">${pharm.name}</h4>
            <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">${pharm.village}</p>
            ${lowStockMeds > 0 ? `<p style="font-size:11px;color:#eab308;margin:0;">${lowStockMeds} medicines low stock</p>` : '<p style="font-size:11px;color:#22c55e;margin:0;">Stock OK</p>'}
          </div>
        `);

        new maplibregl.Marker({ element: el })
          .setLngLat([pharm.lng, pharm.lat])
          .setPopup(popup)
          .addTo(map.current!);
      });
    }
  }, [mapLoaded, filter, showDoctors, showPharmacies]);

  const filterButtons = [
    { key: 'all' as const, label: 'All Villages', count: villages.length },
    { key: 'covered' as const, label: 'Covered', count: villages.filter(v => v.coverageStatus === 'covered').length },
    { key: 'limited' as const, label: 'Limited', count: villages.filter(v => v.coverageStatus === 'limited').length },
    { key: 'uncovered' as const, label: 'Uncovered', count: villages.filter(v => v.coverageStatus === 'uncovered').length },
  ];

  return (
    <DashboardLayout title="Interactive Map" subtitle="Village coverage across Nabha region">
      <div className="space-y-4">
        {/* Controls */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center gap-2">
          {filterButtons.map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === btn.key
                  ? 'gradient-primary text-primary-foreground shadow-elevated'
                  : 'bg-card text-muted-foreground border border-border hover:bg-muted'
              }`}
            >
              {btn.label} ({btn.count})
            </button>
          ))}
          <div className="h-5 w-px bg-border mx-1" />
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showDoctors} onChange={e => setShowDoctors(e.target.checked)} className="rounded" />
            Doctors
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={showPharmacies} onChange={e => setShowPharmacies(e.target.checked)} className="rounded" />
            Pharmacies
          </label>
        </motion.div>

        {/* Map */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg border border-border overflow-hidden shadow-card" style={{ height: 'calc(100vh - 220px)' }}>
          <div ref={mapContainer} className="w-full h-full" />
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.covered }} /> Covered Village</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.limited }} /> Limited Coverage</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.uncovered }} /> No Coverage</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: 'hsl(221,83%,53%)' }} /> Doctor</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: 'hsl(142,71%,45%)' }} /> Pharmacy</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
