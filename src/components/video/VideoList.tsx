'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { CategoryItem } from './CategoryItem';
import { VideoPlayer } from './VideoPlayer';
import { Video, Category } from './videoHooks';
interface VideoListProps {
  categories: Category[];
  onSelectVideo: (video: Video) => void;
}
export function VideoList({
  categories,
  onSelectVideo
}: VideoListProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(Object.fromEntries(categories.map(category => [category.id, true])));
  const [inlineVideoPlaying, setInlineVideoPlaying] = useState<Video | null>(null);
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  const handleInlineVideoPlay = (video: Video) => {
    setInlineVideoPlaying(video === inlineVideoPlaying ? null : video);
  };
  return <div className="space-y-6" data-unique-id="f52b74f1-4ea2-49ae-9514-1aa50bcee8f1" data-file-name="components/video/VideoList.tsx" data-dynamic-text="true">
      {categories.map(category => <CategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} onToggleExpand={() => toggleCategory(category.id)} onSelectVideo={onSelectVideo} onInlineVideoPlay={handleInlineVideoPlay} inlineVideoPlaying={inlineVideoPlaying} />)}
    </div>;
}