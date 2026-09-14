import React, { useState, useEffect, useRef } from "react";
import {
  Zap,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Timer,
  Info,
  Radio,
  Sparkles,
} from "lucide-react";

export default function LightningThreatPanel({
  current,
  hourly,
  currentCity,
}) {
  // Convective Available Potential Energy (CAPE in J/kg)
  const cape = current?.cape ?? 0;
  const weatherCode = current?.weather_code ?? 0;
  const windGusts = Math.round(current?.wind_gusts_10m ?? 0);

  // Derive Lightning Threat Level based on CAPE & Weather Code
  const getThreatData = (capeVal, code) => {
    const isThunderCode = code === 95 || code === 96 || code === 99;
    if (capeVal >= 2500 || code === 99) {
      return {
        level: "Extreme Danger",
        subLevel: "Severe Electrical Storm",
        score: 95,
        color: "text-rose-500",
        border: "border-rose-500/50",
        bg: "bg-rose-500/15",
        barColor: "from-amber-500 via-rose-500 to-red-600",
        advice: "Violent electrical storm potential. Stay strictly indoors, disconnect power lines, and avoid plumbing or open windows.",
        subAdvice: "High danger of cloud-to-ground strikes. Apply the 30/30 safety protocol immediately.",
        badge: "Severe Electrical Storm",
        orb: "rgba(244, 63, 94, 0.3)",
      };
    } else if (capeVal >= 1200 || isThunderCode) {
      return {
        level: "Elevated Risk",
        subLevel: "High Convective Instability",
        score: Math.min(85, Math.round(50 + (capeVal - 1200) / 40)),
        color: "text-amber-500",
        border: "border-amber-500/50",
        bg: "bg-amber-500/15",
        barColor: "from-yellow-400 via-amber-500 to-rose-500",
        advice: "Atmospheric instability is high. Frequent cloud-to-ground lightning is probable during convective downpours.",
        subAdvice: "Avoid tall trees, open bodies of water, and metallic fences in open fields.",
        badge: "High Strike Probability",
        orb: "rgba(245, 158, 11, 0.25)",
      };
    } else if (capeVal >= 400) {
      return {
        level: "Moderate Instability",
        subLevel: "Isolated Thunder Cells",
        score: Math.min(50, Math.round(20 + (capeVal - 400) / 30)),
        color: "text-cyan-500",
        border: "border-cyan-500/50",
        bg: "bg-cyan-500/15",
        barColor: "from-cyan-400 via-blue-500 to-amber-400",
        advice: "Isolated thunderclaps or brief convective showers possible in surrounding hill or coastal pockets.",
        subAdvice: "Atmospheric pressure is fluctuating. Monitor local radar for approaching storm cells.",
        badge: "Isolated Thunder Possible",
        orb: "rgba(6, 182, 212, 0.2)",
      };
    } else {
      return {
        level: "Low / Minimal Threat",
        subLevel: "Stable Atmospheric State",
        score: Math.max(5, Math.round((capeVal / 400) * 20)),
        color: "text-emerald-500",
        border: "border-emerald-500/50",
        bg: "bg-emerald-500/15",
        barColor: "from-emerald-400 to-teal-500",
        advice: "Atmospheric thermal profile is stable. Lightning strikes and convective severe storms are highly unlikely.",
        subAdvice: "Safe outdoor conditions with minimal risk of electrical discharges.",
        badge: "Atmosphere Stable",
        orb: "rgba(16, 185, 129, 0.15)",
      };
    }
  };

  const threat = getThreatData(cape, weatherCode);

  // ==== Flash-To-Bang Distance Stopwatch Logic ====
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const timerRef = useRef(null);

  const startFlashTimer = () => {
    setCalculatedDistance(null);
    setElapsedSeconds(0);
    setStopwatchActive(true);
  };

  useEffect(() => {
    if (stopwatchActive) {
      const startTimestamp = performance.now();
      timerRef.current = setInterval(() => {
        const diffSec = (performance.now() - startTimestamp) / 1000;
        setElapsedSeconds(diffSec);
      }, 50);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stopwatchActive]);

  const stopBangTimer = () => {
    if (!stopwatchActive) return;
    setStopwatchActive(false);
    // Speed of sound in air ≈ 343 m/s => distance in km = seconds * 0.343
    const km = elapsedSeconds * 0.343;
    const miles = km * 0.621371;
    setCalculatedDistance({
      km: km.toFixed(2),
      miles: miles.toFixed(2),
      seconds: elapsedSeconds.toFixed(1),
      danger: km < 10,
    });
  };

  // 24-hour CAPE trend extraction
  const nextHoursCape = hourly?.time
    ? hourly.time.slice(0, 12).map((t, idx) => ({
        time: t.split("T")[1].slice(0, 5),
        cape: hourly.cape?.[idx] ?? 0,
      }))
    : [];

  return (
    <div className="lg:col-span-3 glass-panel p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-xl space-y-6">
      {/* Background Ambience */}
      <div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full blur-[110px] pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: threat.orb }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-600 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30 icon-glow-amber shadow-xs animate-pulse">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Lightning Strike & Thunderstorm Telemetry
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 uppercase tracking-wider">
                Live Lightning Radar
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              CAPE Atmospheric Energy Index & Severe Convective Hazard Center for {currentCity?.name || "Local Region"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className={`text-xs font-black px-3.5 py-1.5 rounded-2xl border backdrop-blur-md flex items-center gap-1.5 shadow-sm ${threat.bg} ${threat.border} ${threat.color}`}
          >
            <Radio className="w-3.5 h-3.5 animate-ping" />
            <span>{threat.badge}</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Energy Gauge & Flash-to-Bang Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 z-10 relative">
        {/* Card 1: Atmospheric Instability Index (CAPE) */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-500" />
              CAPE Convective Energy
            </span>
            <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20">
              J / kg
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                {cape}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase">J/kg</span>
            </div>
            <div className="text-right">
              <div className={`text-sm font-black ${threat.color}`}>{threat.level}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {threat.subLevel}
              </div>
            </div>
          </div>

          {/* Dynamic Spectrum Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-slate-800 shadow-inner">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${threat.barColor} transition-all duration-1000`}
                style={{ width: `${Math.min(100, Math.max(8, threat.score))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-bold px-0.5">
              <span>0 (Stable)</span>
              <span>1,000 (Thunder)</span>
              <span>2,500+ (Severe)</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80">
            <div className="font-bold text-slate-900 dark:text-slate-100 mb-0.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span>Meteorological Analysis:</span>
            </div>
            <p>{threat.advice}</p>
            <p className="text-[11px] text-cyan-800 dark:text-cyan-300 font-semibold mt-1">
              {threat.subAdvice}
            </p>
          </div>
        </div>

        {/* Card 2: Interactive Flash-To-Bang Distance Tool */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-500" />
                Flash-to-Bang Distance Estimator
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-500/15 text-cyan-900 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
                Speed of Sound
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
              See a lightning flash? Tap below, then tap again when you hear thunder to compute exact strike distance.
            </p>
          </div>

          {/* Interactive Tap Actions */}
          <div className="my-2 flex flex-col items-center justify-center gap-3">
            {!stopwatchActive ? (
              <button
                type="button"
                onClick={startFlashTimer}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 transition cursor-pointer"
              >
                <Zap className="w-4 h-4 animate-bounce" />
                <span>Tap on Lightning Flash ⚡</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopBangTimer}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition cursor-pointer animate-pulse"
              >
                <Radio className="w-4 h-4 animate-spin" />
                <span>Tap on Thunder Boom! ({elapsedSeconds.toFixed(1)}s)</span>
              </button>
            )}

            {/* Result Display */}
            {calculatedDistance && (
              <div
                className={`w-full p-3 rounded-2xl border text-xs animate-fade-in ${
                  calculatedDistance.danger
                    ? "bg-rose-100 border-rose-300 text-rose-950 dark:bg-rose-500/20 dark:border-rose-500/40 dark:text-rose-200"
                    : "bg-emerald-100 border-emerald-300 text-emerald-950 dark:bg-emerald-500/20 dark:border-emerald-500/40 dark:text-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between font-black text-sm">
                  <span>Strike Distance:</span>
                  <span className="text-base font-black">
                    {calculatedDistance.km} km ({calculatedDistance.miles} miles)
                  </span>
                </div>
                <div className="text-[11px] font-semibold mt-1">
                  Time gap: {calculatedDistance.seconds} seconds
                </div>
                <div className="mt-1 font-bold text-[11px]">
                  {calculatedDistance.danger
                    ? "⚠️ DANGER: Inside the 10km strike perimeter! Move to safe indoor shelter immediately (30/30 Rule)."
                    : "✓ Safe distance (>10km away), but continue monitoring storm movement."}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 pt-1 border-t border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Rule: Sound travels ~1 km every 2.9 seconds (or 1 mile per 5 sec).</span>
          </div>
        </div>

        {/* Card 3: 30/30 Safety Protocols & Peak Gusts */}
        <div className="glass-card p-5 sm:p-6 rounded-3xl space-y-4 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Safety Protocols & Gusts
            </span>
            <span className="text-xs font-black text-slate-800 dark:text-slate-300">
              Peak: {windGusts} km/h
            </span>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2.5 text-xs text-slate-800 dark:text-slate-300 font-semibold">
            <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 mt-0.5">
                <Zap className="w-3 h-3" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold">
                  The 30/30 Lightning Rule
                </strong>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  If time between flash and thunder is &lt;30s, seek shelter. Stay indoors 30 mins after last thunder.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold">
                  Electronics Protection
                </strong>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Unplug routers, smart TVs and desktop computers to avoid destructive grid power surges.
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-white/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 flex items-start gap-2.5">
              <div className="p-1 rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400 mt-0.5">
                <Sparkles className="w-3 h-3" />
              </div>
              <div>
                <strong className="block text-slate-900 dark:text-white font-bold">
                  Open Field Hazards
                </strong>
                <span className="text-[11px] text-slate-600 dark:text-slate-400">
                  Never shelter under isolated trees, metal towers, open fields, or open water bodies.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly CAPE Trajectory Sparkline */}
      {nextHoursCape.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2 z-10 relative">
          <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-400 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" />
              Next 12-Hour Thunderstorm Instability Index (CAPE) Trajectory
            </span>
            <span className="text-[11px] text-slate-500">Horizontal scroll &rarr;</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
            {nextHoursCape.map((h, i) => {
              const isHigh = h.cape >= 1200;
              const isMod = h.cape >= 400 && h.cape < 1200;
              return (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-2xl border text-center min-w-[75px] shrink-0 transition-all ${
                    isHigh
                      ? "bg-amber-100 border-amber-300 dark:bg-amber-500/15 dark:border-amber-500/40 text-amber-950 dark:text-amber-200"
                      : isMod
                      ? "bg-sky-50 border-sky-200 dark:bg-slate-900/60 dark:border-slate-800 text-slate-800 dark:text-slate-300"
                      : "bg-emerald-50/60 border-emerald-200/60 dark:bg-slate-950/30 dark:border-slate-800/50 text-slate-700 dark:text-slate-400"
                  }`}
                >
                  <div className="text-[10px] font-black">{h.time}</div>
                  <div className="text-xs font-black mt-0.5">{h.cape}</div>
                  <div className="text-[9px] font-semibold opacity-80">J/kg</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
