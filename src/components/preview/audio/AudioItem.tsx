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
  return <div className="py-2 sm:py-3" data-unique-id="52ea6298-2af8-4b5c-9eaf-bc9e821114a3" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="44e88670-a2e4-426a-bdcd-1c10be4de27e" data-file-name="components/preview/audio/AudioItem.tsx">
        <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="132d058a-15fa-4440-945f-bf2ebbfc626f" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0" data-unique-id="2b02e9dd-7c27-4034-89c1-a8d9ab559767" data-file-name="components/preview/audio/AudioItem.tsx">
          <Button onClick={() => handlePlayAudio(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${playingAudioId === audio.id ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'}`} data-unique-id="ecef9d5e-0cfb-441d-9011-91b59d8930f4" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {playingAudioId === audio.id ? <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="8103e3fa-ebe9-4372-ae43-722551538ee4" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="229e89a7-7245-4b9e-815b-b053643d6cf6" data-file-name="components/preview/audio/AudioItem.tsx">Pause</span></span>
              </> : <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="297fb725-3d60-4eb1-9b5c-d1f4a71aee4c" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="0a82988b-1c4d-4601-a812-84b3cc3fb1de" data-file-name="components/preview/audio/AudioItem.tsx">Play</span></span>
              </>}
          </Button>
          <Button onClick={() => handleDownload(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${downloading === audio.id ? 'border-green-500 bg-green-50 text-green-600' : downloadSuccess === audio.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'}`} disabled={downloading === audio.id} data-unique-id="7fa9f54f-edd4-48ff-b561-d920d6beecda" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {downloading === audio.id ? <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : downloadSuccess === audio.id ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Download className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md" data-unique-id="2102f237-aa2c-4813-8c5c-0ad10e9c575d" data-file-name="components/preview/audio/AudioItem.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="b15fdab0-9b43-4cf5-968c-7f6ecffeacc9" data-file-name="components/preview/audio/AudioItem.tsx">
            <Button onClick={() => handlePlayAudio(audio)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full flex items-center justify-center" data-unique-id="af4f17e1-60cd-4b16-accd-ac476f460300" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              {playingAudioId === audio.id ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs" data-unique-id="b869b5ea-0f28-457c-9ea6-1d432fb072ed" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="bf08da34-5ebf-4ece-a06b-5e689f8e3dc6" data-file-name="components/preview/audio/AudioItem.tsx" />
            <span className="text-xs" data-unique-id="30ffb908-18ed-40a3-a20d-dca2384468f9" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center" data-unique-id="1e3fa09b-2a76-450e-9ae9-6bf31ffb3dff" data-file-name="components/preview/audio/AudioItem.tsx">
            <div className="flex items-center gap-2" data-unique-id="4acd6b88-3e76-4067-a2e2-a9fdc86f7c80" data-file-name="components/preview/audio/AudioItem.tsx">
              <Button onClick={toggleMute} variant="ghost" size="sm" className="h-7 w-7 p-0" data-unique-id="87b3bfb8-2ba8-43c5-b3ec-ff0033b0aa02" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="770abc8c-f10c-4e54-b3a6-68c303b7bfa7" data-file-name="components/preview/audio/AudioItem.tsx" />
            </div>
            
            <div className="relative" data-unique-id="34ee1ed1-05b1-4e66-9cd5-4207fa979077" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              <Button onClick={e => {
            e.stopPropagation();
            setShowSpeedDropdown(!showSpeedDropdown);
          }} variant="outline" size="sm" className="h-7 px-2 text-xs flex items-center gap-1" data-unique-id="e1686ccf-a238-4174-b441-39ad528ecebb" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {playbackRate}<span className="editable-text" data-unique-id="2a22317a-d5a9-446d-8320-628b5a5eb28b" data-file-name="components/preview/audio/AudioItem.tsx">x
                </span><ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10" data-unique-id="4af3ebb5-842d-4dcf-b48c-a7a15ed9e7b6" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => <button key={speed} onClick={e => {
              e.stopPropagation();
              changePlaybackRate(speed);
              setShowSpeedDropdown(false);
            }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${playbackRate === speed ? 'bg-muted font-medium' : ''}`} data-is-mapped="true" data-unique-id="79eb2a76-5ec2-4218-b1d0-36528fb8eddd" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                      {speed}<span className="editable-text" data-unique-id="b7d9cdaf-ad7d-4f38-8372-f1118f43f8b6" data-file-name="components/preview/audio/AudioItem.tsx">x
                    </span></button>)}
                </div>}
            </div>
          </div>
        </div>}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center" data-unique-id="223a9078-82db-4d0a-b6c6-62666f0651bc" data-file-name="components/preview/audio/AudioItem.tsx">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /><span className="editable-text" data-unique-id="e7c5b879-af2e-44ac-a1bd-d503c51fe667" data-file-name="components/preview/audio/AudioItem.tsx">
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </span></div>}
    </div>;
}