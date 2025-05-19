'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AudioItem } from './AudioItem';

interface Audio {
  id: number;
  title: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
  audios: Audio[];
}

interface AudioCategoryItemProps {
  category: Category;
  isExpanded: boolean;
  toggleCategory: (id: number) => void;
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

export function AudioCategoryItem({
  category,
  isExpanded,
  toggleCategory,
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
}: AudioCategoryItemProps) {
  return (
    <Card key={category.id} className="overflow-hidden">
      <div 
        className="bg-muted p-3 sm:p-4 flex justify-between items-center cursor-pointer" 
        onClick={() => toggleCategory(category.id)}
      >
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-medium">{category.name}</h3>
          {category.description && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{category.description}</p>
          )}
        </div>
        <Button variant="ghost" size="sm" className="ml-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div className="p-2 sm:p-3 md:p-4 divide-y">
          {category.audios.map(audio => (
            <AudioItem 
              key={audio.id} 
              audio={audio} 
              playingAudioId={playingAudioId}
              expandedAudioId={expandedAudioId}
              handlePlayAudio={handlePlayAudio}
              handleDownload={handleDownload}
              formatTime={formatTime}
              currentTime={currentTime}
              duration={duration}
              handleSeek={handleSeek}
              toggleMute={toggleMute}
              isMuted={isMuted}
              volume={volume}
              handleVolumeChange={handleVolumeChange}
              changePlaybackRate={changePlaybackRate}
              playbackRate={playbackRate}
              downloading={downloading}
              downloadSuccess={downloadSuccess}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
