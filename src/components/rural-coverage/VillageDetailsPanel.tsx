import React, { useState, useEffect } from 'react';
import { Village, Doctor } from '@/data/ruralCoverageData';
import { X, Calendar, Clock, MapPin, Users, History, Activity } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VillageDetailsPanelProps {
  village: Village | null;
  doctors: Doctor[];
  onClose: () => void;
  onUpdate: (villageId: string, updates: Partial<Village>) => void;
}

export function VillageDetailsPanel({ village, doctors, onClose, onUpdate }: VillageDetailsPanelProps) {
  const [editDoc, setEditDoc] = useState('');
  const [editDay, setEditDay] = useState('');
  const [editShift, setEditShift] = useState('');

  // Update temp state when village changes
  useEffect(() => {
    if (village) {
      setEditDoc(village.assignedDoctorId);
      setEditDay(village.visitDay);
      setEditShift(village.shift);
    }
  }, [village]);

  if (!village) return null;

  const doctor = doctors.find(d => d.id === editDoc);

  const handleSave = () => {
    onUpdate(village.id, {
      assignedDoctorId: editDoc,
      visitDay: editDay,
      shift: editShift,
    });
    toast.success('Assignment updated!', {
      description: `${village.name} schedule has been rebuilt.`,
      icon: <Activity className="h-4 w-4 text-primary" />,
    });
  };

  const hasChanges = 
    editDoc !== village.assignedDoctorId || 
    editDay !== village.visitDay || 
    editShift !== village.shift;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l bg-background shadow-lg transition-transform duration-300 transform translate-x-0 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          {village.name}
        </h2>
        <button onClick={onClose} className="p-2 rounded-md hover:bg-muted transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Basic Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Village Details</h3>
          <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              Population
            </span>
            <span className="font-semibold">{village.population}</span>
          </div>
        </div>

        {/* Reassignment Form */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mt-2">Coverage Settings</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Assigned Doctor</label>
            <Select value={editDoc} onValueChange={setEditDoc}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  {doctor && (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: doctor.color }} />
                  )}
                  <SelectValue placeholder="Select Doctor" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {doctors.map(d => (
                  <SelectItem key={d.id} value={d.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> Day
              </label>
              <Select value={editDay} onValueChange={setEditDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Shift
              </label>
              <Select value={editShift} onValueChange={setEditShift}>
                <SelectTrigger>
                  <SelectValue placeholder="Shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Morning">Morning</SelectItem>
                  <SelectItem value="Afternoon">Afternoon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            className="w-full mt-2" 
            disabled={!hasChanges}
            onClick={handleSave}
          >
            Apply Changes
          </Button>
        </div>

        {/* History */}
        <div className="space-y-3 mt-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <History className="h-4 w-4" />
            Service History
          </h3>
          <ul className="space-y-2 border-l-2 border-primary/20 ml-2 pl-4">
            {village.serviceHistory.map((history, i) => (
              <li key={i} className="text-sm text-foreground relative">
                <span className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-primary/50" />
                {history}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
