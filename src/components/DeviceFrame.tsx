import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft, Smartphone, Monitor } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
  onExitMobileMode: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children, onExitMobileMode }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen py-6 px-2 flex flex-col items-center justify-center bg-slate-950 text-slate-100">
      {/* Top Banner explaining phone simulation mode */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">
            Android Device Simulator (Mobile App Preview)
          </span>
        </div>
        <button
          onClick={onExitMobileMode}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 transition"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Exit to Desktop</span>
        </button>
      </div>

      {/* Realistic Smartphone Shell */}
      <div className="relative w-full max-w-[400px] h-[840px] rounded-[48px] bg-slate-900 border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-1 ring-white/10">
        {/* Dynamic Punch-hole / Notch & Speaker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2">
          <div className="w-12 h-1 rounded-full bg-slate-700/60" />
        </div>

        {/* Android Status Bar */}
        <div className="w-full h-8 pt-1.5 px-6 flex items-center justify-between z-30 select-none text-[11px] font-semibold text-slate-300 bg-slate-950/60 backdrop-blur-md">
          <span>{time || '10:42'}</span>
          {/* Camera cut-out circle */}
          <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700 mx-auto" />
          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col">
          {children}
        </div>

        {/* Android Gesture Navigation Bar Pill */}
        <div className="w-full h-6 bg-slate-950/90 flex items-center justify-center select-none z-30">
          <div className="w-28 h-1 rounded-full bg-slate-500/60 hover:bg-slate-400 transition" />
        </div>
      </div>
    </div>
  );
};
