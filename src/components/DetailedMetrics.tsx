import React from "react";
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Compass,
  Thermometer,
  ShieldCheck,
} from "lucide-react";
import { getWindDirection } from "../utils/weatherCodes";
import type { WeatherCurrent, WeatherDaily, UvStatus, TempUnit } from "../types/weather";

interface DetailedMetricsProps {
  current: (WeatherCurrent & { dew_point_2m?: number; visibility?: number }) | null;
  daily: WeatherDaily | null | undefined;
  uvInfo: UvStatus | null;
  tempUnit: TempUnit;
  formatTemp: (celsius?: number | null, unit?: TempUnit) => string;
}

export default function DetailedMetrics({
  current,
  daily,
  uvInfo,
  tempUnit,
  formatTemp,
}: DetailedMetricsProps) {
  if (!current) return null;

  const humidity = current.relative_humidity_2m ?? 0;
  const dewPoint = current.dew_point_2m != null ? formatTemp(current.dew_point_2m, tempUnit) : "--";
  const windSpeed = Math.round(current.wind_speed_10m ?? 0);
  const windGusts = Math.round(current.wind_gusts_10m ?? 0);
  const windDeg = current.wind_direction_10m ?? 0;
  const windDir = getWindDirection(windDeg);
  const uvMax = daily?.uv_index_max?.[0] != null ? Math.round(daily.uv_index_max[0]) : 5;
  const visibilityKm = current.visibility != null ? (current.visibility / 1000).toFixed(1) : "10.0";
  const pressure = current.surface_pressure != null ? Math.round(current.surface_pressure) : 1012;

  return (
    <div className="lg:col-span-3 space-y-4">
      {/* Telemetry Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30 icon-glow-cyan shadow-xs">
            <Gauge className="w-4 h-4" />
          </div>
          <span>Atmospheric Radar & Live Telemetry</span>
        </h3>
        <span className="text-xs text-slate-600 dark:text-slate-400 font-bold">Real-time Sensor Feeds</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. Humidity & Dew Point */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Humidity
            </span>
            <div className="p-2 rounded-xl bg-sky-100 text-sky-600 border border-sky-300 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30 icon-glow-blue shadow-xs">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{humidity}</span>
            <span className="text-xl font-bold text-cyan-700 dark:text-cyan-400">%</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Dew Point</span>
            <strong className="text-slate-900 dark:text-slate-200 font-black">{dewPoint}</strong>
          </div>
        </div>

        {/* 2. Wind Velocity & Compass Direction */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Wind Velocity
            </span>
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30 icon-glow-cyan shadow-xs">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{windSpeed}</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">km/h</span>
            <span className="ml-auto text-xs font-black px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-950 border border-cyan-400 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30 flex items-center gap-1 shadow-xs">
              <Compass className="w-3 h-3" />
              {windDir} ({windDeg}°)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Peak Gusts</span>
            <strong className="text-slate-900 dark:text-slate-200 font-black">{windGusts} km/h</strong>
          </div>
        </div>

        {/* 3. UV Radiation Index */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              UV Radiation
            </span>
            <div className="p-2 rounded-xl bg-amber-100 text-amber-600 border border-amber-300 dark:bg-amber-500/15 dark:text-amber-500 dark:border-amber-500/30 icon-glow-amber shadow-xs">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{uvMax}</span>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md border shadow-xs ${
                uvInfo?.bg || "bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
              } ${uvInfo?.color || "text-amber-950 dark:text-amber-300"}`}
            >
              {uvInfo?.label || "Moderate"}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-400 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{uvInfo?.advice || "Wear sunglasses & sun lotion"}</span>
          </div>
        </div>

        {/* 4. Atmospheric Visibility */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Visibility
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 border border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-500 dark:border-emerald-500/30 icon-glow-emerald shadow-xs">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{visibilityKm}</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">km</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Clarity</span>
            <strong className="text-slate-900 dark:text-slate-200 font-black">
              {Number(visibilityKm) >= 10 ? "Clear Horizon" : "Light Haze"}
            </strong>
          </div>
        </div>

        {/* 5. Barometric Pressure */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Surface Pressure
            </span>
            <div className="p-2 rounded-xl bg-violet-100 text-violet-600 border border-violet-300 dark:bg-violet-500/15 dark:text-violet-500 dark:border-violet-500/30 icon-glow-violet shadow-xs">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{pressure}</span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">hPa</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Atmospheric State</span>
            <strong className="text-slate-900 dark:text-slate-200 font-black">
              {pressure > 1013 ? "High (Stable)" : "Normal / Low"}
            </strong>
          </div>
        </div>

        {/* 6. Thermal Index & Apparent Temp */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Thermal Index
            </span>
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 border border-rose-300 dark:bg-rose-500/15 dark:text-rose-500 dark:border-rose-500/30 icon-glow-rose shadow-xs">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {formatTemp(current.apparent_temperature, tempUnit)}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold">Perceived Comfort</span>
            <strong className="text-slate-900 dark:text-slate-200 font-black">
              {current.apparent_temperature > 30 ? "Warm / Humid" : "Comfortable"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
