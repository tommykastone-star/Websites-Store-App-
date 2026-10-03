import React, { useState, useEffect, useMemo } from 'react';
import { 
  WebSite, 
  Category, 
  HubSettings, 
  BrowserTab, 
  ViewMode, 
  DevicePreviewMode 
} from './types/hub';
import { AdTriggerReason } from './types/ads';
import { 
  loadWebsites, 
  saveWebsites, 
  loadCategories, 
  saveCategories, 
  loadSettings, 
  saveSettings, 
  exportHubData, 
  importHubData, 
  exportAsHtmlBookmarks,
  DEFAULT_SETTINGS
} from './utils/storage';
import { DEFAULT_WEBSITES, DEFAULT_CATEGORIES } from './data/defaultWebsites';
import { playSoundEffect } from './utils/favicon';

import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { FavoritesShelf } from './components/FavoritesShelf';
import { RecentlyOpened } from './components/RecentlyOpened';
import { WebsiteGrid } from './components/WebsiteGrid';
import { InAppBrowser } from './components/InAppBrowser';
import { AddWebsiteModal } from './components/AddWebsiteModal';
import { DirectoryModal } from './components/DirectoryModal';
import { SettingsModal } from './components/SettingsModal';
import { DeviceFrame } from './components/DeviceFrame';
import { OfflineIndicator } from './components/OfflineIndicator';
import { VideoAdModal } from './components/VideoAdModal';
import { BottomBannerAd } from './components/BottomBannerAd';
import { RemoveAdsModal } from './components/RemoveAdsModal';

interface PendingAdAction {
  durationSeconds: 30 | 10;
  reason: AdTriggerReason;
  targetSiteName: string;
  onReward: () => void;
}

