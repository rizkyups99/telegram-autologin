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
        videoContainer.style.transform = `scale(${newZoom/100})`;
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
        videoContainer.style.transform = `scale(${newZoom/100})`;
        videoContainer.style.transformOrigin = 'center center';
      }
    }
  };
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1.5 sm:p-2 md:p-4 z-20">
      <div className="flex flex-col gap-1">
        {/* Progress bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-white text-xs">
            {formatTime(videoProgress)}
          </span>
          <div className="flex-grow mx-1">
            <input
              type="range"
              min="0"
              max={videoDuration || 100}
              value={videoProgress}
              onChange={onSeek}
              className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <span className="text-white text-xs">
            {formatTime(videoDuration)}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            onClick={onTogglePlay}
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10"
          >
            {isPlaying ? (
              <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          
          <Button 
            onClick={onToggleMute}
            variant="ghost"
            size="sm"
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10"
          >
            {isMuted ? (
              <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
          
          <div className="ml-auto flex gap-1 sm:gap-2">
            {/* Mobile zoom controls */}
            {isMobile && (
              <>
                <Button 
                  onClick={handleZoomOut}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10"
                >
                  <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                
                <Button 
                  onClick={handleZoomIn}
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10"
                >
                  <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}
            
            <Button 
              onClick={onToggleFullscreen}
              variant="ghost"
              size="sm"
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-white hover:bg-white hover:bg-opacity-10"
            >
              <Maximize className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
