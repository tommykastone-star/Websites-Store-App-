import React from 'react';
import { 
  Plus, 
  Search, 
  Smartphone, 
  Monitor, 
  Settings, 
  Compass, 
  LayoutGrid, 
  Grid3X3, 
  List, 
  X,
  Zap,
  ShoppingBag,
  Crown
} from 'lucide-react';
import { ViewMode, DevicePreviewMode } from '../types/hub';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddModal: () => void;
  onOpenDirectoryModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenRemoveAds: () => void;
  isPremium?: boolean;
  onRequirePwaInstallAd?: (callback: () => void) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  devicePreview: DevicePreviewMode;
  onToggleDevicePreview: () => void;
  totalSites: number;
  pwaCount: number;
  onFilterPwas?: () => void;
  isPwaActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddModal,
  onOpenDirectoryModal,
  onOpenSettingsModal,
  onOpenRemoveAds,
  isPremium = false,
  onRequirePwaInstallAd,
  viewMode,
  onChangeViewMode,
  devicePreview,
  onToggleDevicePreview,
  totalSites,
  pwaCount,
  onFilterPwas,
  isPwaActive,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-slate-900/80 border-b border-white/10 px-4 lg:px-8 py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Stats */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => onSearchChange('')}>
            {/* Provided App Icon Image */}
            <div className="w-11 h-11 rounded-2xl overflow-hidden border border-white/20 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-950">
              <img
                src="/app-icon.png"
                alt="Websites Store App Icon"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-1.5">
                  Websites Store App
                  {isPremium ? (
                    <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1 shadow-sm">
                      <Crown className="w-3 h-3 fill-slate-950" />
                      VIP Ad-Free
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-cyan-300" />
                      PWA Store
                    </span>
                  )}
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{totalSites} {totalSites === 1 ? 'app' : 'apps'}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">{pwaCount} installable PWAs</span>
              </p>
            </div>
          </div>

          {/* Mobile Right Action Bar */}
          <div className="flex items-center gap-1.5 md:hidden">
            {!isPremium && (
              <button
                onClick={onOpenRemoveAds}
                className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1"
                title="Remove Ads ($5)"
              >
                <Crown className="w-3.5 h-3.5 fill-amber-300" />
                <span>$5</span>
              </button>
            )}
            <PWAInstallButton isPremium={isPremium} onRequireAd={onRequirePwaInstallAd} />
            <button
              onClick={onOpenAddModal}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-transform active:scale-95"
              title="Add / Install Website"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenSettingsModal}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:max-w-md lg:max-w-lg relative">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search store, PWAs, websites, tools... (Press ⌘K)"
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/80 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block absolute right-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-700/60 rounded border border-white/5">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="hidden md:flex items-center gap-2">
          {/* Remove Ads button if not yet premium */}
          {!isPremium && (
            <button
              onClick={onOpenRemoveAds}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition"
              title="Remove all ads forever for US$ 5.00"
            >
              <Crown className="w-3.5 h-3.5 fill-slate-950" />
              <span>Remove Ads ($5)</span>
            </button>
          )}

          {/* PWA Install Button for this Store */}
          <PWAInstallButton isPremium={isPremium} onRequireAd={onRequirePwaInstallAd} />

          {/* Quick PWA Filter Toggle */}
          {onFilterPwas && (
            <button
              onClick={onFilterPwas}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
                isPwaActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-700/80'
              }`}
              title="Show only Progressive Web Apps"
            >
              <Zap className={`w-3.5 h-3.5 ${isPwaActive ? 'fill-white text-white' : 'text-cyan-400 fill-cyan-400'}`} />
              <span>PWAs Only</span>
            </button>
          )}

          {/* View mode switcher */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-white/10">
            <button
              onClick={() => onChangeViewMode('comfortable')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'comfortable' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Comfortable Grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('compact')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'compact' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="Compact Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeViewMode('list')}
              className={`p-1.5 rounded-md transition ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Device Simulator Toggle */}
          <button
            onClick={onToggleDevicePreview}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              devicePreview === 'mobile'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700/80 hover:text-white'
            }`}
            title="Toggle between Desktop Dashboard and Android Mobile Simulation"
          >
            {devicePreview === 'mobile' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Phone Mode</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span>Desktop Mode</span>
              </>
            )}
          </button>

          {/* PWA & Website Store Directory */}
          <button
            onClick={onOpenDirectoryModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 active:scale-95 transition"
            title="Open PWA Store Directory"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-cyan-300" />
            <span>PWA Store</span>
          </button>

          {/* Add Website Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-white/10 active:scale-95 transition-all"
            title="Install custom PWA or website shortcut"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Install URL</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettingsModal}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-white/10 text-slate-300 hover:text-white hover:bg-slate-700/80 transition"
            title="Store Settings & Backup"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
