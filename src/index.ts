// Components
export { VideoScroller } from './components/VideoScroller';
export { VideoItem } from './components/VideoItem';
export { DefaultOverlay } from './components/DefaultOverlay';

// Hooks
export { useVideoScroller } from './hooks/useVideoScroller';
export type { UseVideoScrollerOptions, UseVideoScrollerReturn } from './hooks/useVideoScroller';

// Utils
export { handleShare, createShareHandler } from './utils/share';
export type { ShareOptions } from './utils/share';
export { defaultTheme, createTheme, themes } from './utils/theme';
export type { ThemeName } from './utils/theme';

// Types
export type {
  Video,
  VideoFeedResponse,
  VideoScrollerTheme,
  VideoScrollerConfig,
  VideoScrollerProps,
  VideoItemState,
  VideoItemProps,
  VideoScrollerRef,
} from './types';
