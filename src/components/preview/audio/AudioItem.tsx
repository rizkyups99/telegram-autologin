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
  return <div className="py-2 sm:py-3" data-unique-id="b4002427-0e96-4b8a-855c-b2b6402750da" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
      <div className="flex items-center justify-between" data-unique-id="fb9f395d-766c-43da-b4e0-c81f7a1618df" data-file-name="components/preview/audio/AudioItem.tsx">
        <p className="font-medium text-sm sm:text-base line-clamp-2" data-unique-id="a89481bd-4f0d-4c41-90f9-dd1ff1803973" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{audio.title}</p>
        <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0" data-unique-id="26af71b6-5653-4086-a7fc-5e54f07d6fe6" data-file-name="components/preview/audio/AudioItem.tsx">
          <Button onClick={() => handlePlayAudio(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${playingAudioId === audio.id ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'border-green-500 bg-green-50 text-green-600 hover:bg-green-100'}`} data-unique-id="d2178122-c7f3-4f77-af26-726d30a9fbf4" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {playingAudioId === audio.id ? <>
                <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="80a08138-6cf9-4f64-af46-523d913331e2" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="309d9e9c-1e7f-4f45-84a2-be90a0565bd7" data-file-name="components/preview/audio/AudioItem.tsx">Pause</span></span>
              </> : <>
                <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline" data-unique-id="41e47d88-02d2-4b41-84ea-59c97b83f609" data-file-name="components/preview/audio/AudioItem.tsx"><span className="editable-text" data-unique-id="2e7f442e-51c2-4aeb-8df8-57aead4041cf" data-file-name="components/preview/audio/AudioItem.tsx">Play</span></span>
              </>}
          </Button>
          <Button onClick={() => handleDownload(audio)} variant="outline" size="sm" className={`flex items-center gap-1 h-8 px-2 text-xs sm:text-sm ${downloading === audio.id ? 'border-green-500 bg-green-50 text-green-600' : downloadSuccess === audio.id ? 'border-green-500 bg-green-50 text-green-600' : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'}`} disabled={downloading === audio.id} data-unique-id="9a9bdaaa-e562-4f39-bf5d-980b6e70145d" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
            {downloading === audio.id ? <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" /> : downloadSuccess === audio.id ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> : <Download className="h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Expanded Audio Player */}
      {expandedAudioId === audio.id && <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-muted bg-opacity-30 rounded-md" data-unique-id="fd40249b-0d07-4806-a8e5-2fd33d0029ad" data-file-name="components/preview/audio/AudioItem.tsx">
          <div className="flex items-center gap-2 mb-2" data-unique-id="77dff9e0-2942-41c3-9871-8812855956fb" data-file-name="components/preview/audio/AudioItem.tsx">
            <Button onClick={() => handlePlayAudio(audio)} variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-full flex items-center justify-center" data-unique-id="d13607a7-5ddf-4794-94ee-84a9666cfe78" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              {playingAudioId === audio.id ? <Pause className="h-3 w-3 sm:h-4 sm:w-4" /> : <Play className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>
            <span className="text-xs" data-unique-id="0178176a-3dfd-431b-af31-9f94ca124d0b" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(currentTime)}</span>
            <input type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek} className="flex-grow h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="b735c723-a8f4-46bc-b121-8bab016d9074" data-file-name="components/preview/audio/AudioItem.tsx" />
            <span className="text-xs" data-unique-id="dd9022f9-ff07-44f6-b316-9f099323a3df" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">{formatTime(duration)}</span>
          </div>
          
          <div className="flex justify-between items-center" data-unique-id="5d8fe89d-8435-42a4-9f78-c8f90642b47f" data-file-name="components/preview/audio/AudioItem.tsx">
            <div className="flex items-center gap-2" data-unique-id="5cb8cbe1-aaf8-4a05-9721-a589b15190ca" data-file-name="components/preview/audio/AudioItem.tsx">
              <Button onClick={toggleMute} variant="ghost" size="sm" className="h-7 w-7 p-0" data-unique-id="a875077e-fa7d-4d1f-85c4-47ec0c4aa0e1" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {isMuted ? <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" /> : <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <input type="range" min={0} max={1} step={0.1} value={volume} onChange={handleVolumeChange} className="w-16 sm:w-20 h-1.5 bg-gray-300 rounded-lg appearance-none cursor-pointer" data-unique-id="449588dd-3935-4940-a68a-f4180d329952" data-file-name="components/preview/audio/AudioItem.tsx" />
            </div>
            
            <div className="relative" data-unique-id="7a131df2-b95c-429c-814e-5ec9d004d5c7" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
              <Button onClick={e => {
            e.stopPropagation();
            setShowSpeedDropdown(!showSpeedDropdown);
          }} variant="outline" size="sm" className="h-7 px-2 text-xs flex items-center gap-1" data-unique-id="cb8e78e4-6f47-401a-9df8-ba674913f211" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                {playbackRate}<span className="editable-text" data-unique-id="59e59005-1894-4544-8530-6e5ddd48a6de" data-file-name="components/preview/audio/AudioItem.tsx">x
                </span><ChevronDown className="h-3 w-3" />
              </Button>
              
              {showSpeedDropdown && <div className="absolute right-0 top-full mt-1 bg-background border rounded-md shadow-lg z-10" data-unique-id="38e67c50-ac0a-4898-b0fc-e3a80659d932" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                  {[0.5, 1.0, 1.5, 2.0].map(speed => <button key={speed} onClick={e => {
              e.stopPropagation();
              changePlaybackRate(speed);
              setShowSpeedDropdown(false);
            }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted ${playbackRate === speed ? 'bg-muted font-medium' : ''}`} data-is-mapped="true" data-unique-id="f8a66abd-277a-4346-a141-33709870cd73" data-file-name="components/preview/audio/AudioItem.tsx" data-dynamic-text="true">
                      {speed}<span className="editable-text" data-unique-id="ab07a013-1d61-46d0-aa14-8e76d8e0bbb0" data-file-name="components/preview/audio/AudioItem.tsx">x
                    </span></button>)}
                </div>}
            </div>
          </div>
        </div>}
      
      {/* Download Success Toast */}
      {downloadSuccess === audio.id && <div className="mt-2 p-2 bg-green-50 text-green-800 text-xs sm:text-sm rounded flex items-center" data-unique-id="5d660f08-64cd-4cd5-bb9c-6acd7d3c2de8" data-file-name="components/preview/audio/AudioItem.tsx">
          <Check className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /><span className="editable-text" data-unique-id="2ce2cedf-2d5d-4d40-a766-351302848da8" data-file-name="components/preview/audio/AudioItem.tsx">
          Audio selesai di download silahkan cek penyimpanan lokal HP atau PC anda
        </span></div>}
    </div>;
}