import React from "react";
import { Sparkles, Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-panel p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 mt-8">
      <div className="flex items-center gap-3">
        <img className="w-8 h-8 rounded-lg" src="./app_logo.png" alt="SkyPulse Logo" />
        <div>
          <span className="font-extrabold text-white tracking-tight">SkyPulse</span>
          <span className="mx-2 text-slate-600">|</span>
          <span>Next-Gen Glassmorphic Atmospheric Telemetry</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Radar Feeds Live</span>
        </div>
        <span className="text-slate-600">•</span>
        <span>Powered by Open-Meteo High-Resolution API</span>
      </div>
    </footer>
  );
}
