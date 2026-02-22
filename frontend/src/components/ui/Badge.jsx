/**
 * Badge Component
 * Status indicators with semantic colors
 * AI-generated: 100%
 */

import { forwardRef } from 'react';
import { cn } from '../../styles/utils';

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  error: 'bg-error-100 text-error-700',
  info: 'bg-info-100 text-info-700',
  purple: 'bg-accent-purple-100 text-accent-purple-700',
  // Legacy status colors
  completed: 'bg-success-100 text-success-700',
  pending: 'bg-warning-100 text-warning-700',
  failed: 'bg-error-100 text-error-700',
  processing: 'bg-primary-100 text-primary-700',
  refunded: 'bg-accent-purple-100 text-accent-purple-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
  lg: 'px-3 py-1 text-base',
};

export const Badge = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
