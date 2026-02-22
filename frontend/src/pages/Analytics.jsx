import {
  PieChart,
  Pie,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useAnalytics } from '../hooks/useAnalytics';
import { mockAnalytics } from '../utils/mockData';
import { formatCurrency, getStatusChartColor, formatShortDate } from '../utils/helpers';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import SkeletonLoader from '../components/SkeletonLoader';

/**
 * Analytics dashboard page with charts and metrics
 * AI-generated component for analytics visualization
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
    volume: item.volume
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Volume Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(analytics.totalVolume)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Completed transactions only</p>
        </div>

        {/* Total Transactions Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {analytics.totalTransactions.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">All statuses included</p>
        </div>

        {/* Average Transaction Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Amount</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {formatCurrency(analytics.averageTransactionAmount)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-8 h-8 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Per completed transaction</p>
        </div>

        {/* Success Rate Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {analytics.successRate.toFixed(2)}%
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-500">Completed vs total</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Donut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Transactions by Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: <span className="font-medium">{item.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sources Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Sources by Count
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourcesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Transaction Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Over Time Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Volume Over Time
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip
              formatter={(value, name) => {
                if (name === 'volume') return formatCurrency(value);
                return value;
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="volume"
              stroke="#10b981"
              strokeWidth={2}
              name="Volume ($)"
              dot={{ r: 4 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Count"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
