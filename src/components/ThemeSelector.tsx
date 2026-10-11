'use client';

import React, { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { ThemeId } from '@/types/music';
import { THEMES } from '@/lib/themeConfig';
import { Palette, Check, Sparkles, X } from 'lucide-react';

export const ThemeSelector: React.FC = () => {
  const { activeTheme, setTheme } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
        title="Choose Theme"
      >
        <Palette className="w-4 h-4 text-purple-400" />
        <span className="hidden sm:inline">{THEMES[activeTheme]?.name || 'Theme'}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 z-50 w-72 p-4 rounded-2xl bg-slate-900 border border-white/10 shadow-2xl space-y-3 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Select Theme
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {(Object.keys(THEMES) as ThemeId[]).map((id) => {
                const theme = THEMES[id];
                const isSelected = activeTheme === id;

                return (
                  <button
                    key={id}
                    onClick={() => {
                      setTheme(id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-600/20 border-purple-500/50 text-white'
                        : 'bg-black/20 hover:bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full ${theme.previewBg} border border-white/20`} />
                      <span>{theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
