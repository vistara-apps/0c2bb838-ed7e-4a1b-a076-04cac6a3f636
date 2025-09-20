/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(210, 30%, 98%)',
        accent: 'hsl(40, 95%, 55%)',
        primary: 'hsl(204, 85%, 45%)',
        surface: 'hsl(210, 30%, 100%)',
        'text-primary': 'hsl(210, 20%, 15%)',
        'text-secondary': 'hsl(210, 15%, 45%)',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
        'sm': '4px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 20%, 0%, 0.08)',
      },
      spacing: {
        'lg': '16px',
        'md': '12px',
        'sm': '8px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
