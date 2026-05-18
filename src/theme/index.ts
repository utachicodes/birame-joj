import { Platform } from 'react-native'; // available for platform-specific shadow handling

export type ThemeMode = 'dark' | 'light'; // the two modes the app supports

export const Colors = {
  // Background
  bg: '#0A0E1A',           // main screen background — almost black
  bgDeep: '#06090F',       // deeper layer, used behind modals
  bgElevated: '#10151F',   // cards and elevated surfaces

  // Surfaces
  surface1: 'rgba(255,255,255,0.04)', // very subtle white layer — level 1
  surface2: 'rgba(255,255,255,0.07)', // slightly more visible — level 2
  surface3: 'rgba(255,255,255,0.10)', // most visible surface layer — level 3

  // Glass aliases (legacy compatibility)
  glass1: 'rgba(255,255,255,0.04)', // same as surface1 — kept for old code
  glass2: 'rgba(255,255,255,0.07)', // same as surface2
  glass3: 'rgba(255,255,255,0.10)', // same as surface3
  glassHover: 'rgba(255,255,255,0.14)', // pressed/hovered state

  // Borders (specular highlights)
  border1: 'rgba(255,255,255,0.08)', // subtle divider line
  border2: 'rgba(255,255,255,0.14)', // normal card border
  border3: 'rgba(255,255,255,0.20)', // strong border, e.g. focused input

  // Brand — single primary
  brand: '#FF6B35',      // main orange — buttons, active tabs, highlights
  brandLight: '#FF8C5A', // lighter variant for hover states
  brandDark: '#E54A1A',  // darker variant for pressed states

  // Aliases
  orange: '#FF6B35',      // same as brand — used directly in some components
  orangeLight: '#FF8C5A', // same as brandLight

  // Functional accents (used sparingly)
  gold: '#D4AF37',        // medals, points, premium content
  goldLight: '#E8C25C',   // lighter gold for text on dark bg
  teal: '#3FBDB6',        // sport badges, secondary actions
  tealDark: '#2A9C95',    // darker teal for pressed state
  blue: '#4A90E2',        // info, transport alerts, links
  blueLight: '#6EA8E8',   // lighter blue for icon tints
  purple: '#7B5EA7',      // accreditation badge, volunteer role
  purpleLight: '#9B7FD4', // lighter purple
  pink: '#D866A0',        // used sparingly for certain sport badges
  green: '#3FBA7A',       // success states, open venue indicator

  // Text
  text: '#FFFFFF',                        // primary text — full white on dark bg
  textSecondary: 'rgba(255,255,255,0.70)', // secondary labels, subtitles
  textTertiary: 'rgba(255,255,255,0.45)', // hints, placeholders
  textDim: 'rgba(255,255,255,0.28)',      // disabled or very low priority text

  // Semantic
  success: '#3FBA7A',  // same as green — positive feedback
  warning: '#FFB547',  // amber — warnings, low seat count
  error: '#FF5270',    // red-pink — form errors, destructive actions
  info: '#4A90E2',     // same as blue — informational banners
  liveDot: '#FF3838',  // pulsing dot on LIVE badges
};

export const Spacing = {
  xs: 4,    // tight gaps between icon and label
  sm: 8,    // internal padding in small components
  md: 12,   // standard inner padding
  lg: 16,   // section padding, standard card padding
  xl: 20,   // larger section gaps
  xxl: 24,  // section header margin
  xxxl: 32, // big vertical gaps between page sections
};

export const Radius = {
  sm: 10,    // small chips and badges
  md: 14,    // standard card radius
  lg: 18,    // larger cards, bottom sheets
  xl: 24,    // modals, big action cards
  xxl: 32,   // extra large panels
  full: 999, // fully rounded — pill buttons, avatars
};

