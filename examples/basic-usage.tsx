/**
 * Basic Usage Example
 *
 * This example demonstrates the simplest way to use the VideoScroller component
 * with static video data.
 */

import React from 'react';
import { VideoScroller, Video } from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css';

// Sample video data
const sampleVideos: Video[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies.',
    likeCount: 12500,
    hasLiked: false,
    commentCount: 342,
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'Elephant Dream',
    description: 'The first Blender Open Movie from 2006.',
    likeCount: 8700,
    hasLiked: true,
    commentCount: 156,
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    title: 'For Bigger Blazes',
    description: 'HBO GO now icons Notes On Blind.',
    likeCount: 3200,
    hasLiked: false,
    commentCount: 89,
  },
];

export function BasicExample() {
  const handleLike = (video: Video, liked: boolean) => {
    console.log(`Video ${video.id} ${liked ? 'liked' : 'unliked'}`);
  };

  const handleShare = (video: Video) => {
    console.log(`Sharing video ${video.id}: ${video.title}`);
    // Use native share or copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: video.title,
        url: `https://myapp.com/watch/${video.id}`,
      });
    } else {
      navigator.clipboard.writeText(`https://myapp.com/watch/${video.id}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleVideoComplete = (video: Video) => {
    console.log(`Video ${video.id} finished playing`);
  };

  return (
    <VideoScroller
      videos={sampleVideos}
      onLike={handleLike}
      onShare={handleShare}
      onVideoComplete={handleVideoComplete}
      config={{
        heightOffset: 0, // Adjust if you have a navbar
      }}
    />
  );
}

export default BasicExample;
