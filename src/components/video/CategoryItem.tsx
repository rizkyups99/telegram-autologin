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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="e56daa2e-a0b5-40a2-b7e9-b18fda51aecc" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={onToggleExpand} data-unique-id="2b414bb8-ee37-42e2-ac8a-e58a2cde0fd4" data-file-name="components/video/CategoryItem.tsx">
        <div data-unique-id="0f736911-ed36-4fe0-96c8-bdf12b72fe6e" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="86ad363b-f192-4e58-86a1-e6be63527c33" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="073ff178-fd77-4e90-8660-0a5d7dfe3fc7" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="34ec46bb-453b-4d0c-979c-18eb0f821a26" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 space-y-4" data-unique-id="9bef7653-d86e-4270-a83f-1e5d47878596" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {category.videos.map(video => <VideoItem key={video.id} video={video} onSelect={onSelectVideo} onInlinePlay={onInlineVideoPlay} isPlaying={inlineVideoPlaying?.id === video.id} />)}
        </div>}
    </div>;
}