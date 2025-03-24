"use client"
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, CartesianGrid} from 'recharts';
import { useState } from 'react';

interface ResponseData {
  title: string;
  rate: number;
}

const data: ResponseData[] = [
  { title: "Software Engineer", rate: 72 },
  { title: "Product Manager", rate: 68 },
  { title: "Data Scientist", rate: 65 },
  { title: "UX Designer", rate: 58 },
  { title: "DevOps Engineer", rate: 70 },
];

const BLUE_COLOR = '#3b82f6';

export default function JobTitleResponseChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-gray p-6 rounded-xl border border-[#1e293b]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white text-xl font-semibold">Response Rate based on Job Titles</h2>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 60 }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" /> {/* Lighter blue */}
                <stop offset="100%" stopColor={BLUE_COLOR} /> {/* Your exact blue */}
              </linearGradient>
            </defs>
            
            <YAxis 
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
            />
            
            <CartesianGrid 
              stroke="#1e293b" 
              strokeDasharray="3 3" 
              horizontal={true} 
              vertical={false}
            />

            <XAxis 
              dataKey="title" 
              type="category"
              tick={{ fill: '#e2e8f0', fontSize: 12 }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={30}
            />
            
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                borderColor: BLUE_COLOR, // Blue border to match
                borderRadius: '6px',
                color: '#f8fafc'
              }}
              formatter={(value: number) => [`${value}%`, 'Response Rate']}
              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }} // Blue tint
            />
            
            <Bar 
              dataKey="rate"
              name="Response Rate"
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === activeIndex ? "url(#barGradient)" : BLUE_COLOR}
                  stroke={index === activeIndex ? "#93c5fd" : "none"} // Light blue border on hover
                  strokeWidth={index === activeIndex ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
