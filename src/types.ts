import { ReactNode, CSSProperties } from 'react';

/**
 * Represents a video item in the feed
 */
export interface Video {
  /** Unique identifier for the video */
  id: string | number;
  /** URL to the video file */
  videoUrl: string;
  /** Optional thumbnail/poster image URL */
  thumbnailUrl?: string;
  /** Video title */
  title?: string;
  /** Video description */
  description?: string;
  /** Number of likes */
  likeCount?: number;
  /** Whether the current user has liked this video */
  hasLiked?: boolean;
  /** Number of comments */
  commentCount?: number;
  /** Video duration in seconds */
  duration?: number;
  /** Any additional custom data */
  [key: string]: unknown;
}

/**
 * Response structure for paginated video feeds
 */
export interface VideoFeedResponse {
  /** Array of video items */
  videos: Video[];
  /** Whether there are more videos to load */
  hasNextPage: boolean;
  /** Cursor for the next page (for cursor-based pagination) */
  nextCursor?: string | null;
  /** Total count of videos (optional) */
  totalCount?: number;
}

/**
 * Theme configuration for the video scroller
 */
export interface VideoScrollerTheme {
  /** Primary color for interactive elements (likes, progress bar, etc.) */
  primaryColor?: string;
  /** Background color for the scroller container */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Muted icon background color */
  mutedIconBackground?: string;
  /** Progress bar height */
  progressBarHeight?: number;
  /** Progress bar background color */
  progressBarBackground?: string;
}

/**
 * Configuration options for the video scroller
 */
export interface VideoScrollerConfig {
  /** Number of items to render outside the visible area (default: 1) */
  overscan?: number;
  /** Intersection threshold for triggering next page load (default: 0.1) */
  loadMoreThreshold?: number;
  /** Number of items from the end to trigger load more (default: 3) */
  loadMoreOffset?: number;
  /** Whether videos should autoplay when in view (default: true) */
  autoPlay?: boolean;
  /** Intersection threshold for autoplay (default: 0.75) */
  autoPlayThreshold?: number;
  /** Whether videos should loop (default: true) */
  loop?: boolean;
  /** Whether videos start muted (default: true, required for autoplay) */
  muted?: boolean;
  /** Height offset from viewport (e.g., for navbar) in pixels (default: 0) */
  heightOffset?: number;
  /** Enable keyboard navigation (default: true) */
  keyboardNavigation?: boolean;
}

/**
 * Props for the main VideoScroller component
 */
export interface VideoScrollerProps {
  /** Array of videos to display */
  videos: Video[];
  /** Callback when more videos should be loaded */
  onFetchMore?: () => void;
  /** Whether there are more videos to load */
  hasMore?: boolean;
  /** Whether videos are currently being loaded */
  isLoading?: boolean;
  /** Whether the initial load is in progress */
  isInitialLoading?: boolean;
  /** Callback when a video finishes playing */
  onVideoComplete?: (video: Video) => void;
  /** Callback when a video is liked/unliked */
  onLike?: (video: Video, liked: boolean) => void;
  /** Callback when share is triggered */
  onShare?: (video: Video) => void;
  /** Callback when a video starts playing */
  onVideoPlay?: (video: Video) => void;
  /** Callback when a video is paused */
  onVideoPause?: (video: Video) => void;
  /** Callback when video progress updates */
  onProgress?: (video: Video, progress: number, currentTime: number) => void;
  /** Custom render function for the overlay/controls */
  renderOverlay?: (video: Video, state: VideoItemState) => ReactNode;
  /** Custom render function for the loading indicator */
  renderLoading?: () => ReactNode;
  /** Custom render function for empty state */
  renderEmpty?: () => ReactNode;
  /** Custom render function for loading more indicator */
  renderLoadingMore?: () => ReactNode;
  /** Theme configuration */
  theme?: VideoScrollerTheme;
  /** Configuration options */
  config?: VideoScrollerConfig;
  /** Additional CSS class for the container */
  className?: string;
  /** Additional inline styles for the container */
  style?: CSSProperties;
}

/**
 * State of a video item (passed to renderOverlay)
 */
export interface VideoItemState {
  /** Whether the video is currently playing */
  isPlaying: boolean;
  /** Whether the video is muted */
  isMuted: boolean;
  /** Current playback progress (0-100) */
  progress: number;
  /** Current playback time in seconds */
  currentTime: number;
  /** Total duration in seconds */
  duration: number;
  /** Whether the video is currently in view */
  isInView: boolean;
}

/**
 * Props for the VideoItem component
 */
export interface VideoItemProps {
  /** The video to display */
  video: Video;
  /** Theme configuration */
  theme?: VideoScrollerTheme;
  /** Configuration options */
  config?: VideoScrollerConfig;
  /** Callback when video completes */
  onVideoComplete?: (video: Video) => void;
  /** Callback when like is toggled */
  onLike?: (video: Video, liked: boolean) => void;
  /** Callback when share is triggered */
  onShare?: (video: Video) => void;
  /** Callback when video starts playing */
  onVideoPlay?: (video: Video) => void;
  /** Callback when video is paused */
  onVideoPause?: (video: Video) => void;
  /** Callback for progress updates */
  onProgress?: (video: Video, progress: number, currentTime: number) => void;
  /** Custom overlay renderer */
  renderOverlay?: (video: Video, state: VideoItemState) => ReactNode;
  /** Whether to show default controls */
  showDefaultControls?: boolean;
}

/**
 * Ref handle for the VideoScroller component
 */
export interface VideoScrollerRef {
  /** Scroll to a specific video by index */
  scrollToIndex: (index: number) => void;
  /** Scroll to a specific video by ID */
  scrollToVideo: (videoId: string | number) => void;
  /** Get the currently visible video index */
  getCurrentIndex: () => number;
  /** Play the current video */
  play: () => void;
  /** Pause the current video */
  pause: () => void;
  /** Toggle mute state */
  toggleMute: () => void;
}
