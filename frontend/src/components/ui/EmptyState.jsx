/**
 * EmptyState Component
 * Display when no data is available
 * AI-generated: 100%
 */

import { motion } from 'framer-motion';
import { cn } from '../../styles/utils';
import { fadeIn, scaleIn } from '../../utils/animations';

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}) {
  return (
    <motion.div
      {...fadeIn}
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 px-6 text-center',
        className
      )}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          {...scaleIn}
          className="mb-4 p-4 rounded-full bg-gray-100"
        >
          <Icon className="w-8 h-8 text-gray-400" />
        </motion.div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}

      {/* Message */}
      {message && (
        <p className="text-sm text-gray-500 max-w-md mb-6">
          {message}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

export default EmptyState;
