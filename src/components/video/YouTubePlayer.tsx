'use client';

import { useEffect } from 'react';
import { Play } from 'lucide-react';
import { getYoutubeEmbedInfo } from './videoHooks';
interface YouTubePlayerProps {
  videoUrl: string;
  onPlay: () => void;
  onPause: () => void;
  onBuffer: () => void;
  onBufferEnd: () => void;
  onProgress: (progress: number) => void;
  onDuration: (duration: number) => void;
  onEnded: () => void;
  youtubePlayerRef: React.MutableRefObject<any>;
  togglePlay: () => void;
  isPlaying: boolean;
  setIsPlaying?: (playing: boolean) => void;
}
export function YouTubePlayer({
  videoUrl,
  onPlay,
  onPause,
  onBuffer,
  onBufferEnd,
  onProgress,
  onDuration,
  onEnded,
  youtubePlayerRef,
  togglePlay,
  isPlaying
}: YouTubePlayerProps) {
  const {
    videoId
  } = getYoutubeEmbedInfo(videoUrl);

  // Handle fullscreen changes for mobile landscape mode
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Force re-render to apply the conditional styling
      if (typeof window !== 'undefined' && document.fullscreenElement && window.innerWidth < 768) {
        if (screen.orientation && 'lock' in screen.orientation) {
          (screen.orientation as any).lock('landscape').catch((err: Error) => {
            // Some browsers don't support orientation lock
            console.log("Orientation lock not supported:", err);
          });
        }
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isPlaying]);

  // Initialize YouTube player when video is selected
  useEffect(() => {
    // Load necessary scripts - to ensure it only runs in browser
    if (typeof document !== 'undefined') {
      // Update YouTube iframe src to include enablejsapi parameter for any existing iframes
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach(iframe => {
        if (iframe.src.includes('youtube.com/embed')) {
          const currentSrc = iframe.src;
          if (!currentSrc.includes('enablejsapi=1')) {
            iframe.src = currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'enablejsapi=1';
          }
        }
      });
    }

    // Set up message listener for YouTube iframe API messages
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from YouTube
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onStateChange') {
          switch (data.info) {
            case 1:
              // playing
              onPlay();
              onBufferEnd();
              if (data.duration) onDuration(data.duration);
              break;
            case 2:
              // paused
              onPause();
              break;
            case 3:
              // buffering
              onBuffer();
              break;
            case 0:
              // ended
              onEnded();
              break;
          }
        }
      } catch (e) {
        // Not a YouTube API message
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [videoUrl, onPlay, onPause, onBuffer, onBufferEnd, onDuration, onEnded]);

  // Initialize YouTube player with API
  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initializeYouTubePlayer;
    } else {
      initializeYouTubePlayer();
    }
    return () => {
      // Cleanup YouTube player instance
      if (youtubePlayerRef.current) {
        youtubePlayerRef.current = null;
      }
    };
  }, [videoId]);

  // Start tracking progress when playing
  useEffect(() => {
    let progressInterval: ReturnType<typeof setTimeout>;
    if (isPlaying && videoId) {
      progressInterval = setInterval(() => {
        if (youtubePlayerRef.current) {
          try {
            const currentTime = youtubePlayerRef.current.getCurrentTime();
            onProgress(currentTime);
          } catch (err) {
            console.error("Error getting current time:", err);
          }
        }
      }, 1000);
    }
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isPlaying, videoId, onProgress]);
  const initializeYouTubePlayer = () => {
    if (!videoId) return;

    // For client-side only execution
    if (typeof window === 'undefined') return;

    // Get the iframe element
    const iframe = document.getElementById('youtube-player-iframe');
    if (!iframe) return;

    // Initialize the player
    if (typeof window !== 'undefined') {
      // Extract references safely within the window check
      const YT = window.YT;
      if (YT && YT.Player) {
        youtubePlayerRef.current = new YT.Player('youtube-player-iframe', {
          videoId: videoId,
          events: {
            'onReady': event => {
              // Get video duration when player is ready
              const duration = event.target.getDuration();
              onDuration(duration);

              // Set up event listeners for status changes
              event.target.addEventListener('onStateChange', (e: any) => {
                // YouTube states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering)
                const playerState = e.data;
                if (playerState === 1) {
                  onPlay();
                  onBufferEnd();
                } else if (playerState === 2) {
                  onPause();
                } else if (playerState === 3) {
                  onBuffer();
                } else if (playerState === 0) {
                  onEnded();
                }
              });
            }
          }
        });
      }
    }
  };
  return <div className="w-full aspect-video relative" data-unique-id="4ac90cd8-b734-4cc0-b6a1-c9a5c1c6630b" data-file-name="components/video/YouTubePlayer.tsx">
      <iframe id="youtube-player-iframe" src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&disablekb=1&rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen data-unique-id="c3109402-89c3-4951-8edc-725908fbfc81" data-file-name="components/video/YouTubePlayer.tsx"></iframe>
      
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay} data-unique-id="d29b1bc1-8c41-4f3c-9924-a65985e6114d" data-file-name="components/video/YouTubePlayer.tsx" data-dynamic-text="true">
        {!isPlaying && <div className="w-16 h-16 bg-black bg-opacity-60 rounded-full flex items-center justify-center" data-unique-id="b88a2637-dd96-4f16-8814-058ba1e3b511" data-file-name="components/video/YouTubePlayer.tsx">
            <Play className="h-8 w-8 text-white" />
          </div>}
      </div>
    </div>;
}