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
  return <div className="flex flex-col p-2 hover:bg-muted rounded-md" data-unique-id="094dc8b4-b5c7-46e8-abce-dcd59c5cd3e0" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="4326de96-22bd-4760-976d-75de21706224" data-file-name="components/video/VideoItem.tsx">
        <div className="flex-1" data-unique-id="7313f711-6601-4385-b234-8eb49edb6a1a" data-file-name="components/video/VideoItem.tsx">
          <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="55d760ff-3d1d-45a0-809a-f216c9cc3cf3" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">{video.title}</p>
        </div>
        <Button onClick={handleClick} variant="outline" size="sm" className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm" data-unique-id="226eb98b-26e7-4f35-a423-5f081836be85" data-file-name="components/video/VideoItem.tsx" data-dynamic-text="true">
          {isPlaying ? <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <span className="hidden xs:inline" data-unique-id="ea862dc9-3a4d-4bdc-98e1-b268cd70d626" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="d863eccf-9af6-478a-b54d-a420eb843507" data-file-name="components/video/VideoItem.tsx">Pause</span></span>
            </> : <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              <span className="hidden xs:inline" data-unique-id="01fd36ce-bfbb-4f68-b0ca-63bdaa47262a" data-file-name="components/video/VideoItem.tsx"><span className="editable-text" data-unique-id="31e272e6-53ea-49fc-adf3-1a9fff6a7191" data-file-name="components/video/VideoItem.tsx">Lihat</span></span>
            </>}
        </Button>
      </div>
      
      {isPlaying && <div className="mt-3 w-full" data-unique-id="9f69edad-d4ce-4d77-8aa1-3ffaf89fdbd4" data-file-name="components/video/VideoItem.tsx">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>}
    </div>;
}