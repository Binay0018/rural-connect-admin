import React, { useState } from 'react';
import { Village, Doctor } from '@/data/ruralCoverageData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScheduleTableProps {
  villages: Village[];
  doctors: Doctor[];
}

export function ScheduleTable({ villages, doctors }: ScheduleTableProps) {
  const [search, setSearch] = useState('');
  const [filterDoc, setFilterDoc] = useState('all');
  const [filterDay, setFilterDay] = useState('all');

  const filteredVillages = villages.filter(v => {
    const docMatch = filterDoc === 'all' || v.assignedDoctorId === filterDoc;
    const dayMatch = filterDay === 'all' || v.visitDay === filterDay;
    const searchMatch = v.name.toLowerCase().includes(search.toLowerCase());
    return docMatch && dayMatch && searchMatch;
  });

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input 
          className="w-full sm:max-w-xs" 
          placeholder="Search villages..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <div className="flex w-full sm:w-auto gap-4">
          <Select value={filterDoc} onValueChange={setFilterDoc}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map(d => (
                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDay} onValueChange={setFilterDay}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Days</SelectItem>
              <SelectItem value="Monday">Monday</SelectItem>
              <SelectItem value="Tuesday">Tuesday</SelectItem>
              <SelectItem value="Wednesday">Wednesday</SelectItem>
              <SelectItem value="Thursday">Thursday</SelectItem>
              <SelectItem value="Friday">Friday</SelectItem>
              <SelectItem value="Saturday">Saturday</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border h-64 overflow-y-auto w-full">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10 w-full">
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Village</TableHead>
              <TableHead className="text-right">Population</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVillages.length > 0 ? (
              filteredVillages.map((village) => (
                <TableRow key={village.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: doctors.find(d => d.id === village.assignedDoctorId)?.color }}
                      />
                      {doctors.find(d => d.id === village.assignedDoctorId)?.name}
                    </div>
                  </TableCell>
                  <TableCell>{village.visitDay}</TableCell>
                  <TableCell>{village.shift}</TableCell>
                  <TableCell>{village.name}</TableCell>
                  <TableCell className="text-right">{village.population}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No villages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
