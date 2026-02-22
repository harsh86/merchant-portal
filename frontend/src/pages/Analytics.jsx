import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, TrendingUp, Target } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { mockAnalytics } from '../utils/mockData';
import { formatCurrency, getStatusChartColor, formatShortDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonLoader from '../components/SkeletonLoader';
import MetricCard from '../components/analytics/MetricCard';
import FilterBar from '../components/analytics/FilterBar';
import EnhancedDonutChart from '../components/analytics/EnhancedDonutChart';
import EnhancedAreaChart from '../components/analytics/EnhancedAreaChart';
import EnhancedBarChart from '../components/analytics/EnhancedBarChart';
import HeatmapChart from '../components/analytics/HeatmapChart';
import RadarChart from '../components/analytics/RadarChart';

/**
 * Analytics dashboard page with charts and metrics
 * Modernized with glassmorphism design and enhanced visualizations
 * AI-generated: 100%
 */
const Analytics = () => {
  // Fetch analytics using React Query (commented out for mock data)
  // const { data, isLoading, isError, error, refetch } = useAnalytics();

  // Use mock data for now
  const isLoading = false;
  const isError = false;
  const error = null;
  const data = { success: true, data: mockAnalytics };

  const analytics = data?.data || mockAnalytics;

  // Filter state
  const [activeFilters, setActiveFilters] = useState({
    dateRange: { start: null, end: null },
    status: [],
    source: []
  });

  // Generate mock previous period data for comparison (30% lower than current)
  const previousPeriodData = useMemo(() => ({
    totalVolume: analytics.totalVolume * 0.7,
    totalTransactions: analytics.totalTransactions * 0.75,
    averageTransactionAmount: analytics.averageTransactionAmount * 0.93,
    successRate: analytics.successRate * 0.95
  }), [analytics]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <SkeletonLoader key={idx} type="card" rows={3} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonLoader type="card" rows={5} />
          <SkeletonLoader type="card" rows={5} />
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <ErrorMessage
        message={error?.response?.data?.error?.message || 'Failed to load analytics'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Prepare data for status donut chart
  const statusData = Object.entries(analytics.countByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: getStatusChartColor(status)
  }));

  // Prepare data for volume over time chart
  const volumeData = analytics.volumeOverTime.map(item => ({
    date: formatShortDate(item.date),
    volume: item.volume,
    count: item.count
  }));

  // Prepare data for top sources bar chart
  const sourcesData = analytics.topSources.map(item => ({
    source: item.source.charAt(0).toUpperCase() + item.source.slice(1),
    count: item.count,
    volume: item.volume,
    percentage: (item.count / analytics.totalTransactions * 100).toFixed(1)
  }));

  // Prepare data for heatmap (last 90 days)
  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      // Generate random transaction count for demo
      const count = Math.floor(Math.random() * 100) + 10;
      data.push({
        date: date.toISOString().split('T')[0],
        count,
        value: count
      });
    }
    return data;
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    // In production, this would trigger a new API call with filters
    console.log('Filters updated:', filters);
  };

  // Handle filter removal
  const handleRemoveFilter = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].filter(v => v !== value)
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-b border-white/20 sticky top-0 z-40 shadow-lg"
      >
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Transaction Analytics
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Real-time insights and performance metrics
          </p>
        </div>
      </motion.div>

      <div className="p-6 space-y-6">
        {/* Filter Bar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={activeFilters}
          onRemoveFilter={handleRemoveFilter}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Volume"
            value={analytics.totalVolume}
            format="currency"
            icon={DollarSign}
            trend={30}
            subtitle="Completed transactions only"
            gradientFrom="from-green-500"
            gradientTo="to-emerald-600"
          />
          <MetricCard
            title="Total Transactions"
            value={analytics.totalTransactions}
            format="number"
            icon={CreditCard}
            trend={25}
            subtitle="All statuses included"
            gradientFrom="from-blue-500"
            gradientTo="to-indigo-600"
          />
          <MetricCard
            title="Average Amount"
            value={analytics.averageTransactionAmount}
            format="currency"
            decimals={2}
            icon={TrendingUp}
            trend={-7}
            subtitle="Per completed transaction"
            gradientFrom="from-purple-500"
            gradientTo="to-pink-600"
          />
          <MetricCard
            title="Success Rate"
            value={analytics.successRate}
            format="percentage"
            decimals={2}
            icon={Target}
            trend={5}
            subtitle="Completed vs total"
            gradientFrom="from-amber-500"
            gradientTo="to-orange-600"
          />
        </div>

        {/* Charts Row 1 - Status & Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Breakdown Donut Chart */}
          <EnhancedDonutChart
            data={statusData}
            title="Transactions by Status"
            subtitle="Distribution across all statuses"
          />

          {/* Top Sources Bar Chart */}
          <EnhancedBarChart
            data={sourcesData}
            title="Top Transaction Sources"
            subtitle="Leading sources by transaction count"
            dataKey="count"
            labelKey="source"
          />
        </div>

        {/* Volume Over Time Area Chart */}
        <EnhancedAreaChart
          data={volumeData}
          title="Transaction Volume Over Time"
          subtitle="Dual-axis view of volume and count"
        />

        {/* Charts Row 2 - Heatmap & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Heatmap */}
          <HeatmapChart
            data={heatmapData}
            title="Transaction Activity Heatmap"
            subtitle="Last 90 days of transaction density"
          />

          {/* Performance Radar Chart */}
          <RadarChart
            currentData={analytics}
            previousData={previousPeriodData}
            title="Performance Comparison"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
