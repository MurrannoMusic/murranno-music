/**
 * NativeWind Tailwind Configuration
 * Pixel-perfect match with web Tailwind config
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    container: {
      center: true,
      padding: 32,
      screens: {
        '2xl': 1400,
      },
    },
    extend: {
      colors: {
        border: 'rgb(30, 41, 59)',
        input: 'rgb(30, 41, 59)',
        ring: 'rgb(124, 58, 237)',
        background: 'rgb(8, 12, 21)',
        foreground: 'rgb(248, 250, 252)',
        primary: {
          DEFAULT: 'rgb(124, 58, 237)',
          foreground: 'rgb(248, 250, 252)',
          glow: 'rgb(156, 89, 255)',
        },
        secondary: {
          DEFAULT: 'rgb(30, 41, 59)',
          foreground: 'rgb(226, 232, 240)',
        },
        muted: {
          DEFAULT: 'rgb(26, 36, 51)',
          foreground: 'rgb(148, 163, 184)',
        },
        accent: {
          DEFAULT: 'rgb(139, 92, 246)',
          foreground: 'rgb(248, 250, 252)',
        },
        card: {
          DEFAULT: 'rgb(14, 21, 36)',
          foreground: 'rgb(248, 250, 252)',
        },
        popover: {
          DEFAULT: 'rgb(14, 21, 36)',
          foreground: 'rgb(248, 250, 252)',
        },
        destructive: {
          DEFAULT: 'rgb(127, 29, 29)',
          foreground: 'rgb(248, 250, 252)',
        },
        success: {
          DEFAULT: 'rgb(34, 197, 94)',
          foreground: 'rgb(248, 250, 252)',
        },
        warning: {
          DEFAULT: 'rgb(245, 158, 11)',
          foreground: 'rgb(248, 250, 252)',
        },
        sidebar: {
          DEFAULT: 'rgb(10, 15, 26)',
          foreground: 'rgb(248, 250, 252)',
          primary: 'rgb(124, 58, 237)',
          'primary-foreground': 'rgb(248, 250, 252)',
          accent: 'rgb(30, 41, 59)',
          'accent-foreground': 'rgb(226, 232, 240)',
          border: 'rgb(30, 41, 59)',
          ring: 'rgb(124, 58, 237)',
        },
      },
      borderRadius: {
        sm: 8,
        md: 12,
        DEFAULT: 16,
        lg: 24,
        xl: 28,
        '2xl': 32,
        '3xl': 48,
        full: 9999,
      },
      fontFamily: {
        sans: ['SF Pro Display', 'System'],
      },
    },
  },
  plugins: [],
};
