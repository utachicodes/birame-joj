import { Platform } from 'react-native';

export const Colors = {
  // Background
  bg: '#0A0E1A',
  bgDeep: '#06090F',
  bgElevated: '#10151F',

  // Surfaces
  surface1: 'rgba(255,255,255,0.04)',
  surface2: 'rgba(255,255,255,0.07)',
  surface3: 'rgba(255,255,255,0.10)',

  // Glass aliases (legacy compatibility)
  glass1: 'rgba(255,255,255,0.04)',
  glass2: 'rgba(255,255,255,0.07)',
  glass3: 'rgba(255,255,255,0.10)',
  glassHover: 'rgba(255,255,255,0.14)',

  // Borders (specular highlights)
  border1: 'rgba(255,255,255,0.08)',
  border2: 'rgba(255,255,255,0.14)',
  border3: 'rgba(255,255,255,0.20)',

  // Brand — single primary
  brand: '#FF6B35',
  brandLight: '#FF8C5A',
  brandDark: '#E54A1A',

  // Aliases
  orange: '#FF6B35',
  orangeLight: '#FF8C5A',

  // Functional accents (used sparingly)
  gold: '#D4AF37',
  goldLight: '#E8C25C',
  teal: '#3FBDB6',
  tealDark: '#2A9C95',
  blue: '#4A90E2',
  blueLight: '#6EA8E8',
  purple: '#7B5EA7',
  purpleLight: '#9B7FD4',
  pink: '#D866A0',
  green: '#3FBA7A',

  // Text
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.70)',
  textTertiary: 'rgba(255,255,255,0.45)',
  textDim: 'rgba(255,255,255,0.28)',

  // Semantic
  success: '#3FBA7A',
  warning: '#FFB547',
  error: '#FF5270',
  info: '#4A90E2',
  liveDot: '#FF3838',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  xxl: 32,
  full: 999,
};

export const Typography = {
  largeTitle: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.6,
    color: Colors.text,
  },
  title1: {
    fontSize: 26,
    fontWeight: '800' as const,
    letterSpacing: -0.4,
    color: Colors.text,
  },
  title2: {
    fontSize: 21,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    color: Colors.text,
  },
  title3: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    color: Colors.text,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.15,
    color: Colors.text,
  },
  callout: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: -0.1,
    color: Colors.text,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: -0.1,
    color: Colors.textSecondary,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textTertiary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.0,
    textTransform: 'uppercase' as const,
    color: Colors.textTertiary,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  }),
};
