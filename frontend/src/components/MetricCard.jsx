/**
 * Reusable Metric Card Component
 * AI-generated glassmorphism card for displaying metrics
 */

import { motion } from 'framer-motion';

const MetricCard = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
    teal: 'from-teal-500 to-teal-600'
  };

  const bgClasses = {
    blue: 'bg-blue-500/10',
    green: 'bg-green-500/10',
    purple: 'bg-purple-500/10',
    orange: 'bg-orange-500/10',
    pink: 'bg-pink-500/10',
    teal: 'bg-teal-500/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`backdrop-blur-md ${bgClasses[color]} border border-white/20 rounded-2xl p-6 shadow-2xl shadow-${color}-500/20 hover:shadow-${color}-500/30 transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-4xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
              {value}
            </h3>
            {trend && (
              <span className={`text-sm font-medium ${
                trend.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricCard;
