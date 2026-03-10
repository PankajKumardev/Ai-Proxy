"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function CacheDistributionChart({ hits, misses }: { hits: number, misses: number }) {
  const data = useMemo(() => [
    { name: "Hits", value: hits, color: "#2DD4BF" }, // soft teal/mint
    { name: "Misses", value: misses, color: "#52525B" } // muted slate
  ], [hits, misses])

  if (hits === 0 && misses === 0) {
    return (
      <div className="h-48 w-full flex items-center justify-center text-neutral-500 text-sm">
        No cache data available.
      </div>
    )
  }

  return (
    <div className="h-64 w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip 
            contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
            itemStyle={{ color: "#fff" }}
          />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-medium">Hit Rate</span>
        <span className="text-xl font-semibold tracking-tight text-white mt-1">
           {Math.round((hits / (hits + misses)) * 100)}%
        </span>
      </div>
    </div>
  )
}
