'use client';

import { Button } from '../ui/button';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ZoomIn, ZoomOut } from 'lucide-react';
import { formatTime } from './videoHooks';
import { useState, useEffect } from 'react';
interface VideoControlsProps {
  videoProgress: number;
  videoDuration: number;
  isPlaying: boolean;
  isMuted: boolean;
  onSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
}
export function VideoControls({
  videoProgress,
  videoDuration,
  isPlaying,
  isMuted,
  onSeek,
  onTogglePlay,
  onToggleMute,
  onToggleFullscreen
}: VideoControlsProps) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if on mobile device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768);
      };
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, []);
  const handleZoomIn = () => {
    if (zoomLevel < 150) {
      const newZoom = Math.min(zoomLevel + 10, 150);
      setZoomLevel(newZoom);

      // Apply zoom to video container
      const videoContainer = document.querySelector('.video-container') as HTMLElement;
      if (videoContainer) {
        videoContainer.style.transform = `scale(${newZoom / 100})`;
        videoContainer.style.transformOrigin = 'center center';
      }
    }
  };
  const handleZoomOut = () => {
    if (zoomLevel > 70) {
      const newZoom = Math.max(zoomLevel - 10, 70);
      setZoomLevel(newZoom);

      // Apply zoom to video container
      const videoContainer = document.querySelector('.video-container') as HTMLElement;
      if (videoContainer) {
        videoContainer.style.transform = `scale(${newZoom / 100})`;
        videoContainer.style.transformOrigin = 'center center';
      }
    }
  };
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20" data-unique-id="00e8ca8d-8ec9-40b0-81cb-156e393d787c" data-file-name="components/video/VideoControls.tsx">
      <div className="flex flex-col gap-1" data-unique-id="d46e030d-dc02-41e2-bdc7-44dc514ef2df" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="a09e07d5-7c86-4125-926c-5775e25b3b19" data-file-name="components/video/VideoControls.tsx">
          <span className="text-white text-xs" data-unique-id="8546fd8f-12a0-4df0-9926-3de72b5cd8d7" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1" data-unique-id="e57308a9-ce7b-4cd8-8532-51b0e9b2dab2" data-file-name="components/video/VideoControls.tsx">
            <input type="range" min="0" max={videoDuration || 100} value={videoProgress} onChange={onSeek} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="d442e0a4-b4db-464f-9f29-ae7d37149540" data-file-name="components/video/VideoControls.tsx" />
          </div>
          <span className="text-white text-xs" data-unique-id="420839c7-4e13-4f5b-8600-fc533a2156b1" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="5b49e9b2-ab19-4f01-8bb4-852e5e20a235" data-file-name="components/video/VideoControls.tsx">
          <Button onClick={onTogglePlay} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="b919c51f-d5ee-4e6b-9e5c-3f966ccda4fa" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Button onClick={onToggleMute} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="e63f6bd7-ca5d-4021-9224-031676b20654" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2" data-unique-id="ed618879-991a-4036-8250-5f950914864c" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {/* Mobile zoom controls */}
            {isMobile && <>
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="e70f2781-3db3-4654-aec9-c9a5a5543099" data-file-name="components/video/VideoControls.tsx">
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="3ce2e81a-192d-4ebe-a64b-f6b5edfc4376" data-file-name="components/video/VideoControls.tsx">
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>}
            
            <Button onClick={onToggleFullscreen} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="e219b09c-4faf-4f68-b8f4-178e9da0969a" data-file-name="components/video/VideoControls.tsx">
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}