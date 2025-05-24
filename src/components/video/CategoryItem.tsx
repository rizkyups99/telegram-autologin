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
  return <div className="border rounded-lg overflow-hidden" data-unique-id="c7300887-7822-4a40-bdee-53599a7ac57c" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-4 flex items-center justify-between cursor-pointer" onClick={onToggleExpand} data-unique-id="1d67296f-3f77-4113-b944-8ce99ef095d1" data-file-name="components/video/CategoryItem.tsx">
        <div data-unique-id="4d1156d2-9a28-48e8-9f91-1ddd8744fd07" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          <h3 className="font-semibold text-lg" data-unique-id="3fd1cbfb-8960-41d8-864a-ace521688416" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-sm text-muted-foreground" data-unique-id="93153108-a0e5-49e1-bd27-9ac029a6ec1f" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" data-unique-id="7fae7471-3c11-4c5f-a78f-c0a3b8c3c7fd" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        </Button>
      </div>
      
      {isExpanded && <div className="p-4 space-y-4" data-unique-id="e2292c3b-dff3-41b2-bf5e-1abdfb870a51" data-file-name="components/video/CategoryItem.tsx" data-dynamic-text="true">
          {category.videos.map(video => <VideoItem key={video.id} video={video} onSelect={onSelectVideo} onInlinePlay={onInlineVideoPlay} isPlaying={inlineVideoPlaying?.id === video.id} />)}
        </div>}
    </div>;
}