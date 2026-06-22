'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { onTimeTrend, shipmentVolume } from '@/lib/data'

const volumeConfig = {
  air: { label: 'Air', color: 'var(--chart-1)' },
  ocean: { label: 'Ocean', color: 'var(--chart-2)' },
  ground: { label: 'Ground', color: 'var(--chart-3)' },
} satisfies ChartConfig

const rateConfig = {
  rate: { label: 'On-time %', color: 'var(--chart-1)' },
} satisfies ChartConfig

export function VolumeChart() {
  return (
    <ChartContainer config={volumeConfig} className="h-[280px] w-full">
      <BarChart data={shipmentVolume} barGap={4}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="air" fill="var(--color-air)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ocean" fill="var(--color-ocean)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="ground" fill="var(--color-ground)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function OnTimeChart() {
  return (
    <ChartContainer config={rateConfig} className="h-[280px] w-full">
      <AreaChart data={onTimeTrend}>
        <defs>
          <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-rate)" stopOpacity={0.4} />
            <stop offset="95%" stopColor="var(--color-rate)" stopOpacity={0.04} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          domain={[94, 100]}
          tickLine={false}
          axisLine={false}
          width={36}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="rate"
          stroke="var(--color-rate)"
          strokeWidth={2}
          fill="url(#fillRate)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
