'use client';

import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';
import { Video } from './videoHooks';
import { VideoPlayer } from './VideoPlayer';
import { useState } from 'react';
interface VideoItemProps {
  video: Video;
  onSelect: (video: Video) => void;
  onInlinePlay?: (video: Video) => void;
  isPlaying?: boolean;
}
export function VideoItem({
  video,
  onSelect,
  onInlinePlay,
  isPlaying = false
}: VideoItemProps) {
  const [showPlayer, setShowPlayer] = useState(false);
  const handleClick = () => {
    if (onInlinePlay) {
      onInlinePlay(video);
      setShowPlayer(!showPlayer);
    } else {
      onSelect(video);
    }
  };
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="cd8d1344-4d1d-4cb2-bca6-e979efdb9d91" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="84627cad-96de-4ce6-b4a3-b4d0aef7285e" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="98560259-7b33-49c4-8a31-55ef23e7f805" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="e0a33050-6643-4708-a626-77a302ecd9f9" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="5ad95738-dbc0-400a-ab83-6463dc8eb63a" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span className="hidden xs:inline" data-unique-id="a705aa7f-1f2e-4a6b-9ef3-ea3af770e630" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="ecd4eee7-b9bd-49f7-b966-3366b78c279a" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="hidden xs:inline" data-unique-id="81822113-d2ae-4c1d-8b0b-aa1eb719e84d" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="00ececd8-0de8-45fa-b376-d945b09888d8" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="d29b3ce5-239d-4da6-b599-9f6036375a00" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}