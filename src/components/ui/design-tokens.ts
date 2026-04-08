/**
 * Design System Tokens
 *
 * Centralized design token constants for programmatic use.
 * These complement Tailwind CSS classes and can be used in:
 * - Dynamic styles
 * - Component logic
 * - Animation values
 * - Conditional styling
 */

export const COLORS = {
  // Primary (Blue)
  primary: {
    dark: '#1E40AF',
    base: '#3B82F6',
    light: '#DBEAFE',
  },
  
  // Accent (Green)
  accent: {
    base: '#10B981',
    light: '#D1FAE5',
  },
  
  // Neutral
  neutral: {
    bg: '#F8FAFC',
    bgSecondary: '#F1F5F9',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
  },
  
  // Status
  status: {
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    success: '#10B981',
    successLight: '#D1FAE5',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  soft: '0 6px 20px rgba(16, 24, 40, 0.08)',
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'Inter',
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const LAYOUT = {
  sidebarWidth: 272,
  headerHeight: 64,
  contentMaxWidth: 1280,
} as const;

/**
 * Quick Access Helpers
 */

export const getSpacing = (size: keyof typeof SPACING): number => {
  return SPACING[size];
};

export const getSpacingPx = (size: keyof typeof SPACING): string => {
  return `${SPACING[size]}px`;
};

/**
 * Appointment Status Colors
 */
export const APPOINTMENT_STATUS_COLORS = {
  scheduled: COLORS.primary.base,
  completed: COLORS.status.success,
  canceled: COLORS.neutral.textMuted,
  no_show: COLORS.status.danger,
} as const;

/**
 * Badge/Badge Colors
 */
export const BADGE_COLORS = {
  primary: {
    bg: COLORS.primary.light,
    text: COLORS.primary.dark,
  },
  success: {
    bg: COLORS.status.successLight,
    text: COLORS.status.success,
  },
  warning: {
    bg: COLORS.status.warningLight,
    text: COLORS.status.warning,
  },
  danger: {
    bg: COLORS.status.dangerLight,
    text: COLORS.status.danger,
  },
} as const;
