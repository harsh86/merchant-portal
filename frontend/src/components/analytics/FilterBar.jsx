import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Filter, X, Download, RefreshCw } from 'lucide-react';

/**
 * Glassmorphic filter bar with sticky positioning
 * Features: date range picker, active filters, export functionality
 */
const FilterBar = ({ onFilterChange, onExport, onRefresh }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [dateRange, setDateRange] = useState('7d');
  const [showFilters, setShowFilters] = useState(false);

  const dateRangeOptions = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    onFilterChange?.({ dateRange: value });
  };

  const handleRemoveFilter = (filterId) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setDateRange('7d');
    onFilterChange?.({ dateRange: '7d' });
  };

  return (
    <div className="sticky top-0 z-30 mb-6">
      {/* Main filter bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Date range selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2">
              {dateRangeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleDateRangeChange(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    dateRange === option.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200"
              title="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all duration-200 hover:rotate-180 transform"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Export */}
            <button
              onClick={onExport}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-medium shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Active filters */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">Active filters:</span>
                {activeFilters.map((filter) => (
                  <motion.div
                    key={filter.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm"
                  >
                    <span>{filter.label}</span>
                    <button
                      onClick={() => handleRemoveFilter(filter.id)}
                      className="hover:bg-blue-500/30 rounded p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                <button
                  onClick={handleClearAll}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear all
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Extended filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Status
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-blue-500 focus:outline-none transition-colors">
                    <option>All Statuses</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Source
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-blue-500 focus:outline-none transition-colors">
                    <option>All Sources</option>
                    <option>Stripe</option>
                    <option>PayPal</option>
                    <option>Square</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount Range
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 focus:border-blue-500 focus:outline-none transition-colors">
                    <option>All Amounts</option>
                    <option>Under $100</option>
                    <option>$100 - $1,000</option>
                    <option>Over $1,000</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FilterBar;
