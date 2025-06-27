'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoList } from '@/components/video/VideoList';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { NoVideoSelected } from '@/components/video/NoVideoSelected';
import { VideoLoadingIndicator } from '@/components/video/VideoLoadingIndicator';
import { EmptyVideoList } from '@/components/video/EmptyVideoList';
import { Video, Category } from '@/components/video/videoHooks';
interface VideoPreviewProps {
  filterCategoryIds?: number[];
}
export default function VideoPreview({
  filterCategoryIds
}: VideoPreviewProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchVideosGroupedByCategory();
  }, [filterCategoryIds]);

  // Custom fetch function to replace the hook and support filtering
  const fetchVideosGroupedByCategory = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Fetch videos
      const videosResponse = await fetch('/api/videos?sort=asc');
      const videosData = await videosResponse.json();
      let videoList: Video[] = [];
      if (videosData && videosData.videos && Array.isArray(videosData.videos)) {
        videoList = videosData.videos;
      } else if (Array.isArray(videosData)) {
        videoList = videosData;
      }

      // Ensure videos are sorted by ID in ascending order
      if (Array.isArray(videoList)) {
        videoList.sort((a, b) => a.id - b.id);
      }

      // Group videos by category
      const videosByCategory = filteredCategories.map((category: any) => {
        const categoryVideos = videoList.filter(video => video.categoryId === category.id) || [];
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          videos: categoryVideos
        };
      }).filter((category: Category) => category.videos.length > 0);
      setCategories(videosByCategory);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleViewVideo = (video: Video) => {
    setSelectedVideo(video);
  };
  return <Card data-unique-id="e74a4421-743b-44f2-a8e3-656fd3b3b87a" data-file-name="components/preview/video/VideoPreview.tsx">
      <CardContent className="p-6" data-unique-id="4e616101-9d46-412d-9667-c84d32c09a62" data-file-name="components/preview/video/VideoPreview.tsx">
        <div className="w-full" data-unique-id="6ee7ff77-9640-43cc-b266-698b7b69b65e" data-file-name="components/preview/video/VideoPreview.tsx" data-dynamic-text="true">
          {isLoading ? <VideoLoadingIndicator /> : categories.length === 0 ? <EmptyVideoList /> : <VideoList categories={categories} onSelectVideo={handleViewVideo} />}
        </div>
      </CardContent>
    </Card>;
}