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
  return <Card key={category.id} className="overflow-hidden" data-unique-id="13e67d5a-c504-4068-b642-e2278a371cc8" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-3 sm:p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="0e214be3-822f-4d2b-bb91-cfbfd7bf3c0c" data-file-name="components/preview/audio/AudioCategoryItem.tsx">
        <div data-unique-id="de0603e4-9ddb-42b7-8eb3-21c720f026f4" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="text-base sm:text-lg md:text-xl font-medium" data-unique-id="fc62729a-02db-44fe-ac10-39bd434515c8" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1" data-unique-id="bb1053e2-415f-4058-9324-2a0f471f2ccf" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="ml-2" data-unique-id="857504d0-072f-4e30-847b-1bf7849ae34e" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      {isExpanded && <div className="p-2 sm:p-3 md:p-4 divide-y" data-unique-id="1d102781-1b63-45f6-afbe-07ad0f0faa83" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {category.audios.map(audio => <AudioItem key={audio.id} audio={audio} playingAudioId={playingAudioId} expandedAudioId={expandedAudioId} handlePlayAudio={handlePlayAudio} handleDownload={handleDownload} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSeek={handleSeek} toggleMute={toggleMute} isMuted={isMuted} volume={volume} handleVolumeChange={handleVolumeChange} changePlaybackRate={changePlaybackRate} playbackRate={playbackRate} downloading={downloading} downloadSuccess={downloadSuccess} />)}
        </div>}
    </Card>;
}