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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="5ea41934-0cef-4932-aafb-03b485c19b89" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="4cd03206-4c57-4fec-92b5-ae25a243286c" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="f4a5ae50-fd04-4c91-a654-69ff85210dba" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="5cd71535-42ff-433a-a85d-afabfb952092" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="f010785d-81c2-47d5-b649-9308c25231c8" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="96582ec0-adf1-4fbe-8dee-72d958cf9375" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="881532e3-85da-4012-9af7-ad260b41cb9a" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="191b5b31-89e0-480a-89c1-0c3dd9ce1ea7" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="b0c2e914-839a-4081-9387-642f6f6995c3" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="e7e0e192-f31d-4bab-91ba-c732077373da" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}