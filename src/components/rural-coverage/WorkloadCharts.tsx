import React from 'react';
import { Village, Doctor } from '@/data/ruralCoverageData';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface WorkloadChartsProps {
  villages: Village[];
  doctors: Doctor[];
}

export function WorkloadCharts({ villages, doctors }: WorkloadChartsProps) {
  const totalDoctors = doctors.length;
  const totalVillages = villages.length;
  const avgVillagesPerDoctor = (totalVillages / totalDoctors).toFixed(1);

  // Villages per doctor distribution
  const villagesPerDoctor = doctors.map(doc => ({
    name: doc.name,
    count: villages.filter(v => v.assignedDoctorId === doc.id).length,
    color: doc.color
  }));

  const doughnutData = {
    labels: villagesPerDoctor.map(d => d.name),
    datasets: [{
      data: villagesPerDoctor.map(d => d.count),
      backgroundColor: villagesPerDoctor.map(d => d.color),
      borderWidth: 1,
    }]
  };

  const barData = {
    labels: villagesPerDoctor.map(d => d.name.split(' ')[1]), // Just last name or first name to save space
    datasets: [{
      label: 'Villages Assigned',
      data: villagesPerDoctor.map(d => d.count),
      backgroundColor: villagesPerDoctor.map(d => d.color),
    }]
  };

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div>
        <h2 className="text-lg font-semibold mb-4">Workload Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Total Doctors</p>
            <p className="text-2xl font-bold">{totalDoctors}</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Total Villages</p>
            <p className="text-2xl font-bold">{totalVillages}</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Avg per Doctor</p>
            <p className="text-2xl font-bold">{avgVillagesPerDoctor}</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground">Coverage</p>
            <p className="text-2xl font-bold text-primary">100%</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        <div className="h-48 relative">
          <h3 className="text-sm font-semibold text-center mb-2">Villages Distribution</h3>
          <Doughnut 
            data={doughnutData} 
            options={{ 
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }} 
          />
        </div>
        
        <div className="h-48 relative">
          <h3 className="text-sm font-semibold text-center mb-2">Villages per Doctor</h3>
          <Bar 
            data={barData}
            options={{
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>
      </div>
    </div>
  );
}
