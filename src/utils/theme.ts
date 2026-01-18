import type { VideoScrollerTheme } from '../types';

/**
 * Default theme for the video scroller
 */
export const defaultTheme: VideoScrollerTheme = {
  primaryColor: '#ff0050',
  backgroundColor: '#000000',
  textColor: '#ffffff',
  mutedIconBackground: 'rgba(0, 0, 0, 0.5)',
  progressBarHeight: 3,
  progressBarBackground: 'rgba(255, 255, 255, 0.3)',
};

/**
 * Create a custom theme by merging with defaults
 */
export function createTheme(customTheme: Partial<VideoScrollerTheme>): VideoScrollerTheme {
  return {
    ...defaultTheme,
    ...customTheme,
  };
}

/**
 * Preset themes
 */
export const themes = {
  default: defaultTheme,

  dark: {
    ...defaultTheme,
    primaryColor: '#ff0050',
    backgroundColor: '#000000',
    textColor: '#ffffff',
  },

  light: {
    ...defaultTheme,
    primaryColor: '#ff0050',
    backgroundColor: '#f5f5f5',
    textColor: '#1a1a1a',
    mutedIconBackground: 'rgba(255, 255, 255, 0.8)',
    progressBarBackground: 'rgba(0, 0, 0, 0.2)',
  },

  tiktok: {
    ...defaultTheme,
    primaryColor: '#fe2c55',
    backgroundColor: '#000000',
    textColor: '#ffffff',
  },

  youtube: {
    ...defaultTheme,
    primaryColor: '#ff0000',
    backgroundColor: '#0f0f0f',
    textColor: '#ffffff',
  },

  instagram: {
    ...defaultTheme,
    primaryColor: '#e1306c',
    backgroundColor: '#000000',
    textColor: '#ffffff',
  },
} as const;

export type ThemeName = keyof typeof themes;
