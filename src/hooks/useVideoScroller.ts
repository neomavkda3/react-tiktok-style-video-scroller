import { useState, useCallback, useRef } from 'react';
import type { Video, VideoFeedResponse } from '../types';

export interface UseVideoScrollerOptions<T extends Video = Video> {
  /** Initial videos to display */
  initialVideos?: T[];
  /** Function to fetch more videos */
  fetchVideos?: (cursor?: string | null) => Promise<VideoFeedResponse>;
  /** Number of videos to fetch per page */
  pageSize?: number;
}

export interface UseVideoScrollerReturn<T extends Video = Video> {
  /** Current list of videos */
  videos: T[];
  /** Whether initial loading is in progress */
  isLoading: boolean;
  /** Whether more videos are being fetched */
  isFetchingMore: boolean;
  /** Whether there are more videos to load */
  hasMore: boolean;
  /** Error if any occurred */
  error: Error | null;
  /** Fetch the next page of videos */
  fetchMore: () => Promise<void>;
  /** Refresh the entire feed */
  refresh: () => Promise<void>;
  /** Add a video to the list */
  addVideo: (video: T, position?: 'start' | 'end') => void;
  /** Remove a video from the list */
  removeVideo: (videoId: string | number) => void;
  /** Update a video in the list */
  updateVideo: (videoId: string | number, updates: Partial<T>) => void;
  /** Set videos directly */
  setVideos: (videos: T[]) => void;
}

/**
 * Hook for managing video scroller state
 *
 * This hook provides a simple way to manage video feed state including
 * pagination, loading states, and video mutations.
 *
 * @example
 * ```tsx
 * const { videos, isLoading, hasMore, fetchMore } = useVideoScroller({
 *   fetchVideos: async (cursor) => {
 *     const response = await fetch(`/api/videos?cursor=${cursor}`);
 *     return response.json();
 *   },
 * });
 *
 * return (
 *   <VideoScroller
 *     videos={videos}
 *     isInitialLoading={isLoading}
 *     hasMore={hasMore}
 *     onFetchMore={fetchMore}
 *   />
 * );
 * ```
 */
export function useVideoScroller<T extends Video = Video>({
  initialVideos = [],
  fetchVideos,
  // pageSize is available for custom fetch implementations
  pageSize: _pageSize = 10,
}: UseVideoScrollerOptions<T> = {}): UseVideoScrollerReturn<T> {
  void _pageSize; // Available for use in custom fetchVideos implementations
  const [videos, setVideos] = useState<T[]>(initialVideos);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cursorRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  const fetchMore = useCallback(async () => {
    if (!fetchVideos || isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setIsFetchingMore(true);
    setError(null);

    try {
      const response = await fetchVideos(cursorRef.current);
      setVideos((prev) => [...prev, ...(response.videos as T[])]);
      cursorRef.current = response.nextCursor || null;
      setHasMore(response.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
    } finally {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
    }
  }, [fetchVideos, hasMore]);

  const refresh = useCallback(async () => {
    if (!fetchVideos) return;

    setIsLoading(true);
    setError(null);
    cursorRef.current = null;

    try {
      const response = await fetchVideos(null);
      setVideos(response.videos as T[]);
      cursorRef.current = response.nextCursor || null;
      setHasMore(response.hasNextPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch videos'));
    } finally {
      setIsLoading(false);
    }
  }, [fetchVideos]);

  const addVideo = useCallback((video: T, position: 'start' | 'end' = 'start') => {
    setVideos((prev) => (position === 'start' ? [video, ...prev] : [...prev, video]));
  }, []);

  const removeVideo = useCallback((videoId: string | number) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  }, []);

  const updateVideo = useCallback((videoId: string | number, updates: Partial<T>) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === videoId ? { ...v, ...updates } : v))
    );
  }, []);

  return {
    videos,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchMore,
    refresh,
    addVideo,
    removeVideo,
    updateVideo,
    setVideos,
  };
}
