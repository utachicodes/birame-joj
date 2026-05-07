import { Platform } from 'react-native';

export const Colors = {
  // Backgrounds
  bg: '#050A18',
  bgDeep: '#02050F',

  // Glass surfaces (iOS 26 liquid glass)
  glass1: 'rgba(255,255,255,0.07)',
  glass2: 'rgba(255,255,255,0.12)',
  glass3: 'rgba(255,255,255,0.18)',
  glassHover: 'rgba(255,255,255,0.22)',

  // Glass borders — specular highlight
  border1: 'rgba(255,255,255,0.10)',
  border2: 'rgba(255,255,255,0.18)',
  border3: 'rgba(255,255,255,0.28)',

  // JOJ Brand
  orange: '#FF6B35',
  orangeLight: '#FF8C5A',
  gold: '#C9A84C',
  goldLight: '#F0C96A',

  // Accents
  teal: '#4ECDC4',
  tealDark: '#2DB8AE',
  purple: '#7B5EA7',
  purpleLight: '#9B7FD4',
  blue: '#3D8EF5',
  blueLight: '#61A8FF',
  pink: '#E06FA8',
  green: '#4CAF72',

  // Text
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textTertiary: 'rgba(255,255,255,0.40)',
  textDim: 'rgba(255,255,255,0.25)',

  // Semantic
  success: '#4CAF72',
  warning: '#FFB547',
  error: '#FF5270',
  info: '#3D8EF5',

  // Gradients
  gradientBg: ['#050A18', '#0D0B2E', '#050A18'] as const,
  gradientCard: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'] as const,
  gradientOrange: ['#FF8C5A', '#FF4500'] as const,
  gradientGold: ['#F0C96A', '#C9A84C'] as const,
  gradientTeal: ['#4ECDC4', '#2DB8AE'] as const,
  gradientBlue: ['#61A8FF', '#3D8EF5'] as const,
  gradientPurple: ['#9B7FD4', '#5A3E8C'] as const,
  gradientPink: ['#F093C8', '#E06FA8'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  full: 999,
};

export const Typography = {
  largeTitle: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.37,
    color: Colors.text,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  title1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.36,
    color: Colors.text,
  },
  title2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    color: Colors.text,
  },
  title3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.38,
    color: Colors.text,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.4,
    color: Colors.text,
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.4,
    color: Colors.text,
  },
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.3,
    color: Colors.text,
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.2,
    color: Colors.textSecondary,
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: Colors.textTertiary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.07,
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    color: Colors.textSecondary,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 8,
  }),
};