export const Typography = {
  largeTitle: {
    fontSize: 32,
    fontWeight: '800' as const, // heaviest weight — screen hero titles
    letterSpacing: -0.6,        // tight tracking looks better at large sizes
    color: Colors.text,
  },
  title1: {
    fontSize: 26,
    fontWeight: '800' as const, // section headers on main screens
    letterSpacing: -0.4,
    color: Colors.text,
  },
  title2: {
    fontSize: 21,
    fontWeight: '700' as const, // modal titles, card headlines
    letterSpacing: -0.3,
    color: Colors.text,
  },
  title3: {
    fontSize: 18,
    fontWeight: '700' as const, // sub-section titles
    letterSpacing: -0.2,
    color: Colors.text,
  },
  headline: {
    fontSize: 16,
    fontWeight: '600' as const, // list item headers, bold labels
    letterSpacing: -0.2,
    color: Colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const, // default reading text
    letterSpacing: -0.15,
    color: Colors.text,
  },
  callout: {
    fontSize: 15,
    fontWeight: '500' as const, // slightly heavier body for emphasis
    letterSpacing: -0.1,
    color: Colors.text,
  },
  subheadline: {
    fontSize: 14,
    fontWeight: '400' as const, // secondary info below a headline
    letterSpacing: -0.1,
    color: Colors.textSecondary, // dimmed by default
  },
  footnote: {
    fontSize: 13,
    fontWeight: '400' as const, // small print, timestamps
    letterSpacing: 0,
    color: Colors.textSecondary,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const, // image captions, hint text
    color: Colors.textTertiary,
  },
  caption2: {
    fontSize: 11,
    fontWeight: '500' as const, // smallest readable text — use sparingly
    color: Colors.textTertiary,
  },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.0,                    // wide tracking gives the all-caps feel
    textTransform: 'uppercase' as const,   // section labels, e.g. "LIVE", "VIP"
    color: Colors.textTertiary,
  },
};

export const LightColors = {
  bg: '#F5F6FA',           // off-white page background
  bgDeep: '#ECEEF5',       // slightly darker — used behind modals
  bgElevated: '#FFFFFF',   // pure white cards sit above the bg
  surface1: 'rgba(0,0,0,0.03)', // near-invisible dark wash — level 1
  surface2: 'rgba(0,0,0,0.05)', // level 2
  surface3: 'rgba(0,0,0,0.08)', // level 3
  glass1: 'rgba(0,0,0,0.03)',   // legacy alias
  glass2: 'rgba(0,0,0,0.05)',
  glass3: 'rgba(0,0,0,0.08)',
  glassHover: 'rgba(0,0,0,0.12)', // pressed/hovered state in light mode
  border1: 'rgba(0,0,0,0.06)',  // subtle divider
  border2: 'rgba(0,0,0,0.10)',  // standard card border
  border3: 'rgba(0,0,0,0.16)',  // strong border
  brand: '#D94E18',      // darker orange — enough contrast on white
  brandLight: '#E86B3A',
  brandDark: '#B83D0E',
  orange: '#D94E18',
  orangeLight: '#E86B3A',
  gold: '#9A7320',       // muted gold — readable on light bg
  goldLight: '#B89040',
  teal: '#1A8C86',       // darker teal for light mode contrast
  tealDark: '#147570',
  blue: '#2663C4',       // accessible blue on white
  blueLight: '#4A82D8',
  purple: '#5B3F90',
  purpleLight: '#7B5FC8',
  pink: '#A03878',
  green: '#1A8C52',      // darker green — passes WCAG on white
  text: '#0D1117',                         // near-black primary text
  textSecondary: 'rgba(13,17,23,0.60)',    // 60% opacity of text color
  textTertiary: 'rgba(13,17,23,0.38)',     // hints and placeholders
  textDim: 'rgba(13,17,23,0.22)',          // disabled text
  success: '#1A8C52',
  warning: '#C47A00',  // amber adjusted for light bg
  error: '#C42B2B',    // dark red — still clearly an error
  info: '#2663C4',
  liveDot: '#C42B2B',  // matches error red in light mode
};

export function getColors(mode: ThemeMode) {
  return mode === 'dark' ? Colors : LightColors; // simple palette switch
}

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // small lift — list items
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2, // Android equivalent
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // standard card shadow
    shadowOpacity: 0.30,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 }, // strong shadow — modals, FABs
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  glow: (color: string) => ({ // colored glow effect — pass the brand or accent color
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 }, // centered glow, no directional offset
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 6,
  }),
};
