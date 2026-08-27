/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f6f3',
          100: '#edeae3',
          200: '#d9d4c8',
          300: '#c0b8a6',
          400: '#a39682',
          500: '#8a7d68',
          600: '#6f6454',
          700: '#5a5145',
          800: '#4a4339',
          900: '#3d3830',
          950: '#211e1a',
        },
        accent: {
          DEFAULT: '#e85d4c',
          light: '#ff7a6b',
          dark: '#c94435',
        },
        sage: {
          DEFAULT: '#5a8f7b',
          light: '#7ab39c',
          dark: '#3d6b59',
        },
      },
      boxShadow: {
        postcard: '0 4px 20px rgba(33, 30, 26, 0.12), 0 1px 3px rgba(33, 30, 26, 0.08)',
        'postcard-hover': '0 12px 40px rgba(33, 30, 26, 0.18), 0 4px 8px rgba(33, 30, 26, 0.1)',
      },
    },
  },
  plugins: [],
};
