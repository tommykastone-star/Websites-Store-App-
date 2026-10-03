export interface WebSite {
  id: string;
  name: string;
  url: string;
  iconType: 'favicon' | 'url' | 'preset' | 'upload';
  iconValue?: string; // Custom image URL or data URI or Lucide icon name
  category: string;
  color?: string; // Brand accent or background color
  isFavorite: boolean;
  openCount: number;
  lastOpenedAt?: number;
  notes?: string;
  embedFriendly?: boolean; // If true, known to embed smoothly or has embed URL
  embedUrl?: string; // Alternative embed URL (e.g. youtube embed)
  isPwa?: boolean; // True if this website is an installable Progressive Web App
  pwaFeatures?: string[]; // e.g. ['Offline Ready', 'App Window', 'Push Notifications']
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export type ViewMode = 'comfortable' | 'compact' | 'list';
export type DevicePreviewMode = 'dashboard' | 'mobile';
export type ThemeMode = 'dark' | 'light' | 'midnight' | 'sunset' | 'emerald';

export interface HubSettings {
  theme: ThemeMode;
  wallpaper: string; // gradient preset or image url
  customWallpaperUrl?: string;
  viewMode: ViewMode;
  devicePreview: DevicePreviewMode;
  defaultOpenInNewTab: boolean;
  soundEnabled: boolean;
  showRecentShelf: boolean;
  showFavoritesShelf: boolean;
  activeProfile: string;
  isPremium?: boolean; // True if user paid US$ 5 to remove ads forever
}

export interface BrowserTab {
  id: string;
  websiteId?: string;
  title: string;
  url: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
}
