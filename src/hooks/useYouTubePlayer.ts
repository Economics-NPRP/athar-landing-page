import { useEffect, useRef, type RefObject } from 'react';

/* Minimal typing for the parts of the YouTube IFrame API we use. */
type YTPlayer = {
  playVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};
type YTNamespace = { Player: new (el: HTMLElement, options: object) => YTPlayer };

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
let api: Promise<YTNamespace> | null = null;

function loadYouTubeApi() {
  api ??= new Promise(resolve => {
    if (window.YT?.Player) return resolve(window.YT);
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT!);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    document.head.append(script);
  });
  return api;
}

type Options = {
  host: RefObject<HTMLElement | null>;
  videoId: string;
  /** Nothing loads from YouTube until this turns true (the visitor pressed play). */
  active: boolean;
  start: number;
  onTime: (seconds: number, duration: number) => void;
};

/** Privacy-enhanced YouTube player that autoplays once activated and reports playback time. */
export function useYouTubePlayer({ host, videoId, active, start, onTime }: Options) {
  const player = useRef<YTPlayer | null>(null);
  const onTimeRef = useRef(onTime);
  onTimeRef.current = onTime;
  const startRef = useRef(start);
  startRef.current = start;

  useEffect(() => {
    if (!active || !host.current) return;
    // The API swaps its target for an iframe, so give it a node React doesn't own.
    const mount = document.createElement('div');
    host.current.append(mount);
    let alive = true;
    let timer: ReturnType<typeof setInterval> | undefined;

    loadYouTubeApi().then(YT => {
      if (!alive) return;
      player.current = new YT.Player(mount, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, start: Math.floor(startRef.current), rel: 0, playsinline: 1 },
        events: { onReady: (e: { target: YTPlayer }) => e.target.playVideo() },
      });
      timer = setInterval(() => {
        const p = player.current;
        // Only while playing: before the initial seek lands, YouTube briefly reports 0 s.
        if (p && typeof p.getPlayerState === 'function' && p.getPlayerState() === PLAYING) onTimeRef.current(p.getCurrentTime(), p.getDuration());
      }, 250);
    });

    return () => {
      alive = false;
      clearInterval(timer);
      player.current?.destroy();
      player.current = null;
      mount.remove();
    };
  }, [active, videoId, host]);

  /** Jumps to `seconds` and keeps playing; a no-op until the player is ready. */
  const seek = (seconds: number) => {
    const p = player.current;
    if (!p || typeof p.seekTo !== 'function') return;
    p.seekTo(seconds, true);
    p.playVideo();
  };

  return { seek };
}
