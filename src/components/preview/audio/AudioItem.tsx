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
  return <div className="py-2 sm:py-3" data-unique-id="08631964-347b-4612-a1e2-26b4c3348a84" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="cc37fa78-7e5b-4b96-98b8-e56615bc6c55" data-file-name="components/preview/audio/AudioItem.tsx">
        <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="0eaba6c0-aad8-470a-ae25-51637bf27423" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0" data-unique-id="27b30f98-0cd2-41f8-8382-d44abc0f95c5" data-file-name="components/preview/audio/AudioItem.tsx">
          <Button onClick={() => handlePlayAudio(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${playingAudioId === audio.id ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'}`} data-unique-id="4305441d-101e-4a14-9e4d-36ad543dae46" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {playingAudioId === audio.id ? <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="c8155974-cfdb-4484-8638-e14da3249cd8" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="f3c6a220-07d7-4da6-835a-5936d223fc8e" data-file-name="components/preview/audio/AudioItem.tsx">Pause</span></span>
              </> : <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="000cc94f-a510-4839-948c-3c48d0f7f65a" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="bca82d48-0103-4a17-b834-a9cf1cf55d44" data-file-name="components/preview/audio/AudioItem.tsx">Play</span></span>
              </>}
          </Button>
          <Button onClick={() => handleDownload(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${downloading === audio.id ? 'border-green-500 bg-green-50 text-green-600' : downloadSuccess === audio.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'}`} disabled={downloading === audio.id} data-unique-id="76f969b8-e5cb-4f2d-b25e-dd3db4b740bc" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {downloading === audio.id ? <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : downloadSuccess === audio.id ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Download className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md" data-unique-id="386cb586-be09-4073-8748-061512c501d6" data-file-name="components/preview/audio/AudioItem.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="78a2146f-8104-4d6d-b42e-d3cadb649ab5" data-file-name="components/preview/audio/AudioItem.tsx">
            <Button onClick={() => handlePlayAudio(audio)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full flex items-center justify-center" data-unique-id="0e604608-e448-49ed-9333-4bd899330679" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              {playingAudioId === audio.id ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs" data-unique-id="6589a93c-9df2-41e0-8041-6495329c8322" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="09d5061a-2ff0-4038-a20e-e4fa9c95ce6f" data-file-name="components/preview/audio/AudioItem.tsx" />
            <span className="text-xs" data-unique-id="500a6026-7671-48d2-b139-43cb54cefbe0" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center" data-unique-id="e27842b0-54b2-4b8b-95ae-266e3f2239a1" data-file-name="components/preview/audio/AudioItem.tsx">
            <div className="flex items-center gap-2" data-unique-id="15efdb10-d059-4aae-acd5-d218030c73d0" data-file-name="components/preview/audio/AudioItem.tsx">
              <Button onClick={toggleMute} variant="ghost" size="sm" className="h-7 w-7 p-0" data-unique-id="9be24c48-f01e-49af-9747-20c899614ed9" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="08859090-2ce6-443e-b053-bf78971d8f21" data-file-name="components/preview/audio/AudioItem.tsx" />
            </div>
            
            <div className="relative" data-unique-id="5852172a-e52e-4f3e-a0ab-381766015aa5" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              <Button onClick={e => {
            e.stopPropagation();
            setShowSpeedDropdown(!showSpeedDropdown);
          }} variant="outline" size="sm" className="h-7 px-2 text-xs flex items-center gap-1" data-unique-id="7eac69c3-99f4-4464-acfd-84050a762edb" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {playbackRate}<span className="editable-text" data-unique-id="4ec3e40d-04c2-401b-abc3-44a5201debab" data-file-name="components/preview/audio/AudioItem.tsx">x
                </span><ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10" data-unique-id="40c0601b-6fbf-44b7-8938-212f083ff12c" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => <button key={speed} onClick={e => {
              e.stopPropagation();
              changePlaybackRate(speed);
              setShowSpeedDropdown(false);
            }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${playbackRate === speed ? 'bg-muted font-medium' : ''}`} data-is-mapped="true" data-unique-id="3272b373-fbc1-45ee-84b9-21f70f442d75" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                      {speed}<span className="editable-text" data-unique-id="dcf96d50-5df4-478d-bf71-724d2701edee" data-file-name="components/preview/audio/AudioItem.tsx">x
                    </span></button>)}
                </div>}
            </div>
          </div>
        </div>}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center" data-unique-id="546f4962-09c6-4a92-96ee-494f074c55c8" data-file-name="components/preview/audio/AudioItem.tsx">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /><span className="editable-text" data-unique-id="4ea126d3-c7d4-4acb-b4e8-014ee67f5eef" data-file-name="components/preview/audio/AudioItem.tsx">
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </span></div>}
    </div>;
}