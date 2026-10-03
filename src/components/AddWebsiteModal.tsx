import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Globe, 
  Sparkles, 
  Star, 
  Palette, 
  Folder, 
  Link as LinkIcon, 
  Tag, 
  Check,
  Zap,
  Image as ImageIcon,
  ShieldCheck
} from 'lucide-react';
import { WebSite, Category } from '../types/hub';
import { formatUrl, getDomain, getFaviconUrl, getInitialsAndColor } from '../utils/favicon';

interface AddWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Partial<WebSite>) => void;
  categories: Category[];
  editingSite?: WebSite | null;
  isPremium?: boolean;
  onOpenRemoveAds?: () => void;
}

const COLOR_SWATCHES = [
  '#4285F4', // Blue (Google)
  '#06B6D4', // Cyan (PWA)
  '#FF0000', // Red (YouTube)
  '#25D366', // Green (WhatsApp)
  '#E4405F', // Pink/Magenta (Instagram)
  '#24292E', // Dark (GitHub)
  '#1877F2', // Blue (Facebook)
  '#10A37F', // Emerald (OpenAI)
  '#5865F2', // Blurple (Discord)
  '#1DB954', // Spotify Green
  '#D97706', // Amber (Claude)
  '#9333EA', // Purple
];

const KNOWN_PWAS = [
  'twitter.com',
  'x.com',
  'spotify.com',
  'devdocs.io',
  'photopea.com',
  'telegram.org',
  'pinterest.com',
  'starbucks.com',
  'uber.com',
  'trivago.com',
  'aliexpress.com',
  'flipkart.com',
  'canva.com',
  'notion.so',
  'chatgpt.com',
  'youtube.com',
  'google.com',
  'reddit.com',
];

