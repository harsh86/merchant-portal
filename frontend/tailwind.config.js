import tokens from './src/styles/tokens.js';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Inject design tokens
      colors: {
        ...tokens.colors,
        // Legacy status colors for backward compatibility
        'status-completed': tokens.colors.success[500],
        'status-pending': tokens.colors.warning[500],
        'status-failed': tokens.colors.error[500],
        'status-processing': tokens.colors.primary[500],
        'status-refunded': tokens.colors.accent.purple[500],
        'status-cancelled': tokens.colors.gray[500],
      },
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize,
      fontWeight: tokens.typography.fontWeight,
      letterSpacing: tokens.typography.letterSpacing,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      boxShadow: tokens.elevation,
      zIndex: tokens.zIndex,
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-out',
        'fade-out': 'fadeOut 250ms ease-in',
        'slide-up': 'slideUp 300ms ease-out',
        'slide-down': 'slideDown 300ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'scale-in': 'scaleIn 200ms ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 1s ease-in-out infinite',
      },
      keyframes: tokens.animation.keyframes,
    },
  },
  plugins: [
    require('@tailwindcss/typography'),

    // Custom glassmorphism utilities
    plugin(function({ addUtilities }) {
      addUtilities({
        '.glass': {
          'background': 'rgba(255, 255, 255, 0.7)',
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'border': '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.glass-strong': {
          'background': 'rgba(255, 255, 255, 0.9)',
          'backdrop-filter': 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
          'border': '1px solid rgba(255, 255, 255, 0.25)',
        },
        '.glass-subtle': {
          'background': 'rgba(255, 255, 255, 0.5)',
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
      });
    }),
  ],
}
