/**
 * Theme Index - React Native
 * Central export for all theme values
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './animations';

import { colors, gradients, ColorScheme, ThemeColors } from './colors';
import { textStyles, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './typography';
import { spacing, borderRadius, componentSpacing } from './spacing';
import { shadows, getShadow } from './shadows';
import { timing, spring } from './animations';

// Complete theme object
export const theme = {
  colors,
  gradients,
  textStyles,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  borderRadius,
  componentSpacing,
  shadows,
  timing,
  spring,
};

// Theme context type
export interface ThemeContextType {
  colorScheme: ColorScheme;
  colors: ThemeColors;
  toggleColorScheme: () => void;
}

export default theme;
