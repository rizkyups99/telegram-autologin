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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="51f8074d-b925-4692-8365-438fc3b9d718" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="2d191e8c-ac93-47d3-845b-92d388ee9640" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="ce8aba78-0094-4d54-9b37-d4cf3f8ea553" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="749397ed-e4d5-45f1-a910-314672515e4d" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="8acebecf-1695-4c7a-9cfb-e9a650bda9c5" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span className="hidden xs:inline" data-unique-id="884865d6-8c58-4ec2-96a0-5421065349a8" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="e1077bf4-4a10-4f48-b439-ca117c378d79" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="hidden xs:inline" data-unique-id="eb9263a7-48ac-452d-bf59-90a6527b29c1" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="18117a74-2a07-4cc1-8ba5-d76906d4433e" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="ce216a45-f267-41dd-a207-ef1d3d47f831" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}