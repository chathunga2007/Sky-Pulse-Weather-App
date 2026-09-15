import React from "react";
import { Navigation, RefreshCw, Moon, Sun, Sparkles } from "lucide-react";
import type { TempUnit } from "../types/weather";

interface HeaderProps {
  currentTime: Date;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  locating: boolean;
  handleCurrentLocation: () => void;
  tempUnit: TempUnit;
  setTempUnit: React.Dispatch<React.SetStateAction<TempUnit>>;
  refreshing: boolean;
  loading: boolean;
  handleRefresh: () => void;
  searchComponent: React.ReactNode;
  audioComponent?: React.ReactNode;
  fxEnabled?: boolean;
  setFxEnabled?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  currentTime,
  darkMode,
  setDarkMode,
  locating,
  handleCurrentLocation,
  tempUnit,
  setTempUnit,
  refreshing,
  loading,
  handleRefresh,
  searchComponent,
  audioComponent,
  fxEnabled,
  setFxEnabled,
}: HeaderProps) {
  return (
    <header className="relative z-50 glass-panel p-3.5 sm:p-4 md:p-5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-3.5 lg:gap-4 shadow-xl border border-white/15 dark:border-white/10">
      {/* Brand Logo & Title */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-3 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo container with fixed dimensions and no shrinking */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl shrink-0 overflow-hidden shadow-md border border-cyan-500/40 bg-white dark:bg-slate-950/80 p-1 flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-cyan-400/20 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <img
              className="w-full h-full object-contain relative z-10"
              src="./app_logo.png"
              alt="SkyPulse Logo"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent">
                SkyPulse
              </h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 border border-cyan-400 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30 uppercase tracking-widest flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-400 animate-ping" />
                Live Radar
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold hidden sm:block">
              Atmospheric Telemetry & Severe Weather Intelligence
            </p>
          </div>
        </div>

        {/* Mobile Clock display */}
        <div className="lg:hidden text-right text-xs text-slate-600 dark:text-slate-400 font-medium shrink-0">
          <div className="text-slate-900 dark:text-slate-200 font-black">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">
            {currentTime.toLocaleDateString([], { month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Center Search Input Bar */}
      <div className="w-full lg:flex-1 lg:max-w-md mx-auto">
        {searchComponent}
      </div>

      {/* Right Controls & Action Tools */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end shrink-0">
        {/* Ambient Soundscape */}
        {audioComponent}

        {/* Live Weather FX Particle Toggle */}
        {setFxEnabled && (
          <button
            type="button"
            onClick={() => setFxEnabled((p) => !p)}
            title={fxEnabled ? "Disable Live Rain/Lightning Background FX" : "Enable Live Rain/Lightning Background FX"}
            className={`glass-pill px-2.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-xs ${
              fxEnabled
                ? "text-cyan-600 dark:text-cyan-300 border-cyan-500/40 bg-cyan-500/10"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${fxEnabled ? "text-cyan-500 animate-spin-slow" : ""}`} />
            <span className="hidden xl:inline">Live FX</span>
          </button>
        )}

        {/* Current GPS Location */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locating}
          title="Use current GPS location"
          className="glass-pill px-3 py-2 rounded-2xl text-xs font-bold text-slate-800 dark:text-cyan-300 flex items-center gap-1.5 hover:border-cyan-500 cursor-pointer active:scale-95 disabled:opacity-50 transition-all shadow-xs"
        >
          <Navigation
            className={`w-3.5 h-3.5 ${
              locating ? "animate-spin text-cyan-600" : "text-cyan-600 dark:text-cyan-400"
            }`}
          />
          <span className="hidden sm:inline">GPS</span>
        </button>

        {/* Temperature Unit Switcher */}
        <div className="glass-pill p-1 rounded-2xl flex items-center shadow-xs">
          <button
            type="button"
            onClick={() => setTempUnit("C")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tempUnit === "C"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setTempUnit("F")}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tempUnit === "F"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            °F
          </button>
        </div>

        {/* Refresh telemetry */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          title="Refresh live telemetry"
          className="glass-pill p-2 rounded-2xl text-slate-800 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 cursor-pointer active:scale-95 transition shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-cyan-600" : ""}`} />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="glass-pill px-2.5 py-2 rounded-2xl flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all text-xs font-bold shadow-xs"
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="text-amber-300 hidden sm:inline font-bold">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-700" />
              <span className="text-indigo-950 font-black hidden sm:inline">Dark</span>
            </>
          )}
        </button>

        {/* Desktop Clock */}
        <div className="hidden lg:flex flex-col text-right pl-2 border-l border-slate-300 dark:border-slate-800 text-xs">
          <span className="font-black text-slate-900 dark:text-slate-200">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
            {currentTime.toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </header>
  );
}
