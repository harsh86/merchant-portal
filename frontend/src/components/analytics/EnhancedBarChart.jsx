import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { chartColors, gridStyle, axisStyle, chartAnimations } from '../../utils/chartConfig';
import { CreditCard, DollarSign } from 'lucide-react';

/**
 * Enhanced horizontal bar chart with gradients
 * Features: horizontal layout, animated growth, source icons, percentage labels
 */
const EnhancedBarChart = ({ data, title, subtitle }) => {
  // Source icon mapping
  const getSourceIcon = (source) => {
    const icons = {
      stripe: <CreditCard className="w-5 h-5" />,
      paypal: <DollarSign className="w-5 h-5" />,
      square: <CreditCard className="w-5 h-5" />,
      default: <CreditCard className="w-5 h-5" />,
    };
    return icons[source.toLowerCase()] || icons.default;
  };

  // Get gradient colors for bars
  const getBarColor = (index) => {
    const colors = [
      chartColors.primary.main,
      chartColors.secondary.main,
      chartColors.success.main,
      chartColors.info.main,
      chartColors.warning.main,
    ];
    return colors[index % colors.length];
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-slate-900/95 border border-white/20 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-sm font-bold text-white mb-2">{payload[0].payload.source}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              Count: <span className="text-white font-semibold">{payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-sm text-gray-400">
              Percentage: <span className="text-white font-semibold">
                {((payload[0].value / data.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl"
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <defs>
            {data.map((entry, index) => (
              <linearGradient
                key={`gradient-${index}`}
                id={`barGradient-${index}`}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor={getBarColor(index)} stopOpacity={0.8} />
                <stop offset="100%" stopColor={getBarColor(index)} stopOpacity={1} />
              </linearGradient>
            ))}
          </defs>

          {/* Grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={gridStyle.stroke}
            horizontal={false}
          />

          {/* Axes */}
          <XAxis
            type="number"
            tick={{ fill: axisStyle.tick.fill, fontSize: axisStyle.tick.fontSize }}
            axisLine={axisStyle.axisLine}
            tickLine={axisStyle.tickLine}
          />
          <YAxis
            type="category"
            dataKey="source"
            tick={{ fill: axisStyle.tick.fill, fontSize: axisStyle.tick.fontSize }}
            axisLine={axisStyle.axisLine}
            tickLine={axisStyle.tickLine}
          />

          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />

          {/* Bars */}
          <Bar
            dataKey="count"
            radius={[0, 8, 8, 0]}
            animationBegin={chartAnimations.animationBegin}
            animationDuration={chartAnimations.animationDuration}
            animationEasing={chartAnimations.animationEasing}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#barGradient-${index})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Source breakdown list */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => {
          const percentage = ((item.count / total) * 100).toFixed(1);
          return (
            <motion.div
              key={item.source}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${getBarColor(index)}20`,
                      color: getBarColor(index),
                    }}
                  >
                    {getSourceIcon(item.source)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.source}</p>
                    <p className="text-xs text-gray-400">{item.count.toLocaleString()} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{percentage}%</p>
                  <p className="text-xs text-gray-400">of total</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.7 }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${getBarColor(index)}80, ${getBarColor(index)})`,
                    boxShadow: `0 0 10px ${getBarColor(index)}50`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View all button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium transition-all duration-200"
      >
        View All Sources
      </motion.button>
    </motion.div>
  );
};

export default EnhancedBarChart;
