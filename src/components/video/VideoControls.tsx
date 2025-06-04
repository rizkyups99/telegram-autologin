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
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20" data-unique-id="b547ae3f-5948-4f68-9faa-971395769580" data-file-name="components/video/VideoControls.tsx">
      <div className="flex flex-col gap-1" data-unique-id="06fe2134-cb3e-465d-b0e5-53b5cb3402d5" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="4fa9e226-a7db-419a-9a75-2a7e468ad0fd" data-file-name="components/video/VideoControls.tsx">
          <span className="text-white text-xs" data-unique-id="8d14bcb8-26cd-4bf6-9dc9-4a996decb670" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1" data-unique-id="7b0e202e-86a4-44bb-8ace-3c4d16590e3c" data-file-name="components/video/VideoControls.tsx">
            <input type="range" min="0" max={videoDuration || 100} value={videoProgress} onChange={onSeek} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="7381aaa2-680e-4dfd-af9a-caf078d2ca92" data-file-name="components/video/VideoControls.tsx" />
          </div>
          <span className="text-white text-xs" data-unique-id="93d8adff-e5d1-47ac-9ea9-0e83114f8c57" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="0b04f386-4f3e-4532-9d21-9a6688ff80b1" data-file-name="components/video/VideoControls.tsx">
          <Button onClick={onTogglePlay} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="4c768501-1249-42c2-9f68-ebff7f2fd848" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Button onClick={onToggleMute} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="9fd5f02f-aa60-4794-92a2-6dfe1d60b2cd" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2" data-unique-id="ca9ef536-f3a4-4d2b-93e2-da0146303f53" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {/* Mobile zoom controls */}
            {isMobile && <>
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="b81d9b24-f1fd-4478-897a-bfefc30d0e4f" data-file-name="components/video/VideoControls.tsx">
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="05aa61d5-7f8b-4d15-b3eb-7edcc97e7951" data-file-name="components/video/VideoControls.tsx">
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>}
            
            <Button onClick={onToggleFullscreen} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="05e50565-1a65-4f56-8100-2eb8d8a21f37" data-file-name="components/video/VideoControls.tsx">
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}