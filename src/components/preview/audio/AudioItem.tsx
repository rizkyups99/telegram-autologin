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
  return <div className="py-2 sm:py-3" data-unique-id="64cad1b5-6b02-4917-b38f-6e925812569c" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="aa081a7e-d868-4c09-9621-00503c83122e" data-file-name="components/preview/audio/AudioItem.tsx">
        <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="0b9b4cda-35e3-46a1-b2dd-ee38c684562c" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0" data-unique-id="4d6a5c6b-5f6c-498c-a344-ab3a8e68d9e2" data-file-name="components/preview/audio/AudioItem.tsx">
          <Button onClick={() => handlePlayAudio(audio)} variant="outline" size="sm" className="flex items-center gap-1 h-8 px-2 text-xs sm:text-sm" data-unique-id="01f5372d-e63b-4fd6-99a4-9f1131ee685b" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {playingAudioId === audio.id ? <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="fb81d49f-4dd4-4e0f-898c-8e48fe925660" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="2d34ed4d-3dba-47d9-9d3b-b4164eb5a0c0" data-file-name="components/preview/audio/AudioItem.tsx">Pause</span></span>
              </> : <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="c76896fb-8a9a-4935-9af1-988221e4c68f" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="1951db77-aaf3-47ff-a6a1-41b1863e008d" data-file-name="components/preview/audio/AudioItem.tsx">Play</span></span>
              </>}
          </Button>
          <Button onClick={() => handleDownload(audio)} variant="outline" size="sm" className="flex items-center gap-1 h-8 px-2 text-xs sm:text-sm" disabled={downloading === audio.id} data-unique-id="b4b695cd-811e-4bb0-b819-01d6787b9c71" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {downloading === audio.id ? <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : downloadSuccess === audio.id ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Download className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md" data-unique-id="22997a34-c2a6-4619-92bc-99ebf555a31a" data-file-name="components/preview/audio/AudioItem.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="54f974f1-f2de-45b5-b79d-43c218ee8591" data-file-name="components/preview/audio/AudioItem.tsx">
            <Button onClick={() => handlePlayAudio(audio)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full flex items-center justify-center" data-unique-id="10515a29-98e5-448b-b6ba-e0e51bdccd39" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              {playingAudioId === audio.id ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs" data-unique-id="50ad4f67-ac89-4de0-ab34-4b413979f21d" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="894cb8ac-69d4-4939-9265-28f5e1a347da" data-file-name="components/preview/audio/AudioItem.tsx" />
            <span className="text-xs" data-unique-id="e95607ad-a74c-49ca-81cd-c3bb276b5e19" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center" data-unique-id="eb456b2f-5fd7-4d41-b516-b49413fa1414" data-file-name="components/preview/audio/AudioItem.tsx">
            <div className="flex items-center gap-2" data-unique-id="fdabf9e1-6ed1-499f-9c57-d339d2b59783" data-file-name="components/preview/audio/AudioItem.tsx">
              <Button onClick={toggleMute} variant="ghost" size="sm" className="h-7 w-7 p-0" data-unique-id="b72a5549-c3ad-4f53-89ea-cfe18f8e2521" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="25147abb-f285-48bc-b44a-9c4e5a9ea6fb" data-file-name="components/preview/audio/AudioItem.tsx" />
            </div>
            
            <div className="relative" data-unique-id="b734ab3b-1b49-4e35-b91d-9757c0adb735" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              <Button onClick={e => {
            e.stopPropagation();
            setShowSpeedDropdown(!showSpeedDropdown);
          }} variant="outline" size="sm" className="h-7 px-2 text-xs flex items-center gap-1" data-unique-id="0cd739a6-99c6-4293-a74f-dfad9a049530" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {playbackRate}<span className="editable-text" data-unique-id="81106732-f25a-43b0-a5a9-5f642892c7bc" data-file-name="components/preview/audio/AudioItem.tsx">x
                </span><ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10" data-unique-id="491b98cf-7224-4838-adfc-3fee7bcccfd2" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => <button key={speed} onClick={e => {
              e.stopPropagation();
              changePlaybackRate(speed);
              setShowSpeedDropdown(false);
            }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${playbackRate === speed ? 'bg-muted font-medium' : ''}`} data-is-mapped="true" data-unique-id="00fe7c58-b677-4975-bb6f-85fd89cbfc6e" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                      {speed}<span className="editable-text" data-unique-id="490c94f3-fdf4-451e-b5c3-6aa3d0d779e3" data-file-name="components/preview/audio/AudioItem.tsx">x
                    </span></button>)}
                </div>}
            </div>
          </div>
        </div>}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center" data-unique-id="6265c44e-8d9f-4aa2-ac8b-b99827c2beed" data-file-name="components/preview/audio/AudioItem.tsx">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /><span className="editable-text" data-unique-id="3e07a221-2964-45a5-95a0-cb5bf4605ead" data-file-name="components/preview/audio/AudioItem.tsx">
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </span></div>}
    </div>;
}