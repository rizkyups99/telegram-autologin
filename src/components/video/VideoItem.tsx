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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="389330e9-7f68-42a1-bbe4-17a210c35905" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="86e86298-7290-4892-9dde-ce4aeb17c4e5" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="7f0cffb1-63e4-4539-827b-a9c8d34ad6f0" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="18b6185e-84f3-4dd0-bd5c-2abaf9d6f03c" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="fe04f559-a966-4840-8021-e80e9495f3c9" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="3bf5c741-33cc-41ff-9744-8b0aac4ef52a" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="aa52ddc6-c3f3-44f6-a572-53a9a2dc415f" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline" data-unique-id="6d34eba6-9b99-4880-90b5-1a13a07f8349" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="172d91c2-6727-4d43-8dc5-a918bad1f4f0" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="f296436d-552f-4a23-b296-787afa4a6b6d" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}