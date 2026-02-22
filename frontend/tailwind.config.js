/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'status-completed': '#10b981',
        'status-pending': '#f59e0b',
        'status-failed': '#ef4444',
        'status-processing': '#3b82f6',
        'status-refunded': '#8b5cf6',
        'status-cancelled': '#6b7280',
      },
    },
  },
  plugins: [],
}
