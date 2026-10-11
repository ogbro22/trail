'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, ThemeId } from '@/types/music';
import { FEATURED_TRACKS } from '@/lib/musicService';

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  queue: Track[];
  history: Track[];
  favorites: Track[];
  activeTheme: ThemeId;
  isLyricsOpen: boolean;
  isQueueOpen: boolean;

  // Actions
  playTrack: (track: Track, newQueue?: Track[]) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addToQueue: (track: Track) => void;
  playNextInQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  setTheme: (theme: ThemeId) => void;
  setIsLyricsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsQueueOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  addCustomTrack: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<Track[]>(FEATURED_TRACKS);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(FEATURED_TRACKS[0]);
  const [history, setHistory] = useState<Track[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');

  const [activeTheme, setActiveTheme] = useState<ThemeId>('dark-obsidian');
  const [isLyricsOpen, setIsLyricsOpen] = useState<boolean>(false);
  const [isQueueOpen, setIsQueueOpen] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'metadata';
      audioRef.current = audio;

      // Local storage restore for favorites & theme
      const savedFavs = localStorage.getItem('sonora_favorites');
      if (savedFavs) {
        try { setFavorites(JSON.parse(savedFavs)); } catch (e) {}
      }
      const savedTheme = localStorage.getItem('sonora_theme') as ThemeId;
      if (savedTheme) {
        setActiveTheme(savedTheme);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // Sync audio element state listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentTrack?.duration || 0);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    const handleError = (e: Event) => {
      console.warn('Audio playback error, attempting recovery or next track', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrack, repeatMode, queue, isShuffle, history]);

  // Handle playing track changes
  const playTrack = (track: Track, newQueue?: Track[]) => {
    if (newQueue) {
      setQueue(newQueue);
    } else if (!queue.some((t) => t.id === track.id)) {
      setQueue((prev) => [track, ...prev]);
    }

    if (currentTrack) {
      setHistory((prev) => [currentTrack, ...prev.filter((t) => t.id !== currentTrack.id)]);
    }

    setCurrentTrack(track);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error('Playback error:', err);
          setIsPlaying(false);
        });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src !== currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Error starting audio:', err));
    }
  };

  const pause = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : clamped;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const playNext = () => {
    if (!currentTrack || queue.length === 0) return;

    let nextTrack: Track | null = null;

    if (isShuffle) {
      const remaining = queue.filter((t) => t.id !== currentTrack.id);
      if (remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        nextTrack = remaining[randomIndex];
      } else {
        nextTrack = queue[0];
      }
    } else {
      const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex !== -1 && currentIndex < queue.length - 1) {
        nextTrack = queue[currentIndex + 1];
      } else if (repeatMode === 'all') {
        nextTrack = queue[0];
      }
    }

    if (nextTrack) {
      playTrack(nextTrack);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (!currentTrack) return;

    if (currentTime > 4 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (history.length > 0) {
      const prevTrack = history[0];
      setHistory((prev) => prev.slice(1));
      playTrack(prevTrack);
      return;
    }

    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1]);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const addToQueue = (track: Track) => {
    setQueue((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  };

  const playNextInQueue = (track: Track) => {
    if (!currentTrack) {
      playTrack(track);
      return;
    }
    setQueue((prev) => {
      const filtered = prev.filter((t) => t.id !== track.id);
      const currentIndex = filtered.findIndex((t) => t.id === currentTrack.id);
      if (currentIndex !== -1) {
        filtered.splice(currentIndex + 1, 0, track);
        return filtered;
      }
      return [currentTrack, track, ...filtered];
    });
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
    } else {
      setQueue([]);
    }
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const toggleShuffle = () => setIsShuffle((prev) => !prev);

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  };

  const toggleFavorite = (track: Track) => {
    setFavorites((prev) => {
      const exists = prev.some((t) => t.id === track.id);
      let updated: Track[];
      if (exists) {
        updated = prev.filter((t) => t.id !== track.id);
      } else {
        updated = [track, ...prev];
      }
      localStorage.setItem('sonora_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (trackId: string) => favorites.some((t) => t.id === trackId);

  const setTheme = (theme: ThemeId) => {
    setActiveTheme(theme);
    localStorage.setItem('sonora_theme', theme);
  };

  const addCustomTrack = (track: Track) => {
    setQueue((prev) => [track, ...prev]);
    playTrack(track);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        history,
        favorites,
        activeTheme,
        isLyricsOpen,
        isQueueOpen,
        playTrack,
        togglePlay,
        pause,
        resume,
        seek,
        setVolume,
        toggleMute,
        playNext,
        playPrevious,
        addToQueue,
        playNextInQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        toggleShuffle,
        toggleRepeat,
        toggleFavorite,
        isFavorite,
        setTheme,
        setIsLyricsOpen,
        setIsQueueOpen,
        addCustomTrack
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
