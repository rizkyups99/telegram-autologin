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
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20" data-unique-id="7592b8b4-5aae-478a-9615-c647f70e6ae4" data-file-name="components/video/VideoControls.tsx">
      <div className="flex flex-col gap-1" data-unique-id="04ce90e2-fb97-44f6-84f6-e45ab1bf65de" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="1adca6e8-b452-4a88-a290-c6e7b4337bf3" data-file-name="components/video/VideoControls.tsx">
          <span className="text-white text-xs" data-unique-id="d6478986-ed10-4069-8656-23c8498060b0" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1" data-unique-id="cc273e92-d2fd-492b-b0f2-6ac733abd88a" data-file-name="components/video/VideoControls.tsx">
            <input type="range" min="0" max={videoDuration || 100} value={videoProgress} onChange={onSeek} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="e298243e-37a7-47d4-ba92-d08995675dc1" data-file-name="components/video/VideoControls.tsx" />
          </div>
          <span className="text-white text-xs" data-unique-id="3b0a4576-9e1f-48f7-a222-be2236ca26b5" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="eabe0de1-cca0-4d82-a6ed-762e9b58480a" data-file-name="components/video/VideoControls.tsx">
          <Button onClick={onTogglePlay} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="5b83d614-fb73-4537-9e6d-21910b0cae87" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Button onClick={onToggleMute} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="f8cead58-1c98-4fb5-8a28-94015a267b11" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2" data-unique-id="a22a1e85-8fe1-48a0-ba17-addf67b0f20c" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {/* Mobile zoom controls */}
            {isMobile && <>
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="825d0a8b-c841-4ae6-8ef2-6b33f261b56c" data-file-name="components/video/VideoControls.tsx">
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="5fb183e5-f05b-4bdd-833f-2d64cd024422" data-file-name="components/video/VideoControls.tsx">
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>}
            
            <Button onClick={onToggleFullscreen} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="44c2dbb2-6e8e-4d9c-8f68-7b13f6b0fac1" data-file-name="components/video/VideoControls.tsx">
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}