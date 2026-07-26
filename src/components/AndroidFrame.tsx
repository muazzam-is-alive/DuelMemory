import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  showFrame: boolean;
  onToggleFrame: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  showFrame,
  onToggleFrame,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!showFrame) {
    return (
      <div className="relative min-h-screen w-full flex flex-col bg-[#0b0b14] text-white">
        {/* Toggle back to phone view button on desktop floating header */}
        <div className="fixed top-3 right-3 z-50 hidden sm:block">
          <button
            onClick={onToggleFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105"
            title="Toggle Android Device Frame"
          >
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span>Phone View</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 md:p-6 bg-[#07070d] text-white overflow-x-hidden">
      {/* Phone View toggle button on desktop */}
      <div className="fixed top-3 right-3 z-50 hidden sm:block">
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 shadow-lg backdrop-blur-md transition-all hover:scale-105"
          title="Toggle Fullscreen View"
        >
          <Monitor className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full Width</span>
        </button>
      </div>

      {/* Android Device Outer Casing */}
      <div className="relative w-full max-w-[480px] h-[100vh] sm:h-[92vh] sm:max-h-[920px] bg-[#12121e] sm:rounded-[42px] border-0 sm:border-[8px] border-slate-800/90 shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col overflow-hidden ring-1 ring-purple-500/30">
        
        {/* Top Camera Punch Hole / Speaker Notch */}
        <div className="relative w-full bg-[#0b0b14] pt-2 px-6 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-medium select-none z-40 border-b border-white/5">
          {/* Clock */}
          <span>{timeStr || '09:41'}</span>

          {/* Camera Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 top-2 w-20 h-4 bg-black rounded-full flex items-center justify-center gap-2 px-2 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-[#181828] border border-slate-700" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900/80" />
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-2">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>

        {/* Device Content Screen */}
        <div className="flex-1 w-full relative flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#0b0b14]">
          {children}
        </div>

        {/* Bottom Android Gesture Navigation Bar */}
        <div className="w-full h-5 bg-[#0b0b14] flex items-center justify-center select-none z-40">
          <div className="w-28 h-1 rounded-full bg-slate-600/70" />
        </div>
      </div>
    </div>
  );
};
