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
  return <div className="py-2 sm:py-3" data-unique-id="7508514e-d655-4a7a-9ad1-c5a382bd246b" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="5145a19f-82c4-4716-a7eb-272de72ae5e4" data-file-name="components/preview/audio/AudioItem.tsx">
        <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="214121ba-4131-4168-b3ca-0bca53d92cf9" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0" data-unique-id="e63e3879-796e-4251-a9b0-3e5c803213db" data-file-name="components/preview/audio/AudioItem.tsx">
          <Button onClick={() => handlePlayAudio(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${playingAudioId === audio.id ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'}`} data-unique-id="e30e9fa1-8d7c-46a1-ac05-12b2d1d15dc2" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {playingAudioId === audio.id ? <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="8df95635-a175-4964-afe3-27df9c6f7f28" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="683fd4d0-7a41-4e83-a0cc-24fba17fb693" data-file-name="components/preview/audio/AudioItem.tsx">Pause</span></span>
              </> : <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="58926cc4-28b9-4da3-a7b4-bba70c6ebce4" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="348ee9fe-b3c2-4c45-a0ea-4d806421154f" data-file-name="components/preview/audio/AudioItem.tsx">Play</span></span>
              </>}
          </Button>
          <Button onClick={() => handleDownload(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${downloading === audio.id ? 'border-green-500 bg-green-50 text-green-600' : downloadSuccess === audio.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'}`} disabled={downloading === audio.id} data-unique-id="c651d327-3ab6-48df-ab8f-40b24dfd58dc" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {downloading === audio.id ? <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : downloadSuccess === audio.id ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Download className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md" data-unique-id="4f0c57e0-0310-4b0d-8b29-ca0b9bf003ee" data-file-name="components/preview/audio/AudioItem.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="ffd5f96d-ad64-4b4c-a564-321f98499cbf" data-file-name="components/preview/audio/AudioItem.tsx">
            <Button onClick={() => handlePlayAudio(audio)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full flex items-center justify-center" data-unique-id="8f2d0a49-c136-4886-bf35-f3d177174d9a" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              {playingAudioId === audio.id ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs" data-unique-id="db64c338-0a90-4b4f-abc1-1b0c16f731eb" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="63120dc9-745c-4017-a28e-c4003df8ff3e" data-file-name="components/preview/audio/AudioItem.tsx" />
            <span className="text-xs" data-unique-id="9cdf1b0c-e459-49b1-8497-7042ab0f102c" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center" data-unique-id="2005f201-5d77-4bed-8484-fe1c637f7dc8" data-file-name="components/preview/audio/AudioItem.tsx">
            <div className="flex items-center gap-2" data-unique-id="9e09eefc-7650-43a1-b5fb-313a293be0b3" data-file-name="components/preview/audio/AudioItem.tsx">
              <Button onClick={toggleMute} variant="ghost" size="sm" className="h-7 w-7 p-0" data-unique-id="37dd28ab-c47a-4a97-9173-dd4f6160f8a2" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="52695ab5-6f81-48eb-afa3-3caf6017b4e1" data-file-name="components/preview/audio/AudioItem.tsx" />
            </div>
            
            <div className="relative" data-unique-id="d691a968-e8e3-4b4e-aeae-a70f90399bdd" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              <Button onClick={e => {
            e.stopPropagation();
            setShowSpeedDropdown(!showSpeedDropdown);
          }} variant="outline" size="sm" className="h-7 px-2 text-xs flex items-center gap-1" data-unique-id="55cc760e-e373-41b9-ad10-381f1fb700bd" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {playbackRate}<span className="editable-text" data-unique-id="4234100f-95e7-4d46-892f-71afd8648612" data-file-name="components/preview/audio/AudioItem.tsx">x
                </span><ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10" data-unique-id="c22cee1c-8bcb-43f7-b111-e100c2bf677a" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => <button key={speed} onClick={e => {
              e.stopPropagation();
              changePlaybackRate(speed);
              setShowSpeedDropdown(false);
            }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${playbackRate === speed ? 'bg-muted font-medium' : ''}`} data-is-mapped="true" data-unique-id="1d152ce1-2945-45bf-a84e-b83c56906836" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                      {speed}<span className="editable-text" data-unique-id="5d5f3ef6-a1e6-4565-ad9e-14cda36cc1da" data-file-name="components/preview/audio/AudioItem.tsx">x
                    </span></button>)}
                </div>}
            </div>
          </div>
        </div>}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center" data-unique-id="4f1bee6d-914f-45e9-82be-0321725f2bdf" data-file-name="components/preview/audio/AudioItem.tsx">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /><span className="editable-text" data-unique-id="50f5c53a-f2a4-4363-abd5-34b28b15fbf0" data-file-name="components/preview/audio/AudioItem.tsx">
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </span></div>}
    </div>;
}