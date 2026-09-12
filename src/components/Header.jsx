import React from "react";
import { Navigation, RefreshCw, Moon, Sun, Clock } from "lucide-react";

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
}) {
  return (
    <header className="glass-panel p-4 sm:p-5 rounded-3xl flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Brand Logo & Status */}
      <div className="flex items-center justify-between w-full lg:w-auto gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-lg rounded-2xl" />
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl relative z-10 border border-white/10 shadow-lg object-contain bg-slate-900/60 p-1"
              src="./app_logo.png"
              alt="SkyPulse Logo"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                SkyPulse
              </h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                Live Radar
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Atmospheric Telemetry & Forecast
            </p>
          </div>
        </div>

        {/* Mobile Clock */}
        <div className="lg:hidden text-right text-xs text-slate-400 font-medium">
          <div className="text-slate-200 font-bold">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <div className="text-[10px] text-slate-500">
            {currentTime.toLocaleDateString([], { month: "short", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Center Search Container */}
      <div className="w-full lg:max-w-md flex justify-center">
        {searchComponent}
      </div>

      {/* Right Action Tools & Controls */}
      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-between lg:justify-end">
        {/* GPS Current Location */}
        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locating}
          title="Use my current GPS location"
          className="glass-pill px-3.5 py-2 rounded-2xl text-xs font-semibold text-cyan-300 flex items-center gap-1.5 hover:border-cyan-400/50 cursor-pointer active:scale-95 disabled:opacity-50 transition-all"
        >
          <Navigation className={`w-3.5 h-3.5 ${locating ? "animate-spin text-cyan-400" : ""}`} />
          <span className="hidden sm:inline">GPS Location</span>
        </button>

        {/* Temperature Unit Switcher */}
        <div className="glass-pill p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setTempUnit("C")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tempUnit === "C"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            °C
          </button>
          <button
            type="button"
            onClick={() => setTempUnit("F")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tempUnit === "F"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            °F
          </button>
        </div>

        {/* Refresh button */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing || loading}
          title="Refresh live telemetry"
          className="glass-pill p-2 rounded-2xl text-slate-300 hover:text-cyan-300 cursor-pointer active:scale-95 transition"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-cyan-400" : ""}`} />
        </button>

        {/* Dark/Light mode toggle */}
        <button
          type="button"
          onClick={() => setDarkMode((prev) => !prev)}
          title={darkMode ? "Switch to daylight mode" : "Switch to dark mode"}
          className="glass-pill p-2 rounded-2xl text-slate-300 hover:text-cyan-300 cursor-pointer active:scale-95 transition"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* Desktop Clock */}
        <div className="hidden lg:flex flex-col text-right pl-2 border-l border-slate-800 text-xs">
          <span className="font-bold text-slate-200">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className="text-[10px] text-slate-400">
            {currentTime.toLocaleDateString([], { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </header>
  );
}
