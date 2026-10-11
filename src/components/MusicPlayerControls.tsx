'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Volume1,
  Mic2,
  ListMusic,
  Heart,
  Music2,
  Sliders
} from 'lucide-react';

export const MusicPlayerControls: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    playNext,
    playPrevious,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    isFavorite,
    setIsLyricsOpen,
    isLyricsOpen,
    setIsQueueOpen,
    isQueueOpen
  } = usePlayer();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const favorite = isFavorite(currentTrack.id);

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-2xl border-t border-white/10 px-4 py-3 md:px-8 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">

        {/* Track Details Info (Left) */}
        <div className="flex items-center justify-between w-full md:w-1/4 gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg group">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  isPlaying ? 'scale-105 animate-spin-slow' : ''
                }`}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="min-w-0">
              <h4 className="font-bold text-sm md:text-base text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{currentTrack.artist}</p>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(currentTrack)}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              favorite ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Playback Controls & Seek Bar (Center) */}
        <div className="flex flex-col items-center w-full md:w-1/2 max-w-xl space-y-1.5">
          {/* Action Buttons */}
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isShuffle ? 'text-purple-400' : 'text-zinc-400 hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={playPrevious}
              className="p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={playNext}
              className="p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                repeatMode !== 'off' ? 'text-purple-400' : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Progress Seek Bar */}
          <div className="w-full flex items-center gap-2 text-xs text-zinc-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Toggles (Right) */}
        <div className="flex items-center justify-end w-full md:w-1/4 gap-3">
          <button
            onClick={() => setIsLyricsOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isLyricsOpen
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
            title="Live Lyrics"
          >
            <Mic2 className="w-3.5 h-3.5" />
            <span>Lyrics</span>
          </button>

          <button
            onClick={() => setIsQueueOpen((prev) => !prev)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isQueueOpen
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border-white/10'
            }`}
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          {/* Volume Control Slider */}
          <div className="hidden sm:flex items-center gap-2">
            <button onClick={toggleMute} className="text-zinc-400 hover:text-white cursor-pointer">
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 focus:outline-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
