import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import aspectRatio from '@tailwindcss/aspect-ratio'

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,vue,html}',
    './public/**/*.{html,js}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'SF Pro', 'Segoe UI', 'Arial', 'sans-serif'],
      mono: ['Fira Mono', 'Menlo', 'Monaco', 'monospace'],
      body: ['Inter', 'sans-serif'],
      heading: ['Inter', 'sans-serif'],
      label: ['Inter', 'sans-serif'],
      caption: ['Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: '#F8F9FA',
          dark: '#181A1B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#23272F',
        },
        surface2: {
          DEFAULT: '#F8F9FA',
          dark: '#2C3138',
        },
        card: {
          DEFAULT: '#FFFFFF',
          dark: '#23272F',
        },
        primary: {
          DEFAULT: '#007BFF',
          dark: '#339AF0',
        },
        accent: {
          blue: '#007BFF',
          green: '#28A745',
          purple: '#6F42C1',
        },
        error: '#DC3545',
        warning: '#FFC107',
        text: {
          primary: '#212529',
          secondary: '#6C757D',
          muted: '#6C757D',
          subtle: '#ADB5BD',
        },
      },
      borderRadius: {
        'btn': '12px',
        'card': '16px',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'btn': '0 4px 16px rgba(0, 208, 86, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-lg': '0 4px 24px 0 rgba(44, 51, 58, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'h2': ['2rem', { lineHeight: '1.25', fontWeight: '500' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      transitionProperty: {
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
    },
  },
  safelist: [
    'bg-blue-600', 'bg-green-500', 'bg-purple-600', 'bg-gray-100', 'bg-gray-700',
    'text-blue-600', 'text-green-500', 'text-purple-600', 'text-gray-500', 'text-gray-400',
    'dark:bg-gray-800', 'dark:text-blue-400', 'dark:text-gray-100', 'dark:text-gray-400',
    'hover:shadow-lg', 'transition-shadow', 'rounded-xl', 'rounded-2xl',
    'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500',
  ],
  plugins: [
    typography,
    forms,
    aspectRatio,
  ],
}; 