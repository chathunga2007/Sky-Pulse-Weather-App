import React from "react";
import { Activity, Cloud, CloudRain, ShieldAlert } from "lucide-react";

export default function AirQualityPanel({ airQuality, aqiInfo, current }) {
  const aqiValue = airQuality?.us_aqi ?? 28;
  const pm25 = airQuality?.pm2_5 ? Math.round(airQuality.pm2_5) : 12;
  const pm10 = airQuality?.pm10 ? Math.round(airQuality.pm10) : 18;
  const cloudCover = current?.cloud_cover ?? 0;
  const precipitation = current?.precipitation ?? 0;

  return (
    <div className="glass-panel p-5 sm:p-7 rounded-3xl flex flex-col justify-between relative overflow-hidden shadow-lg">
      {/* Background soft glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-[70px] pointer-events-none" />

      <div className="space-y-4 z-10">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-500 dark:border-emerald-500/30 icon-glow-emerald shadow-xs">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-wide">
                Air & Atmosphere
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">EPA US AQI Standard</p>
            </div>
          </div>

          <span
            className={`text-xs font-black px-3 py-1 rounded-full border backdrop-blur-md shadow-xs ${
              aqiInfo?.bg || "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
            } ${aqiInfo?.color || "text-emerald-900 dark:text-emerald-300"}`}
          >
            {aqiInfo?.label || "Good"}
          </span>
        </div>

        {/* AQI Score Gauge Card - High contrast white card in light mode */}
        <div className="p-5 rounded-2xl bg-white/90 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {aqiValue}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
                AQI Index
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-slate-800 dark:text-slate-300">
                {aqiInfo?.label || "Clean Air"}
              </span>
            </div>
          </div>

          {/* Color-coded spectrum track */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3.5 overflow-hidden p-0.5 border border-slate-300 dark:border-slate-700/50 shadow-inner">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                aqiValue <= 50
                  ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                  : aqiValue <= 100
                  ? "bg-gradient-to-r from-amber-400 to-yellow-500"
                  : aqiValue <= 150
                  ? "bg-gradient-to-r from-orange-400 to-rose-400"
                  : "bg-gradient-to-r from-rose-500 to-purple-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(12, aqiInfo?.pct ?? 25))}%` }}
            />
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 mt-3 leading-relaxed flex items-start gap-1.5 font-bold">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <span>{aqiInfo?.advice || "Air quality is considered satisfactory, and air pollution poses little or no risk."}</span>
          </p>
        </div>

        {/* Pollutants Breakdown */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/40 border border-slate-200/90 dark:border-slate-800/60 shadow-xs">
            <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-black uppercase tracking-wider">
              PM2.5 Particles
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">{pm25}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">µg/m³</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/40 border border-slate-200/90 dark:border-slate-800/60 shadow-xs">
            <span className="text-slate-600 dark:text-slate-400 block text-[10px] font-black uppercase tracking-wider">
              PM10 Particles
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg font-black text-slate-900 dark:text-slate-100">{pm10}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">µg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud & Precipitation Micro Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 z-10">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Cloud Cover</span>
            <strong className="text-slate-900 dark:text-white font-black">{cloudCover}%</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CloudRain className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">Precipitation</span>
            <strong className="text-slate-900 dark:text-white font-black">{precipitation} mm</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
