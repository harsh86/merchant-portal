/**
 * Shared chart configuration and styling
 * Contemporary design tokens for all charts
 */

// Color palette for charts with gradients
export const chartColors = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    gradient: ['#3b82f6', '#8b5cf6'],
  },
  secondary: {
    main: '#8b5cf6',
    light: '#a78bfa',
    dark: '#7c3aed',
    gradient: ['#8b5cf6', '#ec4899'],
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    gradient: ['#10b981', '#14b8a6'],
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: ['#f59e0b', '#ef4444'],
  },
  danger: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    gradient: ['#ef4444', '#991b1b'],
  },
  info: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    gradient: ['#06b6d4', '#3b82f6'],
  },
};

// Status colors for transactions
export const statusColors = {
  completed: chartColors.success.main,
  pending: chartColors.warning.main,
  failed: chartColors.danger.main,
  processing: chartColors.primary.main,
  refunded: chartColors.secondary.main,
  cancelled: '#6b7280',
};

// Chart animations
export const chartAnimations = {
  animationBegin: 0,
  animationDuration: 1000,
  animationEasing: 'ease-in-out',
};

// Custom tooltip styling
export const customTooltipStyle = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '12px 16px',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
};

// Grid styling
export const gridStyle = {
  stroke: 'rgba(148, 163, 184, 0.1)',
  strokeDasharray: '3 3',
};

// Axis styling
export const axisStyle = {
  tick: { fill: '#94a3b8', fontSize: 12 },
  axisLine: { stroke: 'rgba(148, 163, 184, 0.2)' },
  tickLine: { stroke: 'rgba(148, 163, 184, 0.2)' },
};

// Legend styling
export const legendStyle = {
  wrapperStyle: {
    paddingTop: '20px',
  },
  iconType: 'circle',
};

// Gradient definitions for charts
export const gradientDefs = [
  {
    id: 'colorVolume',
    colors: [
      { offset: '0%', color: chartColors.success.main, opacity: 0.8 },
      { offset: '95%', color: chartColors.success.main, opacity: 0.1 },
    ],
  },
  {
    id: 'colorCount',
    colors: [
      { offset: '0%', color: chartColors.primary.main, opacity: 0.8 },
      { offset: '95%', color: chartColors.primary.main, opacity: 0.1 },
    ],
  },
  {
    id: 'colorRevenue',
    colors: [
      { offset: '0%', color: chartColors.secondary.main, opacity: 0.8 },
      { offset: '95%', color: chartColors.secondary.main, opacity: 0.1 },
    ],
  },
];

// Responsive chart heights
export const chartHeights = {
  small: 250,
  medium: 320,
  large: 400,
  extraLarge: 500,
};

// Chart margin defaults
export const chartMargins = {
  default: { top: 10, right: 30, left: 0, bottom: 0 },
  withAxis: { top: 10, right: 40, left: 40, bottom: 20 },
  compact: { top: 5, right: 10, left: 0, bottom: 5 },
};

// Generate gradient for SVG
export const createGradient = (id, colors) => (
  <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
    {colors.map((color, index) => (
      <stop
        key={index}
        offset={color.offset}
        stopColor={color.color}
        stopOpacity={color.opacity}
      />
    ))}
  </linearGradient>
);

// Custom active dot styling for line charts
export const activeDotStyle = {
  r: 6,
  strokeWidth: 2,
  stroke: '#fff',
};

// Bar chart styling
export const barChartStyle = {
  radius: [8, 8, 0, 0],
  maxBarSize: 60,
};

// Donut chart styling
export const donutChartStyle = {
  innerRadius: '60%',
  outerRadius: '85%',
  paddingAngle: 3,
  cornerRadius: 8,
};

// Export all as default for easy import
export default {
  chartColors,
  statusColors,
  chartAnimations,
  customTooltipStyle,
  gridStyle,
  axisStyle,
  legendStyle,
  gradientDefs,
  chartHeights,
  chartMargins,
  createGradient,
  activeDotStyle,
  barChartStyle,
  donutChartStyle,
};