export default function App() {
  const [websites, setWebsites] = useState<WebSite[]>(() => {
    const loaded = loadWebsites();
    return loaded.map((site) => {
      const match = DEFAULT_WEBSITES.find((d) => d.id === site.id || d.url === site.url);
      if (match && typeof site.isPwa === 'undefined') {
        return { ...site, isPwa: match.isPwa, pwaFeatures: match.pwaFeatures };
      }
      return site;
    });
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const loaded = loadCategories();
    if (!loaded.some((c) => c.id === 'pwa')) {
      const pwaCat: Category = { id: 'pwa', name: '⚡ PWAs', icon: 'Zap' };
      return [loaded[0], pwaCat, ...loaded.slice(1)];
    }
    return loaded;
  });

  const [settings, setSettings] = useState<HubSettings>(() => loadSettings());

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<WebSite | null>(null);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isRemoveAdsModalOpen, setIsRemoveAdsModalOpen] = useState(false);

  // Video Ad State (30s for adding sites, 10s for installing PWAs)
  const [pendingAd, setPendingAd] = useState<PendingAdAction | null>(null);

  // In-App Browser State
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [browserTabs, setBrowserTabs] = useState<BrowserTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  // Persist state changes
  useEffect(() => {
    saveWebsites(websites);
  }, [websites]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        searchInput?.focus();
      } else if (e.key === 'Escape') {
        if (pendingAd) setPendingAd(null);
        if (isRemoveAdsModalOpen) setIsRemoveAdsModalOpen(false);
        if (isBrowserOpen) setIsBrowserOpen(false);
        if (isAddModalOpen) setIsAddModalOpen(false);
        if (isDirectoryModalOpen) setIsDirectoryModalOpen(false);
        if (isSettingsModalOpen) setIsSettingsModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBrowserOpen, isAddModalOpen, isDirectoryModalOpen, isSettingsModalOpen, isRemoveAdsModalOpen, pendingAd]);

  const triggerSound = (type: 'click' | 'open' | 'delete' | 'success') => {
    if (settings.soundEnabled) {
      playSoundEffect(type);
    }
  };

  // Launch website action
  const handleOpenWebsite = (site: WebSite, mode?: 'in-app' | 'external' | 'pwa-window') => {
    triggerSound('open');

    setWebsites((prev) =>
      prev.map((s) =>
        s.id === site.id
          ? { ...s, openCount: (s.openCount || 0) + 1, lastOpenedAt: Date.now() }
          : s
      )
    );

    if (mode === 'pwa-window') {
      window.open(site.url, '_blank', 'popup=yes,width=1200,height=800');
      return;
    }

    const openInNewTab = mode === 'external' || settings.defaultOpenInNewTab;

    if (openInNewTab) {
      window.open(site.url, '_blank', 'noopener,noreferrer');
      return;
    }

    const existingTab = browserTabs.find((t) => t.websiteId === site.id || t.url === site.url);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: BrowserTab = {
        id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        websiteId: site.id,
        title: site.name,
        url: site.embedUrl || site.url,
        history: [site.url],
        historyIndex: 0,
      };
      setBrowserTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    }
    setIsBrowserOpen(true);
  };

  const handleNewBrowserTab = (url: string = 'https://duckduckgo.com') => {
    triggerSound('click');
    const newTab: BrowserTab = {
      id: `tab-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: 'New Tab',
      url,
      history: [url],
      historyIndex: 0,
    };
    setBrowserTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseBrowserTab = (tabId: string) => {
    triggerSound('click');
    const remaining = browserTabs.filter((t) => t.id !== tabId);
    if (remaining.length === 0) {
      setIsBrowserOpen(false);
      setBrowserTabs([]);
      setActiveTabId('');
    } else {
      setBrowserTabs(remaining);
      if (activeTabId === tabId) {
        setActiveTabId(remaining[remaining.length - 1].id);
      }
    }
  };

  const handleToggleFavorite = (siteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerSound('click');
    setWebsites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleDeleteWebsite = (siteId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerSound('delete');
    setWebsites((prev) => prev.filter((s) => s.id !== siteId));
  };

  const handleEditWebsite = (site: WebSite, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    triggerSound('click');
    setEditingSite(site);
    setIsAddModalOpen(true);
  };

  const handleMoveWebsite = (siteId: string, direction: 'prev' | 'next') => {
    triggerSound('click');
    setWebsites((prev) => {
      const index = prev.findIndex((s) => s.id === siteId);
      if (index === -1) return prev;
      const targetIndex = direction === 'prev' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, item);
      return copy;
    });
  };

  // Direct insertion function for sites
  const executeAddSite = (data: Partial<WebSite>) => {
    triggerSound('success');
    setWebsites((prev) => [data as WebSite, ...prev]);

    if (data.category && !categories.some((c) => c.name.toLowerCase() === data.category?.toLowerCase())) {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          name: data.category!,
        },
      ]);
    }
  };

  // Save from Add/Edit Modal
  // Requirement: "For a user to add a site the user must watch a 30 seconds one ad to add the site"
  const handleSaveWebsite = (data: Partial<WebSite>) => {
    if (editingSite) {
      triggerSound('success');
      setWebsites((prev) =>
        prev.map((s) => (s.id === editingSite.id ? ({ ...s, ...data } as WebSite) : s))
      );
      setEditingSite(null);
      return;
    }

    // Adding a new site
    if (settings.isPremium) {
      executeAddSite(data);
    } else {
      // Must watch 30-second ad first
      setPendingAd({
        durationSeconds: 30,
        reason: 'add_site',
        targetSiteName: data.name || 'Website',
        onReward: () => {
          executeAddSite(data);
        },
      });
    }
  };

  // Direct insertion for directory items
  const executeAddFromDirectory = (item: Omit<WebSite, 'id' | 'openCount' | 'isFavorite'>) => {
    triggerSound('success');
    const newSite: WebSite = {
      ...item,
      id: `dir-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      openCount: 0,
      isFavorite: false,
    };
    setWebsites((prev) => [...prev, newSite]);

    if (!categories.some((c) => c.name.toLowerCase() === item.category.toLowerCase())) {
      setCategories((prev) => [
        ...prev,
        {
          id: `cat-${Date.now()}`,
          name: item.category,
        },
      ]);
    }
  };

  // Add from Curated Directory
  const handleAddFromDirectory = (item: Omit<WebSite, 'id' | 'openCount' | 'isFavorite'>) => {
    if (settings.isPremium) {
      executeAddFromDirectory(item);
    } else {
      // If installing PWA: 10s ad; if regular website: 30s ad
      const isPwaItem = (item as { isPwa?: boolean }).isPwa;
      const durationSeconds: 30 | 10 = isPwaItem ? 10 : 30;
      const reason: AdTriggerReason = isPwaItem ? 'install_pwa' : 'add_site';

      setPendingAd({
        durationSeconds,
        reason,
        targetSiteName: item.name,
        onReward: () => {
          executeAddFromDirectory(item);
        },
      });
    }
  };

  // Device PWA Install handler
  // Requirement: "For a user to install a PWA website to his or her device the user must watch a 10 seconds one ad"
  const handleRequirePwaInstallAd = (onAdWatched: () => void) => {
    if (settings.isPremium) {
      onAdWatched();
    } else {
      setPendingAd({
        durationSeconds: 10,
        reason: 'install_pwa',
        targetSiteName: 'Websites Store PWA',
        onReward: onAdWatched,
      });
    }
  };

  // Generic ad trigger for modals
  const handleRequireAdGeneric = (reason: AdTriggerReason, itemName: string, callback: () => void) => {
    if (settings.isPremium) {
      callback();
    } else {
      const durationSeconds: 30 | 10 = reason === 'install_pwa' ? 10 : 30;
      setPendingAd({
        durationSeconds,
        reason,
        targetSiteName: itemName,
        onReward: callback,
      });
    }
  };

  // Handle Remove Ads US$ 5 payment success
  const handleRemoveAdsSuccess = () => {
    triggerSound('success');
    setSettings((prev) => ({
      ...prev,
      isPremium: true,
    }));
    // If an ad was currently pending, automatically fulfill the action immediately!
    if (pendingAd) {
      pendingAd.onReward();
      setPendingAd(null);
    }
  };

  const handleAddCategory = (name: string) => {
    triggerSound('click');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
    };
    setCategories((prev) => [...prev, newCat]);
    setActiveCategoryId(name);
  };

  const handleClearRecentHistory = () => {
    triggerSound('delete');
    setWebsites((prev) =>
      prev.map((s) => ({ ...s, lastOpenedAt: undefined }))
    );
  };

  const handleImportJson = async (file: File) => {
    try {
      const imported = await importHubData(file);
      if (imported.websites) setWebsites(imported.websites);
      if (imported.categories) setCategories(imported.categories);
      if (imported.settings) setSettings(imported.settings);
      triggerSound('success');
      alert('Store data imported successfully!');
    } catch {
      alert('Failed to import file. Please check that it is a valid JSON file.');
    }
  };

  const handleResetDefaults = () => {
    triggerSound('click');
    setWebsites(DEFAULT_WEBSITES);
    setCategories(DEFAULT_CATEGORIES);
    setSettings(DEFAULT_SETTINGS);
  };

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 
      all: websites.length,
      pwa: websites.filter((s) => s.isPwa).length,
    };
    websites.forEach((s) => {
      const cat = s.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [websites]);

  const favorites = useMemo(() => {
    return websites.filter((s) => s.isFavorite);
  }, [websites]);

  const pwaCount = useMemo(() => {
    return websites.filter((s) => s.isPwa).length;
  }, [websites]);

  const recentSites = useMemo(() => {
    return websites
      .filter((s) => typeof s.lastOpenedAt === 'number')
      .sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0));
  }, [websites]);

  const filteredWebsites = useMemo(() => {
    return websites.filter((site) => {
      if (activeCategoryId === 'pwa') {
        if (!site.isPwa) return false;
      } else if (activeCategoryId === 'favorites') {
        if (!site.isFavorite) return false;
      } else if (activeCategoryId === 'recent') {
        if (!site.lastOpenedAt) return false;
      } else if (activeCategoryId !== 'all') {
        if (site.category?.toLowerCase() !== activeCategoryId.toLowerCase()) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = site.name.toLowerCase().includes(q);
        const matchesUrl = site.url.toLowerCase().includes(q);
        const matchesCategory = site.category?.toLowerCase().includes(q);
        const matchesNotes = site.notes?.toLowerCase().includes(q);
        const matchesPwa = site.isPwa && (q === 'pwa' || (site.pwaFeatures && site.pwaFeatures.some((f) => f.toLowerCase().includes(q))));
        if (!matchesName && !matchesUrl && !matchesCategory && !matchesNotes && !matchesPwa) {
          return false;
        }
      }

      return true;
    });
  }, [websites, activeCategoryId, searchQuery]);

  const getBackgroundStyle = () => {
    if (settings.wallpaper === 'custom' && settings.customWallpaperUrl) {
      return {
        backgroundImage: `linear-gradient(rgba(9, 13, 22, 0.85), rgba(9, 13, 22, 0.95)), url(${settings.customWallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      };
    }
    if (settings.theme === 'light') {
      return {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      };
    }
    if (settings.wallpaper === 'gradient-midnight') {
      return {
        background: 'radial-gradient(ellipse at top, #0d1330 0%, #060914 100%)',
      };
    }
    if (settings.wallpaper === 'gradient-sunset') {
      return {
        background: 'radial-gradient(ellipse at top, #260d2e 0%, #0e0514 100%)',
      };
    }
    if (settings.wallpaper === 'gradient-emerald') {
      return {
        background: 'radial-gradient(ellipse at top, #06241c 0%, #03120e 100%)',
      };
    }
    if (settings.wallpaper === 'gradient-cyber') {
      return {
        background: 'linear-gradient(135deg, #090b1c 0%, #170d2b 50%, #071728 100%)',
      };
    }
    return {
      background: 'radial-gradient(ellipse at 50% 0%, #151f38 0%, #090d16 100%)',
    };
  };

  // Main Store Content Body
  const hubContent = (
    <div className="flex-1 flex flex-col min-h-screen">
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddModal={() => {
          triggerSound('click');
          setEditingSite(null);
          setIsAddModalOpen(true);
        }}
        onOpenDirectoryModal={() => {
          triggerSound('click');
          setIsDirectoryModalOpen(true);
        }}
        onOpenSettingsModal={() => {
          triggerSound('click');
          setIsSettingsModalOpen(true);
        }}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
        isPremium={settings.isPremium || false}
        onRequirePwaInstallAd={handleRequirePwaInstallAd}
        viewMode={settings.viewMode}
        onChangeViewMode={(mode) => setSettings((s) => ({ ...s, viewMode: mode }))}
        devicePreview={settings.devicePreview}
        onToggleDevicePreview={() => {
          triggerSound('click');
          setSettings((s) => ({
            ...s,
            devicePreview: s.devicePreview === 'mobile' ? 'dashboard' : 'mobile',
          }));
        }}
        totalSites={websites.length}
        pwaCount={pwaCount}
        onFilterPwas={() => setActiveCategoryId(activeCategoryId === 'pwa' ? 'all' : 'pwa')}
        isPwaActive={activeCategoryId === 'pwa'}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 flex flex-col">
        {/* Category Navigation Bar */}
        <div className="mb-4">
          <CategoryBar
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={(id) => {
              triggerSound('click');
              setActiveCategoryId(id);
            }}
            categoryCounts={categoryCounts}
            onAddCategory={handleAddCategory}
            favoritesCount={favorites.length}
            recentCount={recentSites.length}
            pwaCount={pwaCount}
          />
        </div>

        {/* Recently Opened Shelf */}
        {settings.showRecentShelf && !searchQuery && activeCategoryId === 'all' && (
          <RecentlyOpened
            recentSites={recentSites}
            onOpen={(site) => handleOpenWebsite(site)}
            onClearRecent={handleClearRecentHistory}
          />
        )}

        {/* Favorites Quick Shelf */}
        {settings.showFavoritesShelf && !searchQuery && activeCategoryId === 'all' && (
          <FavoritesShelf
            favorites={favorites}
            onOpen={(site, mode) => handleOpenWebsite(site, mode)}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleEditWebsite}
            onDelete={handleDeleteWebsite}
            onViewAllFavorites={() => setActiveCategoryId('favorites')}
          />
        )}

        {/* Main Website Grid Header */}
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight capitalize">
              {activeCategoryId === 'all'
                ? searchQuery
                  ? `Search Results (${filteredWebsites.length})`
                  : 'Installed Store Apps'
                : activeCategoryId === 'pwa'
                ? '⚡ Progressive Web Apps (PWAs)'
                : activeCategoryId === 'favorites'
                ? 'Favorite Websites'
                : activeCategoryId === 'recent'
                ? 'Recently Visited'
                : activeCategoryId}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5 font-mono">
              {filteredWebsites.length}
            </span>
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Website Grid / List View */}
        <div className="flex-1">
          <WebsiteGrid
            websites={filteredWebsites}
            viewMode={settings.viewMode}
            onOpen={(site, mode) => handleOpenWebsite(site, mode)}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleEditWebsite}
            onDelete={handleDeleteWebsite}
            onMoveSite={handleMoveWebsite}
            onOpenAddModal={() => {
              triggerSound('click');
              setEditingSite(null);
              setIsAddModalOpen(true);
            }}
            onOpenDirectoryModal={() => {
              triggerSound('click');
              setIsDirectoryModalOpen(true);
            }}
            searchQuery={searchQuery}
            activeCategory={activeCategoryId}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="w-full border-t border-white/5 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Websites Store App • Discover, install, and run PWAs and web apps</span>
          <div className="flex items-center gap-4 text-slate-400">
            {!settings.isPremium && (
              <button
                onClick={() => setIsRemoveAdsModalOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-semibold transition"
              >
                👑 Remove Ads (US$ 5)
              </button>
            )}
            <span>•</span>
            <button
              onClick={() => {
                triggerSound('click');
                setIsDirectoryModalOpen(true);
              }}
              className="hover:text-cyan-400 transition"
            >
              PWA Store Directory
            </button>
            <span>•</span>
            <button
              onClick={() => {
                triggerSound('click');
                setIsSettingsModalOpen(true);
              }}
              className="hover:text-cyan-400 transition"
            >
              Settings & Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Bottom Banner Ads: supported bottom Banner ads only, removed when user pays US$ 5 */}
      <BottomBannerAd
        isPremium={settings.isPremium || false}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
      />
    </div>
  );

  return (
    <div
      className={`min-h-screen font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-300 ${
        settings.theme === 'light' ? 'text-slate-900' : 'text-slate-100'
      }`}
      style={getBackgroundStyle()}
    >
      {/* Device Simulator Frame vs Full Dashboard */}
      {settings.devicePreview === 'mobile' ? (
        <DeviceFrame
          onExitMobileMode={() =>
            setSettings((s) => ({ ...s, devicePreview: 'dashboard' }))
          }
        >
          {hubContent}
        </DeviceFrame>
      ) : (
        hubContent
      )}

      {/* In-App Browser Component */}
      <InAppBrowser
        isOpen={isBrowserOpen}
        tabs={browserTabs}
        activeTabId={activeTabId}
        onSelectTab={(id) => {
          triggerSound('click');
          setActiveTabId(id);
        }}
        onCloseTab={handleCloseBrowserTab}
        onNewTab={handleNewBrowserTab}
        onCloseBrowser={() => {
          triggerSound('click');
          setIsBrowserOpen(false);
        }}
        onToggleFavorite={(url) => {
          const match = websites.find((s) => s.url === url);
          if (match) {
            handleToggleFavorite(match.id);
          }
        }}
        isFavorite={
          Boolean(
            websites.find(
              (s) =>
                s.url === browserTabs.find((t) => t.id === activeTabId)?.url &&
                s.isFavorite
            )
          )
        }
      />

      {/* Add / Edit Website Modal */}
      <AddWebsiteModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingSite(null);
        }}
        onSave={handleSaveWebsite}
        categories={categories}
        editingSite={editingSite}
        isPremium={settings.isPremium || false}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
      />

      {/* Curated Directory / Featured Store Modal */}
      <DirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        existingSites={websites}
        onAddFromDirectory={handleAddFromDirectory}
        isPremium={settings.isPremium || false}
        onRequireAd={handleRequireAdGeneric}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
      />

      {/* Hub Settings & Personalization Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) =>
          setSettings((prev) => ({ ...prev, ...newSettings }))
        }
        onExportJson={() => exportHubData(websites, categories, settings)}
        onImportJson={handleImportJson}
        onExportBookmarks={() => exportAsHtmlBookmarks(websites)}
        onResetDefaults={handleResetDefaults}
        onOpenRemoveAds={() => setIsRemoveAdsModalOpen(true)}
      />

      {/* Video Ad Modal (30s for adding sites, 10s for installing PWAs) */}
      {pendingAd && (
        <VideoAdModal
          isOpen={true}
          durationSeconds={pendingAd.durationSeconds}
          reason={pendingAd.reason}
          targetSiteName={pendingAd.targetSiteName}
          onComplete={() => {
            const action = pendingAd.onReward;
            setPendingAd(null);
            action();
          }}
          onCancel={() => {
            setPendingAd(null);
          }}
          onOpenRemoveAds={() => {
            setIsRemoveAdsModalOpen(true);
          }}
        />
      )}

      {/* Remove Ads US$ 5 Credit Card Checkout Modal */}
      <RemoveAdsModal
        isOpen={isRemoveAdsModalOpen}
        onClose={() => setIsRemoveAdsModalOpen(false)}
        onSuccess={handleRemoveAdsSuccess}
      />

      {/* Connectivity & Offline Status Indicator */}
      <OfflineIndicator />
    </div>
  );
}
