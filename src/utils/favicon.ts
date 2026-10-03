export function getDomain(url: string): string {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = 'https://' + cleanUrl;
    }
    const parsed = new URL(cleanUrl);
    return parsed.hostname;
  } catch {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0] || '';
  }
}

export function formatUrl(url: string): string {
  let cleanUrl = url.trim();
  if (!cleanUrl) return '';
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  return cleanUrl;
}

export function getFaviconUrl(url: string, sz: number = 128): string {
  const domain = getDomain(url);
  if (!domain) return '';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`;
}

export function getDuckDuckGoIcon(url: string): string {
  const domain = getDomain(url);
  if (!domain) return '';
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`;
}

// Generate nice pastel/gradient badge color from string
export function getInitialsAndColor(name: string): { initials: string; gradient: string } {
  const words = name.trim().split(/\s+/);
  let initials = words[0]?.slice(0, 1) || 'W';
  if (words.length > 1 && words[1]) {
    initials += words[1].slice(0, 1);
  }
  initials = initials.toUpperCase();

  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-purple-500 to-pink-600',
    'from-rose-500 to-red-600',
    'from-amber-500 to-orange-600',
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-700',
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return { initials, gradient: gradients[index] };
}

// Web Audio API subtle click sound
export function playSoundEffect(type: 'click' | 'open' | 'delete' | 'success') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'open') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'success') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch {
    // Audio may fail if user hasn't interacted yet or audio is disabled
  }
}
