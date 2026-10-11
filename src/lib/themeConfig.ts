import { ThemeConfig, ThemeId } from '@/types/music';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'dark-obsidian': {
    id: 'dark-obsidian',
    name: 'Dark Obsidian',
    bgClass: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900/60 border-slate-800/80',
    accentClass: 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-500/25',
    accentText: 'text-purple-400',
    borderClass: 'border-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    previewBg: 'bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950'
  },
  'clean-studio': {
    id: 'clean-studio',
    name: 'Clean Studio',
    bgClass: 'bg-zinc-100 text-zinc-900',
    cardBg: 'bg-white/80 border-zinc-200 shadow-sm',
    accentClass: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25',
    accentText: 'text-indigo-600',
    borderClass: 'border-zinc-200',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-500',
    previewBg: 'bg-gradient-to-br from-zinc-100 via-indigo-50 to-zinc-200'
  },
  'midnight-sapphire': {
    id: 'midnight-sapphire',
    name: 'Midnight Sapphire',
    bgClass: 'bg-slate-950 text-sky-100',
    cardBg: 'bg-sky-950/40 border-sky-800/50',
    accentClass: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold shadow-sky-500/25',
    accentText: 'text-sky-400',
    borderClass: 'border-sky-900/60',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-300/70',
    previewBg: 'bg-gradient-to-br from-slate-950 via-sky-950 to-indigo-950'
  },
  'emerald-studio': {
    id: 'emerald-studio',
    name: 'Emerald Studio',
    bgClass: 'bg-zinc-950 text-emerald-100',
    cardBg: 'bg-emerald-950/40 border-emerald-800/40',
    accentClass: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold shadow-emerald-500/25',
    accentText: 'text-emerald-400',
    borderClass: 'border-emerald-900/50',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-300/70',
    previewBg: 'bg-gradient-to-br from-zinc-950 via-emerald-950 to-teal-950'
  },
  'sunset-glow': {
    id: 'sunset-glow',
    name: 'Sunset Glow',
    bgClass: 'bg-stone-950 text-amber-100',
    cardBg: 'bg-rose-950/30 border-amber-900/40',
    accentClass: 'bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-stone-950 font-bold shadow-amber-500/25',
    accentText: 'text-amber-400',
    borderClass: 'border-amber-900/40',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
    previewBg: 'bg-gradient-to-br from-stone-950 via-rose-950 to-amber-950'
  }
};
