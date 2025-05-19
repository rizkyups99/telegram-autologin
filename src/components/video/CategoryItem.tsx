'use client';

import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import { VideoItem } from './VideoItem';
import { Video, Category } from './videoHooks';

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSelectVideo: (video: Video) => void;
  onInlineVideoPlay?: (video: Video) => void;
  inlineVideoPlaying?: Video | null;
}

export function CategoryItem({ 
  category, 
  isExpanded, 
  onToggleExpand, 
  onSelectVideo,
  onInlineVideoPlay,
  inlineVideoPlaying
}: CategoryItemProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="bg-muted p-4 flex items-center justify-between cursor-pointer"
        onClick={onToggleExpand}
      >
        <div>
          <h3 className="font-semibold text-lg">{category.name}</h3>
          {category.description && (
            <p className="text-sm text-muted-foreground">{category.description}</p>
          )}
        </div>
        <Button variant="ghost" size="sm">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4">
          {category.videos.map(video => (
            <VideoItem
              key={video.id}
              video={video}
              onSelect={onSelectVideo}
              onInlinePlay={onInlineVideoPlay}
              isPlaying={inlineVideoPlaying?.id === video.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
