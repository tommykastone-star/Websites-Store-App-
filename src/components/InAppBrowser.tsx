import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Lock, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Star, 
  Copy, 
  Check, 
  Plus, 
  AlertTriangle,
  Globe,
  Share2
} from 'lucide-react';
import { BrowserTab, WebSite } from '../types/hub';
import { formatUrl, getDomain, getFaviconUrl } from '../utils/favicon';

interface InAppBrowserProps {
  isOpen: boolean;
  tabs: BrowserTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: (url?: string) => void;
  onCloseBrowser: () => void;
  onToggleFavorite?: (url: string) => void;
  isFavorite?: boolean;
}

export const InAppBrowser: React.FC<InAppBrowserProps> = ({
  isOpen,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onCloseBrowser,
  onToggleFavorite,
  isFavorite = false,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deviceViewport, setDeviceViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [loadErrorNotice, setLoadErrorNotice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync address input when active tab changes
  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
      setLoadErrorNotice(false);
      setIsLoading(true);
    }
  }, [activeTab?.id, activeTab?.url]);

  if (!isOpen || !activeTab) return null;

  const currentDomain = getDomain(activeTab.url);

  // Check if known high-security domain that typically forbids iframe embedding
  const isEmbedRestricted = [
    'google.com',
    'youtube.com',
    'instagram.com',
    'facebook.com',
    'github.com',
    'twitter.com',
    'x.com',
    'reddit.com',
    'web.whatsapp.com',
    'netflix.com',
    'chatgpt.com',
    'linkedin.com',
  ].some((d) => currentDomain.toLowerCase().endsWith(d));

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;
    
    // Check if search query or url
    if (!target.includes('.') || target.includes(' ')) {
      target = `https://duckduckgo.com/html/?q=${encodeURIComponent(target)}`;
    } else {
      target = formatUrl(target);
    }
    
    setInputUrl(target);
    activeTab.url = target;
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
  };

  const handleReload = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    window.open(activeTab.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(activeTab.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert to embed alternative if available
  const getDisplayUrl = () => {
    const url = activeTab.url;
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`;
    }
    return url;
  };

  const displayUrl = getDisplayUrl();

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 ${
      isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
    }`}>
      {/* Browser Window Wrapper */}
      <div className={`flex flex-col w-full h-full bg-slate-900 border border-white/10 shadow-2xl overflow-hidden ${
        isFullscreen ? 'rounded-none' : 'rounded-2xl'
      }`}>
        {/* Top Tab Bar & Window Controls */}
        <div className="flex items-center justify-between px-3 pt-2 bg-slate-950/80 border-b border-white/10 select-none">
          {/* Tabs List */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar max-w-[80vw]">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab.id;
              const tabDomain = getDomain(tab.url);
              const favicon = getFaviconUrl(tab.url, 32);

              return (
                <div
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition-all border-t border-x ${
                    isActive
                      ? 'bg-slate-900 text-white border-white/10 shadow-sm'
                      : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-transparent'
                  }`}
                  style={{ maxWidth: '200px' }}
                >
                  <img
                    src={favicon}
                    alt=""
                    className="w-3.5 h-3.5 rounded object-contain flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="truncate flex-1">{tab.title || tabDomain || 'New Tab'}</span>
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* New Tab Button */}
            <button
              onClick={() => onNewTab()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              title="Open New In-App Tab"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Window Control Buttons */}
          <div className="flex items-center gap-1.5 pb-1">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onCloseBrowser}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition"
              title="Close Browser and Return to Hub"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Browser Navigation Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-900 border-b border-white/10">
          {/* History & Reload */}
          <div className="flex items-center gap-1">
            <button
              onClick={onCloseBrowser}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Return to Hub Home"
            >
              <Home className="w-4 h-4" />
            </button>
            <button
              onClick={handleReload}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ${
                isLoading ? 'animate-spin text-blue-400' : ''
              }`}
              title="Reload Page"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Omnibox / URL Address Bar */}
          <form onSubmit={handleNavigate} className="flex-1 max-w-2xl mx-1">
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center text-emerald-400" title="Secure Connection">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Enter URL or search..."
                className="w-full pl-9 pr-24 py-1.5 rounded-xl bg-slate-950/70 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono tracking-tight"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => window.open(activeTab.url, '_blank', 'popup=yes,width=1200,height=800')}
                  className="p-1 rounded text-cyan-400 hover:bg-cyan-500/20 transition"
                  title="Launch in Standalone App Window"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {onToggleFavorite && (
                  <button
                    type="button"
                    onClick={() => onToggleFavorite(activeTab.url)}
                    className="p-1 rounded text-slate-400 hover:text-amber-400 transition"
                    title="Bookmark / Favorite"
                  >
                    <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Copy Link"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </form>

          {/* Viewport & External Actions */}
          <div className="flex items-center gap-1.5">
            {/* Viewport size switcher */}
            <div className="hidden sm:flex items-center bg-slate-950/60 p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setDeviceViewport('mobile')}
                className={`p-1.5 rounded-md transition ${
                  deviceViewport === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceViewport('tablet')}
                className={`p-1.5 rounded-md transition ${
                  deviceViewport === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceViewport('desktop')}
                className={`p-1.5 rounded-md transition ${
                  deviceViewport === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop Responsive"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Launch In External Window Button */}
            <button
              onClick={handleOpenExternal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition active:scale-95"
              title="Open website in new browser tab / window"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & X-Frame Compatibility Notice Banner */}
        {isEmbedRestricted && (
          <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>{currentDomain}</strong> restricts third-party iframe embedding for security (X-Frame-Options).
                If the content is blank or blocked below, click <strong>"Open in New Tab"</strong> to launch directly.
              </span>
            </div>
            <button
              onClick={handleOpenExternal}
              className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-semibold text-xs hover:bg-amber-400 transition"
            >
              Launch in New Tab ↗
            </button>
          </div>
        )}

        {/* In-App Browser Content Viewport */}
        <div className="flex-1 w-full bg-slate-950 overflow-hidden relative flex items-center justify-center">
          {/* Loading Bar */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600/30 overflow-hidden z-20">
              <div className="w-full h-full bg-blue-500 animate-pulse" />
            </div>
          )}

          {/* Viewport Container */}
          <div
            className={`h-full transition-all duration-300 relative shadow-2xl overflow-hidden bg-white ${
              deviceViewport === 'mobile'
                ? 'w-[375px] max-w-full my-auto border-x-4 border-slate-800 rounded-2xl shadow-slate-950/80'
                : deviceViewport === 'tablet'
                ? 'w-[768px] max-w-full my-auto border-x-4 border-slate-800 rounded-xl'
                : 'w-full'
            }`}
          >
            <iframe
              key={`${activeTab.id}-${iframeKey}`}
              ref={iframeRef}
              src={displayUrl}
              title={activeTab.title || 'In-App Web Viewer'}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals allow-presentation"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setLoadErrorNotice(true);
              }}
            />

            {/* In case iframe fails to render due to browser X-Frame-Options policy */}
            {isEmbedRestricted && (
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-white text-center shadow-2xl pointer-events-auto">
                <p className="text-xs text-slate-300 mb-3">
                  Viewing <strong>{currentDomain}</strong> inside MyWebHub In-App Browser.
                  Security headers may prevent some interactive features.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleOpenExternal}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow transition"
                  >
                    Open Full Window ↗
                  </button>
                  <button
                    onClick={handleReload}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  >
                    Retry In-App
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
