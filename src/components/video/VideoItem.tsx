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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="ff80d805-78ca-4e37-9a77-4ef54d923e49" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="374d9e66-569d-4f8a-ab71-a6ee502c7c08" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="c232ba5b-eb77-4d2d-b2dd-f1c8919e41af" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="84b39544-2d8e-4b72-8fb5-5110d8767ed0" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="e86c457c-4a6f-454f-96a0-0f7996e9e4f1" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="31e77a63-5913-4811-9315-ff1e9052d45d" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="805d1859-7981-44c3-84b7-2f94e9967bf2" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="79af31a6-9e73-4339-b0a2-7ab3899276e3" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="d6d8b23a-15ba-4ac1-9098-b3dfcb5a85c0" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="9d7f7ffa-d4eb-4385-a047-405aeaf94843" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}