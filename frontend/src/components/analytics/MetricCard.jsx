import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

/**
 * Glassmorphic metric card with animations
 * Features: count-up animation, trend indicator, mini sparkline
 */
const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  sparklineData = [],
  delay = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-purple-600',
}) => {
  const isPositiveTrend = trend === 'up';
  const TrendIcon = isPositiveTrend ? TrendingUp : TrendingDown;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group relative"
    >
      {/* Glassmorphic card */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 p-6 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
        {/* Gradient overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                {title}
              </p>
            </div>
            {Icon && (
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Main value with count-up animation */}
          <div className="mb-2">
            <h3 className={`text-4xl font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
              {prefix}
              <CountUp
                end={value}
                duration={2}
                delay={delay}
                decimals={decimals}
                separator=","
              />
              {suffix}
            </h3>
          </div>

          {/* Subtitle and trend */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{subtitle}</p>

            {trendValue && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                isPositiveTrend ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendIcon className="w-3 h-3" />
                <span>{Math.abs(trendValue)}%</span>
              </div>
            )}
          </div>

          {/* Mini sparkline chart */}
          {sparklineData.length > 0 && (
            <div className="mt-4 h-12 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#sparklineGradient)"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1500}
                    animationBegin={delay * 1000}
                  />
                  <defs>
                    <linearGradient id="sparklineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

export default MetricCard;
