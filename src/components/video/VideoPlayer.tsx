'use client';

import { useState, useEffect, useRef } from 'react';
import { VideoControls } from './VideoControls';
import { YouTubePlayer } from './YouTubePlayer';
import { NativeVideoPlayer } from './NativeVideoPlayer';
import { Loader } from 'lucide-react';
import { Video } from './videoHooks';
interface VideoPlayerProps {
  video: Video;
  categoryName?: string;
}
export function VideoPlayer({
  video,
  categoryName
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const youtubePlayerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isYouTubeVideo = video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be');

  // Handle showing/hiding controls
  const showControlsTemporarily = () => {
    setShowControls(true);

    // Clear any existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    // Hide controls after 3 seconds
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Show controls when video is paused, hide when playing
  useEffect(() => {
    if (isPlaying) {
      // Hide controls after a delay when video starts playing
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timeout);
    } else {
      // Always show controls when paused
      setShowControls(true);
    }
  }, [isPlaying]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Prevent right-click on video container
  const preventRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  };

  // Handle click on video container to show controls temporarily
  const handleContainerClick = () => {
    if (isPlaying) {
      showControlsTemporarily();
    } else {
      togglePlay();
    }
  };
  const togglePlay = () => {
    if (isYouTubeVideo) {
      if (youtubePlayerRef.current) {
        if (isPlaying) {
          youtubePlayerRef.current.pauseVideo();
        } else {
          youtubePlayerRef.current.playVideo();
        }
      } else {
        // Fallback if player ref isn't available - ensure client-side only
        if (typeof window === 'undefined') return;
        let iframe: HTMLIFrameElement | null = null;
        if (typeof document !== 'undefined') {
          iframe = document.getElementById('youtube-player-iframe') as HTMLIFrameElement | null;
        }
        if (iframe && iframe.contentWindow) {
          try {
            const func = isPlaying ? 'pauseVideo' : 'playVideo';
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: func
            }), '*');
            setIsPlaying(!isPlaying);
          } catch (err) {
            console.error('Error toggling play state:', err);
          }
        }
      }
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };
  const toggleMute = () => {
    if (isYouTubeVideo) {
      if (youtubePlayerRef.current) {
        if (isMuted) {
          youtubePlayerRef.current.unMute();
        } else {
          youtubePlayerRef.current.mute();
        }
        setIsMuted(!isMuted);
      } else {
        // Fallback if player ref isn't available - ensure client-side only
        if (typeof window === 'undefined') return;
        let iframe: HTMLIFrameElement | null = null;
        if (typeof document !== 'undefined') {
          iframe = document.getElementById('youtube-player-iframe') as HTMLIFrameElement | null;
        }
        if (iframe && iframe.contentWindow) {
          try {
            const func = isMuted ? 'unMute' : 'mute';
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: func
            }), '*');
            setIsMuted(!isMuted);
          } catch (err) {
            console.error('Error toggling mute state:', err);
          }
        }
      }
    } else if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    if (isYouTubeVideo) {
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current.seekTo(seekTime, true);
        setVideoProgress(seekTime);
      } else {
        // Fallback if player ref isn't available
        if (typeof document === 'undefined') return;
        const iframe = document.getElementById('youtube-player-iframe') as HTMLIFrameElement | null;
        if (iframe && iframe.contentWindow) {
          try {
            iframe.contentWindow.postMessage(JSON.stringify({
              event: 'command',
              func: 'seekTo',
              args: [seekTime, true]
            }), '*');
            setVideoProgress(seekTime);
          } catch (err) {
            console.error('Error seeking video:', err);
          }
        }
      }
    } else if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setVideoProgress(seekTime);
    }
  };
  const [isSimulatedFullscreen, setIsSimulatedFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    try {
      if (typeof document !== 'undefined') {
        // Check if fullscreen is supported and allowed
        const fullscreenEnabled = document.fullscreenEnabled || (document as any).webkitFullscreenEnabled || (document as any).mozFullScreenEnabled || (document as any).msFullscreenEnabled;
        if (!fullscreenEnabled || isSimulatedFullscreen) {
          // Toggle simulated fullscreen as fallback
          setIsSimulatedFullscreen(!isSimulatedFullscreen);
          return;
        }
        if (!document.fullscreenElement) {
          // Try to request fullscreen with error handling
          try {
            if (videoContainerRef.current.requestFullscreen) {
              videoContainerRef.current.requestFullscreen().catch(() => {
                // Fallback to simulated fullscreen if real fullscreen fails
                setIsSimulatedFullscreen(true);
              });
            } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
              (videoContainerRef.current as any).webkitRequestFullscreen();
            } else if ((videoContainerRef.current as any).mozRequestFullScreen) {
              (videoContainerRef.current as any).mozRequestFullScreen();
            } else if ((videoContainerRef.current as any).msRequestFullscreen) {
              (videoContainerRef.current as any).msRequestFullscreen();
            } else {
              // No fullscreen API available, use simulated fullscreen
              setIsSimulatedFullscreen(true);
            }
          } catch (error) {
            console.warn('Fullscreen request was denied:', error);
            // Fallback to simulated fullscreen
            setIsSimulatedFullscreen(true);
          }
        } else {
          // Exit fullscreen
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              (document as any).webkitExitFullscreen();
            } else if ((document as any).mozCancelFullScreen) {
              (document as any).mozCancelFullScreen();
            } else if ((document as any).msExitFullscreen) {
              (document as any).msExitFullscreen();
            }
          } catch (error) {
            console.warn('Error exiting fullscreen:', error);
          }
        }
      }
    } catch (err) {
      console.error(`Error attempting to toggle fullscreen: ${err}`);
      // Fallback to simulated fullscreen
      setIsSimulatedFullscreen(!isSimulatedFullscreen);
    }
  };
  return <div data-unique-id="0a532e09-a157-4b2d-9ed0-ecd358afa212" data-file-name="components/video/VideoPlayer.tsx">
      <div className={`relative bg-black rounded-lg overflow-hidden video-container ${isSimulatedFullscreen ? 'simulated-fullscreen' : ''}`} ref={videoContainerRef} onContextMenu={preventRightClick} onClick={handleContainerClick} style={{
      /* Base styles */
      transformOrigin: 'center center',
      transition: 'all 0.3s ease-in-out',
      /* When fullscreen on mobile, force landscape mode */
      ...(typeof document !== 'undefined' && typeof window !== 'undefined' ? document?.fullscreenElement && window?.innerWidth < 768 ? {
        transform: 'rotate(90deg)',
        width: '90vh',
        /* Reduced from 100vh to 90vh to fix overflow */
        height: '80vw',
        /* Reduced from 100vw to 80vw to fix overflow */
        position: 'fixed',
        top: '10%',
        /* Add top offset to center the video */
        left: '5%',
        /* Add left offset to center the video */
        maxWidth: '90vh',
        /* Ensure video doesn't exceed screen size */
        maxHeight: '80vw',
        /* Ensure video doesn't exceed screen size */
        overflow: 'hidden'
      } : {} : {})
    }} data-unique-id="490168cf-b807-43e6-90c3-6b529e546fbf" data-file-name="components/video/VideoPlayer.tsx" data-dynamic-text="true">
        {isYouTubeVideo ? <YouTubePlayer videoUrl={video.videoUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onBuffer={() => setIsBuffering(true)} onBufferEnd={() => setIsBuffering(false)} onProgress={setVideoProgress} onDuration={setVideoDuration} onEnded={() => {
        setIsPlaying(false);
        setVideoProgress(0);
      }} youtubePlayerRef={youtubePlayerRef} togglePlay={togglePlay} isPlaying={isPlaying} /> : <NativeVideoPlayer videoUrl={video.videoUrl} videoRef={videoRef} togglePlay={togglePlay} onProgress={setVideoProgress} onDuration={setVideoDuration} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onBuffer={() => setIsBuffering(true)} onBufferEnd={() => setIsBuffering(false)} onEnded={() => {
        setIsPlaying(false);
        setVideoProgress(0);
      }} />}
        
        {isBuffering && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30" data-unique-id="a812c26a-ecd7-4c25-85d7-0a452df26d77" data-file-name="components/video/VideoPlayer.tsx">
            <Loader className="h-12 w-12 text-white animate-spin" />
          </div>}
        
        {showControls && <VideoControls videoProgress={videoProgress} videoDuration={videoDuration} isPlaying={isPlaying} isMuted={isMuted} onSeek={handleSeek} onTogglePlay={togglePlay} onToggleMute={toggleMute} onToggleFullscreen={toggleFullscreen} />}
      </div>
    </div>;
}