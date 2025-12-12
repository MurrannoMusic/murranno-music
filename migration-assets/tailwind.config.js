/**
 * NativeWind Tailwind Configuration
 * Matches the web Tailwind config for React Native
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Core colors
        border: 'rgb(30, 41, 59)',
        input: 'rgb(30, 41, 59)',
        ring: 'rgb(124, 58, 237)',
        background: 'rgb(8, 12, 21)',
        foreground: 'rgb(248, 250, 252)',
        
        // Primary
        primary: {
          DEFAULT: 'rgb(124, 58, 237)',
          foreground: 'rgb(248, 250, 252)',
          glow: 'rgb(156, 89, 255)',
        },
        
        // Secondary
        secondary: {
          DEFAULT: 'rgb(30, 41, 59)',
          foreground: 'rgb(226, 232, 240)',
        },
        
        // Muted
        muted: {
          DEFAULT: 'rgb(26, 36, 51)',
          foreground: 'rgb(148, 163, 184)',
        },
        
        // Accent
        accent: {
          DEFAULT: 'rgb(139, 92, 246)',
          foreground: 'rgb(248, 250, 252)',
        },
        
        // Card
        card: {
          DEFAULT: 'rgb(14, 21, 36)',
          foreground: 'rgb(248, 250, 252)',
        },
        
        // Destructive
        destructive: {
          DEFAULT: 'rgb(127, 29, 29)',
          foreground: 'rgb(248, 250, 252)',
        },
        
        // Popover
        popover: {
          DEFAULT: 'rgb(14, 21, 36)',
          foreground: 'rgb(248, 250, 252)',
        },
        
        // Status colors
        success: {
          DEFAULT: 'rgb(34, 197, 94)',
          foreground: 'rgb(248, 250, 252)',
        },
        warning: {
          DEFAULT: 'rgb(245, 158, 11)',
          foreground: 'rgb(248, 250, 252)',
        },
      },
      
      borderRadius: {
        none: 0,
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
      
      fontSize: {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
      },
    },
  },
  plugins: [],
};
