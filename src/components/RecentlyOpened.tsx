import React from 'react';
import { Clock, ExternalLink, X } from 'lucide-react';
import { WebSite } from '../types/hub';
import { getDomain, getFaviconUrl } from '../utils/favicon';

interface RecentlyOpenedProps {
  recentSites: WebSite[];
  onOpen: (site: WebSite) => void;
  onClearRecent?: () => void;
}

export const RecentlyOpened: React.FC<RecentlyOpenedProps> = ({
  recentSites,
  onOpen,
  onClearRecent,
}) => {
  if (recentSites.length === 0) return null;

  const formatTimeAgo = (timestamp?: number) => {
    if (!timestamp) return 'Recently';
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <section className="w-full mb-6">
      <div className="flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <h2 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Jump Back In (Recent)
          </h2>
        </div>
        {onClearRecent && (
          <button
            onClick={onClearRecent}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition"
          >
            Clear History
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {recentSites.slice(0, 10).map((site) => {
          const domain = getDomain(site.url);
          const icon = site.iconType === 'upload' || site.iconType === 'url'
            ? site.iconValue
            : getFaviconUrl(site.url, 64);

          return (
            <button
              key={site.id}
              onClick={() => onOpen(site)}
              className="group flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700/80 border border-white/5 hover:border-blue-500/30 transition-all flex-shrink-0 text-left"
            >
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center p-1 flex-shrink-0"
                style={{ backgroundColor: site.color ? `${site.color}25` : 'rgba(30, 41, 59, 0.9)' }}
              >
                {icon ? (
                  <img src={icon} alt={site.name} className="w-4 h-4 object-contain" />
                ) : (
                  <span className="text-xs font-bold text-white">{site.name.slice(0, 1)}</span>
                )}
              </div>
              <div className="min-w-0 pr-1">
                <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400 truncate max-w-[110px]">
                  {site.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {formatTimeAgo(site.lastOpenedAt)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
