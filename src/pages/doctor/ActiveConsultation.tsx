import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PatientEMR } from '@/components/doctor/PatientEMR';
import { VideoInterface } from '@/components/doctor/VideoInterface';
import { ConsultationNotes } from '@/components/doctor/ConsultationNotes';
import { DigitalPrescription } from '@/components/doctor/DigitalPrescription';
import { patients } from '@/data/mockData';
import { ArrowLeft } from 'lucide-react';

export default function ActiveConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const patient = patients.find(p => p.id === id);

  if (!patient) {
    return (
      <DashboardLayout title="Consultation Not Found">
        <div className="flex flex-col items-center justify-center p-10 h-full">
          <p className="text-muted-foreground mb-4">The requested patient could not be found.</p>
          <button 
            onClick={() => navigate('/doctor/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title={`Active Consultation: ${patient.name}`} 
      subtitle={`Patient ID: ${patient.id} • ${patient.village}`}
    >
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-140px)]">
        
        {/* Left Panel: Patient EMR */}
        <div className="xl:col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <PatientEMR patientId={patient.id} />
        </div>

        {/* Center Panel: Video Interface */}
        <div className="xl:col-span-5 flex flex-col bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <VideoInterface patientName={patient.name} />
        </div>

        {/* Right Panel: Notes & Prescriptions */}
        <div className="xl:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex-1 bg-card rounded-xl border border-border shadow-card overflow-hidden">
             <ConsultationNotes />
          </div>
          <div className="flex-1 bg-card rounded-xl border border-border shadow-card overflow-hidden">
            <DigitalPrescription />
          </div>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
