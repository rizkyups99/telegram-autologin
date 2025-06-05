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
  return <Card key={category.id} className="overflow-hidden" data-unique-id="2a466296-0711-4353-a1f4-a34487ac0f5f" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
      <div className="bg-muted p-3 sm:p-4 flex justify-between items-center cursor-pointer" onClick={() => toggleCategory(category.id)} data-unique-id="fee8188c-3be1-4d32-a043-a91e3b98b85d" data-file-name="components/preview/audio/AudioCategoryItem.tsx">
        <div data-unique-id="0fa50244-481a-4057-875a-f1b7180b8ae6" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          <h3 className="text-base sm:text-lg md:text-xl font-medium" data-unique-id="706974e6-51ff-4805-b85e-f1021e24e53a" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.name}</h3>
          {category.description && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1" data-unique-id="45bbe230-a9fe-4fdd-8221-82a459e1552f" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">{category.description}</p>}
        </div>
        <Button variant="ghost" size="sm" className="ml-2" data-unique-id="5f5db70b-b4d5-499d-800d-dcda94109fb7" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {isExpanded ? <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />}
        </Button>
      </div>
      {isExpanded && <div className="p-2 sm:p-3 md:p-4 divide-y" data-unique-id="9b6025d3-0fb4-467d-bbf7-9f190ab3651d" data-file-name="components/preview/audio/AudioCategoryItem.tsx" data-dynamic-text="true">
          {category.audios.map(audio => <AudioItem key={audio.id} audio={audio} playingAudioId={playingAudioId} expandedAudioId={expandedAudioId} handlePlayAudio={handlePlayAudio} handleDownload={handleDownload} formatTime={formatTime} currentTime={currentTime} duration={duration} handleSeek={handleSeek} toggleMute={toggleMute} isMuted={isMuted} volume={volume} handleVolumeChange={handleVolumeChange} changePlaybackRate={changePlaybackRate} playbackRate={playbackRate} downloading={downloading} downloadSuccess={downloadSuccess} />)}
        </div>}
    </Card>;
}