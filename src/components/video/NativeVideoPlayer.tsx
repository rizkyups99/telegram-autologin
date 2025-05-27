'use client';

import { useEffect } from 'react';
interface NativeVideoPlayerProps {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  togglePlay: () => void;
  onProgress: (progress: number) => void;
  onDuration: (duration: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onBuffer: () => void;
  onBufferEnd: () => void;
  onEnded: () => void;
}
export function NativeVideoPlayer({
  videoUrl,
  videoRef,
  togglePlay,
  onProgress,
  onDuration,
  onPlay,
  onPause,
  onBuffer,
  onBufferEnd,
  onEnded
}: NativeVideoPlayerProps) {
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      const handleTimeUpdate = () => {
        onProgress(video.currentTime);
      };
      const handleLoadedMetadata = () => {
        onDuration(video.duration);
      };
      const handleEnded = () => {
        onEnded();
      };
      const handlePlay = () => {
        onPlay();
      };
      const handlePause = () => {
        onPause();
      };
      const handleWaiting = () => {
        onBuffer();
      };
      const handlePlaying = () => {
        onBufferEnd();
      };
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
      };
    }
  }, [videoRef, onProgress, onDuration, onPlay, onPause, onBuffer, onBufferEnd, onEnded]);
  return <video ref={videoRef} src={videoUrl} className="w-full aspect-video" onClick={togglePlay} data-unique-id="421b2b7b-3279-4ffb-90c3-a4e05fee3245" data-file-name="components/video/NativeVideoPlayer.tsx" />;
}