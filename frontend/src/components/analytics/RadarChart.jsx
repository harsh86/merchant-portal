import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * RadarChart - Performance comparison visualization
 * Compares current metrics against previous period
 * AI-generated: 100%
 */
const RadarChart = ({ currentData, previousData, title = 'Performance Comparison' }) => {
  // Transform data for radar chart
  const chartData = [
    {
      metric: 'Volume',
      current: currentData?.totalVolume || 0,
      previous: previousData?.totalVolume || 0,
      max: Math.max(currentData?.totalVolume || 0, previousData?.totalVolume || 0) * 1.2
    },
    {
      metric: 'Count',
      current: currentData?.totalTransactions || 0,
      previous: previousData?.totalTransactions || 0,
      max: Math.max(currentData?.totalTransactions || 0, previousData?.totalTransactions || 0) * 1.2
    },
    {
      metric: 'Avg Amount',
      current: currentData?.averageTransactionAmount || 0,
      previous: previousData?.averageTransactionAmount || 0,
      max: Math.max(currentData?.averageTransactionAmount || 0, previousData?.averageTransactionAmount || 0) * 1.2
    },
    {
      metric: 'Success Rate',
      current: currentData?.successRate || 0,
      previous: previousData?.successRate || 0,
      max: 100
    }
  ];

  // Calculate overall trend
  const currentTotal = chartData.reduce((sum, item) => sum + (item.current / item.max * 100), 0);
  const previousTotal = chartData.reduce((sum, item) => sum + (item.previous / item.max * 100), 0);
  const trend = currentTotal - previousTotal;
  const isPositive = trend >= 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-md bg-white/90 dark:bg-gray-800/90 border border-white/20 rounded-xl p-4 shadow-2xl"
        >
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {payload[0].payload.metric}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                {entry.name}:
              </span>
              <span className="text-sm font-bold" style={{ color: entry.color }}>
                {entry.value.toFixed(2)}
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
      transition={{ duration: 0.5 }}
      className="backdrop-blur-md bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Current period vs Previous period
          </p>
        </div>

        {/* Trend Indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isPositive
              ? 'bg-green-500/20 text-green-600 dark:text-green-400'
              : 'bg-red-500/20 text-red-600 dark:text-red-400'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span className="text-sm font-semibold">
            {Math.abs(trend).toFixed(1)}%
          </span>
        </motion.div>
      </div>

      {/* Radar Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <RechartsRadar>
            <PolarGrid
              stroke="#94a3b8"
              strokeOpacity={0.3}
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
              stroke="#94a3b8"
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#94748b', fontSize: 10 }}
              stroke="#94a3b8"
              strokeOpacity={0.3}
            />
            <Radar
              name="Current"
              dataKey="current"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
              animationBegin={0}
              animationDuration={1000}
            />
            <Radar
              name="Previous"
              dataKey="previous"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.15}
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3, fill: '#94a3b8', strokeWidth: 2, stroke: '#fff' }}
              animationBegin={200}
              animationDuration={1000}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: 600
              }}
              iconType="circle"
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </motion.div>

      {/* Metric Details */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        {chartData.map((item, index) => {
          const change = item.current - item.previous;
          const percentChange = item.previous !== 0 ? (change / item.previous * 100) : 0;
          const isIncrease = change >= 0;

          return (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-lg p-3"
            >
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {item.metric}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {item.current.toFixed(item.metric === 'Success Rate' ? 1 : 0)}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-1 ${
                  isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {isIncrease ? '↑' : '↓'}
                  {Math.abs(percentChange).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RadarChart;
