import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { WebSite } from '../types/hub';
import { WebsiteCard } from './WebsiteCard';

interface FavoritesShelfProps {
  favorites: WebSite[];
  onOpen: (site: WebSite, mode?: 'in-app' | 'external' | 'pwa-window') => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEdit: (site: WebSite, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onViewAllFavorites: () => void;
}

export const FavoritesShelf: React.FC<FavoritesShelfProps> = ({
  favorites,
  onOpen,
  onToggleFavorite,
  onEdit,
  onDelete,
  onViewAllFavorites,
}) => {
  if (favorites.length === 0) return null;

  return (
    <section className="w-full mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
          </div>
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            Favorites & Pinned
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 font-mono">
            {favorites.length}
          </span>
        </div>

        {favorites.length > 6 && (
          <button
            onClick={onViewAllFavorites}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5 font-medium transition"
          >
            <span>View all</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Horizontal smooth scrolling shelf or auto-wrap grid */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/60 via-slate-850/50 to-slate-900/60 border border-white/5 backdrop-blur-md shadow-lg">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-6 justify-items-center">
          {favorites.slice(0, 8).map((site) => (
            <WebsiteCard
              key={site.id}
              site={site}
              viewMode="comfortable"
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
