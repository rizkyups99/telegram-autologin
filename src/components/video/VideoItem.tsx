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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="440f63e5-4df5-4375-9a89-a6a466a105ae" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="8ff93ea0-5f44-41a1-9d4e-2d5e13c5e334" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="b49d618a-ba65-4ef6-8d71-72301074c37e" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="3bf97f44-05f7-4cbb-b6fa-766cf75b8ba5" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="2324c028-cb42-4fa0-8caf-b24b88920ec9" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="ef621672-d4fb-42d5-b317-e8fe33bbfab0" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="f80eed61-31f9-4588-8af8-f2d0e8e1184e" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="6345aa4d-b6d4-493a-b286-f02e6baa3d00" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="279cf726-a3b8-4145-b02f-677500c8af53" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="cc210dfe-405b-4076-8c95-8dcc24fd94ac" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}