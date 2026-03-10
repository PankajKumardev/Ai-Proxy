"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function DailyRequestsChart({ data }: { data: Record<string, number> }) {
  const chartData = useMemo(() => {
    return Object.entries(data).map(([date, count]) => ({
      date: date.slice(5), // MM-DD
      count,
    })).sort((a, b) => a.date.localeCompare(b.date))
  }, [data])

  if (chartData.length === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center text-neutral-500 text-sm">
        No daily activity recorded.
      </div>
    )
  }

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis 
            dataKey="date" 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
            fontFamily="monospace"
          />
          <YAxis 
            stroke="#525252" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
            tickFormatter={(value) => `${value}`}
            fontFamily="monospace"
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
            itemStyle={{ color: "#fff" }}
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          />
          <Bar 
            dataKey="count" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
