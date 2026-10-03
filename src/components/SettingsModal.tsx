import React, { useRef, useState } from 'react';
import { 
  X, 
  Settings, 
  Palette, 
  Volume2, 
  VolumeX, 
  Download, 
  Upload, 
  Bookmark, 
  RotateCcw, 
  Smartphone, 
  Monitor, 
  Moon, 
  Sun, 
  Sparkles, 
  Check,
  Layout,
  Layers,
  Image as ImageIcon,
  Crown
} from 'lucide-react';
import { HubSettings, ThemeMode, ViewMode, DevicePreviewMode } from '../types/hub';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: HubSettings;
  onUpdateSettings: (newSettings: Partial<HubSettings>) => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onExportBookmarks: () => void;
  onResetDefaults: () => void;
  onOpenRemoveAds: () => void;
}

const THEME_OPTIONS: { id: ThemeMode; label: string; icon: string; preview: string }[] = [
  { id: 'dark', label: 'Dark Slate', icon: '🌙', preview: 'bg-slate-900 border-slate-700' },
  { id: 'midnight', label: 'Midnight Blue', icon: '🌌', preview: 'bg-[#060814] border-indigo-900' },
  { id: 'sunset', label: 'Sunset OLED', icon: '🌆', preview: 'bg-[#14081c] border-purple-900' },
  { id: 'emerald', label: 'Emerald Deep', icon: '🌲', preview: 'bg-[#051611] border-emerald-900' },
  { id: 'light', label: 'Clean Light', icon: '☀️', preview: 'bg-slate-100 border-slate-300' },
];

const WALLPAPER_PRESETS = [
  { id: 'gradient-slate', label: 'Slate Mesh', gradient: 'from-slate-950 via-slate-900 to-slate-950' },
  { id: 'gradient-midnight', label: 'Midnight Glow', gradient: 'from-slate-950 via-indigo-950 to-slate-950' },
  { id: 'gradient-sunset', label: 'Sunset Nebula', gradient: 'from-purple-950 via-slate-900 to-pink-950' },
  { id: 'gradient-emerald', label: 'Northern Lights', gradient: 'from-emerald-950 via-slate-900 to-teal-950' },
  { id: 'gradient-cyber', label: 'Cyber Grid', gradient: 'from-blue-950 via-purple-950 to-slate-950' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportJson,
  onImportJson,
  onExportBookmarks,
  onResetDefaults,
  onOpenRemoveAds,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'appearance' | 'layout' | 'data'>('appearance');
  const [customWallUrl, setCustomWallUrl] = useState(settings.customWallpaperUrl || '');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  const handleApplyCustomWallpaper = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      wallpaper: 'custom',
      customWallpaperUrl: customWallUrl.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-xl rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Hub Settings & Personalization</h2>
              <p className="text-xs text-slate-400">Customize appearance, behavior, and backups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/30 px-6 pt-2">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'appearance'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Appearance & Themes
          </button>
          <button
            onClick={() => setActiveTab('layout')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'layout'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Layout & Sounds
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'data'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Data & Backup
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Ad-Free VIP Plan Status Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-white/10 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                <Crown className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    {settings.isPremium ? 'VIP Ad-Free Plan Active' : 'Ad-Supported Plan'}
                  </h4>
                  {settings.isPremium && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {settings.isPremium
                    ? 'All 30s/10s ads and bottom banners are permanently disabled.'
                    : 'Watch 30s ads to add sites & 10s ads to install PWAs. Remove all ads for US$ 5.'}
                </p>
              </div>
            </div>

            {!settings.isPremium && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRemoveAds();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition active:scale-95 whitespace-nowrap flex-shrink-0"
              >
                Remove Ads ($5)
              </button>
            )}
          </div>

          {activeTab === 'appearance' && (
            <>
              {/* Theme Selector */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-blue-400" />
                  Color Theme
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {THEME_OPTIONS.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateSettings({ theme: theme.id })}
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                        settings.theme === theme.id
                          ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/20 bg-slate-800/40'
                      }`}
                    >
                      <span className="text-base">{theme.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white">{theme.label}</div>
                      </div>
                      {settings.theme === theme.id && (
                        <Check className="w-3.5 h-3.5 text-blue-400 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wallpaper / Background */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  Wallpaper Background
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {WALLPAPER_PRESETS.map((wall) => (
                    <button
                      key={wall.id}
                      onClick={() => onUpdateSettings({ wallpaper: wall.id })}
                      className={`h-14 rounded-xl border p-2 flex flex-col justify-end text-left bg-gradient-to-br ${wall.gradient} transition ${
                        settings.wallpaper === wall.id
                          ? 'border-blue-500 ring-2 ring-blue-500/30'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <span className="text-[11px] font-medium text-white drop-shadow">
                        {wall.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom Wallpaper Image URL */}
                <form onSubmit={handleApplyCustomWallpaper} className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      value={customWallUrl}
                      onChange={(e) => setCustomWallUrl(e.target.value)}
                      placeholder="Custom image URL (e.g. Unsplash wallpaper)..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </>
          )}

          {activeTab === 'layout' && (
            <>
              {/* Default View Mode */}
              <div>
                <label className="block text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-blue-400" />
                  Default Icon Layout
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['comfortable', 'compact', 'list'] as ViewMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onUpdateSettings({ viewMode: mode })}
                      className={`py-2 px-3 rounded-xl border capitalize text-center transition ${
                        settings.viewMode === mode
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Shelves */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 cursor-pointer">
                  <div>
                    <span className="text-white font-medium block">Show Favorites Shelf</span>
                    <span className="text-[11px] text-slate-400">Display quick launch bar for pinned sites</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showFavoritesShelf}
                    onChange={(e) => onUpdateSettings({ showFavoritesShelf: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-white/20 focus:ring-blue-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 cursor-pointer">
                  <div>
                    <span className="text-white font-medium block">Show Recently Visited</span>
                    <span className="text-[11px] text-slate-400">Display recently opened sites carousel</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showRecentShelf}
                    onChange={(e) => onUpdateSettings({ showRecentShelf: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-white/20 focus:ring-blue-500"
                  />
                </label>

                {/* Sound Effects Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 cursor-pointer">
                  <div className="flex items-center gap-2.5">
                    {settings.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <div>
                      <span className="text-white font-medium block">Sound Effects</span>
                      <span className="text-[11px] text-slate-400">Subtle audio feedback on clicks and shortcuts</span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-white/20 focus:ring-blue-500"
                  />
                </label>
              </div>
            </>
          )}

          {activeTab === 'data' && (
            <>
              {/* Backup & Restore */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <h4 className="text-white font-semibold mb-1">Export / Backup Hub Data</h4>
                  <p className="text-slate-400 text-[11px] mb-3">
                    Download a full JSON backup of all your saved shortcuts, categories, and custom preferences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={onExportJson}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export JSON Backup</span>
                    </button>
                    <button
                      onClick={onExportBookmarks}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 font-medium transition"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export HTML Bookmarks</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <h4 className="text-white font-semibold mb-1">Restore Hub Backup</h4>
                  <p className="text-slate-400 text-[11px] mb-3">
                    Upload an existing `mywebhub-backup.json` to restore your websites and categories.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-white/10 font-medium transition active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Import JSON File</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <h4 className="text-rose-400 font-semibold mb-1">Reset to Default Hub</h4>
                  <p className="text-slate-300 text-[11px] mb-3">
                    Restore the original curated collection of websites and categories (Google, YouTube, GitHub, WhatsApp, etc.).
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to reset all websites to default?')) {
                        onResetDefaults();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-medium transition active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
