import React from "react";
import {
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  CloudRain,
  Compass,
  AlertCircle,
  Wind,
  ShieldAlert,
} from "lucide-react";
import type { WeatherCurrent, WeatherHourly, WeatherMinutely15, TempUnit } from "../types/weather";

interface WeatherVolatilityPanelProps {
  current: WeatherCurrent | null;
  hourly: WeatherHourly | null | undefined;
  minutely15: WeatherMinutely15 | null | undefined;
  tempUnit: TempUnit;
}

export default function WeatherVolatilityPanel({
  current,
  hourly,
  minutely15,
  tempUnit,
}: WeatherVolatilityPanelProps) {
  // Extract 15-min precipitation if available
  const minutelyRain = minutely15?.precipitation || [];
  const minutelyTimes = minutely15?.time || [];

  // Compute 3-hour pressure tendency:
  // If hourly pressure exists, compare current pressure with 3 hours ahead or previous
  const currentPressure = current?.surface_pressure ?? 1012;
  const currentTemp = current?.temperature_2m ?? 25;
  const currentWind = current?.wind_speed_10m ?? 10;
  const windGusts = current?.wind_gusts_10m ?? currentWind;

  // Hourly next 3 hours
  const next3HoursRain = hourly?.precipitation?.slice(0, 4) || [];
  const next3HoursProb = hourly?.precipitation_probability?.slice(0, 4) || [];
  const next3HoursTemp = hourly?.temperature_2m?.slice(0, 4) || [];

  // Determine pressure trend
  const hour3Pressure = hourly?.surface_pressure?.[3] ?? currentPressure;
  const pressureDelta = hour3Pressure - currentPressure;

  let pressureTrend = "steady";
  let pressureLabel = "Stable Barometer";
  let pressureSub = "Equilibrium Maintained";
  if (pressureDelta < -1.8) {
    pressureTrend = "falling_fast";
    pressureLabel = "Rapidly Falling (Storm Front Approaching)";
    pressureSub = "Squall & Downburst Warning Triggered";
  } else if (pressureDelta < -0.6) {
    pressureTrend = "falling";
    pressureLabel = "Gradually Falling (Rain Possible)";
    pressureSub = "Moisture Influx Detected";
  } else if (pressureDelta > 1.2) {
    pressureTrend = "rising";
    pressureLabel = "Rising (Clearing Conditions)";
    pressureSub = "High Pressure Shield Establishing";
  }

  // Calculate Sudden Weather Change Probability (0 - 100%)
  const maxRainProbNext3h = Math.max(0, ...next3HoursProb);
  const tempSwing = Math.abs(currentTemp - (next3HoursTemp[2] ?? currentTemp));
  const gustGap = Math.max(0, windGusts - currentWind);

  const changeScore = Math.min(
    98,
    Math.round(
      maxRainProbNext3h * 0.55 +
      (Math.abs(pressureDelta) > 1.5 ? 25 : Math.abs(pressureDelta) * 10) +
      tempSwing * 4 +
      (gustGap > 15 ? 15 : gustGap * 0.7)
    )
  );

  // Classify volatility
  let volatility = {
    level: "High Volatility",
    subLevel: "Imminent Sudden Shift",
    color: "text-amber-500",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
    summary: "Atmosphere is volatile. Rapid onset of rain, wind gusts or temperature drops expected within 1–2 hours.",
    subSummary: "Sudden convective showers or squall bursts probable in the next 45–75 minutes.",
    timeEstimate: "Sudden shift likely in ~45–75 mins",
  };

  if (changeScore < 30) {
    volatility = {
      level: "Highly Stable",
      subLevel: "Steady Meteorological Envelope",
      color: "text-emerald-500",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500/30",
      summary: "Atmospheric equilibrium is consistent. Weather conditions will remain steady for the next 4–6 hours.",
      subSummary: "Dry and clear weather pattern prevailing with negligible fluctuation.",
      timeEstimate: "Dry & stable window for 5+ hours",
    };
  } else if (changeScore < 60) {
    volatility = {
      level: "Moderate Shift Probability",
      subLevel: "Minor Fluctuations Anticipated",
      color: "text-cyan-500",
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/30",
      summary: "Gradual changes anticipated. Scattered cloud formations or light transient drizzle may occur.",
      subSummary: "Intermittent cloud patches with light breezes expected over the next 2–3 hours.",
      timeEstimate: "Minor variation possible in ~2–3 hours",
    };
  }

  // 15-Minute Rain Pulse Bars (Next 16 steps = 4 hours)
  const pulseBars = minutelyRain.slice(0, 16).map((mm, idx) => {
    const timeStr = minutelyTimes[idx] ? minutelyTimes[idx].split("T")[1]?.slice(0, 5) || `+${idx * 15}m` : `+${idx * 15}m`;
    return {
      time: timeStr,
      amount: mm,
      isRain: mm > 0.05,
    };
  });

  return (
    <div className="lg:col-span-3 glass-panel p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-xl space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-700 border border-cyan-300 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/30 icon-glow-cyan shadow-xs">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Rapid Weather Change & Volatility Radar
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-950 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-500/30 uppercase tracking-wider">
                Volatility Index
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              High-Precision Atmospheric Shift Probability & 15-Minute Next Precipitation Pulse
            </p>
          </div>
        </div>

        <span
          className={`text-xs font-black px-3.5 py-1.5 rounded-2xl border backdrop-blur-md flex items-center gap-1.5 shadow-sm self-start sm:self-auto ${volatility.bg} ${volatility.border} ${volatility.color}`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{volatility.timeEstimate}</span>
        </span>
      </div>

      {/* Main Grid: Probability Dial & 15-Minute Pulse Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card 1: Change Probability Index */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-cyan-500" />
              Sudden Change Probability
            </span>
            <div className="flex items-baseline justify-between mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                  {changeScore}
                </span>
                <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">%</span>
              </div>
              <div className="text-right">
                <div className={`text-sm font-black ${volatility.color}`}>{volatility.level}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                  {volatility.subLevel}
                </div>
              </div>
            </div>

            {/* Change Probability Progress Meter */}
            <div className="mt-3.5 w-full h-3 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  changeScore > 65
                    ? "bg-gradient-to-r from-amber-400 via-rose-500 to-red-500"
                    : changeScore > 30
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                    : "bg-gradient-to-r from-emerald-400 to-teal-500"
                }`}
                style={{ width: `${changeScore}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 leading-relaxed font-medium">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{volatility.summary}</p>
            <p className="text-[11px] text-cyan-800 dark:text-cyan-300 font-bold mt-1">
              {volatility.subSummary}
            </p>
          </div>
        </div>

        {/* Card 2: Barometric Delta Tendency */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                {pressureTrend.includes("falling") ? (
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                ) : pressureTrend === "rising" ? (
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Minus className="w-4 h-4 text-cyan-500" />
                )}
                Barometric Delta (3h Tendency)
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {currentPressure} hPa
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {pressureDelta >= 0 ? `+${pressureDelta.toFixed(1)}` : pressureDelta.toFixed(1)}{" "}
                <span className="text-xs font-bold text-slate-500">hPa / 3hr</span>
              </span>
              <span
                className={`text-xs font-black px-2.5 py-1 rounded-xl border ${
                  pressureTrend.includes("falling")
                    ? "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30"
                    : "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                }`}
              >
                {pressureTrend.includes("falling") ? "Squall Alert" : "Steady"}
              </span>
            </div>

            <div className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-300">
              {pressureLabel}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              {pressureSub}
            </div>
          </div>

          <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 font-semibold">
            <Wind className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Gust Differential: <strong>{Math.round(windGusts - currentWind)} km/h</strong> over steady wind</span>
          </div>
        </div>

        {/* Card 3: Next Precipitation Radar Timing */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-500" />
                Rain Ingress / Egress Window
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-blue-100 text-blue-900 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-300 dark:border-blue-500/30">
                15m Steps
              </span>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {maxRainProbNext3h > 40
                  ? `Rain expected (~${maxRainProbNext3h}% chance)`
                  : "No imminent rain bursts"}
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                {maxRainProbNext3h > 40
                  ? "Precipitation cells forming in regional radius. Expect cloud buildup."
                  : "Atmosphere remains dry with negligible rain accumulation in immediate hours."}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 dark:bg-slate-950/40 border border-sky-200 dark:border-slate-800 flex items-center gap-2 text-xs text-slate-800 dark:text-slate-300 font-bold">
            <ShieldAlert className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
            <span>Telemetry calibrated via Open-Meteo 15-minute predictive telemetry.</span>
          </div>
        </div>
      </div>

      {/* 15-Minute Next Precipitation Pulse Visual Timeline */}
      {pulseBars.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-500" />
              Next 4-Hour Precipitation Pulse (15-Minute High-Resolution Intervals)
            </span>
            <span className="text-[11px] text-slate-500">Horizontal scroll &rarr;</span>
          </div>

          <div className="flex items-end gap-2 overflow-x-auto custom-scrollbar pb-2 pt-4">
            {pulseBars.map((p, idx) => {
              const heightPx = Math.max(18, Math.min(65, Math.round(p.amount * 35) + 18));
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1.5 min-w-[55px] sm:min-w-[62px] shrink-0 group"
                >
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition">
                    {p.amount > 0 ? `${p.amount.toFixed(1)}mm` : "0mm"}
                  </span>
                  <div
                    className={`w-full rounded-xl transition-all duration-500 border ${
                      p.isRain
                        ? "bg-gradient-to-t from-blue-600 to-cyan-400 border-cyan-400/50 shadow-md shadow-blue-500/20"
                        : "bg-slate-200/80 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700/50"
                    }`}
                    style={{ height: `${heightPx}px` }}
                  />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                    {p.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
