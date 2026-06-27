"use client"

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

interface SalesChartProps {
  data: {
    name: string
    total: number
  }[]
}

// --- CUSTOM PREMIUM TOOLTIP ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-4 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-md">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-black">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-[350px] mt-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          {/* Gradient for the Area Fill */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#000000" stopOpacity={0.01} />
            </linearGradient>
          </defs>

          {/* Background Grid - Very Subtle */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="#f3f4f6" 
          />

          {/* X Axis - Days of the week */}
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }}
            padding={{ left: 20, right: 20 }}
            dy={15}
          />

          {/* Y Axis - Revenue */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fontWeight: 800, fill: '#9ca3af' }}
            tickFormatter={(value) => `₹${value >= 1000 ? `${value / 1000}k` : value}`}
          />

          {/* Premium Tooltip */}
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000', strokeWidth: 1, strokeDasharray: '4 4' }} />

          {/* The Actual Graph Line & Area */}
          <Area
            type="monotone"
            dataKey="total"
            stroke="#000000"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#chartGradient)"
            animationDuration={1500}
            activeDot={{ r: 6, strokeWidth: 0, fill: '#000' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Legend / Status Info */}
      <div className="flex items-center justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-black" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Revenue Flow</span>
        </div>
      </div>
    </div>
  )
}