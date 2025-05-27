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
  return <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20" data-unique-id="6eeed7ff-a716-4f52-b2d4-607eb6f55e13" data-file-name="components/video/VideoControls.tsx">
      <div className="flex flex-col gap-1" data-unique-id="37443eba-ebf2-4a4e-b6d3-3e9c5fed6a0d" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="12d31d54-616d-4f97-9c28-51d0c90b036b" data-file-name="components/video/VideoControls.tsx">
          <span className="text-white text-xs" data-unique-id="a0194d3f-a1db-480c-ac7e-63a406a13a9b" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1" data-unique-id="31ca0568-4c06-4c03-9db5-7b34150f5e67" data-file-name="components/video/VideoControls.tsx">
            <input type="range" min="0" max={videoDuration || 100} value={videoProgress} onChange={onSeek} className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="61ba12b3-f89f-4872-8190-df15e44fd52f" data-file-name="components/video/VideoControls.tsx" />
          </div>
          <span className="text-white text-xs" data-unique-id="f63f2ab2-05b4-488d-a166-280ace8840ae" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2" data-unique-id="6fa270c5-40f8-4f8f-9340-a68861a549d2" data-file-name="components/video/VideoControls.tsx">
          <Button onClick={onTogglePlay} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="2a1d56c3-0aa6-4833-bfbd-2b2ad94ffbe6" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isPlaying ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <Button onClick={onToggleMute} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="2ea12168-da52-46bd-970f-f33ceb25cb50" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2" data-unique-id="f21a156a-19e6-4118-a862-377a14ef9538" data-file-name="components/video/VideoControls.tsx" data-dynamic-text="true">
            {/* Mobile zoom controls */}
            {isMobile && <>
                <Button onClick={handleZoomOut} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="d7c9d267-cd49-4e32-ab68-2d39c7c581ee" data-file-name="components/video/VideoControls.tsx">
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button onClick={handleZoomIn} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="fc0f35cb-7576-44f3-a788-a061a03ea61c" data-file-name="components/video/VideoControls.tsx">
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>}
            
            <Button onClick={onToggleFullscreen} variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10" data-unique-id="9f14ec77-7d3a-414b-b688-f1a5cd83384f" data-file-name="components/video/VideoControls.tsx">
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}