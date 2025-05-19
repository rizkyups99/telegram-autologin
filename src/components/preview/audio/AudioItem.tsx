'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Download, Check, Loader, VolumeX, Volume2, ChevronDown } from 'lucide-react';

interface Audio {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}

interface AudioItemProps {
  audio: Audio;
  playingAudioId: number | null;
  expandedAudioId: number | null;
  handlePlayAudio: (audio: Audio) => void;
  handleDownload: (audio: Audio) => void;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  handleSeek: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleMute: () => void;
  isMuted: boolean;
  volume: number;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  changePlaybackRate: (rate: number) => void;
  playbackRate: number;
  downloading: number | null;
  downloadSuccess: number | null;
}

export function AudioItem({
  audio,
  playingAudioId,
  expandedAudioId,
  handlePlayAudio,
  handleDownload,
  formatTime,
  currentTime,
  duration,
  handleSeek,
  toggleMute,
  isMuted,
  volume,
  handleVolumeChange,
  changePlaybackRate,
  playbackRate,
  downloading,
  downloadSuccess
}: AudioItemProps) {
  const [showSpeedDropdown, setShowSpeedDropdown] = useState(false);
  
  return (
    <div className="py-2 sm:py-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm sm:text-base line-clamp-2">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0">
          <Button 
            onClick={() => handlePlayAudio(audio)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 text-xs sm:text-sm"
          >
            {playingAudioId === audio.id ? (
              <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Play</span>
              </>
            )}
          </Button>
          <Button 
            onClick={() => handleDownload(audio)}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 h-8 px-2 text-xs sm:text-sm"
            disabled={downloading === audio.id}
          >
            {downloading === audio.id ? (
              <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : downloadSuccess === audio.id ? (
              <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && (
        <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Button
              onClick={() => handlePlayAudio(audio)}
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full flex items-center justify-center"
            >
              {playingAudioId === audio.id ? (
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
            </Button>
            <span className="text-xs">{formatTime(currentTime)}</span>
            <input 
              type="range" 
              min={0} 
              max={duration || 100} 
              value={currentTime} 
              onChange={handleSeek}
              className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button 
                onClick={toggleMute}
                variant="ghost" 
                size="sm"
                className="h-7 w-7 p-0"
              >
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input 
                type="range" 
                min={0} 
                max={1} 
                step={0.1} 
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="relative">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSpeedDropdown(!showSpeedDropdown);
                }}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs flex items-center gap-1"
              >
                {playbackRate}x
                <ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10">
                  {[0.5, 1.0, 1.5, 2.0].map((speed) => (
                    <button
                      key={speed}
                      onClick={(e) => {
                        e.stopPropagation();
                        changePlaybackRate(speed);
                        setShowSpeedDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${
                        playbackRate === speed ? 'bg-muted font-medium' : ''
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && (
        <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </div>
      )}
    </div>
  );
}
