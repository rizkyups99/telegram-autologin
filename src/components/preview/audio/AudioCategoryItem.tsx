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
  return <Card key={category.id} className="overflow-hidden" data-unique-id="47243d2a-e359-4967-a879-04538f8967ec" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-3 sm:p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="53a89c43-ae3a-4ef9-a9cc-7c7b6550adbc" data-file-name="components/preview/audio/AudioCategoryItem.tsx">
        <div data-unique-id="7c49c607-c7ca-4394-b7ef-5af347ea00ff" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="text-base sm:text-lg md:text-xl font-medium" data-unique-id="7e51d252-fe3f-4ff2-ba99-3bf12e69033e" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1" data-unique-id="2ac230ca-8d74-4c57-885b-23dfdd5dadd1" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="ml-2" data-unique-id="792a55d9-5018-45f3-8734-6468b6d1c2ec" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      {isExpanded && <div className="p-2 sm:p-3 md:p-4 divide-y" data-unique-id="cee1c926-2eb0-416a-a03d-34bec879ae86" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {category.audios.map(audio => <AudioItem key={audio.id} audio={audio} playingAudioId={playingAudioId} expandedAudioId={expandedAudioId} handlePlayAudio={handlePlayAudio} handleDownload={handleDownload} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSeek={handleSeek} toggleMute={toggleMute} isMuted={isMuted} volume={volume} handleVolumeChange={handleVolumeChange} changePlaybackRate={changePlaybackRate} playbackRate={playbackRate} downloading={downloading} downloadSuccess={downloadSuccess} />)}
        </div>}
    </Card>;
}