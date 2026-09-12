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

export default function DetailedMetrics({ current, daily, uvInfo, tempUnit, formatTemp }) {
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
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 icon-glow-cyan">
            <Gauge className="w-4 h-4" />
          </div>
          <span>Atmospheric Radar & Live Telemetry</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time Sensor Feeds</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. Humidity & Dew Point */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Humidity
            </span>
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30 icon-glow-blue">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{humidity}</span>
            <span className="text-xl font-light text-cyan-600 dark:text-cyan-400">%</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Dew Point</span>
            <strong className="text-slate-900 dark:text-slate-200 font-bold">{dewPoint}</strong>
          </div>
        </div>

        {/* 2. Wind Velocity & Compass Direction */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Wind Velocity
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 icon-glow-cyan">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{windSpeed}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">km/h</span>
            <span className="ml-auto text-xs font-bold px-2.5 py-0.5 rounded-md bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30 flex items-center gap-1">
              <Compass className="w-3 h-3" />
              {windDir} ({windDeg}°)
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Peak Gusts</span>
            <strong className="text-slate-900 dark:text-slate-200 font-bold">{windGusts} km/h</strong>
          </div>
        </div>

        {/* 3. UV Radiation Index */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              UV Radiation
            </span>
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30 icon-glow-amber">
              <Sun className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{uvMax}</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${
                uvInfo?.bg || "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30"
              } ${uvInfo?.color || "text-amber-800 dark:text-amber-300"}`}
            >
              {uvInfo?.label || "Moderate"}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{uvInfo?.advice || "Wear sunglasses & sun lotion"}</span>
          </div>
        </div>

        {/* 4. Atmospheric Visibility */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Visibility
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 icon-glow-emerald">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{visibilityKm}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">km</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Clarity</span>
            <strong className="text-slate-900 dark:text-slate-200 font-bold">
              {Number(visibilityKm) >= 10 ? "Clear Horizon" : "Light Haze"}
            </strong>
          </div>
        </div>

        {/* 5. Barometric Pressure */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Surface Pressure
            </span>
            <div className="p-2 rounded-xl bg-violet-500/15 text-violet-500 border border-violet-500/30 icon-glow-violet">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">{pressure}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">hPa</span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Atmospheric State</span>
            <strong className="text-slate-900 dark:text-slate-200 font-bold">
              {pressure > 1013 ? "High (Stable)" : "Normal / Low"}
            </strong>
          </div>
        </div>

        {/* 6. Thermal Index & Apparent Temp */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Thermal Index
            </span>
            <div className="p-2 rounded-xl bg-rose-500/15 text-rose-500 border border-rose-500/30 icon-glow-rose">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-900 dark:text-white">
              {formatTemp(current.apparent_temperature, tempUnit)}
            </span>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Perceived Comfort</span>
            <strong className="text-slate-900 dark:text-slate-200 font-bold">
              {current.apparent_temperature > 30 ? "Warm / Humid" : "Comfortable"}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
