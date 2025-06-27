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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="4cb9a6b3-f803-49c0-ab93-6f609f05d6df" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={onToggleExpand} data-unique-id="f0025bfc-a483-4908-9450-53a33f63feaf" data-file-name="components/video/CategoryItem.tsx">
        <div data-unique-id="9e6255df-086e-4509-8ab4-48f37cc30b77" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="8d7d9172-6384-4cc3-bbad-28d26b91c782" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="e6256060-ae36-4e2e-874f-3c689214a4e0" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="07ca1113-9ac2-40e8-9b39-9b3d7eb62efb" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 space-y-4" data-unique-id="ddaa2ea5-8f47-43f8-b993-cf2b50c5ce6b" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {category.videos.map(video => <VideoItem key={video.id} video={video} onSelect={onSelectVideo} onInlinePlay={onInlineVideoPlay} isPlaying={inlineVideoPlaying?.id === video.id} />)}
        </div>}
    </div>;
}