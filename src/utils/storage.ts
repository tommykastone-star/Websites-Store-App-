import { WebSite, Category, HubSettings } from '../types/hub';
import { DEFAULT_WEBSITES, DEFAULT_CATEGORIES } from '../data/defaultWebsites';

const WEBSITES_KEY = 'mywebhub_websites_v1';
const CATEGORIES_KEY = 'mywebhub_categories_v1';
const SETTINGS_KEY = 'mywebhub_settings_v1';

export const DEFAULT_SETTINGS: HubSettings = {
  theme: 'dark',
  wallpaper: 'gradient-slate',
  viewMode: 'comfortable',
  devicePreview: 'dashboard',
  defaultOpenInNewTab: false,
  soundEnabled: true,
  showRecentShelf: true,
  showFavoritesShelf: true,
  activeProfile: 'Default',
  isPremium: false,
};

export function loadWebsites(): WebSite[] {
  try {
    const raw = localStorage.getItem(WEBSITES_KEY);
    if (!raw) return DEFAULT_WEBSITES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_WEBSITES;
  } catch (err) {
    console.error('Failed to load websites from localStorage:', err);
    return DEFAULT_WEBSITES;
  }
}

export function saveWebsites(sites: WebSite[]): void {
  try {
    localStorage.setItem(WEBSITES_KEY, JSON.stringify(sites));
  } catch (err) {
    console.error('Failed to save websites:', err);
  }
}

export function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) return DEFAULT_CATEGORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function loadSettings(): HubSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: HubSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
}

// Export data as JSON file download
export function exportHubData(sites: WebSite[], categories: Category[], settings: HubSettings) {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    websites: sites,
    categories,
    settings,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mywebhub-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export as HTML Bookmark file format (Netscape Bookmarks)
export function exportAsHtmlBookmarks(sites: WebSite[]) {
  let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>MyWebHub Bookmarks</H1>
<DL><p>
`;

  // Group by category
  const groups: Record<string, WebSite[]> = {};
  sites.forEach((site) => {
    const cat = site.category || 'General';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(site);
  });

  Object.entries(groups).forEach(([category, groupSites]) => {
    html += `    <DT><H3 ADD_DATE="${Math.floor(Date.now() / 1000)}">${category}</H3>\n    <DL><p>\n`;
    groupSites.forEach((site) => {
      html += `        <DT><A HREF="${site.url}" ADD_DATE="${Math.floor(Date.now() / 1000)}">${site.name}</A>\n`;
    });
    html += `    </DL><p>\n`;
  });

  html += `</DL><p>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mywebhub-bookmarks-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Read JSON file from input
export function importHubData(file: File): Promise<{ websites: WebSite[]; categories?: Category[]; settings?: HubSettings }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          // Array of websites
          resolve({ websites: parsed });
        } else if (parsed && Array.isArray(parsed.websites)) {
          resolve({
            websites: parsed.websites,
            categories: parsed.categories,
            settings: parsed.settings,
          });
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
