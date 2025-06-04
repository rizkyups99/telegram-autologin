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
  return <div className="space-y-6" data-unique-id="b1ca847e-354b-4be9-a37e-bc613fcd1551" data-file-name="components/video/VideoList.tsx" data-dynamic-text="true">
      {categories.map(category => <CategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} onToggleExpand={() => toggleCategory(category.id)} onSelectVideo={onSelectVideo} onInlineVideoPlay={handleInlineVideoPlay} inlineVideoPlaying={inlineVideoPlaying} />)}
    </div>;
}