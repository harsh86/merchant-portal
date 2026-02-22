import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { chartColors, gridStyle, axisStyle, chartAnimations } from '../../utils/chartConfig';
import { formatCurrency } from '../../utils/helpers';

/**
 * Enhanced area chart with gradients and dual Y-axis
 * Features: gradient fills, smooth curves, animated path drawing, time period selector
 */
const EnhancedAreaChart = ({ data, title, subtitle }) => {
  const [timePeriod, setTimePeriod] = useState('30d');

  const timePeriods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
    { value: 'all', label: 'All' },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-sm text-gray-300 mb-2">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-400">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold text-white">
                {entry.name === 'Volume'
                  ? formatCurrency(entry.value)
                  : entry.value.toLocaleString()
                }
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
    >
      {/* Header with time period selector */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-400">{subtitle}</p>
          )}
        </div>

        {/* Time period selector */}
        <div className="flex gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.value}
              onClick={() => setTimePeriod(period.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                timePeriod === period.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            {/* Volume gradient */}
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.success.main} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.success.main} stopOpacity={0.1} />
            </linearGradient>

            {/* Count gradient */}
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColors.primary.main} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColors.primary.main} stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridStyle.stroke}
            vertical={false}
          />

          {/* Axes */}
          <XAxis
            dataKey="date"
            tick={{ fill: axisStyle.tick.fill, fontSize: axisStyle.tick.fontSize }}
            axisLine={axisStyle.axisLine}
            tickLine={axisStyle.tickLine}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: axisStyle.tick.fill, fontSize: axisStyle.tick.fontSize }}
            axisLine={axisStyle.axisLine}
            tickLine={axisStyle.tickLine}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: axisStyle.tick.fill, fontSize: axisStyle.tick.fontSize }}
            axisLine={axisStyle.axisLine}
            tickLine={axisStyle.tickLine}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Legend */}
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />

          {/* Area fills */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="volume"
            stroke={chartColors.success.main}
            strokeWidth={3}
            fill="url(#colorVolume)"
            name="Volume"
            animationBegin={chartAnimations.animationBegin}
            animationDuration={chartAnimations.animationDuration}
            animationEasing={chartAnimations.animationEasing}
            dot={{ r: 4, fill: chartColors.success.main, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="count"
            stroke={chartColors.primary.main}
            strokeWidth={3}
            fill="url(#colorCount)"
            name="Count"
            animationBegin={chartAnimations.animationBegin}
            animationDuration={chartAnimations.animationDuration + 200}
            animationEasing={chartAnimations.animationEasing}
            dot={{ r: 4, fill: chartColors.primary.main, strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Stats below chart */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <p className="text-sm text-gray-400">Total Volume</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(data.reduce((sum, item) => sum + item.volume, 0))}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <p className="text-sm text-gray-400">Total Count</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {data.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedAreaChart;
