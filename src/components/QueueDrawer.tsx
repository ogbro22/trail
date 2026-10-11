'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { X, Trash2, Play, GripVertical, Disc } from 'lucide-react';

export const QueueDrawer: React.FC = () => {
  const { queue, currentTrack, isPlaying, playTrack, removeFromQueue, clearQueue, isQueueOpen, setIsQueueOpen } = usePlayer();

  if (!isQueueOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md h-full bg-slate-900/95 border-l border-white/10 p-6 flex flex-col shadow-2xl space-y-4">

        {/* Queue Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Disc className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">Up Next Queue ({queue.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 1 && (
              <button
                onClick={clearQueue}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors"
              >
                Clear Queue
              </button>
            )}
            <button
              onClick={() => setIsQueueOpen(false)}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Playing Track Banner */}
        {currentTrack && (
          <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-2xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Now Playing</span>
            <div className="flex items-center gap-3">
              <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-12 h-12 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-white truncate">{currentTrack.title}</p>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
            </div>
          </div>
        )}

        {/* Queue Tracks List */}
        <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-1">
          {queue.length === 0 ? (
            <p className="text-center text-zinc-500 text-sm py-12">Queue is empty</p>
          ) : (
            queue.map((track, idx) => {
              const isCurrent = currentTrack?.id === track.id;

              return (
                <div
                  key={`${track.id}-${idx}`}
                  className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-purple-600/20 border-purple-500/50 text-white'
                      : 'bg-black/20 hover:bg-white/5 border-white/5 text-zinc-300'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 cursor-grab" />
                  <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded-lg object-cover" />

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold truncate ${isCurrent ? 'text-purple-300' : 'text-white'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    {!isCurrent && (
                      <button
                        onClick={() => playTrack(track)}
                        className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10"
                        title="Play Now"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                    <button
                      onClick={() => removeFromQueue(idx)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-white/10"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
