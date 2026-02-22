/**
 * Spinner Component
 * Loading indicator
 * AI-generated: 100%
 */

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../styles/utils';

const spinnerSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export const Spinner = forwardRef(({
  size = 'md',
  className,
  ...props
}, ref) => {
  return (
    <Loader2
      ref={ref}
      className={cn(
        'animate-spin text-primary-600',
        spinnerSizes[size],
        className
      )}
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

// Centered spinner for full page loading
export const SpinnerOverlay = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="xl" />
        {message && (
          <p className="mt-4 text-gray-600 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
