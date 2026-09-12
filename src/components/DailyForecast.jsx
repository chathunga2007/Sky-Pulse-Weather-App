import React from "react";
import { Calendar, Droplets, ArrowUp, ArrowDown } from "lucide-react";
import { getWeatherMeta } from "../utils/weatherCodes";
import WeatherIcon from "./WeatherIcon";

export default function DailyForecast({ daily, tempUnit, formatTemp }) {
  if (!daily || !daily.time || daily.time.length === 0) return null;

  return (
    <div className="lg:col-span-3 glass-panel p-6 sm:p-7 rounded-3xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 icon-glow-cyan">
              <Calendar className="w-4 h-4" />
            </div>
            <span>7-Day Extended Forecast</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Weekly meteorological outlook and precipitation probabilities
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30 shadow-xs">
          7 Days
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
        {daily.time.slice(0, 7).map((dateStr, i) => {
          const code = daily.weather_code?.[i] ?? 0;
          const meta = getWeatherMeta(code, 1);
          const maxTemp = daily.temperature_2m_max?.[i];
          const minTemp = daily.temperature_2m_min?.[i];
          const rainProb = daily.precipitation_probability_max?.[i] ?? 0;

          const dateObj = new Date(dateStr);
          const dayName = i === 0 ? "Today" : dateObj.toLocaleDateString("en-US", { weekday: "short" });
          const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

          return (
            <div
              key={dateStr}
              className={`glass-card p-4 rounded-2xl flex flex-col items-center justify-between gap-3 text-center transition-all shadow-xs ${
                i === 0
                  ? "border-cyan-500/50 shadow-md shadow-cyan-500/15 bg-cyan-50/70 dark:bg-cyan-500/5 dark:border-cyan-400/40"
                  : ""
              }`}
            >
              <div>
                <span
                  className={`text-xs font-bold block ${
                    i === 0 ? "text-cyan-800 dark:text-cyan-300 font-extrabold" : "text-slate-900 dark:text-slate-200"
                  }`}
                >
                  {dayName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</span>
              </div>

              {/* Weather Icon with glowing backdrop */}
              <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 my-1 group-hover:scale-110 transition">
                <WeatherIcon name={meta.icon} className={`w-7 h-7 ${meta.color || "text-cyan-500 dark:text-cyan-400"}`} />
              </div>

              {/* Weather Description */}
              <div className="w-full">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 block truncate" title={meta.label}>
                  {meta.label}
                </span>
                {meta.subLabel && (
                  <span className="text-[10px] text-cyan-800 dark:text-cyan-400 font-semibold block truncate" title={meta.subLabel}>
                    {meta.subLabel}
                  </span>
                )}
              </div>

              {/* High / Low Temperature range */}
              <div className="w-full pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs px-1">
                <span className="text-rose-500 dark:text-rose-400 font-extrabold flex items-center gap-0.5">
                  <ArrowUp className="w-3 h-3" />
                  {formatTemp(maxTemp, tempUnit)}
                </span>
                <span className="text-cyan-700 dark:text-cyan-400 font-extrabold flex items-center gap-0.5">
                  <ArrowDown className="w-3 h-3" />
                  {formatTemp(minTemp, tempUnit)}
                </span>
              </div>

              {/* Rain Probability pill */}
              <div className="w-full flex items-center justify-center">
                {rainProb > 0 ? (
                  <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Droplets className="w-2.5 h-2.5 text-sky-600 dark:text-sky-400" />
                    {rainProb}%
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-medium">0% rain</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
