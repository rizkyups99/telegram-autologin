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
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20" data-unique-id="dcfaece2-3e74-4851-8f32-16fe5455a0bc" data-file-name="components/video/VideoControls.tsx">
      <div className="flex flex-col gap-1" data-unique-id="0122fbb6-0f45-4ee9-beaf-332a09dd7423" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="8431f73e-8d80-4f55-8d14-12dad775ccb0" data-file-name="components/video/VideoControls.tsx">
          <span className="text-white text-xs" data-unique-id="16bc7c2a-b6c8-400c-9018-bad30a41e09d" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1" data-unique-id="d565653c-ab5e-43a9-8a4c-88ecd7b59666" data-file-name="components/video/VideoControls.tsx">
            <input type="range" min="0" max={videoDuration || 100} value={videoProgress} onChange={onSeek} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="86c745c1-62b9-4906-88a5-9e0bcf4331e4" data-file-name="components/video/VideoControls.tsx" />
          </div>
          <span className="text-white text-xs" data-unique-id="15c31b53-4156-4e11-bb11-5a3d0a965bb3" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="b6a2d20d-5490-4b19-ba1e-9e1e8a14161b" data-file-name="components/video/VideoControls.tsx">
          <Button onClick={onTogglePlay} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="d8544883-90bf-42bb-9359-708da533b400" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Button onClick={onToggleMute} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="a4f320a6-b327-4762-a2cb-5410e7043c51" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2" data-unique-id="24290cb3-a737-40fd-aee2-648f34f6bb2a" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {/* Mobile zoom controls */}
            {isMobile && <>
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="2e0cf335-eacf-44b2-9a9d-b6bb9e9e92ec" data-file-name="components/video/VideoControls.tsx">
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="834210b4-7c34-4dd1-b3e5-9b9950d195d7" data-file-name="components/video/VideoControls.tsx">
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>}
            
            <Button onClick={onToggleFullscreen} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="1f52fc1b-aeea-4b2b-8441-012a65af10ba" data-file-name="components/video/VideoControls.tsx">
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}