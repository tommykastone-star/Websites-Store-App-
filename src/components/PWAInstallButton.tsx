import React, { useState } from 'react';
import { Download, Check, Share, Plus, Smartphone, Sparkles, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  isPremium?: boolean;
  onRequireAd?: (onAdWatched: () => void) => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  isPremium = false,
  onRequireAd,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  const doNativeInstall = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  const handleInstallClick = () => {
    // If not premium and ad required, user must watch a 10s ad first
    if (!isPremium && onRequireAd) {
      onRequireAd(() => {
        doNativeInstall();
      });
    } else {
      doNativeInstall();
    }
  };

  const handleIOSClick = () => {
    if (!isPremium && onRequireAd) {
      onRequireAd(() => {
        setShowIOSGuide(true);
      });
    } else {
      setShowIOSGuide(true);
    }
  };

  // If already running as an installed PWA, show a status badge
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
        <Check className="w-3.5 h-3.5" />
        <span>App Installed</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={handleInstallClick}
        disabled={installing}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition active:scale-95 animate-pulse hover:animate-none"
        title={isPremium ? 'Install Websites Store App to your device' : 'Watch a quick 10s ad to install PWA to your device'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App {!isPremium && '(10s Ad)'}</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={handleIOSClick}
          className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Install on iOS {!isPremium && '(10s Ad)'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="/app-icon.png" alt="App Icon" className="w-7 h-7 rounded-lg" />
                  <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-300 space-y-2 mb-4 leading-relaxed">
                1. Tap the <strong className="text-blue-400 inline-flex items-center gap-1"><Share className="w-3.5 h-3.5" /> Share</strong> button in Safari toolbar.<br />
                2. Scroll down and tap <strong className="text-white inline-flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add to Home Screen</strong>.<br />
                3. Open from your home screen for full standalone experience!
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-2 text-xs font-semibold text-white transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for browsers
  return (
    <button
      onClick={() => {
        if (!isPremium && onRequireAd) {
          onRequireAd(() => {
            alert(
              'PWA Installation Guide:\n• On Chrome/Edge: Click the install icon in the address bar (or menu -> Install Websites Store App).\n• On Android Chrome: Tap menu (⋮) -> "Add to Home Screen" or "Install App".\n• On iOS Safari: Tap Share -> "Add to Home Screen".'
            );
          });
        } else {
          alert(
            'PWA Installation Guide:\n• On Chrome/Edge: Click the install icon in the address bar (or menu -> Install Websites Store App).\n• On Android Chrome: Tap menu (⋮) -> "Add to Home Screen" or "Install App".\n• On iOS Safari: Tap Share -> "Add to Home Screen".'
          );
        }
      }}
      className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition"
      title="How to install as a PWA"
    >
      <Download className="w-3.5 h-3.5 text-emerald-400" />
      <span>Install PWA {!isPremium && '(10s Ad)'}</span>
    </button>
  );
};
