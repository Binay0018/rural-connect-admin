import { useState } from 'react';
import { Pill, Plus, X, Search, FileDown } from 'lucide-react';
import { pharmacies } from '@/data/mockData';

interface PrescribedMeds {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export function DigitalPrescription() {
  const [meds, setMeds] = useState<PrescribedMeds[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract all unique medicines from across all pharmacies in mockData
  const allMeds = Array.from(new Set(pharmacies.flatMap(p => p.medicines.map(m => m.name))));
  
  const filteredMeds = searchTerm.trim() 
    ? allMeds.filter(m => m.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : [];

  const addMed = (name: string) => {
    setMeds([...meds, { 
      id: Math.random().toString(36).substr(2, 9), 
      name, 
      dosage: '1 Tablet', 
      frequency: '1-0-1 (Morning/Night)', 
      duration: '5 Days' 
    }]);
    setSearchTerm('');
  };

  const removeMed = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  const updateMed = (id: string, field: keyof PrescribedMeds, value: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border bg-muted/40 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Pill className="h-4 w-4 text-primary" /> e-Prescription
        </h3>
        <button 
          disabled={meds.length === 0}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
        >
          <FileDown size={14} /> Generate PDF
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
        
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search for medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-lg text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          
          {/* Autocomplete Dropdown */}
          {searchTerm && filteredMeds.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
              {filteredMeds.map((med, i) => (
                <button
                  key={i}
                  onClick={() => addMed(med)}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted font-medium border-b border-border last:border-0 flex items-center justify-between group"
                >
                  {med}
                  <Plus size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prescribed List */}
        <div className="flex-1 border rounded-lg border-border bg-muted/10 overflow-hidden flex flex-col">
          {meds.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <Pill className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">No medicines prescribed.</p>
              <p className="text-xs mt-1">Search above to add medications to the prescription.</p>
            </div>
          ) : (
            <div className="overflow-y-auto p-2 space-y-2">
              {meds.map((med) => (
                <div key={med.id} className="bg-card border border-border rounded-md p-3 shadow-sm relative group">
                  <button 
                    onClick={() => removeMed(med.id)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors p-1 rounded hover:bg-destructive/10"
                  >
                    <X size={14} />
                  </button>
                  <h4 className="font-bold text-sm text-foreground mb-2 pr-6">{med.name}</h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-semibold">Dosage</label>
                      <input 
                        type="text" 
                        value={med.dosage}
                        onChange={(e) => updateMed(med.id, 'dosage', e.target.value)}
                        className="w-full text-xs p-1.5 bg-background border border-border rounded focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-semibold">Frequency</label>
                      <select 
                        value={med.frequency}
                        onChange={(e) => updateMed(med.id, 'frequency', e.target.value)}
                        className="w-full text-xs p-1.5 bg-background border border-border rounded focus:outline-none focus:border-primary"
                      >
                        <option>1-0-0 (Morning)</option>
                        <option>0-0-1 (Night)</option>
                        <option>1-0-1 (Morning/Night)</option>
                        <option>1-1-1 (TDS)</option>
                        <option>SOS (As Needed)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-muted-foreground uppercase font-semibold">Duration</label>
                      <input 
                        type="text" 
                        value={med.duration}
                        onChange={(e) => updateMed(med.id, 'duration', e.target.value)}
                        className="w-full text-xs p-1.5 bg-background border border-border rounded focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
