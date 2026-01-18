import { useState } from 'react';
import { VideoScroller, Video, themes } from 'react-tiktok-style-video-scroller';
import 'react-tiktok-style-video-scroller/styles.css';

// Sample videos using free public domain videos
const initialVideos: Video[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
    title: 'Big Buck Bunny',
    description: 'A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel.',
    likeCount: 12500,
    hasLiked: false,
    commentCount: 342,
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
    title: 'Elephants Dream',
    description: 'The first Blender Open Movie from 2006. A surreal journey through a mechanical world.',
    likeCount: 8700,
    hasLiked: true,
    commentCount: 156,
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
    title: 'For Bigger Blazes',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
    likeCount: 3200,
    hasLiked: false,
    commentCount: 89,
  },
  {
    id: '4',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
    title: 'For Bigger Escapes',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
    likeCount: 5400,
    hasLiked: false,
    commentCount: 201,
  },
  {
    id: '5',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    title: 'For Bigger Fun',
    description: 'Introducing Chromecast. The easiest way to enjoy online video and music on your TV.',
    likeCount: 7800,
    hasLiked: true,
    commentCount: 445,
  },
];

function App() {
  const [videos, setVideos] = useState<Video[]>(initialVideos);

  const handleLike = (video: Video, liked: boolean) => {
    console.log(`Video ${video.id} ${liked ? 'liked' : 'unliked'}`);
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? {
              ...v,
              hasLiked: liked,
              likeCount: (v.likeCount || 0) + (liked ? 1 : -1),
            }
          : v
      )
    );
  };

  const handleShare = (video: Video) => {
    console.log(`Sharing video: ${video.title}`);
    const url = `${window.location.origin}/watch/${video.id}`;

    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleVideoComplete = (video: Video) => {
    console.log(`Video completed: ${video.title}`);
  };

  const handleVideoPlay = (video: Video) => {
    console.log(`Playing: ${video.title}`);
  };

  return (
    <VideoScroller
      videos={videos}
      onLike={handleLike}
      onShare={handleShare}
      onVideoComplete={handleVideoComplete}
      onVideoPlay={handleVideoPlay}
      theme={themes.tiktok}
      config={{
        heightOffset: 0,
        autoPlay: true,
        loop: true,
      }}
    />
  );
}

export default App;
