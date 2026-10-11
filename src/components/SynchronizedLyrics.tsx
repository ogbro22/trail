'use client';

import React, { useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { LyricLine } from '@/types/music';
import { X, Music2, Mic2, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export const SynchronizedLyrics: React.FC = () => {
  const { currentTrack, currentTime, seek, isLyricsOpen, setIsLyricsOpen, activeTheme } = usePlayer();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const lyrics: LyricLine[] = currentTrack?.lyrics || [
    { time: 0, text: `♪ Listening to ${currentTrack?.title || 'Sonora'} ♪` },
    { time: 5, text: `By ${currentTrack?.artist || 'Unknown Artist'}` },
    { time: 15, text: '♪ Enjoy high quality full-length track streaming ♪' }
  ];

  // Find active line index based on currentTime
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    if (currentTime >= lyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  // Auto scroll active lyric into middle using GSAP
  useEffect(() => {
    if (activeLineRef.current && containerRef.current && activeIndex !== -1) {
      const container = containerRef.current;
      const activeEl = activeLineRef.current;

      const containerHeight = container.clientHeight;
      const activeTop = activeEl.offsetTop;
      const activeHeight = activeEl.clientHeight;

      const targetScroll = activeTop - containerHeight / 2 + activeHeight / 2;

      gsap.to(container, {
        scrollTop: targetScroll,
        duration: 0.6,
        ease: 'power2.out'
      });
    }
  }, [activeIndex]);

  if (!isLyricsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-3xl flex flex-col overflow-hidden bg-gradient-to-b from-slate-900/90 to-black/95 border border-white/10 shadow-2xl">
        {/* Top Bar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Mic2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                Live Lyrics
                <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400 truncate max-w-xs md:max-w-md">
                {currentTrack?.title} — <span className="text-zinc-300">{currentTrack?.artist}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLyricsOpen(false)}
            className="p-2.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            aria-label="Close Lyrics"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body: Left Artwork, Right Auto-Scrolling Lyrics */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Album Cover Side */}
          <div className="hidden md:flex md:col-span-5 flex-col items-center justify-center p-8 border-r border-white/5 bg-black/20">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl group border border-white/10">
              <img
                src={currentTrack?.coverUrl}
                alt={currentTrack?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm font-bold truncate">{currentTrack?.title}</p>
                <p className="text-xs text-zinc-300 truncate">{currentTrack?.artist}</p>
              </div>
            </div>
          </div>

          {/* Right Lyrics Scroll Area */}
          <div
            ref={containerRef}
            className="col-span-12 md:col-span-7 h-full overflow-y-auto px-6 py-12 md:px-12 space-y-8 scroll-smooth no-scrollbar select-none"
          >
            {lyrics.map((line, index) => {
              const isActive = index === activeIndex;
              const isPast = index < activeIndex;

              return (
                <p
                  key={index}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => seek(line.time)}
                  className={`text-xl md:text-2xl font-bold cursor-pointer transition-all duration-300 transform leading-relaxed ${
                    isActive
                      ? 'text-purple-400 scale-105 opacity-100 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : isPast
                      ? 'text-zinc-500 opacity-60 hover:opacity-90'
                      : 'text-zinc-400 opacity-40 hover:opacity-80'
                  }`}
                >
                  {line.text}
                </p>
              );
            })}

            {currentTrack?.plainLyrics && (
              <div className="mt-12 pt-8 border-t border-white/10 text-zinc-400 text-sm whitespace-pre-line leading-relaxed">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">Song Info / Full Lyrics</p>
                {currentTrack.plainLyrics}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Quick Seek Instruction */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 text-center text-xs text-zinc-400">
          Tip: Click on any lyric line to jump directly to that timestamp in the song.
        </div>
      </div>
    </div>
  );
};
