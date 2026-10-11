'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { THEMES } from '@/lib/themeConfig';
import { MusicSearchAndBrowse } from '@/components/MusicSearchAndBrowse';
import { MusicPlayerControls } from '@/components/MusicPlayerControls';
import { SynchronizedLyrics } from '@/components/SynchronizedLyrics';
import { QueueDrawer } from '@/components/QueueDrawer';
import { ThemeSelector } from '@/components/ThemeSelector';
import { Music2, Disc, Radio, Sparkles, Heart } from 'lucide-react';

export default function Home() {
  const { activeTheme, favorites, queue, currentTrack } = usePlayer();
  const theme = THEMES[activeTheme] || THEMES['dark-obsidian'];

  return (
    <div className={`min-h-screen ${theme.bgClass} flex flex-col transition-colors duration-500 pb-32`}>
      {/* Navbar Header */}
      <header className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 border border-white/20">
              <Disc className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                Sonora
              </h1>
              <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold">
                Full-Length Music & Synchronized Lyrics
              </p>
            </div>
          </div>

          {/* Right Header Options */}
          <div className="flex items-center gap-3">
            <ThemeSelector />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 space-y-10">

        {/* Banner Hero */}
        <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-white/10 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-black/60 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Song Streaming • No 30-Sec Previews</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Stream Endless Music With Live Synced Lyrics.
            </h2>
            <p className="text-sm md:text-base text-zinc-300 leading-relaxed">
              Search by music names, apps, or artist names. Enjoy queue management, custom themes, and full synchronized lyrics auto-scrolling with every beat.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 top-0 hidden lg:flex items-center justify-center p-8 opacity-20 pointer-events-none">
            <Music2 className="w-72 h-72 text-purple-400" />
          </div>
        </div>

        {/* Music Search and Streaming Browser */}
        <section className="space-y-4">
          <MusicSearchAndBrowse />
        </section>
      </main>

      {/* Synchronized Lyrics Overlay Modal */}
      <SynchronizedLyrics />

      {/* Up Next Queue Drawer */}
      <QueueDrawer />

      {/* Sticky Bottom Music Player Bar */}
      <MusicPlayerControls />
    </div>
  );
}
