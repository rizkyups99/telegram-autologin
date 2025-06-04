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
  return <Card data-unique-id="c0670859-13a4-4a40-9662-e289aa8103b0" data-file-name="components/preview/video/VideoPreview.tsx">
      <CardContent className="p-6" data-unique-id="85394747-1642-4663-a1a2-9e60763aaf45" data-file-name="components/preview/video/VideoPreview.tsx">
        <div className="w-full" data-unique-id="f295fd36-23f7-45af-adae-ed142bc38e7b" data-file-name="components/preview/video/VideoPreview.tsx" data-dynamic-text="true">
          {isLoading ? <VideoLoadingIndicator /> : categories.length === 0 ? <EmptyVideoList /> : <VideoList categories={categories} onSelectVideo={handleViewVideo} />}
        </div>
      </CardContent>
    </Card>;
}