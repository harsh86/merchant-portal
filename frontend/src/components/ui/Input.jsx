/**
 * Input Component
 * Text input with variants, icons, and validation states
 * AI-generated: 100%
 */

import { forwardRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../styles/utils';

const inputVariants = {
  default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
  error: 'border-error-500 focus:border-error-600 focus:ring-error-500',
  success: 'border-success-500 focus:border-success-600 focus:ring-success-500',
};

const inputSizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-5 text-lg',
};

export const Input = forwardRef(
  (
    {
      variant = 'default',
      size = 'md',
      leftIcon,
      rightIcon,
      onClear,
      error,
      helperText,
      label,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const showClearButton = onClear && props.value;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg border bg-white',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              'placeholder:text-gray-400',
              inputVariants[error ? 'error' : variant],
              inputSizes[size],
              leftIcon && 'pl-10',
              (rightIcon || showClearButton) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right Icon or Clear Button */}
          {showClearButton ? (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                {rightIcon}
              </div>
            )
          )}
        </div>

        {/* Helper Text or Error */}
        {(helperText || error) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              error ? 'text-error-600' : 'text-gray-500'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
