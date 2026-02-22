/**
 * Style Utility Functions
 * Helper for conditional class merging with Tailwind
 * AI-generated: 100%
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with proper precedence
 * Combines clsx for conditional classes and tailwind-merge for proper overrides
 *
 * @param {...any} inputs - Class names to merge
 * @returns {string} Merged class string
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-blue-500', 'px-6') // px-6 wins over px-4
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Create variant classes helper
 * Useful for component variants
 *
 * @param {Object} variants - Object mapping variant names to class strings
 * @param {string} defaultVariant - Default variant key
 * @returns {Function} Function that returns classes for a variant
 *
 * @example
 * const buttonVariants = createVariants({
 *   primary: 'bg-blue-500 text-white',
 *   secondary: 'bg-gray-200 text-gray-900'
 * }, 'primary');
 *
 * buttonVariants('secondary') // Returns 'bg-gray-200 text-gray-900'
 */
export function createVariants(variants, defaultVariant) {
  return (variant = defaultVariant, className = '') => {
    return cn(variants[variant] || variants[defaultVariant], className);
  };
}

/**
 * Create responsive class helper
 * Generate responsive classes based on breakpoints
 *
 * @param {Object} breakpoints - Object with breakpoint keys and class values
 * @returns {string} Responsive class string
 *
 * @example
 * responsive({ base: 'text-sm', md: 'text-base', lg: 'text-lg' })
 * // Returns: 'text-sm md:text-base lg:text-lg'
 */
export function responsive(breakpoints) {
  const { base, ...rest } = breakpoints;
  const classes = [base];

  Object.entries(rest).forEach(([breakpoint, value]) => {
    classes.push(`${breakpoint}:${value}`);
  });

  return classes.filter(Boolean).join(' ');
}

/**
 * Data attribute helper
 * Convert object to data attributes string
 *
 * @param {Object} data - Object with data attribute key-value pairs
 * @returns {Object} Object with data-* attributes
 *
 * @example
 * dataAttr({ state: 'active', index: 0 })
 * // Returns: { 'data-state': 'active', 'data-index': 0 }
 */
export function dataAttr(data) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[`data-${key}`] = value;
    return acc;
  }, {});
}

/**
 * Focus ring utility
 * Standard focus ring classes for accessibility
 *
 * @param {string} color - Ring color (default: 'primary-500')
 * @returns {string} Focus ring classes
 */
export function focusRing(color = 'primary-500') {
  return cn(
    'focus:outline-none focus-visible:outline-none',
    `focus-visible:ring-2 focus-visible:ring-${color} focus-visible:ring-offset-2`
  );
}

/**
 * Disabled state utility
 * Standard disabled classes
 *
 * @returns {string} Disabled classes
 */
export function disabledState() {
  return 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';
}

/**
 * Truncate text utility
 * Create truncate classes with line clamp
 *
 * @param {number} lines - Number of lines to show
 * @returns {string} Truncate classes
 */
export function truncate(lines = 1) {
  if (lines === 1) {
    return 'truncate';
  }
  return `line-clamp-${lines}`;
}

/**
 * Safe area insets
 * Handle mobile safe areas (notches)
 *
 * @param {string} side - Which side (top, bottom, left, right)
 * @returns {Object} Style object with safe area
 */
export function safeArea(side) {
  const map = {
    top: { paddingTop: 'env(safe-area-inset-top)' },
    bottom: { paddingBottom: 'env(safe-area-inset-bottom)' },
    left: { paddingLeft: 'env(safe-area-inset-left)' },
    right: { paddingRight: 'env(safe-area-inset-right)' }
  };
  return map[side] || {};
}

export default cn;
