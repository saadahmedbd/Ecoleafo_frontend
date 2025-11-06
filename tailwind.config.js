/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // supports dark mode via "dark" class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // scans all components/pages
  ],
  theme: {
    extend: {
      fontFamily: {
        // Set your custom font
        sans: ['"Your Super UI Designer"', 'ui-sans-serif', 'system-ui'],
        heading: ['"Your Super UI Designer"', 'ui-sans-serif', 'system-ui'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        background: '#ffffff',
        foreground: '#1f2937',
        card: '#ffffff',
        'card-foreground': '#1f2937',
        primary: '#059669',
        'primary-foreground': '#ffffff',
        secondary: '#f3f4f6',
        'secondary-foreground': '#1f2937',
        muted: '#f9fafb',
        'muted-foreground': '#6b7280',
        accent: '#f97316',
        'accent-foreground': '#ffffff',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
        border: '#e5e7eb',
        ring: '#059669',
        'seller-bg': '#FFF7E6',
      },
      borderRadius: {
        sm: '0.125rem',
        md: '0.375rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      outline: {
        ring: '2px solid rgba(99, 144, 216, 0.5)',
      },
    },
  },
  plugins: [],
};
