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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="47eb744f-fbef-4fae-9564-be6afb203ef4" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={onToggleExpand} data-unique-id="f073a575-31f3-48f9-a178-9305b7c798ce" data-file-name="components/video/CategoryItem.tsx">
        <div data-unique-id="6486a1c6-9068-4a63-9978-38d1449c5633" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="19f563bc-6255-4eae-af10-171e138c8d30" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="eeaae58d-d57c-4635-b71a-874c67347933" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="0c8df8f9-6427-49df-a80d-339194b18101" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 space-y-4" data-unique-id="40f1ca71-60c3-4f7d-ad36-d82a82bf6abd" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {category.videos.map(video => <VideoItem key={video.id} video={video} onSelect={onSelectVideo} onInlinePlay={onInlineVideoPlay} isPlaying={inlineVideoPlaying?.id === video.id} />)}
        </div>}
    </div>;
}