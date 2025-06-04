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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="12a75804-51ab-429f-8c22-0e02af5d76aa" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={onToggleExpand} data-unique-id="a66b5c88-fac0-44cf-acfa-eb54f52bceed" data-file-name="components/video/CategoryItem.tsx">
        <div data-unique-id="92ba8ed9-7f88-4b21-967e-3837eb1d2798" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="4149270e-b978-4d9b-9d11-73ca816a1181" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="94f5f8c3-0835-4f11-a14b-a42c5c16d100" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="2532a785-e66e-450a-929b-c50587bb68ca" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 space-y-4" data-unique-id="2e9193d0-e6f1-43c1-a9ca-393b31096674" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {category.videos.map(video => <VideoItem key={video.id} video={video} onSelect={onSelectVideo} onInlinePlay={onInlineVideoPlay} isPlaying={inlineVideoPlaying?.id === video.id} />)}
        </div>}
    </div>;
}