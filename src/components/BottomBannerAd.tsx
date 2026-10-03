import React, { useState, useEffect } from 'react';
import { Crown, ExternalLink, ShieldCheck, X, Sparkles } from 'lucide-react';

interface BottomBannerAdProps {
  isPremium: boolean;
  onOpenRemoveAds: () => void;
}

const BANNER_SPONSORS = [
  {
    id: '1',
    name: 'NordPulse VPN',
    tagline: 'Military-grade encryption for all your web apps and browsing.',
    cta: 'Get 70% Off',
    badge: 'Cyber Defense',
    url: 'https://example.com/nordpulse',
    color: '#3B82F6',
    accent: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  },
  {
    id: '2',
    name: 'CloudScale Edge',
    tagline: 'Ultra-fast global edge hosting for PWAs and modern web apps.',
    cta: '$200 Credits',
    badge: 'Cloud Infrastructure',
    url: 'https://example.com/cloudscale',
    color: '#06B6D4',
    accent: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  },
  {
    id: '3',
    name: 'Apex AI Coder',
    tagline: 'Autopilot code completions and web deployment assistant.',
    cta: 'Try Free',
    badge: 'Developer Tool',
    url: 'https://example.com/apexcoder',
    color: '#A855F7',
    accent: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
];

export const BottomBannerAd: React.FC<BottomBannerAdProps> = ({
  isPremium,
  onOpenRemoveAds,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // If user paid US$ 5 to remove ads, do not display the banner ad
  if (isPremium) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_SPONSORS.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const sponsor = BANNER_SPONSORS[currentIndex];

  return (
    <aside 
      aria-label="Sponsored Advertisement"
      className="sticky bottom-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-t border-white/10 px-3 py-2 shadow-2xl transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Ad Label & Sponsor Content */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          {/* AdChoices Badge */}
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold uppercase tracking-wider flex-shrink-0">
            <span>Ad</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow"
              style={{ backgroundColor: sponsor.color }}
            >
              ✦
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {sponsor.name}
                </span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium border truncate hidden md:inline ${sponsor.accent}`}>
                  {sponsor.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                {sponsor.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
          {/* Sponsor CTA link */}
          <button
            onClick={() => {
              alert(`Sponsored link: ${sponsor.name}\n${sponsor.tagline}`);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <span>{sponsor.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </button>

          {/* Remove Ads Upsell Button */}
          <button
            onClick={onOpenRemoveAds}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 active:scale-95 transition"
            title="Remove all ads forever for a one-time US$ 5 payment"
          >
            <Crown className="w-3.5 h-3.5 fill-slate-950" />
            <span>Remove Ads ($5)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
