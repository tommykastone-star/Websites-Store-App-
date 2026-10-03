import React, { useState } from 'react';
import { 
  Star, 
  ExternalLink, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  ArrowRight, 
  Globe, 
  Maximize2,
  Zap,
  AppWindow
} from 'lucide-react';
import { WebSite, ViewMode } from '../types/hub';
import { getFaviconUrl, getDomain, getInitialsAndColor } from '../utils/favicon';

interface WebsiteCardProps {
  site: WebSite;
  viewMode: ViewMode;
  onOpen: (site: WebSite, mode?: 'in-app' | 'external' | 'pwa-window') => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEdit: (site: WebSite, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
  onMove?: (id: string, direction: 'prev' | 'next') => void;
  canMovePrev?: boolean;
  canMoveNext?: boolean;
}

export const WebsiteCard: React.FC<WebsiteCardProps> = ({
  site,
  viewMode,
  onOpen,
  onToggleFavorite,
  onEdit,
  onDelete,
  onMove,
  canMovePrev = false,
  canMoveNext = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const domain = getDomain(site.url);
  const { initials, gradient } = getInitialsAndColor(site.name);

  // Icon resolver
  let iconSrc = '';
  if (site.iconType === 'upload' || site.iconType === 'url') {
    iconSrc = site.iconValue || '';
  } else {
    iconSrc = getFaviconUrl(site.url, 128);
  }

  // List view rendering
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onOpen(site, 'in-app')}
        className="group relative flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-blue-500/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Icon */}
          <div 
            className="w-11 h-11 rounded-xl flex items-center justify-center p-2 flex-shrink-0 shadow-md relative overflow-hidden transition-transform group-hover:scale-105"
            style={{ backgroundColor: site.color ? `${site.color}25` : 'rgba(30, 41, 59, 0.9)' }}
          >
            {!imgFailed && iconSrc ? (
              <img
                src={iconSrc}
                alt={site.name}
                className="w-7 h-7 object-contain drop-shadow"
                onError={() => setImgFailed(true)}
              />
            ) : (
              <div className={`w-full h-full rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}>
                {initials}
              </div>
            )}
            {site.isFavorite && (
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-blue-400 transition-colors">
                {site.name}
              </h3>
              {site.isPwa && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                  <Zap className="w-2.5 h-2.5 fill-cyan-300" />
                  PWA
                </span>
              )}
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-white/5 truncate max-w-[120px]">
                {site.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5">
              {domain} {site.notes ? `• ${site.notes}` : ''}
              {site.pwaFeatures && site.pwaFeatures.length > 0 && (
                <span className="text-emerald-400/90 ml-1">
                  ({site.pwaFeatures.join(', ')})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {onMove && (
            <div className="hidden md:flex items-center gap-0.5 mr-1">
              <button
                disabled={!canMovePrev}
                onClick={() => onMove(site.id, 'prev')}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition"
                title="Move left"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={!canMoveNext}
                onClick={() => onMove(site.id, 'next')}
                className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-20 transition"
                title="Move right"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {site.isPwa && (
            <button
              onClick={() => onOpen(site, 'pwa-window')}
              className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition"
              title="Launch in Standalone PWA Window"
            >
              <AppWindow className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={(e) => onToggleFavorite(site.id, e)}
            className={`p-1.5 rounded-lg hover:bg-slate-700 transition ${
              site.isFavorite ? 'text-amber-400' : 'text-slate-400 hover:text-white'
            }`}
            title={site.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-4 h-4 ${site.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => onOpen(site, 'external')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Open in new window / tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => onEdit(site, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="Edit website details"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => onDelete(site.id, e)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Remove from store hub"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid view (Comfortable or Compact)
  const isCompact = viewMode === 'compact';
  const iconSizeClass = isCompact ? 'w-13 h-13 sm:w-14 sm:h-14 p-2.5' : 'w-16 h-16 sm:w-18 sm:h-18 p-3.5';
  const imgSizeClass = isCompact ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-9 h-9 sm:w-10 sm:h-10';

  return (
    <div className="group relative flex flex-col items-center">
      {/* Icon Squircle Box */}
      <div 
        onClick={() => onOpen(site, 'in-app')}
        className={`relative ${iconSizeClass} rounded-2xl cursor-pointer transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-95 flex items-center justify-center border border-white/10 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-500/20`}
        style={{
          background: site.color 
            ? `linear-gradient(135deg, ${site.color}35 0%, rgba(15, 23, 42, 0.95) 100%)` 
            : 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Subtle glossy sheen */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

        {/* Favorite Star Badge */}
        {site.isFavorite && (
          <div className="absolute -top-1 -right-1 z-10 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
            <Star className="w-2.5 h-2.5 fill-slate-950" />
          </div>
        )}

        {/* PWA Badge */}
        {site.isPwa && (
          <div 
            className="absolute -bottom-1 -right-1 z-10 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-md border border-slate-900"
            title="Progressive Web App"
          >
            <Zap className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
          </div>
        )}

        {/* Icon Asset or Fallback */}
        {!imgFailed && iconSrc ? (
          <img
            src={iconSrc}
            alt={site.name}
            className={`${imgSizeClass} object-contain drop-shadow transition-transform`}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold ${isCompact ? 'text-sm' : 'text-base'}`}>
            {initials}
          </div>
        )}

        {/* Quick Launch In-App hint overlay on hover */}
        <div className="absolute inset-0 rounded-2xl bg-blue-600/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
          <Maximize2 className="w-4 h-4 text-white drop-shadow" />
        </div>
      </div>

      {/* Title & Domain under icon */}
      <div 
        onClick={() => onOpen(site, 'in-app')}
        className="mt-2 text-center w-full px-1 cursor-pointer"
      >
        <span 
          className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-cyan-400 block truncate transition-colors"
          title={`${site.name} (${domain})${site.isPwa ? ' • Progressive Web App' : ''}`}
        >
          {site.name}
        </span>
        {!isCompact && (
          <span className="text-[11px] text-slate-400 block truncate group-hover:text-slate-300">
            {site.isPwa ? (
              <span className="text-cyan-400/90 font-medium">⚡ PWA App</span>
            ) : (
              domain
            )}
          </span>
        )}
      </div>

      {/* Floating Action Menu Button */}
      <div className="absolute -top-2 -left-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-20">
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-full bg-slate-800/90 text-slate-300 hover:text-white border border-white/10 shadow-md backdrop-blur transition"
            title="Options"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop to close menu */}
              <div 
                className="fixed inset-0 z-30" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }} 
              />
              <div 
                className="absolute left-0 mt-1 w-44 rounded-xl bg-slate-800/95 border border-white/10 shadow-2xl py-1 z-40 text-xs backdrop-blur-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onOpen(site, 'in-app');
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-blue-600 hover:text-white flex items-center gap-2"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Open In-App</span>
                </button>

                {site.isPwa && (
                  <button
                    onClick={(e) => {
                      setShowMenu(false);
                      onOpen(site, 'pwa-window');
                    }}
                    className="w-full px-3 py-1.5 text-left text-cyan-300 hover:bg-cyan-600 hover:text-white flex items-center gap-2 font-medium"
                  >
                    <AppWindow className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Launch PWA Window</span>
                  </button>
                )}

                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onOpen(site, 'external');
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>New Browser Tab</span>
                </button>

                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onToggleFavorite(site.id, e);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Star className={`w-3.5 h-3.5 ${site.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                  <span>{site.isFavorite ? 'Unfavorite' : 'Favorite'}</span>
                </button>

                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onEdit(site, e);
                  }}
                  className="w-full px-3 py-1.5 text-left text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Details</span>
                </button>

                {onMove && (
                  <div className="flex items-center justify-between px-3 py-1 text-slate-400 border-t border-white/5 my-1">
                    <span className="text-[10px]">Reorder:</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={!canMovePrev}
                        onClick={() => {
                          onMove(site.id, 'prev');
                        }}
                        className="p-1 hover:text-white disabled:opacity-20"
                        title="Move Left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        disabled={!canMoveNext}
                        onClick={() => {
                          onMove(site.id, 'next');
                        }}
                        className="p-1 hover:text-white disabled:opacity-20"
                        title="Move Right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="h-px bg-white/10 my-1" />

                <button
                  onClick={(e) => {
                    setShowMenu(false);
                    onDelete(site.id, e);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
