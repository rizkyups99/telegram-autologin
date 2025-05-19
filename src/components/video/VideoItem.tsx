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

export function VideoItem({ video, onSelect, onInlinePlay, isPlaying = false }: VideoItemProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const handleClick = () => {
    if (onInlinePlay) {
      onInlinePlay(video);
      setShowPlayer(!showPlayer);
    } else {
      onSelect(video);
    }
  };

  return (
    <div className="flex flex-col p-2 hover:bg-muted rounded-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-medium text-sm sm:text-base line-clamp-2">{video.title}</p>
        </div>
        <Button 
          onClick={handleClick}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 ml-2 h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Pause</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Lihat</span>
            </>
          )}
        </Button>
      </div>
      
      {isPlaying && (
        <div className="mt-3 w-full">
          <VideoPlayer video={video} categoryName={undefined} />
        </div>
      )}
    </div>
  );
}
