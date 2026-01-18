import { useState, useRef, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import type { VideoItemProps, VideoItemState } from '../types';
import { defaultTheme } from '../utils/theme';
import { DefaultOverlay } from './DefaultOverlay';

/**
 * VideoItem component - Renders a single video with controls and interactions
 */
export function VideoItem({
  video,
  theme: themeProp,
  config = {},
  onVideoComplete,
  onLike,
  onShare,
  onVideoPlay,
  onVideoPause,
  onProgress,
  renderOverlay,
  showDefaultControls = true,
}: VideoItemProps) {
  const theme = { ...defaultTheme, ...themeProp };
  const {
    autoPlay = true,
    autoPlayThreshold = 0.75,
    loop = true,
    muted: initialMuted = true,
  } = config;

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const hasTrackedCompletion = useRef(false);
  const hasBeenPlayed = useRef(false);
  const userUnmuted = useRef(false);

  const { ref: inViewRef } = useInView({
    threshold: autoPlayThreshold,
    triggerOnce: false,
    onChange: (inView) => {
      setIsInView(inView);
      const videoElement = videoElementRef.current;
      if (!videoElement) return;

      if (inView && autoPlay) {
        // First play is always muted (browser requirement)
        if (!hasBeenPlayed.current) {
          videoElement.muted = true;
          setIsMuted(true);
          hasBeenPlayed.current = true;
        } else if (!userUnmuted.current) {
          videoElement.muted = true;
          setIsMuted(true);
        }

        videoElement.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});

        onVideoPlay?.(video);
      } else {
        videoElement.pause();
        setIsPlaying(false);
        onVideoPause?.(video);
      }
    },
  });

  // Handle time updates
  const handleTimeUpdate = useCallback(() => {
    const videoElement = videoElementRef.current;
    if (!videoElement || isDragging) return;

    const progressPercent = (videoElement.currentTime / videoElement.duration) * 100;
    setProgress(progressPercent || 0);
    setCurrentTime(videoElement.currentTime);
    onProgress?.(video, progressPercent, videoElement.currentTime);
  }, [video, isDragging, onProgress]);

  // Handle video loaded metadata
  const handleLoadedMetadata = useCallback(() => {
    const videoElement = videoElementRef.current;
    if (videoElement) {
      setDuration(videoElement.duration || 0);
    }
  }, []);

  // Handle video end
  const handleVideoEnd = useCallback(() => {
    if (!hasTrackedCompletion.current) {
      hasTrackedCompletion.current = true;
      onVideoComplete?.(video);
    }
  }, [video, onVideoComplete]);

  // Setup video event listeners
  useEffect(() => {
    const videoElement = videoElementRef.current;
    if (!videoElement) return;

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('ended', handleVideoEnd);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('ended', handleVideoEnd);
    };
  }, [handleTimeUpdate, handleLoadedMetadata, handleVideoEnd]);

  // Handle video click (unmute)
  const handleVideoClick = useCallback(() => {
    const videoElement = videoElementRef.current;
    if (videoElement) {
      videoElement.muted = false;
      userUnmuted.current = true;
      setIsMuted(false);
    }
  }, []);

  // Handle like
  const handleLike = useCallback(() => {
    onLike?.(video, !video.hasLiked);
  }, [video, onLike]);

  // Handle share
  const handleShare = useCallback(() => {
    onShare?.(video);
  }, [video, onShare]);

  // Update video time from progress bar interaction
  const updateVideoTime = useCallback((clientX: number, rect: DOMRect) => {
    const clickX = clientX - rect.left;
    const progressPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));

    const videoElement = videoElementRef.current;
    if (videoElement && duration > 0) {
      const newTime = (progressPercent / 100) * duration;
      videoElement.currentTime = newTime;
      setProgress(progressPercent);
      setCurrentTime(newTime);
    }
  }, [duration]);

  // Progress bar event handlers
  const handleProgressStart = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in event
      ? (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0)
      : event.clientX;
    updateVideoTime(clientX, rect);
  }, [updateVideoTime]);

  const handleProgressMove = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in event
      ? (event.touches[0]?.clientX || event.changedTouches[0]?.clientX || 0)
      : event.clientX;
    updateVideoTime(clientX, rect);
  }, [isDragging, updateVideoTime]);

  const handleProgressEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Combine refs
  const setRefs = useCallback((node: HTMLVideoElement | null) => {
    inViewRef(node);
    videoElementRef.current = node;
  }, [inViewRef]);

  // Current state for overlay
  const state: VideoItemState = {
    isPlaying,
    isMuted,
    progress,
    currentTime,
    duration,
    isInView,
  };

  return (
    <div
      className="react-tiktok-video-item"
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        backgroundColor: theme.backgroundColor,
      }}
    >
      {/* Video Element */}
      <video
        ref={setRefs}
        className="react-tiktok-video-element"
        src={video.videoUrl}
        loop={loop}
        playsInline
        onClick={handleVideoClick}
        poster={video.thumbnailUrl}
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'cover',
          cursor: 'pointer',
        }}
      />

      {/* Muted Indicator */}
      {isMuted && (
        <div
          className="react-tiktok-muted-indicator"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              borderRadius: '50%',
              backgroundColor: theme.mutedIconBackground || 'rgba(0, 0, 0, 0.5)',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.textColor || 'white'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          </div>
        </div>
      )}

      {/* Custom or Default Overlay */}
      {renderOverlay ? (
        renderOverlay(video, state)
      ) : showDefaultControls ? (
        <DefaultOverlay
          video={video}
          state={state}
          theme={theme}
          onLike={handleLike}
          onShare={handleShare}
        />
      ) : null}

      {/* Progress Bar */}
      <div
        className="react-tiktok-progress-container"
        onMouseDown={handleProgressStart}
        onMouseMove={handleProgressMove}
        onMouseUp={handleProgressEnd}
        onMouseLeave={handleProgressEnd}
        onTouchStart={handleProgressStart}
        onTouchMove={handleProgressMove}
        onTouchEnd={handleProgressEnd}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          cursor: 'pointer',
          paddingTop: '24px',
        }}
      >
        <div
          className="react-tiktok-progress-bar"
          style={{
            height: theme.progressBarHeight || 3,
            backgroundColor: theme.progressBarBackground || 'rgba(255, 255, 255, 0.3)',
            width: '100%',
          }}
        >
          <div
            className="react-tiktok-progress-fill"
            style={{
              height: '100%',
              backgroundColor: theme.primaryColor || '#ff0050',
              width: `${progress}%`,
              transition: isDragging ? 'none' : 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
