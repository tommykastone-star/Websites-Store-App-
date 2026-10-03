import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Search, 
  Plus, 
  Check, 
  Zap, 
  ExternalLink, 
  Download, 
  AppWindow, 
  Sparkles, 
  ShoppingBag,
  Crown
} from 'lucide-react';
import { WebSite } from '../types/hub';
import { CURATED_DIRECTORY } from '../data/defaultWebsites';
import { getFaviconUrl, getDomain } from '../utils/favicon';
import { AdTriggerReason } from '../types/ads';

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSites: WebSite[];
  onAddFromDirectory: (item: Omit<WebSite, 'id' | 'openCount' | 'isFavorite'>) => void;
  isPremium?: boolean;
  onRequireAd?: (reason: AdTriggerReason, itemName: string, callback: () => void) => void;
  onOpenRemoveAds?: () => void;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  existingSites,
  onAddFromDirectory,
  isPremium = false,
  onRequireAd,
  onOpenRemoveAds,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'All' | 'pwa' | string>('pwa');

  if (!isOpen) return null;

  const categories = [
    { id: 'pwa', label: '⚡ Progressive Web Apps' },
    { id: 'All', label: 'All Store Apps' },
    { id: 'Social', label: 'Social' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'Entertainment', label: 'Entertainment' },
    { id: 'AI & Research', label: 'AI & Research' },
    { id: 'Dev & Tech', label: 'Dev & Tech' },
  ];

  const filteredItems = CURATED_DIRECTORY.filter((item) => {
    let matchesCat = true;
    if (selectedCat === 'pwa') {
      matchesCat = !!item.isPwa;
    } else if (selectedCat !== 'All') {
      matchesCat = item.category === selectedCat;
    }

    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(q) ||
      item.url.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.pwaFeatures && item.pwaFeatures.some((f) => f.toLowerCase().includes(q)));

    return matchesCat && matchesSearch;
  });

  const isAlreadyAdded = (url: string) => {
    const itemDomain = getDomain(url);
    return existingSites.some((s) => getDomain(s.url) === itemDomain);
  };

  const handleInstallClick = (item: (typeof CURATED_DIRECTORY)[0]) => {
    if (isAlreadyAdded(item.url)) return;

    // PWA install requires 10s ad, adding regular site requires 30s ad
    const reason: AdTriggerReason = item.isPwa ? 'install_pwa' : 'add_site';

    if (!isPremium && onRequireAd) {
      onRequireAd(reason, item.name, () => {
        onAddFromDirectory(item);
      });
    } else {
      onAddFromDirectory(item);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-4xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shadow-lg shadow-cyan-500/20 bg-slate-950 flex-shrink-0">
              <img src="/app-icon.png" alt="Store Icon" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                PWA & Websites Store
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-cyan-300" />
                  Installable PWAs
                </span>
                {isPremium && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                    <Crown className="w-2.5 h-2.5 fill-slate-950" />
                    Ad-Free VIP
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                {!isPremium 
                  ? 'Watch a quick video ad to install apps, or upgrade for US$ 5 to remove all ads'
                  : 'Instant 1-click install active with your VIP Ad-Free Pass'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isPremium && onOpenRemoveAds && (
              <button
                onClick={onOpenRemoveAds}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/30 transition"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>Remove Ads ($5)</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-white/10 bg-slate-950/30 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PWA store by name, feature (offline, push, standalone), or category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                  selectedCat === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/5'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {filteredItems.map((item) => {
            const added = isAlreadyAdded(item.url);
            const favicon = getFaviconUrl(item.url, 64);

            return (
              <div
                key={item.url}
                className="group relative p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-3 shadow-sm hover:shadow-lg"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center p-2 flex-shrink-0 shadow-md relative overflow-hidden"
                    style={{ backgroundColor: item.color ? `${item.color}25` : 'rgba(30, 41, 59, 0.9)' }}
                  >
                    <img
                      src={favicon}
                      alt={item.name}
                      className="w-7 h-7 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {item.isPwa && (
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </h4>
                      {item.isPwa && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <Zap className="w-2 h-2 fill-cyan-300" />
                          PWA
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {item.notes || item.category}
                    </p>
                  </div>
                </div>

                {/* PWA Features chips */}
                {item.pwaFeatures && item.pwaFeatures.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {item.pwaFeatures.map((feat) => (
                      <span
                        key={feat}
                        className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-900/80 text-emerald-300 border border-emerald-500/20"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Action Button */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {getDomain(item.url)}
                  </span>

                  <button
                    disabled={added}
                    onClick={() => handleInstallClick(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 flex-shrink-0 ${
                      added
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : item.isPwa
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Installed</span>
                      </>
                    ) : item.isPwa ? (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Install PWA {!isPremium && '(10s Ad)'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Install App {!isPremium && '(30s Ad)'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredItems.length} apps available in this view</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
