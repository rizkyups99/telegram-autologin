'use client';

import { useState, useEffect } from 'react';

// Type definitions
export interface Video {
  id: number;
  title: string;
  videoUrl: string;
  categoryId: number;
  categoryName?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  videos: Video[];
}

// YouTube API interface - placed in a d.ts file in a real project
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            autoplay?: number;
            controls?: number;
            rel?: number;
            modestbranding?: number;
            playsinline?: number;
          };
          events?: {
            onReady?: (event: any) => void;
            onStateChange?: (event: any) => void;
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        mute: () => void;
        unMute: () => void;
        isMuted: () => boolean;
        getDuration: () => number;
        getCurrentTime: () => number;
        seekTo: (seconds: number) => void;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// Function to convert YouTube URL to embed URL and extract video ID
export const getYoutubeEmbedInfo = (url: string) => {
  let videoId = '';
  
  if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(new URL(url).search);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  
  return {
    embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1` : url,
    videoId
  };
};

// Utility hook to format time
export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Custom hook to fetch videos grouped by category
export function useVideosData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchVideosGroupedByCategory() {
      try {
        setIsLoading(true);
        
        // Fetch categories
        const catResponse = await fetch('/api/categories');
        const categoriesData = await catResponse.json();
        
        // Fetch videos with ascending sort order
        const videosResponse = await fetch('/api/videos?sort=asc');
        const videosData = await videosResponse.json();
        
        // Ensure videos are sorted by ID in ascending order
        if (videosData && videosData.videos) {
          videosData.videos.sort((a: Video, b: Video) => a.id - b.id);
        }
        
        // Group videos by category
        const videosByCategory = categoriesData.map((category: any) => {
          const categoryVideos = videosData.videos?.filter((video: Video) => 
            video.categoryId === category.id
          ) || [];
          
          return {
            ...category,
            videos: categoryVideos
          };
        }).filter((category: Category) => category.videos.length > 0);
        
        setCategories(videosByCategory);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVideosGroupedByCategory();
  }, []);
  
  return { categories, isLoading };
}
