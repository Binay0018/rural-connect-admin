import { useState } from 'react';
import { FileText, Plus, Check } from 'lucide-react';

export function ConsultationNotes() {
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const quickTemplates = [
    { label: 'Viral Fever', notes: 'Patient presnts with high grade fever, body ache, and mild chills. Prescribed antipyretics and rest.', diagnosis: 'Viral Infection' },
    { label: 'Standard Follow-up', notes: 'Routine follow-up. Vitals stable. Continue current medication.', diagnosis: 'Review Encounter' },
    { label: 'Dyspepsia', notes: 'Complaints of heartburn and acidity. Recommended dietary changes and antacids.', diagnosis: 'Acid Reflux / GERD' },
  ];

  const applyTemplate = (notes: string, diag: string) => {
    setChiefComplaint(notes);
    setDiagnosis(diag);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border bg-muted/40">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Clinical Notes
        </h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Quick Templates */}
        <div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Quick Templates</p>
          <div className="flex flex-wrap gap-2">
            {quickTemplates.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(t.notes, t.diagnosis)}
                className="text-xs bg-muted hover:bg-muted/80 text-foreground px-2.5 py-1.5 rounded-md border border-border transition-colors flex items-center gap-1.5"
              >
                <Plus size={12} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Textarea */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Examination & Observations</label>
          <textarea 
            className="w-full h-24 p-3 bg-background border border-input rounded-md text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            placeholder="Type your clinical observations here..."
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
          />
        </div>

        {/* Diagnosis Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Primary Diagnosis</label>
          <input 
            type="text"
            className="w-full p-2.5 bg-background border border-input rounded-md text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="e.g. Acute Bronchitis"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
