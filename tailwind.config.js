/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors (Blue)
        'primary-dark': '#1E40AF',
        'primary': '#3B82F6',
        'primary-light': '#DBEAFE',
        
        // Accent (Green)
        'accent': '#10B981',
        'accent-light': '#D1FAE5',
        
        // Neutral/Gray
        'bg-primary': '#F8FAFC',
        'bg-secondary': '#F1F5F9',
        'text-primary': '#1E293B',
        'text-muted': '#64748B',
        'border': '#E2E8F0',
        
        // Status colors
        'danger': '#EF4444',
        'danger-light': '#FEE2E2',
        'warning': '#F59E0B',
        'warning-light': '#FEF3C7',
        'success': '#10B981',
        'success-light': '#D1FAE5'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['32px', '40px']
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      boxShadow: {
        none: 'none',
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        soft: '0 6px 20px rgba(16, 24, 40, 0.08)'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '48px'
      }
    }
  },
  plugins: []
}
