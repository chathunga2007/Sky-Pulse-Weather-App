import React from "react";
import {
  MapPin,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
  Cloud,
  CloudRain,
  Sparkles,
} from "lucide-react";
import WeatherIcon from "./WeatherIcon";

export default function HeroCard({
  current,
  daily,
  meta,
  currentCity,
  currentTime,
  tempUnit,
  formatTemp,
  sunrise,
  sunset,
}) {
  if (!current) return null;

  const currentTemp =
    tempUnit === "F"
      ? Math.round((current.temperature_2m * 9) / 5 + 32)
      : Math.round(current.temperature_2m);

  const feelsLike = formatTemp(current.apparent_temperature, tempUnit);
  const maxTemp = daily?.temperature_2m_max?.[0] != null
    ? formatTemp(daily.temperature_2m_max[0], tempUnit)
    : "--";
  const minTemp = daily?.temperature_2m_min?.[0] != null
    ? formatTemp(daily.temperature_2m_min[0], tempUnit)
    : "--";

  return (
    <div className="lg:col-span-2 glass-hero p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between group">
      {/* Dynamic Ambient Background Glow inside the Hero */}
      <div
        className={`absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-bl ${meta.glow || "from-cyan-500/20 to-blue-600/20"} rounded-full blur-[100px] pointer-events-none opacity-80 transition-all duration-700`}
      />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Bar: Location details & Day/Night Pill */}
      <div className="flex flex-wrap items-start justify-between gap-4 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
              <MapPin className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {currentCity?.name || "Colombo"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                {currentCity?.country || "Sri Lanka"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${
              meta.badgeBg || "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>{current.is_day ? "Daytime" : "Nighttime"}</span>
            <span>•</span>
            <span>{meta.label}</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium pr-1">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Center Display: Massive Temperature & Weather Icon */}
      <div className="my-6 sm:my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 z-10">
        <div>
          <div className="flex items-baseline">
            <span className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-white drop-shadow-lg text-glow">
              {currentTemp}
            </span>
            <span className="text-4xl sm:text-5xl font-light text-cyan-400 ml-1.5">
              °{tempUnit}
            </span>
          </div>

          {/* Dual Language Condition description */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
              {meta.label}
            </span>
            {meta.sinhalaLabel && (
              <span className="text-sm font-semibold text-cyan-300/80 px-2 py-0.5 rounded-md bg-cyan-950/40 border border-cyan-800/40">
                {meta.sinhalaLabel}
              </span>
            )}
          </div>

          {/* Feels like & High/Low badges */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-300">
            <span className="glass-pill px-3 py-1 rounded-xl flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Feels like</span>
              <strong className="text-white font-bold">{feelsLike}</strong>
            </span>

            <span className="glass-pill px-3 py-1 rounded-xl flex items-center gap-2">
              <span className="flex items-center text-rose-400 font-semibold gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" />
                {maxTemp}
              </span>
              <span className="text-slate-500">/</span>
              <span className="flex items-center text-cyan-400 font-semibold gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" />
                {minTemp}
              </span>
            </span>
          </div>
        </div>

        {/* 3D Glass Weather Icon Showcase */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-950/40 border border-slate-700/60 shadow-2xl backdrop-blur-2xl flex flex-col items-center justify-center self-center sm:self-auto group-hover:border-cyan-500/40 transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/25 blur-2xl rounded-full scale-125" />
            <WeatherIcon
              name={meta.icon}
              className={`w-20 h-20 sm:w-24 sm:h-24 ${meta.color || "text-cyan-400"} relative z-10 drop-shadow-xl transition-transform duration-700 group-hover:scale-110`}
            />
          </div>
          <span className="text-xs font-bold text-slate-200 mt-2.5 tracking-wide">
            {meta.label}
          </span>
        </div>
      </div>

      {/* Bottom Timeline: Sunrise, Daylight Cycle, and Sunset */}
      <div className="pt-5 border-t border-slate-800/80 z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 icon-glow-amber">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Sunrise
            </div>
            <div className="text-sm font-bold text-slate-100">{sunrise}</div>
          </div>
        </div>

        {/* Daylight Arc Meter */}
        <div className="w-full sm:w-56 flex flex-col items-center gap-1.5">
          <div className="w-full h-2 bg-slate-900/80 border border-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-indigo-500 rounded-full transition-all duration-1000"
              style={{
                width: current.is_day ? "68%" : "18%",
              }}
            />
          </div>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wide">
            {current.is_day ? "Daylight active cycle" : "Nighttime active cycle"}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Sunset
            </div>
            <div className="text-sm font-bold text-slate-100">{sunset}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 icon-glow-violet">
            <Sunset className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
