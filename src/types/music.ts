export interface LyricLine {
  time: number; // in seconds
  text: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl: string;
  genre?: string;
  source: 'Jamendo' | 'Audius' | 'Featured' | 'Custom';
  lyrics?: LyricLine[];
  plainLyrics?: string;
  downloadUrl?: string;
}

export type ThemeId = 'dark-obsidian' | 'clean-studio' | 'midnight-sapphire' | 'emerald-studio' | 'sunset-glow';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  bgClass: string;
  cardBg: string;
  accentClass: string;
  accentText: string;
  borderClass: string;
  textPrimary: string;
  textSecondary: string;
  previewBg: string;
}
