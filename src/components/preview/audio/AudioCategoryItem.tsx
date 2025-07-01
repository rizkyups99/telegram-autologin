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
  return <Card key={category.id} className="overflow-hidden" data-unique-id="c6047358-2705-43d1-b6b7-e628a05c9f91" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-2 sm:p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="89f51619-7fb9-44be-bc3b-31dae78adcbe" data-file-name="components/preview/audio/AudioCategoryItem.tsx">
        <div className="flex-1 min-w-0" data-unique-id="e644dec5-ba11-4375-b7cf-0e1cdfcd896a" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="text-base sm:text-lg md:text-xl font-medium leading-tight" data-unique-id="ea0b3569-8386-4530-b196-e720c27b1dfc" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed" data-unique-id="f629baf1-e05c-47f8-9089-ed233a7c0d30" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0" data-unique-id="398bd31c-bcfa-4eea-ab98-32904e2a2778" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      {isExpanded && <div className="p-1 sm:p-3 md:p-4 divide-y" data-unique-id="c4270181-2fe4-4a75-aba8-548c28a20477" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {category.audios.map(audio => <AudioItem key={audio.id} audio={audio} playingAudioId={playingAudioId} expandedAudioId={expandedAudioId} handlePlayAudio={handlePlayAudio} handleDownload={handleDownload} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSeek={handleSeek} toggleMute={toggleMute} isMuted={isMuted} volume={volume} handleVolumeChange={handleVolumeChange} changePlaybackRate={changePlaybackRate} playbackRate={playbackRate} downloading={downloading} downloadSuccess={downloadSuccess} />)}
        </div>}
    </Card>;
}