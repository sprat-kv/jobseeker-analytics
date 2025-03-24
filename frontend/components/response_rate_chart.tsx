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

const CustomLabel = ({ x, y, value, activeIndex, index }: { 
  x: number; 
  y: number; 
  value: number;
  activeIndex: number | null;
  index: number;
}) => {
  return (
    <text
      x={x}
      y={y}
      fill="#f3f4f6"
      textAnchor="middle"
      fontSize={12}
      style={{
        opacity: activeIndex === null || activeIndex === index ? 1 : 0.3,
        transition: 'opacity 0.3s ease',
      }}
    >
      {`${value}%`}
    </text>
  );
};

export default function JobTitleResponseChart() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="bg-black p-6 rounded-xl border border-gray-700 shadow-2xl">
      <h2 className="text-white text-xl font-semibold mb-6 text-center">
        Response Rate By Job Titles
      </h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            
            <YAxis 
              type="number"
              domain={[0, 100]}
              tick={{ fill: '#9ca3af' }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
            />
            
            <CartesianGrid 
              stroke="#2d3748"  // Slightly lighter than background
              strokeDasharray="3 3" 
              horizontal={true} 
              vertical={false}
            />

            <XAxis 
              dataKey="title" 
              type="category"
              tick={{ fill: '#f3f4f6', fontSize: 12 }}
              axisLine={{ stroke: '#4b5563' }}
              tickLine={{ stroke: '#4b5563' }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={40}
            />
            
            <Tooltip
              contentStyle={{
                background: 'rgba(17, 24, 39, 0.9)',
                borderColor: '#7c3aed',
                borderRadius: '8px',
                backdropFilter: 'blur(4px)',
              }}
              formatter={(value: number) => [`${value}%`, 'Response Rate']}
              cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }}
            />
            
            <Bar 
              dataKey="rate"
              name="Response Rate"
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === activeIndex ? "url(#barGradient)" : "#7c3aed"}
                  stroke={index === activeIndex ? "#a78bfa" : "none"}
                  strokeWidth={index === activeIndex ? 2 : 0}
                  style={{
                    transition: 'all 0.3s',
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
