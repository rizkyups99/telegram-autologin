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
  return <Card key={category.id} className="overflow-hidden" data-unique-id="e6cc3434-dce3-4d6b-bece-ce696bc5d9bf" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-2 sm:p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="0797d14f-9769-4fc2-99ff-94013ebe7187" data-file-name="components/preview/audio/AudioCategoryItem.tsx">
        <div className="flex-1 min-w-0" data-unique-id="17f4e181-867f-4778-a687-27f176f69681" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="text-base sm:text-lg md:text-xl font-medium leading-tight" data-unique-id="d408cbdc-53c2-4c6d-8663-f2117e1558eb" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed" data-unique-id="467bc64d-3e8a-4fea-be73-efee112f000d" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="ml-2 flex-shrink-0" data-unique-id="f38a068d-a226-4418-99c0-b9dd88417ba9" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      {isExpanded && <div className="p-1 sm:p-3 md:p-4 divide-y" data-unique-id="709d3f01-22f5-48a7-a7af-9f4357e5afb2" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {category.audios.map(audio => <AudioItem key={audio.id} audio={audio} playingAudioId={playingAudioId} expandedAudioId={expandedAudioId} handlePlayAudio={handlePlayAudio} handleDownload={handleDownload} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSeek={handleSeek} toggleMute={toggleMute} isMuted={isMuted} volume={volume} handleVolumeChange={handleVolumeChange} changePlaybackRate={changePlaybackRate} playbackRate={playbackRate} downloading={downloading} downloadSuccess={downloadSuccess} />)}
        </div>}
    </Card>;
}