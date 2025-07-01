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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="9ee37f15-7478-4be5-9c15-85df79d1d236" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="864ca901-d34f-48c0-8525-296132fe4c06" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="007cba22-46ad-4d74-974f-d80b5fe08e97" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="991bea32-a730-486c-95a3-9c5290a84f67" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="67db5d4e-9d3f-41a1-8a17-7e0e32abe887" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span className="hidden xs:inline" data-unique-id="809545a0-d882-4b40-86c9-2d1d6b7a2e65" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="14e91cf4-b5e7-4d90-a35b-469d26eca279" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="hidden xs:inline" data-unique-id="891788d4-8a7f-4f3f-917d-4db36d5c76a2" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="26f65097-e970-4947-a66d-4de671cc061f" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="26764fcc-0d7c-4b51-b3a5-7d457f2ddff9" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}