/**
 * AI Impact & DORA Metrics Dashboard
 * AI-generated single-page dashboard with real-time metrics visualization
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useCombinedMetrics } from '../hooks/useMetrics';
import MetricCard from '../components/MetricCard';
import LiveIndicator from '../components/LiveIndicator';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const MetricsDashboard = () => {
  const { data, isLoading, error, dataUpdatedAt } = useCombinedMetrics();
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(dataUpdatedAt);
    }
  }, [dataUpdatedAt]);

  // Color schemes
  const COLORS = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    teal: '#14B8A6'
  };

  const PIE_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

  // Memoized chart data
  const timelineData = useMemo(() => {
    return data?.aiImpact?.timeline || [];
  }, [data]);

  const deploymentHistoryData = useMemo(() => {
    return data?.dora?.deploymentHistory || [];
  }, [data]);

  const leadTimeData = useMemo(() => {
    return data?.dora?.leadTimeByFeature || [];
  }, [data]);

  const failureTimelineData = useMemo(() => {
    return data?.dora?.failureTimeline || [];
  }, [data]);

  const codeBreakdownData = useMemo(() => {
    if (!data?.aiImpact?.codeBreakdown) return [];
    return [
      { name: 'AI Generated', value: data.aiImpact.codeBreakdown.aiGenerated },
      { name: 'Human Written', value: data.aiImpact.codeBreakdown.humanWritten || 0 }
    ];
  }, [data]);

  const timeSavedByComponentData = useMemo(() => {
    if (!data?.aiImpact?.timeSavedByComponent) return [];
    const components = data.aiImpact.timeSavedByComponent;
    return [
      { name: 'Backend', hours: components.backend },
      { name: 'Frontend', hours: components.frontend },
      { name: 'Infrastructure', hours: components.infrastructure },
      { name: 'Testing', hours: components.testing }
    ];
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error.message || 'Failed to load metrics'} />
      </div>
    );
  }

  const aiImpact = data?.aiImpact || {};
  const dora = data?.dora || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header with Live Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Impact & DORA Metrics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time engineering productivity and deployment metrics
            </p>
          </div>
          <LiveIndicator lastUpdated={lastUpdated} refreshInterval={30000} />
        </motion.div>

        {/* Section 1: AI Impact Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Lines AI-Generated"
            value={aiImpact.totalLinesGenerated?.toLocaleString() || '0'}
            subtitle={`${aiImpact.aiPercentage || 0}% AI-generated code`}
            color="blue"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            }
          />
          <MetricCard
            title="Total Time Saved"
            value={`${aiImpact.timeSavedHours || 0}h`}
            subtitle="Development time saved"
            color="green"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Productivity Multiplier"
            value={`${aiImpact.productivityMultiplier || 0}x`}
            subtitle="Faster with AI assistance"
            color="purple"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
          <MetricCard
            title="Active AI Agents"
            value={aiImpact.activeAgents || 0}
            subtitle="Contributing to codebase"
            color="orange"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        {/* Section 2: DORA Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Deployment Frequency"
            value={`${dora.deploymentFrequency?.value || 0}`}
            subtitle={`${dora.deploymentFrequency?.unit || 'per week'} (${dora.deploymentFrequency?.status || 'high'})`}
            trend={dora.deploymentFrequency?.trend}
            color="blue"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            }
          />
          <MetricCard
            title="Lead Time for Changes"
            value={`${dora.leadTime?.average?.toFixed(1) || 0}`}
            subtitle={`${dora.leadTime?.unit || 'days'} average (${dora.leadTime?.status || 'medium'})`}
            color="teal"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <MetricCard
            title="Change Failure Rate"
            value={`${dora.changeFailureRate?.percentage || 0}%`}
            subtitle={`Status: ${dora.changeFailureRate?.status || 'good'}`}
            color={dora.changeFailureRate?.percentage > 15 ? 'orange' : 'green'}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Mean Time to Restore"
            value={`${dora.mttr?.average?.toFixed(1) || 0}h`}
            subtitle={`Status: ${dora.mttr?.status || 'good'}`}
            color="pink"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
        </div>

        {/* Section 3: AI Impact Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI-generated lines over time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              AI-Generated Lines Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Line type="monotone" dataKey="aiLines" stroke={COLORS.primary} strokeWidth={2} name="AI Lines" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Code breakdown donut chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              AI vs Human Code Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={codeBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {codeBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Time saved by component */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Time Saved by Component
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeSavedByComponentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="hours" fill={COLORS.success} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Cumulative time saved trend */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Cumulative Time Saved Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorTimeSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Area
                  type="monotone"
                  dataKey="aiLines"
                  stroke={COLORS.purple}
                  fillOpacity={1}
                  fill="url(#colorTimeSaved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Section 4: DORA Metrics Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deployment frequency over time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Deployment Frequency Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deploymentHistoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Line type="monotone" dataKey="count" stroke={COLORS.teal} strokeWidth={2} name="Deployments" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Lead time by feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Lead Time by Feature
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leadTimeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" stroke="#6B7280" />
                <YAxis dataKey="feature" type="category" stroke="#6B7280" width={150} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Bar dataKey="hours" fill={COLORS.primary} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Change success vs failure rate */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Change Success vs Failure Rate
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={failureTimelineData}>
                <defs>
                  <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.success} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFailure" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.danger} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={COLORS.danger} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: 'none' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="success"
                  stackId="1"
                  stroke={COLORS.success}
                  fill="url(#colorSuccess)"
                  name="Successful"
                />
                <Area
                  type="monotone"
                  dataKey="failure"
                  stackId="1"
                  stroke={COLORS.danger}
                  fill="url(#colorFailure)"
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Section 5: Velocity & Quality Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Commits per Day"
            value={aiImpact.commitsByDay?.toFixed(1) || '0.0'}
            subtitle="Average daily commits"
            color="blue"
          />
          <MetricCard
            title="PRs per Week"
            value={aiImpact.prsByWeek || '0'}
            subtitle="Pull requests created"
            color="purple"
          />
          <MetricCard
            title="Average PR Size"
            value="245"
            subtitle="Lines changed per PR"
            color="teal"
          />
        </div>

        {/* Section 6: Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 border border-white/20 rounded-2xl p-6 shadow-2xl"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {(aiImpact.recentCommits || []).slice(0, 10).map((commit, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-4 p-4 bg-white/40 dark:bg-gray-700/40 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/60 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-mono text-sm">
                    {commit.hash?.substring(0, 2) || 'AI'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {commit.message || 'No message'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {commit.author || 'Unknown'} • {commit.aiGenerated || 0}% AI-generated
                    {commit.timeSaved > 0 && ` • ${commit.timeSaved}h saved`}
                  </p>
                </div>
                <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  {commit.date ? new Date(commit.date).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MetricsDashboard;
