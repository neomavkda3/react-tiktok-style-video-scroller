import type { Video } from '../types';

export interface ShareOptions {
  /** Base URL for generating share links (defaults to window.location.origin) */
  baseUrl?: string;
  /** Path pattern for video URLs (use :id as placeholder) */
  pathPattern?: string;
  /** Custom title generator */
  getTitle?: (video: Video) => string;
  /** Custom text/description generator */
  getText?: (video: Video) => string;
  /** Callback after successful share */
  onShareSuccess?: (video: Video) => void;
  /** Callback on share error */
  onShareError?: (video: Video, error: Error) => void;
  /** Callback when URL is copied to clipboard (fallback) */
  onCopySuccess?: (video: Video, url: string) => void;
}

/**
 * Default share handler using Web Share API with clipboard fallback
 */
export async function handleShare(
  video: Video,
  options: ShareOptions = {}
): Promise<boolean> {
  const {
    baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
    pathPattern = '/watch/:id',
    getTitle = (v) => v.title || 'Check out this video',
    getText = (v) => v.description || 'Check out this video',
    onShareSuccess,
    onShareError,
    onCopySuccess,
  } = options;

  const url = `${baseUrl}${pathPattern.replace(':id', String(video.id))}`;
  const title = getTitle(video);
  const text = getText(video);

  try {
    // Try native share API first
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ url, title, text });
      onShareSuccess?.(video);
      return true;
    }

    // Fallback to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      onCopySuccess?.(video, url);
      return true;
    }

    throw new Error('Share not supported');
  } catch (error) {
    // User cancelled share or share not supported
    if (error instanceof Error && error.name !== 'AbortError') {
      onShareError?.(video, error);
    }
    return false;
  }
}

/**
 * Create a configured share handler
 */
export function createShareHandler(defaultOptions: ShareOptions) {
  return (video: Video, overrideOptions?: ShareOptions) =>
    handleShare(video, { ...defaultOptions, ...overrideOptions });
}
