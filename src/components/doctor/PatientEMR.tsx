import { useEffect, useState } from 'react';
import { User, Activity, AlertCircle, Clock, Thermometer, Droplet, Heart, ShieldAlert, FileText, MapPin, Phone } from 'lucide-react';
import { Patient, patients } from '@/data/mockData';

export function PatientEMR({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    // In a real app this would be an API call
    const data = patients.find(p => p.id === patientId);
    setPatient(data || null);
  }, [patientId]);

  if (!patient) return (
    <div className="flex items-center justify-center p-8 text-muted-foreground w-full h-full bg-card rounded-xl border border-border">
      Loading Patient EMR...
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Demographics Card */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
        <div className="bg-primary/10 p-4 border-b border-primary/20 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
              <User size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">{patient.name}</h2>
              <p className="text-xs text-muted-foreground font-medium">
                ID: {patient.id} • {patient.gender || 'Unknown'} • {patient.age} yrs
              </p>
            </div>
          </div>
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
            patient.severity === 'emergency' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
            patient.severity === 'severe' ? 'bg-warning/10 text-warning border-warning/20' : 
            'bg-success/10 text-success border-success/20'
          }`}>
            {patient.severity}
          </span>
        </div>
        
        <div className="p-4 space-y-3">
          <DetailRow icon={<MapPin size={14} />} label="Location" value={patient.village} />
          <DetailRow icon={<Phone size={14} />} label="Contact" value={patient.contact || 'Not Provided'} />
          <DetailRow icon={<Clock size={14} />} label="Triage Time" value={patient.time} />
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <h3 className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={12} /> Chief Complaint
            </h3>
            <p className="text-sm font-medium text-foreground">{patient.symptoms}</p>
          </div>
        </div>
      </div>

      {/* Vitals Uploaded by Health Worker */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" /> Live Vitals
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Recorded by Village Health Worker</p>
        </div>
        
        {patient.vitals ? (
          <div className="grid grid-cols-2 p-3 gap-3">
            <VitalCard icon={<Heart size={16} className="text-destructive" />} label="BP" value={patient.vitals.bp} unit="mmHg" />
            <VitalCard icon={<Thermometer size={16} className="text-warning" />} label="Temp" value={patient.vitals.temp} unit="°F" />
            <VitalCard icon={<Activity size={16} className="text-success" />} label="Heart Rate" value={patient.vitals.heartRate} unit="bpm" />
            <VitalCard icon={<Droplet size={16} className="text-info" />} label="SpO2" value={patient.vitals.spo2} unit="%" />
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No vitals recorded for this encounter.
          </div>
        )}
      </div>

      {/* Medical History & Allergies */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Medical Background
          </h3>
        </div>
        <div className="p-4 space-y-4">
          
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldAlert size={12} className="text-warning" /> Known Allergies
            </h4>
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.map((allergy, i) => (
                  <span key={i} className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded border border-destructive/20 font-medium">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No known allergies.</p>
            )}
          </div>

          <div className="pt-3 border-t border-border">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity size={12} /> Past Medical History
            </h4>
            {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {patient.medicalHistory.map((history, i) => (
                  <li key={i} className="text-sm text-foreground">{history}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No significant past history.</p>
            )}
          </div>
          
        </div>
      </div>

    </div>
  );
}

// Subcomponents for the EMR Sidebar
function DetailRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

function VitalCard({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit: string }) {
  return (
    <div className="bg-muted/40 rounded-lg p-2.5 border border-border flex flex-col items-center justify-center text-center">
      <div className="mb-1.5 bg-background shadow-xs p-1.5 rounded-full border border-border">
        {icon}
      </div>
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{label}</p>
      <div className="flex items-baseline gap-1 mt-0.5">
        <span className="text-lg font-bold text-foreground leading-none">{value}</span>
        <span className="text-[10px] text-muted-foreground font-medium">{unit}</span>
      </div>
    </div>
  );
}
