import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Village, Doctor } from '@/data/ruralCoverageData';

interface CoverageMapProps {
  villages: Village[];
  doctors: Doctor[];
  onMarkerClick: (villageId: string) => void;
}

export function CoverageMap({ villages, doctors, onMarkerClick }: CoverageMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize map using default Carto style or a basic style
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // using a public style
      center: [76.1481, 30.3752], // Nabha coords
      zoom: 11,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when villages/doctors change
  useEffect(() => {
    if (!map.current) return;

    const doctorColorMap = new Map(doctors.map(d => [d.id, d.color]));

    // Remove old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    villages.forEach(village => {
      const color = doctorColorMap.get(village.assignedDoctorId) || '#6b7280';
      
      const el = document.createElement('div');
      el.className = 'w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125';
      el.style.backgroundColor = color;
      
      el.addEventListener('click', () => {
        onMarkerClick(village.id);
      });

      // Optional: Add a small tooltip popup for hover
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 10
      }).setHTML(`
        <div class="px-2 py-1">
          <p class="font-bold text-sm">${village.name}</p>
          <p class="text-xs text-muted-foreground">Pop: ${village.population}</p>
        </div>
      `);

      el.addEventListener('mouseenter', () => popup.addTo(map.current!));
      el.addEventListener('mouseleave', () => popup.remove());

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([village.lng, village.lat])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current[village.id] = marker;
    });

  }, [villages, doctors, onMarkerClick]);

  return <div ref={mapContainer} className="w-full h-full" />;
}
