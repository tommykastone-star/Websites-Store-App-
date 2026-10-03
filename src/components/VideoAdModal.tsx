import React, { useState, useEffect } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Crown, 
  Play, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { AdTriggerReason, AdCreative } from '../types/ads';

interface VideoAdModalProps {
  isOpen: boolean;
  durationSeconds: 30 | 10;
  reason: AdTriggerReason;
  targetSiteName?: string;
  onComplete: () => void;
  onCancel: () => void;
  onOpenRemoveAds: () => void;
}

const AD_CREATIVES: AdCreative[] = [
  {
    id: 'nord_vpn',
    sponsor: 'NordPulse CyberSecurity',
    tagline: 'Ultra-fast Next-Gen VPN & Web Defense. Encrypt your browsing in 1-click.',
    ctaText: 'Claim 70% Off Today',
    category: 'Cybersecurity',
    badge: 'Official Sponsor',
    color: '#3B82F6',
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
  },
  {
    id: 'cloud_scale',
    sponsor: 'CloudScale Global Infrastructure',
    tagline: 'Deploy edge apps, PWAs, and full-stack sites with 99.999% uptime worldwide.',
    ctaText: 'Get $200 Free Cloud Credits',
    category: 'Cloud Hosting',
    badge: 'Featured Partner',
    color: '#06B6D4',
    accentGradient: 'from-cyan-500 via-teal-500 to-emerald-600',
    bgGradient: 'from-slate-950 via-cyan-950 to-slate-900',
  },
  {
    id: 'apex_devtools',
    sponsor: 'Apex Developer Suite',
    tagline: 'AI-assisted code reviews, automated tests, and instant web app telemetry.',
    ctaText: 'Start Free 14-Day Trial',
    category: 'Developer Tools',
    badge: 'Top Rated Web Tool',
    color: '#8B5CF6',
    accentGradient: 'from-violet-600 via-purple-600 to-pink-600',
    bgGradient: 'from-slate-950 via-purple-950 to-slate-900',
  },
];

export const VideoAdModal: React.FC<VideoAdModalProps> = ({
  isOpen,
  durationSeconds,
  reason,
  targetSiteName,
  onComplete,
  onCancel,
  onOpenRemoveAds,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(durationSeconds);
  const [isMuted, setIsMuted] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeAdIndex, setActiveAdIndex] = useState(0);

  // Reset and start countdown when opened
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(durationSeconds);
      setIsFinished(false);
      setShowExitConfirm(false);
      setActiveAdIndex(Math.floor(Math.random() * AD_CREATIVES.length));
    }
  }, [isOpen, durationSeconds]);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen || isFinished) return;

    if (timeLeft <= 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isFinished]);

  if (!isOpen) return null;

  const currentAd = AD_CREATIVES[activeAdIndex] || AD_CREATIVES[0];
  const progressPercent = Math.min(100, Math.round(((durationSeconds - timeLeft) / durationSeconds) * 100));

  const handleClaimReward = () => {
    onComplete();
  };

  const handleCloseAttempt = () => {
    if (isFinished) {
      onComplete();
    } else {
      setShowExitConfirm(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-xl">
      <div 
        className="w-full max-w-xl rounded-3xl bg-slate-900 border border-white/15 shadow-2xl overflow-hidden flex flex-col relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Ad Status Bar */}
        <div className="flex items-center justify-between px-5 py-3 bg-slate-950/90 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] tracking-wider uppercase border border-amber-500/30">
              Ad
            </span>
            <span className="text-slate-300 font-medium">
              {reason === 'add_site' ? 'Reward Ad • Adding Website (30s)' : 'Reward Ad • Installing PWA (10s)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* Countdown Badge or Finished Check */}
            {isFinished ? (
              <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Ready!</span>
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 font-mono font-bold text-xs border border-white/10 animate-pulse">
                {timeLeft}s
              </span>
            )}

            {/* Close button */}
            <button
              onClick={handleCloseAttempt}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close Ad"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Commercial Canvas / Animated Player Container */}
        <div className={`relative w-full h-64 sm:h-72 bg-gradient-to-br ${currentAd.bgGradient} p-6 flex flex-col justify-between overflow-hidden`}>
          {/* Animated Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />

          {/* Top Sponsor Info */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center font-bold text-white text-xs shadow-md">
                ✦
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {currentAd.sponsor}
                </h4>
                <span className="text-[10px] text-cyan-300 font-medium">
                  {currentAd.badge}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                {currentAd.category}
              </span>
            </div>
          </div>

          {/* Dynamic Commercial Center Message */}
          <div className="relative z-10 my-auto text-center px-4 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-200 tracking-tight">
              {currentAd.tagline}
            </h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Trusted by 10,000,000+ power users and software developers worldwide.
            </p>
          </div>

          {/* Commercial Call-To-Action Pill */}
          <div className="relative z-10 flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Web Partner</span>
            </div>

            <button
              onClick={() => {
                alert(`Sponsored link: ${currentAd.sponsor}\nVisit partner promotional site in full window.`);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur text-white text-xs font-semibold border border-white/20 transition shadow"
            >
              <span>{currentAd.ctaText}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Video Progress Bar Line */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-950/60">
            <div 
              className={`h-full bg-gradient-to-r ${currentAd.accentGradient} transition-all duration-1000 ease-linear`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Ad Footer & Reward State */}
        <div className="p-5 bg-slate-950 space-y-3">
          {/* Target site context */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>
                Target: <strong className="text-white">{targetSiteName || 'Requested Website'}</strong>
              </span>
            </div>
            <span>
              {isFinished ? 'Ad completed' : `${timeLeft}s remaining to unlock`}
            </span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            {/* Primary Action Button */}
            {isFinished ? (
              <button
                onClick={handleClaimReward}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {reason === 'add_site' ? 'Complete: Add Website to Hub ✓' : 'Complete: Install PWA Now ✓'}
                </span>
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs border border-white/5 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                <span>Watching Ad ({timeLeft}s left to proceed)...</span>
              </button>
            )}

            {/* Remove Ads Upsell Button */}
            <button
              onClick={() => {
                onOpenRemoveAds();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 whitespace-nowrap transition flex items-center justify-center gap-1.5 active:scale-95"
              title="Remove ads permanently for $5"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Remove Ads ($5)</span>
            </button>
          </div>
        </div>

        {/* Exit Confirmation Warning Overlay */}
        {showExitConfirm && (
          <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Leave without reward?</h4>
            <p className="text-xs text-slate-300 max-w-sm">
              If you cancel now, <strong>{targetSiteName || 'this website'}</strong> will not be {reason === 'add_site' ? 'added to your store hub' : 'installed as a PWA'}. You only have {timeLeft} seconds left!
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
              >
                Resume Ad ({timeLeft}s)
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                Forfeit & Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
