/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-red': '#EF4444',
        'secondary-red': '#DC2626',
        'primary-black': '#1F2937',
        'secondary-black': '#374151',
        'text-light': '#F9FAFB',
        'text-dark': '#D1D5DB',
        'background-light': '#111827',
        'background-dark': '#000000',
        'background-dark-transparent': 'rgba(0, 0, 0, 0.8)',
        'border-color': '#4B5563',
      },
    },
  },
  // Add safelist to ensure colors are always generated
  safelist: [
    'bg-primary-red', 'hover:bg-secondary-red',
    'bg-primary-black', 'hover:bg-secondary-black',
    'bg-text-light', 'hover:bg-text-dark',
    'text-primary-red', 'text-secondary-red',
    'text-primary-black', 'text-secondary-black',
    'text-text-light', 'text-text-dark',
    'bg-background-light', 'bg-background-dark', 'bg-background-dark-transparent',
    'border-border-color',
  ],
  plugins: [],
}
