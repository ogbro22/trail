'use client';

import React, { useState, useEffect } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { Track } from '@/types/music';
import { searchJamendoTracks, fetchAudiusTrendingTracks, FEATURED_TRACKS } from '@/lib/musicService';
import {
  Search,
  Play,
  Pause,
  Plus,
  ListPlus,
  Heart,
  Music,
  Compass,
  Radio,
  Sparkles,
  Check,
  Disc,
  Upload
} from 'lucide-react';

export const MusicSearchAndBrowse: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    addToQueue,
    playNextInQueue,
    toggleFavorite,
    isFavorite,
    addCustomTrack
  } = usePlayer();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'featured' | 'search' | 'audius' | 'favorites'>('featured');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [audiusTracks, setAudiusTracks] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Custom song modal input states
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  // Fetch Audius trending tracks on load
  useEffect(() => {
    fetchAudiusTrendingTracks().then((tracks) => setAudiusTracks(tracks));
  }, []);

  // Debounced search on query change
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchJamendoTracks(query);
      setSearchResults(results);
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const showToast = (message: string) => {
    setAddedToast(message);
    setTimeout(() => setAddedToast(null), 2500);
  };

  const handleAddCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !customUrl) return;

    const newTrack: Track = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      artist: customArtist || 'Independent Artist',
      album: 'Custom Upload',
      duration: 180,
      audioUrl: customUrl,
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      genre: 'Custom Stream',
      source: 'Custom',
      lyrics: [
        { time: 0, text: `Playing custom track: ${customTitle}` },
        { time: 10, text: `Artist: ${customArtist || 'Unknown'}` },
        { time: 30, text: '♪ Enjoy playing your audio on Sonora ♪' }
      ]
    };

    addCustomTrack(newTrack);
    setIsCustomModalOpen(false);
    setCustomTitle('');
    setCustomArtist('');
    setCustomUrl('');
    showToast(`Added "${customTitle}" to playlist!`);
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-xl font-medium animate-bounce text-sm">
          <Check className="w-4 h-4" />
          {addedToast}
        </div>
      )}

      {/* Header Search & Custom Audio Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.trim() && activeTab !== 'search') {
                setActiveTab('search');
              }
            }}
            placeholder="Search songs, artists, music names..."
            className="w-full pl-12 pr-10 py-3.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <button
          onClick={() => setIsCustomModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-2xl shadow-lg transition-all cursor-pointer whitespace-nowrap"
        >
          <Upload className="w-4 h-4" />
          Import Audio URL
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('featured')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'featured'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          Featured Full Tracks
        </button>

        <button
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'search'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Search className="w-4 h-4 text-purple-400" />
          Jamendo Global Search {searchResults.length > 0 && `(${searchResults.length})`}
        </button>

        <button
          onClick={() => setActiveTab('audius')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'audius'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Radio className="w-4 h-4 text-purple-400" />
          Audius Trending Stream
        </button>
      </div>

      {/* Main Track Display Section */}
      <div className="space-y-3">
        {isSearching && activeTab === 'search' ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400 space-y-3">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm">Searching full songs & artist names across Jamendo...</p>
          </div>
        ) : (
          (() => {
            let tracksToDisplay: Track[] = [];

            if (activeTab === 'featured') tracksToDisplay = FEATURED_TRACKS;
            if (activeTab === 'search') tracksToDisplay = searchResults;
            if (activeTab === 'audius') tracksToDisplay = audiusTracks;

            if (tracksToDisplay.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 space-y-3 bg-black/20 rounded-3xl border border-white/5">
                  <Disc className="w-12 h-12 text-zinc-600 animate-spin-slow" />
                  <p className="text-base font-semibold text-zinc-300">
                    {activeTab === 'search' ? 'No songs found. Try searching for "acoustic", "lofi", or artist names!' : 'No tracks available.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tracksToDisplay.map((track) => {
                  const isCurrent = currentTrack?.id === track.id;
                  const isCurrentlyPlaying = isCurrent && isPlaying;
                  const favorite = isFavorite(track.id);

                  return (
                    <div
                      key={track.id}
                      className={`group relative flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-300 ${
                        isCurrent
                          ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-900/20'
                          : 'bg-black/20 hover:bg-white/5 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {/* Album Cover with Overlay Play Button */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                          onClick={() => {
                            if (isCurrent) {
                              togglePlay();
                            } else {
                              playTrack(track, tracksToDisplay);
                            }
                          }}
                          className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity cursor-pointer ${
                            isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        >
                          {isCurrentlyPlaying ? (
                            <Pause className="w-6 h-6 text-purple-400 fill-purple-400" />
                          ) : (
                            <Play className="w-6 h-6 text-white fill-white translate-x-0.5" />
                          )}
                        </button>
                      </div>

                      {/* Song Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                          {track.title}
                        </h4>
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{track.artist}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-medium">
                            {track.source}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            {Math.floor(track.duration / 60)}:
                            {Math.floor(track.duration % 60)
                              .toString()
                              .padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => toggleFavorite(track)}
                          className={`p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                            favorite ? 'text-rose-500' : 'text-zinc-400 hover:text-white'
                          }`}
                          title="Like Song"
                        >
                          <Heart className={`w-4 h-4 ${favorite ? 'fill-rose-500' : ''}`} />
                        </button>

                        <button
                          onClick={() => {
                            playNextInQueue(track);
                            showToast(`Queued next: "${track.title}"`);
                          }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Play Next"
                        >
                          <ListPlus className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            addToQueue(track);
                            showToast(`Added to queue: "${track.title}"`);
                          }}
                          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="Add to Queue"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </div>

      {/* Import Custom Song Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 animate-fade-in">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-400" />
              Import Custom Full-Length Track
            </h3>
            <p className="text-xs text-zinc-400">
              Paste a direct audio file URL (.mp3, .wav, .m4a, or stream URL) to play it inside Sonora.
            </p>

            <form onSubmit={handleAddCustomSong} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Song Title *</label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Midnight Serenade"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Artist Name</label>
                <input
                  type="text"
                  value={customArtist}
                  onChange={(e) => setCustomArtist(e.target.value)}
                  placeholder="e.g. Sonora Artists"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Direct Audio Stream URL *</label>
                <input
                  type="url"
                  required
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/audio.mp3"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
                >
                  Add Track & Play
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
