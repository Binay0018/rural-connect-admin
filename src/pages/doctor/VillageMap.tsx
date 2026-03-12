import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { DoctorLayout } from '@/components/doctor/DoctorLayout';
import { useAuth } from '@/context/AuthContext';
import { villages, doctors, pharmacies } from '@/data/mockData';
import { motion } from 'framer-motion';
import { MapPin, Building2, Users } from 'lucide-react';

const coverageColors = {
  covered: '#22c55e',
  limited: '#eab308',
  uncovered: '#ef4444',
};

const NABHA_CENTER: [number, number] = [76.15, 30.37];

export default function DoctorVillageMap() {
  const { user } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const doctor = doctors.find(d => d.id === user?.doctorId);
  const myVillageIds = doctor?.assignedVillages ?? [];
  const myVillages = villages.filter(v => myVillageIds.includes(v.id));

  // Find pharmacies near assigned villages
  const nearbyPharmacyIds = new Set(myVillages.map(v => v.nearestPharmacyId).filter(Boolean));
  const nearbyPharmacies = pharmacies.filter(p => nearbyPharmacyIds.has(p.id));

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const center: [number, number] = doctor ? [doctor.lng, doctor.lat] : NABHA_CENTER;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center,
      zoom: 11,
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

    document.querySelectorAll('.doctor-map-marker').forEach(el => el.remove());

    // Doctor's own location
    if (doctor) {
      const el = document.createElement('div');
      el.className = 'doctor-map-marker';
      el.style.cssText = `width:28px;height:28px;border-radius:50%;background:hsl(221,83%,53%);border:3px solid white;box-shadow:0 2px 10px rgba(33,82,209,0.4);display:flex;align-items:center;justify-content:center;cursor:pointer;`;
      el.innerHTML = `<span style="color:white;font-size:11px;font-weight:800;">DR</span>`;

      const popup = new maplibregl.Popup({ offset: 14 }).setHTML(`
        <div style="padding:10px;font-family:Inter,sans-serif;">
          <p style="font-size:13px;font-weight:700;margin:0 0 2px;">${doctor.name}</p>
          <p style="font-size:11px;color:#6b7280;margin:0;">${doctor.specialization}</p>
          <p style="font-size:11px;margin:4px 0 0;color:#3b82f6;">${myVillages.length} villages assigned</p>
        </div>
      `);
      new maplibregl.Marker({ element: el }).setLngLat([doctor.lng, doctor.lat]).setPopup(popup).addTo(map.current!);
    }

    // Assigned village markers
    myVillages.forEach(village => {
      const el = document.createElement('div');
      el.className = 'doctor-map-marker';
      el.style.cssText = `width:12px;height:12px;border-radius:50%;background:${coverageColors[village.coverageStatus]};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);cursor:pointer;`;

      const popup = new maplibregl.Popup({ offset: 12, maxWidth: '200px' }).setHTML(`
        <div style="padding:10px;font-family:Inter,sans-serif;">
          <h4 style="font-size:13px;font-weight:600;margin:0 0 4px;">${village.name}</h4>
          <p style="font-size:11px;color:#6b7280;margin:0;">Pop: ${village.population.toLocaleString()}</p>
          <p style="font-size:11px;margin:3px 0 0;">Distance: ${village.distanceToDoctor ?? 'N/A'} km</p>
        </div>
      `);
      new maplibregl.Marker({ element: el }).setLngLat([village.lng, village.lat]).setPopup(popup).addTo(map.current!);
    });

    // Nearby pharmacy markers
    nearbyPharmacies.forEach(pharm => {
      const el = document.createElement('div');
      el.className = 'doctor-map-marker';
      el.style.cssText = `width:18px;height:18px;border-radius:4px;background:hsl(142,71%,45%);border:2px solid white;box-shadow:0 1px 6px rgba(0,0,0,0.2);cursor:pointer;display:flex;align-items:center;justify-content:center;`;
      el.innerHTML = `<span style="color:white;font-size:9px;font-weight:700;">P</span>`;

      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(`
        <div style="padding:10px;font-family:Inter,sans-serif;">
          <h4 style="font-size:13px;font-weight:600;margin:0 0 2px;">${pharm.name}</h4>
          <p style="font-size:11px;color:#6b7280;margin:0;">${pharm.village}</p>
        </div>
      `);
      new maplibregl.Marker({ element: el }).setLngLat([pharm.lng, pharm.lat]).setPopup(popup).addTo(map.current!);
    });
  }, [mapLoaded, myVillages, nearbyPharmacies, doctor]);

  return (
    <DoctorLayout title="My Villages" subtitle="Coverage map for your assigned area">
      <div className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Assigned Villages', value: myVillages.length, icon: MapPin, color: 'text-primary' },
            { label: 'Nearby Pharmacies', value: nearbyPharmacies.length, icon: Building2, color: 'text-success' },
            { label: 'Total Population', value: myVillages.reduce((s, v) => s + v.population, 0).toLocaleString(), icon: Users, color: 'text-info' },
          ].map(({ label, value, icon: Icon, color }) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-lg border border-border overflow-hidden shadow-card" style={{ height: 'calc(100vh - 260px)' }}>
          <div ref={mapContainer} className="w-full h-full" />
        </motion.div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.covered }} /> Covered</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.limited }} /> Limited</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: coverageColors.uncovered }} /> Uncovered</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full" style={{ background: 'hsl(221,83%,53%)' }} /> Your Location</div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded" style={{ background: 'hsl(142,71%,45%)' }} /> Pharmacy</div>
        </div>
      </div>
    </DoctorLayout>
  );
}
