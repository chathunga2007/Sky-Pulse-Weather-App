import React from "react";
import { Heart, Sparkles, Activity } from "lucide-react";

function GithubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-6 text-xs text-slate-400 mt-10 mb-4 transition-colors duration-500">
      {/* Top row: Brand info & Status badges */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-700/40">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-xl" />
            <img
              className="w-10 h-10 rounded-xl relative z-10 border border-white/10 shadow-md object-contain bg-slate-900/60 p-1"
              src="./app_logo.png"
              alt="SkyPulse Logo"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-tight">SkyPulse</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 uppercase tracking-wider">
                v2.0 Glass
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Next-Gen Glassmorphic Atmospheric Telemetry & Predictive Radar
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-400 font-semibold border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Radar Telemetry Active</span>
          </div>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400">Powered by Open-Meteo High-Resolution API</span>
        </div>
      </div>

      {/* Bottom row: Developer Attribution & Copyright Watermark */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-1.5 text-slate-300 font-medium">
          <span>Designed & Developed with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by</span>
          <strong className="text-cyan-400 font-bold tracking-wide hover:underline cursor-pointer">
            Chathunga Bimsara
          </strong>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>&copy; {currentYear} SkyPulse • All Rights Reserved.</span>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com/chathunga2007"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-300 hover:text-cyan-400 transition"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>@chathunga2007</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
