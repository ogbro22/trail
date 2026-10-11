import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { PlayerProvider } from '@/context/PlayerContext';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Sonora — Music Player with Live Synchronized Lyrics',
  description: 'A modern, beautiful music player with full-length track streaming, live synchronized LRC lyrics, queue management, and rich theme options.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen selection:bg-purple-500 selection:text-white">
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
