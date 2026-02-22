/**
 * Live Indicator Component
 * AI-generated pulsing indicator for real-time dashboard status
 */

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const LiveIndicator = ({ lastUpdated, refreshInterval = 30000 }) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - (lastUpdated || Date.now());
      const remaining = Math.max(0, Math.ceil((refreshInterval - elapsed) / 1000));
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated, refreshInterval]);

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Just now';
    const seconds = Math.floor((Date.now() - lastUpdated) / 1000);
    if (seconds < 10) return 'Just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <motion.div
            className="absolute inset-0 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          LIVE
        </span>
      </div>

      <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>

      <div className="text-sm text-gray-600 dark:text-gray-400">
        Last updated: <span className="font-medium">{formatLastUpdated()}</span>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-500">
        Next refresh: <span className="font-medium text-blue-600 dark:text-blue-400">{countdown}s</span>
      </div>
    </div>
  );
};

export default LiveIndicator;
