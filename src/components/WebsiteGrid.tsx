import React from 'react';
import { Plus, Globe2, Compass, AlertCircle } from 'lucide-react';
import { WebSite, ViewMode } from '../types/hub';
import { WebsiteCard } from './WebsiteCard';

interface WebsiteGridProps {
  websites: WebSite[];
  viewMode: ViewMode;
  onOpen: (site: WebSite, mode?: 'in-app' | 'external' | 'pwa-window') => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEdit: (site: WebSite, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onMoveSite?: (id: string, direction: 'prev' | 'next') => void;
  onOpenAddModal: () => void;
  onOpenDirectoryModal: () => void;
  searchQuery: string;
  activeCategory: string;
}

export const WebsiteGrid: React.FC<WebsiteGridProps> = ({
  websites,
  viewMode,
  onOpen,
  onToggleFavorite,
  onEdit,
  onDelete,
  onMoveSite,
  onOpenAddModal,
  onOpenDirectoryModal,
  searchQuery,
  activeCategory,
}) => {
  if (websites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/40 border border-white/5 backdrop-blur-sm my-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
          <Globe2 className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white mb-1">
          {searchQuery ? `No websites match "${searchQuery}"` : `No websites in "${activeCategory}"`}
        </h3>
        <p className="text-xs text-slate-400 max-w-sm mb-6">
          {searchQuery
            ? 'Try searching with a different term, check the URL, or add this website to your hub.'
            : 'Get started by adding your first website shortcut to this category or explore our directory.'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Website</span>
          </button>
          <button
            onClick={onOpenDirectoryModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-white/10 transition-all"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>Explore Directory</span>
          </button>
        </div>
      </div>
    );
  }

  // Grid sizing classes based on viewMode
  const gridContainerClass =
    viewMode === 'list'
      ? 'flex flex-col gap-2'
      : viewMode === 'compact'
      ? 'grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 sm:gap-4 justify-items-center'
      : 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-5 sm:gap-6 justify-items-center';

  return (
    <div className="w-full">
      <div className={gridContainerClass}>
        {websites.map((site, index) => (
          <WebsiteCard
            key={site.id}
            site={site}
            viewMode={viewMode}
            onOpen={onOpen}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMoveSite}
            canMovePrev={index > 0}
            canMoveNext={index < websites.length - 1}
          />
        ))}

        {/* Add Website Quick Card at end of grid */}
        {viewMode !== 'list' && (
          <div className="flex flex-col items-center group">
            <button
              onClick={onOpenAddModal}
              className={`${
                viewMode === 'compact'
                  ? 'w-13 h-13 sm:w-14 sm:h-14'
                  : 'w-16 h-16 sm:w-18 sm:h-18'
              } rounded-2xl border-2 border-dashed border-white/20 hover:border-blue-400/80 bg-slate-800/30 hover:bg-blue-600/10 flex flex-col items-center justify-center text-slate-400 hover:text-blue-400 transition-all duration-200 transform group-hover:scale-105 active:scale-95 shadow-sm hover:shadow-md`}
              title="Add a new website shortcut"
            >
              <Plus className={`${viewMode === 'compact' ? 'w-5 h-5' : 'w-6 h-6'} transition-transform group-hover:rotate-90 duration-300`} />
            </button>
            <span className="mt-2 text-xs text-slate-400 group-hover:text-blue-400 transition-colors font-medium">
              Add Site
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
