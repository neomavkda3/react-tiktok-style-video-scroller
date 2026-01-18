import { useRef, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { VideoScrollerProps, VideoScrollerRef } from '../types';
import { VideoItem } from './VideoItem';
import { defaultTheme } from '../utils/theme';

/**
 * VideoScroller - A TikTok-style vertical video scroller component
 *
 * Features:
 * - Virtual scrolling for optimal performance with large video lists
 * - Infinite scroll with customizable trigger threshold
 * - Auto-play/pause based on viewport visibility
 * - Snap scrolling for a native TikTok feel
 * - Fully customizable theming and controls
 */
export const VideoScroller = forwardRef<VideoScrollerRef, VideoScrollerProps>(
  function VideoScroller(
    {
      videos,
      onFetchMore,
      hasMore = false,
      isLoading = false,
      isInitialLoading = false,
      onVideoComplete,
      onLike,
      onShare,
      onVideoPlay,
      onVideoPause,
      onProgress,
      renderOverlay,
      renderLoading,
      renderEmpty,
      renderLoadingMore,
      theme: themeProp,
      config = {},
      className,
      style,
    },
    ref
  ) {
    const theme = { ...defaultTheme, ...themeProp };
    const {
      overscan = 1,
      loadMoreThreshold = 0.1,
      loadMoreOffset = 3,
      heightOffset = 0,
      keyboardNavigation = true,
    } = config;

    const parentRef = useRef<HTMLDivElement>(null);
    const lastTriggerIndex = useRef<number>(-1);

    // Virtual list setup
    const virtualizer = useVirtualizer({
      count: videos.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => {
        if (typeof window !== 'undefined') {
          return window.innerHeight - heightOffset;
        }
        return 800; // Fallback for SSR
      },
      overscan,
    });

    const virtualItems = virtualizer.getVirtualItems();

    // Intersection observer for infinite loading
    const { ref: intersectionRef } = useInView({
      threshold: loadMoreThreshold,
      onChange: (inView) => {
        if (inView && hasMore && !isLoading && onFetchMore) {
          const triggerIndex = videos.length - loadMoreOffset;
          // Prevent duplicate fetches
          if (triggerIndex > lastTriggerIndex.current) {
            lastTriggerIndex.current = triggerIndex;
            onFetchMore();
          }
        }
      },
    });

    // Keyboard navigation
    useEffect(() => {
      if (!keyboardNavigation) return;

      const handleKeyDown = (event: KeyboardEvent) => {
        const currentIndex = Math.round(
          (parentRef.current?.scrollTop || 0) /
            (typeof window !== 'undefined' ? window.innerHeight - heightOffset : 800)
        );

        if (event.key === 'ArrowDown' || event.key === 'j') {
          event.preventDefault();
          virtualizer.scrollToIndex(Math.min(currentIndex + 1, videos.length - 1), {
            align: 'start',
            behavior: 'smooth',
          });
        } else if (event.key === 'ArrowUp' || event.key === 'k') {
          event.preventDefault();
          virtualizer.scrollToIndex(Math.max(currentIndex - 1, 0), {
            align: 'start',
            behavior: 'smooth',
          });
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [keyboardNavigation, videos.length, heightOffset, virtualizer]);

    // Expose imperative methods
    useImperativeHandle(ref, () => ({
      scrollToIndex: (index: number) => {
        virtualizer.scrollToIndex(index, { align: 'start', behavior: 'smooth' });
      },
      scrollToVideo: (videoId: string | number) => {
        const index = videos.findIndex((v) => v.id === videoId);
        if (index !== -1) {
          virtualizer.scrollToIndex(index, { align: 'start', behavior: 'smooth' });
        }
      },
      getCurrentIndex: () => {
        const scrollTop = parentRef.current?.scrollTop || 0;
        const itemHeight = typeof window !== 'undefined' ? window.innerHeight - heightOffset : 800;
        return Math.round(scrollTop / itemHeight);
      },
      play: () => {
        const currentVideo = parentRef.current?.querySelector('video');
        currentVideo?.play();
      },
      pause: () => {
        const currentVideo = parentRef.current?.querySelector('video');
        currentVideo?.pause();
      },
      toggleMute: () => {
        const currentVideo = parentRef.current?.querySelector('video');
        if (currentVideo) {
          currentVideo.muted = !currentVideo.muted;
        }
      },
    }), [videos, heightOffset, virtualizer]);

    // Combine refs for the trigger element
    const setTriggerRef = useCallback(
      (node: HTMLDivElement | null) => {
        virtualizer.measureElement(node);
        intersectionRef(node);
      },
      [virtualizer, intersectionRef]
    );

    // Loading state
    if (isInitialLoading) {
      return renderLoading ? (
        renderLoading()
      ) : (
        <div
          className="react-tiktok-loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        >
          <div className="react-tiktok-spinner" style={{ fontSize: '18px' }}>
            Loading...
          </div>
        </div>
      );
    }

    // Empty state
    if (videos.length === 0) {
      return renderEmpty ? (
        renderEmpty()
      ) : (
        <div
          className="react-tiktok-empty"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100%',
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
          }}
        >
          <p style={{ fontSize: '16px' }}>No videos available</p>
        </div>
      );
    }

    return (
      <div
        ref={parentRef}
        className={`react-tiktok-scroller ${className || ''}`}
        style={{
          position: 'fixed',
          inset: 0,
          bottom: heightOffset,
          width: '100%',
          overflowY: 'scroll',
          backgroundColor: theme.backgroundColor,
          scrollSnapType: 'y mandatory',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          ...style,
        }}
      >
        <style>
          {`
            .react-tiktok-scroller::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <div
          className="react-tiktok-virtual-container"
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const video = videos[virtualItem.index];
            const isLoadTrigger = virtualItem.index === videos.length - loadMoreOffset;

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={(node) => {
                  virtualizer.measureElement(node);
                  if (isLoadTrigger && node) {
                    setTriggerRef(node);
                  }
                }}
                className="react-tiktok-virtual-item"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transform: `translateY(${virtualItem.start}px)`,
                  scrollSnapAlign: 'start',
                }}
              >
                <VideoItem
                  video={video}
                  theme={theme}
                  config={config}
                  onVideoComplete={onVideoComplete}
                  onLike={onLike ? (v, liked) => onLike(v, liked) : undefined}
                  onShare={onShare}
                  onVideoPlay={onVideoPlay}
                  onVideoPause={onVideoPause}
                  onProgress={onProgress}
                  renderOverlay={renderOverlay}
                  showDefaultControls={!renderOverlay}
                />
              </div>
            );
          })}
        </div>

        {/* Loading more indicator */}
        {isLoading && hasMore && (
          <div
            className="react-tiktok-loading-more"
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
            }}
          >
            {renderLoadingMore ? (
              renderLoadingMore()
            ) : (
              <p
                style={{
                  color: theme.textColor,
                  fontSize: '14px',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                }}
              >
                Loading more videos...
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

VideoScroller.displayName = 'VideoScroller';
