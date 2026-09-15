import React from "react";
import {
  MapPin,
  Thermometer,
  ArrowUp,
  ArrowDown,
  Sunrise,
  Sunset,
  Sparkles,
} from "lucide-react";
import WeatherIcon from "./WeatherIcon";
import type { WeatherCurrent, WeatherDaily, WeatherMeta, TempUnit } from "../types/weather";

interface HeroCardProps {
  current: WeatherCurrent | null;
  daily: WeatherDaily | null | undefined;
  meta: WeatherMeta;
  currentCity: { name: string; country: string } | null;
  currentTime: Date;
  tempUnit: TempUnit;
  formatTemp: (celsius?: number | null, unit?: TempUnit) => string;
  sunrise: string;
  sunset: string;
}

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
}: HeroCardProps) {
  if (!current) return null;

  const currentTemp =
    tempUnit === "F"
      ? Math.round((current.temperature_2m * 9) / 5 + 32)
      : Math.round(current.temperature_2m);

  const feelsLike = formatTemp(current.apparent_temperature, tempUnit);
  const maxTemp =
    daily?.temperature_2m_max?.[0] != null
      ? formatTemp(daily.temperature_2m_max[0], tempUnit)
      : "--";
  const minTemp =
    daily?.temperature_2m_min?.[0] != null
      ? formatTemp(daily.temperature_2m_min[0], tempUnit)
      : "--";

  return (
    <div className="lg:col-span-2 glass-hero p-5 sm:p-7 md:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between group shadow-lg">
      {/* Dynamic Ambient Background Glow inside the Hero */}
      <div
        className={`absolute -right-16 -top-16 w-80 h-80 bg-gradient-to-bl ${meta.glow || "from-cyan-500/20 to-blue-600/20"} rounded-full blur-[100px] pointer-events-none opacity-80 transition-all duration-700`}
      />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Top Bar: Location details & Day/Night Pill */}
      <div className="flex flex-wrap items-start justify-between gap-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/15 dark:border-cyan-500/30 dark:text-cyan-400 shadow-xs">
              <MapPin className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                {currentCity?.name || "Colombo"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
                {currentCity?.country || "Sri Lanka"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="px-3.5 py-1.5 rounded-full text-xs font-black border backdrop-blur-md flex items-center gap-1.5 shadow-xs bg-cyan-100 text-cyan-950 border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-700 dark:text-cyan-400" />
            <span>{current.is_day ? "Daytime" : "Nighttime"}</span>
            <span>•</span>
            <span>{meta.label}</span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold pr-1">
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
            <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
              {currentTemp}
            </span>
            <span className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-cyan-600 dark:text-cyan-400 ml-2">
              °{tempUnit}
            </span>
          </div>

          {/* Condition description */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {meta.label}
            </span>
            {meta.subLabel && (
              <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-950 border border-cyan-300 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800/50 shadow-xs">
                {meta.subLabel}
              </span>
            )}
          </div>

          {/* Feels like & High/Low badges */}
          <div className="flex flex-wrap items-center gap-2.5 mt-3 text-xs">
            <span className="glass-pill px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-slate-800 dark:text-slate-300 shadow-xs font-semibold">
              <Thermometer className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Feels like</span>
              <strong className="text-slate-950 dark:text-white font-black">{feelsLike}</strong>
            </span>

            <span className="glass-pill px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xs">
              <span className="flex items-center text-rose-600 dark:text-rose-400 font-extrabold gap-0.5">
                <ArrowUp className="w-3.5 h-3.5" />
                {maxTemp}
              </span>
              <span className="text-slate-400">/</span>
              <span className="flex items-center text-cyan-700 dark:text-cyan-400 font-extrabold gap-0.5">
                <ArrowDown className="w-3.5 h-3.5" />
                {minTemp}
              </span>
            </span>
          </div>
        </div>

        {/* Weather Icon Showcase */}
        <div className="p-5 sm:p-7 rounded-3xl bg-sky-50/90 border border-sky-100/90 shadow-md dark:bg-slate-950/40 dark:border-slate-700/60 backdrop-blur-2xl flex flex-col items-center justify-center self-center sm:self-auto transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full scale-125" />
            <WeatherIcon
              name={meta.icon}
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 ${meta.color || "text-cyan-600 dark:text-cyan-400"} relative z-10 drop-shadow-md transition-transform duration-700 group-hover:scale-110`}
            />
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-slate-200 mt-2.5 tracking-wide">
            {meta.label}
          </span>
        </div>
      </div>

      {/* Bottom Timeline: Sunrise, Daylight Cycle, and Sunset */}
      <div className="pt-5 border-t border-slate-200 dark:border-slate-800/80 z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-600 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-500 dark:border-amber-500/30 icon-glow-amber shadow-xs">
            <Sunrise className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">
              Sunrise
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-slate-100">{sunrise}</div>
          </div>
        </div>

        {/* Daylight Arc Meter */}
        <div className="w-full sm:w-56 flex flex-col items-center gap-1.5">
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 rounded-full overflow-hidden relative shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-cyan-500 to-indigo-500 rounded-full transition-all duration-1000"
              style={{
                width: current.is_day ? "68%" : "18%",
              }}
            />
          </div>
          <span className="text-[10px] text-slate-700 dark:text-slate-400 font-black tracking-wide">
            {current.is_day ? "Daylight active cycle" : "Nighttime active cycle"}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right">
            <div className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">
              Sunset
            </div>
            <div className="text-sm font-black text-slate-900 dark:text-slate-100">{sunset}</div>
          </div>
          <div className="p-2.5 rounded-2xl bg-indigo-100 text-indigo-600 border border-indigo-300 dark:bg-indigo-500/15 dark:text-indigo-500 dark:border-indigo-500/30 icon-glow-violet shadow-xs">
            <Sunset className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