export const AddWebsiteModal: React.FC<AddWebsiteModalProps> = ({
  isOpen,
  onClose,
  onSave,
  categories,
  editingSite,
  isPremium = false,
  onOpenRemoveAds,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Social');
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [iconType, setIconType] = useState<'favicon' | 'upload' | 'url'>('favicon');
  const [iconValue, setIconValue] = useState('');
  const [color, setColor] = useState('#06B6D4');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPwa, setIsPwa] = useState(false);
  const [offlineCapable, setOfflineCapable] = useState(true);
  const [notes, setNotes] = useState('');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (editingSite) {
      setName(editingSite.name);
      setUrl(editingSite.url);
      setCategory(editingSite.category || 'General');
      setIconType(editingSite.iconType === 'preset' ? 'favicon' : editingSite.iconType);
      setIconValue(editingSite.iconValue || '');
      setColor(editingSite.color || '#06B6D4');
      setIsFavorite(editingSite.isFavorite || false);
      setIsPwa(editingSite.isPwa || false);
      setNotes(editingSite.notes || '');
      setIsCustomCategory(false);
    } else {
      setName('');
      setUrl('');
      setCategory(categories[2]?.name || 'Productivity');
      setIconType('favicon');
      setIconValue('');
      setColor('#06B6D4');
      setIsFavorite(false);
      setIsPwa(false);
      setNotes('');
      setIsCustomCategory(false);
    }
    setPreviewError(false);
  }, [editingSite, isOpen, categories]);

  if (!isOpen) return null;

  // Auto-detect title, brand color, and PWA capabilities from URL
  const handleAutoDetect = () => {
    if (!url.trim()) return;
    const formatted = formatUrl(url);
    setUrl(formatted);
    const domain = getDomain(formatted).toLowerCase();

    // Check if known PWA
    const matchesPwa = KNOWN_PWAS.some((p) => domain.includes(p));
    if (matchesPwa) {
      setIsPwa(true);
    }

    // Auto title from domain if name is empty
    if (!name.trim()) {
      const parts = domain.split('.');
      const mainPart = parts.length > 2 ? parts[parts.length - 2] : parts[0];
      if (mainPart) {
        setName(mainPart.charAt(0).toUpperCase() + mainPart.slice(1));
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Please upload an image smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setIconType('upload');
        setIconValue(result);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const finalUrl = formatUrl(url);
    const finalCategory = isCustomCategory && newCategoryInput.trim() 
      ? newCategoryInput.trim() 
      : category;

    const pwaFeatures: string[] = [];
    if (isPwa) {
      if (offlineCapable) pwaFeatures.push('Offline Ready');
      pwaFeatures.push('App Window');
    }

    onSave({
      id: editingSite ? editingSite.id : `site-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: name.trim(),
      url: finalUrl,
      category: finalCategory,
      iconType,
      iconValue: iconType === 'favicon' ? undefined : iconValue,
      color,
      isFavorite,
      isPwa,
      pwaFeatures: isPwa ? pwaFeatures : undefined,
      notes: notes.trim(),
      openCount: editingSite ? editingSite.openCount : 0,
      lastOpenedAt: editingSite ? editingSite.lastOpenedAt : undefined,
    });

    onClose();
  };

  const previewDomain = getDomain(url || 'example.com');
  const previewFavicon = iconType === 'favicon' 
    ? getFaviconUrl(url || 'https://google.com', 128) 
    : iconValue;
  const { initials, gradient } = getInitialsAndColor(name || 'Website');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingSite ? 'Edit App Details' : 'Install PWA or Website'}
              </h2>
              <p className="text-xs text-slate-400">
                Add an installable Progressive Web App or web shortcut to your store hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Live Icon Preview Card */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center p-3 relative border border-white/10 shadow-xl overflow-hidden"
                style={{
                  background: color 
                    ? `linear-gradient(135deg, ${color}40 0%, rgba(15, 23, 42, 0.95) 100%)` 
                    : 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                }}
              >
                {isFavorite && (
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-amber-400 flex items-center justify-center">
                    <Star className="w-2 h-2 fill-slate-950 text-slate-950" />
                  </div>
                )}
                {isPwa && (
                  <div className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950 shadow">
                    <Zap className="w-2 h-2 fill-slate-950" />
                  </div>
                )}
                {!previewError && previewFavicon ? (
                  <img
                    src={previewFavicon}
                    alt="Preview"
                    className="w-9 h-9 object-contain drop-shadow"
                    onError={() => setPreviewError(true)}
                  />
                ) : (
                  <div className={`w-full h-full rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base`}>
                    {initials}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Icon Preview
                  </span>
                  {isPwa && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                      PWA
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-white truncate max-w-[200px]">
                  {name || 'Website Name'}
                </h4>
                <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                  {previewDomain || 'https://domain.com'}
                </p>
              </div>
            </div>

            <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-cyan-400 border border-cyan-500/20 font-medium">
              {isCustomCategory && newCategoryInput ? newCategoryInput : category}
            </span>
          </div>

          {/* URL Input with Auto-Detect */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                PWA / Website URL <span className="text-rose-400">*</span>
              </span>
              <button
                type="button"
                onClick={handleAutoDetect}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px] transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-detect PWA</span>
              </button>
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setPreviewError(false);
              }}
              onBlur={handleAutoDetect}
              placeholder="e.g. https://open.spotify.com or https://devdocs.io"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          {/* PWA Toggle Option */}
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <div>
                  <span className="text-white font-semibold block">Install as Progressive Web App (PWA)</span>
                  <span className="text-[11px] text-cyan-200/80">
                    Enables standalone app window, caching, and PWA store badge
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isPwa}
                onChange={(e) => setIsPwa(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-white/20 focus:ring-cyan-400"
              />
            </label>
          </div>

          {/* Website Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              App / Website Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Spotify, DevDocs, Twitter"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              Category
            </label>
            {!isCustomCategory ? (
              <div className="flex gap-2">
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__NEW__') {
                      setIsCustomCategory(true);
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                >
                  {categories
                    .filter((c) => c.id !== 'all' && c.id !== 'favorites' && c.id !== 'recent' && c.id !== 'pwa')
                    .map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  <option value="__NEW__">+ Add New Category...</option>
                </select>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter new category name"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Icon Selection Modes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              Icon Source
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => setIconType('favicon')}
                className={`py-2 px-2 rounded-xl border text-center transition ${
                  iconType === 'favicon'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                Auto Favicon
              </button>
              <button
                type="button"
                onClick={() => setIconType('upload')}
                className={`py-2 px-2 rounded-xl border text-center transition ${
                  iconType === 'upload'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setIconType('url')}
                className={`py-2 px-2 rounded-xl border text-center transition ${
                  iconType === 'url'
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300 font-semibold'
                    : 'bg-slate-800/60 border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                Image URL
              </button>
            </div>

            {iconType === 'upload' && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/50 border border-dashed border-white/20">
                <input
                  type="file"
                  id="icon-upload"
                  accept="image/png, image/jpeg, image/svg+xml, image/webp, image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="icon-upload"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer transition font-medium"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose Image File (PNG, JPG, SVG)</span>
                </label>
              </div>
            )}

            {iconType === 'url' && (
              <input
                type="url"
                value={iconValue}
                onChange={(e) => {
                  setIconValue(e.target.value);
                  setPreviewError(false);
                }}
                placeholder="https://example.com/icon.png"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs"
              />
            )}
          </div>

          {/* Accent Color Swatches */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {COLOR_SWATCHES.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setColor(hex)}
                  className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-transform ${
                    color === hex ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {color === hex && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite & Notes */}
          <div className="pt-1 flex items-center justify-between border-t border-white/5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-200 font-medium">
              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-white/20 focus:ring-cyan-500"
              />
              <span className="flex items-center gap-1">
                <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                Pin to Favorites shelf
              </span>
            </label>
          </div>

          {/* Submit & Cancel */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            {!editingSite && !isPremium && onOpenRemoveAds ? (
              <button
                type="button"
                onClick={onOpenRemoveAds}
                className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
              >
                <span>👑 Skip Ads ($5)</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition active:scale-95"
              >
                {editingSite
                  ? 'Save Changes'
                  : isPremium
                  ? (isPwa ? 'Install PWA to Hub' : 'Install Shortcut')
                  : (isPwa ? 'Watch 30s Ad to Install PWA' : 'Watch 30s Ad to Add Website')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
