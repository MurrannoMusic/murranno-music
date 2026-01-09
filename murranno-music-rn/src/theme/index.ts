/**
 * Murranno Music - Theme Colors
 * Matching web app exactly
 */

export const colors = {
  // Core colors
  background: '#050810',       // hsl(222, 84%, 5%)
  foreground: '#F8FAFC',       // hsl(210, 40%, 98%)
  
  // Card
  card: '#0C1220',             // hsl(222, 84%, 8%)
  cardForeground: '#F8FAFC',
  
  // Primary - Purple
  primary: '#7C3AED',          // hsl(263, 70%, 50%)
  primaryForeground: '#F8FAFC',
  primaryGlow: '#8B5CF6',      // hsl(263, 85%, 60%)
  primaryLight: '#A78BFA',
  primaryDark: '#6D28D9',
  
  // Secondary
  secondary: '#1E293B',        // hsl(217, 32%, 17%)
  secondaryForeground: '#E2E8F0',
  
  // Muted
  muted: '#1E293B',
  mutedForeground: '#94A3B8',  // hsl(215, 20%, 65%)
  
  // Accent
  accent: '#8B5CF6',           // hsl(262, 83%, 58%)
  accentForeground: '#F8FAFC',
  
  // Destructive
  destructive: '#EF4444',
  destructiveForeground: '#F8FAFC',
  
  // Border
  border: '#1E293B',
  borderLight: '#334155',
  
  // Status colors
  success: '#22C55E',
  successForeground: '#F8FAFC',
  successLight: '#4ADE80',
  
  warning: '#F59E0B',
  warningForeground: '#F8FAFC',
  
  info: '#3B82F6',
  infoForeground: '#F8FAFC',
  
  // Ring
  ring: '#7C3AED',
  
  // Input
  input: '#1E293B',
  inputForeground: '#F8FAFC',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Gradients (as tuples for LinearGradient)
  gradientPrimary: ['#7C3AED', '#8B5CF6'] as const,
  gradientAccent: ['#8B5CF6', '#A78BFA'] as const,
  gradientDark: ['#050810', '#0C1220'] as const,
  gradientSuccess: ['#22C55E', '#4ADE80'] as const,
  gradientWarning: ['#F59E0B', '#FBBF24'] as const,
};

// Type exports for gradient arrays
export type GradientColors = readonly [string, string];

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  display: 32,
};

export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export default colors;
