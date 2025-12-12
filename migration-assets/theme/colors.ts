/**
 * Color System - React Native
 * Matches the CSS variables from index.css
 */

// Helper to convert HSL to RGB for React Native
const hslToRgb = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return `rgb(${f(0)}, ${f(8)}, ${f(4)})`;
};

// Helper to create RGBA from HSL
const hslToRgba = (h: number, s: number, l: number, a: number): string => {
  s /= 100;
  l /= 100;
  const alpha = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - alpha * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color);
  };
  return `rgba(${f(0)}, ${f(8)}, ${f(4)}, ${a})`;
};

export const colors = {
  dark: {
    // Core Colors
    background: 'rgb(8, 12, 21)',           // 222 84% 5%
    foreground: 'rgb(248, 250, 252)',       // 210 40% 98%
    
    // Card
    card: 'rgb(14, 21, 36)',                // 222 84% 8%
    cardForeground: 'rgb(248, 250, 252)',   // 210 40% 98%
    
    // Popover
    popover: 'rgb(14, 21, 36)',             // 222 84% 8%
    popoverForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    
    // Primary - Modern Purple
    primary: 'rgb(124, 58, 237)',           // 263 70% 50%
    primaryForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    primaryGlow: 'rgb(156, 89, 255)',       // 263 85% 60%
    
    // Secondary - Dark Cards
    secondary: 'rgb(30, 41, 59)',           // 217 32% 17%
    secondaryForeground: 'rgb(226, 232, 240)', // 210 40% 90%
    
    // Muted
    muted: 'rgb(26, 36, 51)',               // 217 32% 15%
    mutedForeground: 'rgb(148, 163, 184)',  // 215 20% 65%
    
    // Accent - Bright Purple
    accent: 'rgb(139, 92, 246)',            // 262 83% 58%
    accentForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    
    // Destructive
    destructive: 'rgb(127, 29, 29)',        // 0 62% 30%
    destructiveForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    
    // Border & Input
    border: 'rgb(30, 41, 59)',              // 217 32% 17%
    input: 'rgb(30, 41, 59)',               // 217 32% 17%
    ring: 'rgb(124, 58, 237)',              // 263 70% 50%
    
    // Status Colors
    success: 'rgb(34, 197, 94)',            // 142 71% 45%
    successForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    warning: 'rgb(245, 158, 11)',           // 38 92% 50%
    warningForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    
    // Sidebar
    sidebar: 'rgb(10, 15, 26)',             // 222 84% 6%
    sidebarForeground: 'rgb(248, 250, 252)', // 210 40% 98%
    sidebarPrimary: 'rgb(124, 58, 237)',    // 263 70% 50%
    sidebarAccent: 'rgb(30, 41, 59)',       // 217 32% 17%
    sidebarBorder: 'rgb(30, 41, 59)',       // 217 32% 17%
  },
  
  light: {
    // Core Colors
    background: 'rgb(250, 250, 250)',       // 0 0% 98%
    foreground: 'rgb(8, 12, 21)',           // 222 84% 4%
    
    // Card
    card: 'rgb(255, 255, 255)',             // 0 0% 100%
    cardForeground: 'rgb(8, 12, 21)',       // 222 84% 4%
    
    // Popover
    popover: 'rgb(255, 255, 255)',          // 0 0% 100%
    popoverForeground: 'rgb(8, 12, 21)',    // 222 84% 4%
    
    // Primary - Modern Purple
    primary: 'rgb(124, 58, 237)',           // 263 70% 50%
    primaryForeground: 'rgb(250, 250, 250)', // 0 0% 98%
    primaryGlow: 'rgb(156, 89, 255)',       // 263 85% 60%
    
    // Secondary
    secondary: 'rgb(241, 245, 249)',        // 210 40% 95%
    secondaryForeground: 'rgb(15, 23, 42)', // 222 84% 10%
    
    // Muted
    muted: 'rgb(241, 245, 249)',            // 210 40% 96%
    mutedForeground: 'rgb(100, 116, 139)',  // 215 16% 47%
    
    // Accent - Bright Purple
    accent: 'rgb(139, 92, 246)',            // 262 83% 58%
    accentForeground: 'rgb(250, 250, 250)', // 0 0% 98%
    
    // Destructive
    destructive: 'rgb(239, 68, 68)',        // 0 84% 60%
    destructiveForeground: 'rgb(250, 250, 250)', // 0 0% 98%
    
    // Border & Input
    border: 'rgb(226, 232, 240)',           // 214 32% 91%
    input: 'rgb(226, 232, 240)',            // 214 32% 91%
    ring: 'rgb(124, 58, 237)',              // 263 70% 50%
    
    // Status Colors
    success: 'rgb(34, 197, 94)',            // 142 71% 45%
    successForeground: 'rgb(250, 250, 250)', // 0 0% 98%
    warning: 'rgb(245, 158, 11)',           // 38 92% 50%
    warningForeground: 'rgb(250, 250, 250)', // 0 0% 98%
    
    // Sidebar
    sidebar: 'rgb(250, 250, 250)',          // 0 0% 98%
    sidebarForeground: 'rgb(8, 12, 21)',    // 222 84% 4%
    sidebarPrimary: 'rgb(124, 58, 237)',    // 263 70% 50%
    sidebarAccent: 'rgb(241, 245, 249)',    // 210 40% 95%
    sidebarBorder: 'rgb(226, 232, 240)',    // 214 32% 91%
  },
  
  // Opacity variants for both themes
  opacity: {
    10: 0.1,
    15: 0.15,
    20: 0.2,
    30: 0.3,
    40: 0.4,
    50: 0.5,
    60: 0.6,
    70: 0.7,
    80: 0.8,
    90: 0.9,
  },
};

// Gradient definitions (for LinearGradient component)
export const gradients = {
  primary: {
    colors: ['rgb(124, 58, 237)', 'rgb(139, 92, 246)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  secondary: {
    colors: ['rgb(30, 41, 59)', 'rgb(14, 21, 36)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  accent: {
    colors: ['rgb(139, 92, 246)', 'rgb(156, 89, 255)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  dark: {
    colors: ['rgb(8, 12, 21)', 'rgb(26, 36, 51)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  mesh: {
    colors: ['rgba(124, 58, 237, 0.1)', 'rgba(14, 21, 36, 0.8)', 'rgb(8, 12, 21)'],
    locations: [0, 0.5, 1],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },
};

export type ColorScheme = 'dark' | 'light';
export type ThemeColors = typeof colors.dark;
