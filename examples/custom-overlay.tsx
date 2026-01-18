/**
 * Custom Overlay Example
 *
 * This example demonstrates how to create a fully custom overlay/controls
 * for the video scroller.
 */

import React, { useState } from 'react';
import {
  VideoScroller,
  Video,
  VideoItemState,
  themes,
} from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css';

// Sample videos
const videos: Video[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies.',
    likeCount: 12500,
    hasLiked: false,
    author: '@blenderfoundation',
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006.',
    likeCount: 8700,
    hasLiked: true,
    author: '@blenderfoundation',
  },
];

// Custom overlay component
function CustomOverlay({
  video,
  state,
  onLike,
  onShare,
  onComment,
}: {
  video: Video;
  state: VideoItemState;
  onLike: () => void;
  onShare: () => void;
  onComment: () => void;
}) {
  const { isPlaying, isMuted, progress, currentTime, duration } = state;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Top gradient */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 100,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom gradient */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 200,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          pointerEvents: 'none',
        }}
      />

      {/* Play/Pause indicator */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
      )}

      {/* Time display */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: 4,
          color: 'white',
          fontSize: 12,
        }}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Right side actions */}
      <div
        style={{
          position: 'absolute',
          right: 12,
          bottom: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Like button with animation */}
        <button
          onClick={onLike}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: video.hasLiked ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.2s',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: video.hasLiked ? '#fe2c55' : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s',
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={video.hasLiked ? 'white' : 'none'}
              stroke="white"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
            {video.likeCount?.toLocaleString()}
          </span>
        </button>

        {/* Comment button */}
        <button
          onClick={onComment}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
            Comments
          </span>
        </button>

        {/* Share button */}
        <button
          onClick={onShare}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </div>
          <span style={{ color: 'white', fontSize: 12, marginTop: 4 }}>
            Share
          </span>
        </button>
      </div>

      {/* Bottom info */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 12,
          right: 80,
        }}
      >
        <p style={{ color: 'white', fontSize: 16, fontWeight: 'bold', margin: 0 }}>
          {(video as any).author || '@anonymous'}
        </p>
        <h3 style={{ color: 'white', fontSize: 14, margin: '4px 0' }}>
          {video.title}
        </h3>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 13,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {video.description}
        </p>
      </div>
    </>
  );
}

export function CustomOverlayExample() {
  const [videoList, setVideoList] = useState(videos);
  const [showComments, setShowComments] = useState(false);

  const handleLike = (video: Video) => {
    setVideoList((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? {
              ...v,
              hasLiked: !v.hasLiked,
              likeCount: (v.likeCount || 0) + (v.hasLiked ? -1 : 1),
            }
          : v
      )
    );
  };

  const handleShare = (video: Video) => {
    console.log('Share:', video.title);
  };

  const handleComment = (video: Video) => {
    console.log('Open comments for:', video.title);
    setShowComments(true);
  };

  return (
    <>
      <VideoScroller
        videos={videoList}
        theme={themes.tiktok}
        renderOverlay={(video, state) => (
          <CustomOverlay
            video={video}
            state={state}
            onLike={() => handleLike(video)}
            onShare={() => handleShare(video)}
            onComment={() => handleComment(video)}
          />
        )}
      />

      {/* Comments modal placeholder */}
      {showComments && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            backgroundColor: '#1a1a1a',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            zIndex: 100,
          }}
        >
          <button
            onClick={() => setShowComments(false)}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 24,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
          <h3 style={{ color: 'white', margin: 0 }}>Comments</h3>
          <p style={{ color: '#888' }}>Comments would go here...</p>
        </div>
      )}
    </>
  );
}

export default CustomOverlayExample;
