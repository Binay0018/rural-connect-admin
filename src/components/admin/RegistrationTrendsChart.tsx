import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { date: 'Mon', registrations: 2 },
  { date: 'Tue', registrations: 5 },
  { date: 'Wed', registrations: 3 },
  { date: 'Thu', registrations: 7 },
  { date: 'Fri', registrations: 4 },
  { date: 'Sat', registrations: 9 },
  { date: 'Sun', registrations: 6 },
];

export function RegistrationTrendsChart() {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748B', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ stroke: '#CBD5E1', strokeWidth: 1, strokeDasharray: '4 4' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="registrations" 
            stroke="#8B5CF6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorReg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
