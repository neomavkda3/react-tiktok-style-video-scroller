# React TikTok Style Video Scroller

[![npm version](https://img.shields.io/npm/v/react-tiktok-style-video-scroller.svg)](https://www.npmjs.com/package/react-tiktok-style-video-scroller)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A high-performance, TikTok-style vertical video scroller component for React. Build engaging short-form video experiences with virtual scrolling, infinite loading, auto-play, and full customization.

## Features

- **Virtual Scrolling** - Renders only visible videos for optimal performance with large lists
- **Infinite Scroll** - Automatically loads more videos as users scroll
- **Auto-play/Pause** - Videos automatically play when in view and pause when scrolled away
- **Snap Scrolling** - Native TikTok-like snap-to-video scrolling experience
- **Keyboard Navigation** - Navigate with arrow keys or j/k
- **Customizable** - Full control over theming, controls, and behavior
- **TypeScript** - Full TypeScript support with comprehensive types
- **Lightweight** - Minimal dependencies (only @tanstack/react-virtual and react-intersection-observer)
- **Mobile-First** - Touch-friendly with responsive design
- **Accessible** - ARIA labels and keyboard support

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Infinite Loading](#infinite-loading)
  - [Custom Overlay](#custom-overlay)
  - [Custom Theme](#custom-theme)
- [API Reference](#api-reference)
  - [VideoScroller Props](#videoscroller-props)
  - [Video Object](#video-object)
  - [Configuration Options](#configuration-options)
  - [Theme Options](#theme-options)
  - [Ref Methods](#ref-methods)
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install react-tiktok-style-video-scroller
```

```bash
yarn add react-tiktok-style-video-scroller
```

```bash
pnpm add react-tiktok-style-video-scroller
```

### Peer Dependencies

This package requires React 18 or higher:

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0"
}
```

## Quick Start

```tsx
import { VideoScroller } from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css'; // Optional base styles

const videos = [
  {
    id: '1',
    videoUrl: 'https://example.com/video1.mp4',
    thumbnailUrl: 'https://example.com/thumb1.jpg',
    title: 'My First Video',
    description: 'This is a great video',
    likeCount: 1234,
    hasLiked: false,
  },
  // ... more videos
];

function App() {
  return (
    <VideoScroller
      videos={videos}
      onLike={(video, liked) => console.log('Liked:', video.id, liked)}
      onShare={(video) => console.log('Share:', video.id)}
    />
  );
}
```

## Examples

### Basic Usage

The simplest way to use the video scroller with static data:

```tsx
import { useState } from 'react';
import { VideoScroller, Video } from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css';

function App() {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      videoUrl: 'https://example.com/video1.mp4',
      title: 'Amazing Video',
      likeCount: 100,
      hasLiked: false,
    },
    // ... more videos
  ]);

  const handleLike = (video: Video, liked: boolean) => {
    setVideos(prev =>
      prev.map(v =>
        v.id === video.id
          ? { ...v, hasLiked: liked, likeCount: (v.likeCount || 0) + (liked ? 1 : -1) }
          : v
      )
    );
  };

  return (
    <VideoScroller
      videos={videos}
      onLike={handleLike}
      onShare={(video) => {
        navigator.clipboard.writeText(`https://myapp.com/watch/${video.id}`);
        alert('Link copied!');
      }}
    />
  );
}
```

### Infinite Loading

Load more videos as the user scrolls using the `useVideoScroller` hook:

```tsx
import { useEffect } from 'react';
import { VideoScroller, useVideoScroller } from 'react-tiktok-style-video-scroller';

// Your API response should match this structure:
// {
//   videos: Video[],
//   hasNextPage: boolean,
//   nextCursor: string | null
// }

function App() {
  const {
    videos,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore,
    updateVideo,
  } = useVideoScroller({
    fetchVideos: async (cursor) => {
      const response = await fetch(`/api/videos?cursor=${cursor || ''}&limit=10`);
      return response.json();
    },
  });

  // Initial load
  useEffect(() => {
    fetchMore();
  }, []);

  const handleLike = async (video, liked) => {
    // Optimistic update for instant feedback
    updateVideo(video.id, {
      hasLiked: liked,
      likeCount: video.likeCount + (liked ? 1 : -1),
    });

    // Sync with server
    await fetch(`/api/videos/${video.id}/like`, {
      method: liked ? 'POST' : 'DELETE',
    });
  };

  return (
    <VideoScroller
      videos={videos}
      isInitialLoading={isLoading && videos.length === 0}
      isLoading={isFetchingMore}
      hasMore={hasMore}
      onFetchMore={fetchMore}
      onLike={handleLike}
    />
  );
}
```

### Custom Overlay

Create a completely custom UI overlay for your videos:

```tsx
import { VideoScroller, Video, VideoItemState } from 'react-tiktok-style-video-scroller';

function CustomOverlay({
  video,
  state,
  onLike
}: {
  video: Video;
  state: VideoItemState;
  onLike: () => void;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Play/Pause indicator */}
      {!state.isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-4">
            <PlayIcon className="w-12 h-12 text-white" />
          </div>
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-16 pointer-events-auto">
        <h3 className="text-white font-bold">{video.title}</h3>
        <p className="text-white/80 text-sm">{video.description}</p>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4 pointer-events-auto">
        <button onClick={onLike} className="flex flex-col items-center">
          <HeartIcon filled={video.hasLiked} />
          <span className="text-white text-xs">{video.likeCount}</span>
        </button>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
        <div
          className="h-full bg-red-500 transition-all"
          style={{ width: `${state.progress}%` }}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <VideoScroller
      videos={videos}
      renderOverlay={(video, state) => (
        <CustomOverlay
          video={video}
          state={state}
          onLike={() => handleLike(video)}
        />
      )}
    />
  );
}
```

### Custom Theme

Apply your brand colors with the theme system:

```tsx
import { VideoScroller, createTheme, themes } from 'react-tiktok-style-video-scroller';

// Use a preset theme
<VideoScroller videos={videos} theme={themes.youtube} />

// Or create a custom theme
const myTheme = createTheme({
  primaryColor: '#your-brand-color',
  backgroundColor: '#1a1a2e',
  textColor: '#eaeaea',
  progressBarHeight: 4,
});

<VideoScroller videos={videos} theme={myTheme} />
```

**Available preset themes:**
- `themes.default` - Pink accent (#ff0050)
- `themes.tiktok` - TikTok red (#fe2c55)
- `themes.youtube` - YouTube red (#ff0000)
- `themes.instagram` - Instagram pink (#e1306c)
- `themes.light` - Light mode theme

## API Reference

### VideoScroller Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videos` | `Video[]` | **Required** | Array of video objects to display |
| `onFetchMore` | `() => void` | - | Callback when more videos should be loaded |
| `hasMore` | `boolean` | `false` | Whether there are more videos to load |
| `isLoading` | `boolean` | `false` | Whether videos are currently being fetched |
| `isInitialLoading` | `boolean` | `false` | Whether the initial load is in progress |
| `onVideoComplete` | `(video: Video) => void` | - | Callback when a video finishes playing |
| `onLike` | `(video: Video, liked: boolean) => void` | - | Callback when like is toggled |
| `onShare` | `(video: Video) => void` | - | Callback when share is triggered |
| `onVideoPlay` | `(video: Video) => void` | - | Callback when a video starts playing |
| `onVideoPause` | `(video: Video) => void` | - | Callback when a video is paused |
| `onProgress` | `(video: Video, progress: number, currentTime: number) => void` | - | Callback for progress updates |
| `renderOverlay` | `(video: Video, state: VideoItemState) => ReactNode` | - | Custom overlay renderer |
| `renderLoading` | `() => ReactNode` | - | Custom loading component |
| `renderEmpty` | `() => ReactNode` | - | Custom empty state component |
| `renderLoadingMore` | `() => ReactNode` | - | Custom "loading more" component |
| `theme` | `VideoScrollerTheme` | Default theme | Theme configuration |
| `config` | `VideoScrollerConfig` | Default config | Behavior configuration |
| `className` | `string` | - | Additional CSS class |
| `style` | `CSSProperties` | - | Additional inline styles |

### Video Object

```typescript
interface Video {
  id: string | number;        // Unique identifier (required)
  videoUrl: string;           // URL to video file (required)
  thumbnailUrl?: string;      // Poster/thumbnail image
  title?: string;             // Video title
  description?: string;       // Video description
  likeCount?: number;         // Number of likes
  hasLiked?: boolean;         // Whether current user liked
  commentCount?: number;      // Number of comments
  duration?: number;          // Duration in seconds
  [key: string]: unknown;     // Additional custom data
}
```

### Configuration Options

```typescript
interface VideoScrollerConfig {
  overscan?: number;           // Items to render outside viewport (default: 1)
  loadMoreThreshold?: number;  // Intersection threshold for load trigger (default: 0.1)
  loadMoreOffset?: number;     // Items from end to trigger load (default: 3)
  autoPlay?: boolean;          // Auto-play videos in view (default: true)
  autoPlayThreshold?: number;  // Visibility threshold for autoplay (default: 0.75)
  loop?: boolean;              // Loop videos (default: true)
  muted?: boolean;             // Start muted (default: true, required for autoplay)
  heightOffset?: number;       // Height offset for navbar etc. (default: 0)
  keyboardNavigation?: boolean; // Enable keyboard nav (default: true)
}
```

**Example with navbar offset:**

```tsx
<VideoScroller
  videos={videos}
  config={{
    heightOffset: 64, // 64px navbar
    loadMoreOffset: 5, // Load more when 5 videos from end
  }}
/>
```

### Theme Options

```typescript
interface VideoScrollerTheme {
  primaryColor?: string;       // Like button, progress bar (default: '#ff0050')
  backgroundColor?: string;    // Container background (default: '#000000')
  textColor?: string;          // Text color (default: '#ffffff')
  mutedIconBackground?: string; // Muted icon bg (default: 'rgba(0,0,0,0.5)')
  progressBarHeight?: number;  // Progress bar height in px (default: 3)
  progressBarBackground?: string; // Progress track color
}
```

### Ref Methods

Access the scroller programmatically using a ref:

```tsx
import { useRef } from 'react';
import { VideoScroller, VideoScrollerRef } from 'react-tiktok-style-video-scroller';

function App() {
  const scrollerRef = useRef<VideoScrollerRef>(null);

  return (
    <>
      <VideoScroller ref={scrollerRef} videos={videos} />

      {/* Control buttons */}
      <button onClick={() => scrollerRef.current?.scrollToIndex(0)}>
        Back to top
      </button>
      <button onClick={() => scrollerRef.current?.toggleMute()}>
        Toggle sound
      </button>
    </>
  );
}
```

**Available methods:**

| Method | Description |
|--------|-------------|
| `scrollToIndex(index: number)` | Scroll to video by index |
| `scrollToVideo(videoId: string \| number)` | Scroll to video by ID |
| `getCurrentIndex()` | Get current visible video index |
| `play()` | Play current video |
| `pause()` | Pause current video |
| `toggleMute()` | Toggle mute state |

## Hooks

### useVideoScroller

A hook for managing video feed state with pagination:

```typescript
const {
  videos,          // Video[] - Current video list
  isLoading,       // boolean - Initial loading state
  isFetchingMore,  // boolean - Loading more state
  hasMore,         // boolean - More videos available
  error,           // Error | null - Any error that occurred
  fetchMore,       // () => Promise<void> - Load next page
  refresh,         // () => Promise<void> - Refresh from start
  addVideo,        // (video, position?) => void - Add video
  removeVideo,     // (videoId) => void - Remove video
  updateVideo,     // (videoId, updates) => void - Update video
  setVideos,       // (videos) => void - Replace all videos
} = useVideoScroller({
  initialVideos: [],  // Optional initial videos
  fetchVideos: async (cursor) => { ... },  // Your fetch function
  pageSize: 10,  // Videos per page
});
```

## Utilities

### handleShare

Built-in share utility with Web Share API support and clipboard fallback:

```tsx
import { handleShare, createShareHandler } from 'react-tiktok-style-video-scroller';

// Direct usage
<VideoScroller
  videos={videos}
  onShare={(video) => handleShare(video, {
    baseUrl: 'https://myapp.com',
    pathPattern: '/watch/:id',  // :id is replaced with video.id
    onShareSuccess: (video) => analytics.track('share', video.id),
    onCopySuccess: (video, url) => toast.success('Link copied!'),
    onShareError: (video, error) => console.error(error),
  })}
/>

// Create a reusable handler
const shareVideo = createShareHandler({
  baseUrl: 'https://myapp.com',
  pathPattern: '/watch/:id',
});

<VideoScroller videos={videos} onShare={shareVideo} />
```

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 88+ |
| Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |
| iOS Safari | 14+ |
| Android Chrome | 88+ |

**Note:** Videos are muted by default because browsers require user interaction before playing audio. Users can tap/click to unmute.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT - see [LICENSE](LICENSE) for details.

---

Made with love for the React community.
