/**
 * Infinite Scroll Example
 *
 * This example demonstrates how to use the VideoScroller with infinite loading
 * using the useVideoScroller hook and a mock API.
 */

import React, { useEffect } from 'react';
import {
  VideoScroller,
  useVideoScroller,
  Video,
  VideoFeedResponse,
} from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css';

// Mock API function - replace with your actual API call
async function fetchVideosFromAPI(cursor?: string | null): Promise<VideoFeedResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Parse cursor to get page number
  const page = cursor ? parseInt(cursor, 10) : 0;
  const pageSize = 5;
  const totalVideos = 50;

  // Generate mock videos
  const videos: Video[] = Array.from({ length: pageSize }, (_, i) => {
    const id = page * pageSize + i + 1;
    return {
      id: String(id),
      videoUrl: `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`,
      thumbnailUrl: `https://picsum.photos/seed/${id}/400/700`,
      title: `Video #${id}`,
      description: `This is the description for video number ${id}. It demonstrates infinite scrolling.`,
      likeCount: Math.floor(Math.random() * 10000),
      hasLiked: Math.random() > 0.7,
      commentCount: Math.floor(Math.random() * 500),
    };
  });

  const hasNextPage = (page + 1) * pageSize < totalVideos;

  return {
    videos,
    hasNextPage,
    nextCursor: hasNextPage ? String(page + 1) : null,
    totalCount: totalVideos,
  };
}

export function InfiniteScrollExample() {
  const {
    videos,
    isLoading,
    isFetchingMore,
    hasMore,
    error,
    fetchMore,
    updateVideo,
  } = useVideoScroller({
    fetchVideos: fetchVideosFromAPI,
  });

  // Initial load
  useEffect(() => {
    fetchMore();
  }, []);

  const handleLike = async (video: Video, liked: boolean) => {
    // Optimistic update
    updateVideo(video.id, {
      hasLiked: liked,
      likeCount: (video.likeCount || 0) + (liked ? 1 : -1),
    });

    // In a real app, you would make an API call here:
    // await api.likeVideo(video.id, liked);
  };

  const handleShare = (video: Video) => {
    const url = `https://myapp.com/watch/${video.id}`;

    if (navigator.share) {
      navigator.share({ title: video.title, url });
    } else {
      navigator.clipboard.writeText(url);
      console.log('Link copied:', url);
    }
  };

  if (error) {
    return (
      <div style={{ padding: 20, color: 'red' }}>
        Error loading videos: {error.message}
        <button onClick={() => fetchMore()}>Retry</button>
      </div>
    );
  }

  return (
    <VideoScroller
      videos={videos}
      isInitialLoading={isLoading && videos.length === 0}
      isLoading={isFetchingMore}
      hasMore={hasMore}
      onFetchMore={fetchMore}
      onLike={handleLike}
      onShare={handleShare}
      config={{
        heightOffset: 64, // Adjust for navbar
        loadMoreOffset: 3, // Load more when 3 videos from end
      }}
      renderLoadingMore={() => (
        <div
          style={{
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '12px 24px',
            borderRadius: 20,
            color: 'white',
          }}
        >
          Loading more videos...
        </div>
      )}
    />
  );
}

export default InfiniteScrollExample;
