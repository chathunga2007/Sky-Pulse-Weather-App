import React, { useState } from "react";
import {
  Sparkles,
  Bot,
  Zap,
  Car,
  Shirt,
  Activity,
  Plane,
  Eye,
  Sliders,
} from "lucide-react";
import type { WeatherCurrent, WeatherDaily, AirQualityCurrent, TempUnit } from "../types/weather";

interface AiMeteorologistPanelProps {
  current: WeatherCurrent | null;
  daily: WeatherDaily | null | undefined;
  airQuality: AirQualityCurrent | null;
  currentCity: { name: string; country?: string } | null;
  tempUnit: TempUnit;
  formatTemp: (celsius?: number | null, unit?: TempUnit) => string;
}

export default function AiMeteorologistPanel({
  current,
  daily,
  airQuality,
  currentCity,
  tempUnit,
  formatTemp,
}: AiMeteorologistPanelProps) {
  const [briefMode, setBriefMode] = useState<"detailed" | "concise">("detailed");

  if (!current) return null;

  const temp = current.temperature_2m ?? 26;
  const feelsLike = current.apparent_temperature ?? temp;
  const humidity = current.relative_humidity_2m ?? 65;
  const windSpeed = current.wind_speed_10m ?? 12;
  const windGusts = current.wind_gusts_10m ?? windSpeed;
  const uvMax = daily?.uv_index_max?.[0] ?? 6;
  const aqi = airQuality?.us_aqi ?? 35;
  const cape = current.cape ?? 0;
  const rain = current.precipitation ?? 0;
  const cloudCover = current.cloud_cover ?? 30;
  const isDay = current.is_day === 1;

  // ==== 6 Activity Evaluations ====

  // 1. Outdoor Sports & Lightning Safety
  let sportsScore = 90;
  let sportsStatus = "Optimal Conditions";
  let sportsAdvice = "Calm atmospheric profile. Ideal for outdoor training, football, running, or cricket.";
  let sportsBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (cape > 1500 || current.weather_code >= 95) {
    sportsScore = 15;
    sportsStatus = "Severe Lightning Hazard";
    sportsAdvice = "Extreme electrical strike danger! Immediately suspend all outdoor field sports and seek shelter.";
    sportsBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  } else if (rain > 1 || cape > 700) {
    sportsScore = 45;
    sportsStatus = "Caution: Slippery & Wet";
    sportsAdvice = "Wet ground surfaces and scattered convective rain bursts expected in surrounding radius.";
    sportsBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  }

  // 2. Driving & Commuting
  let driveScore = 88;
  let driveStatus = "Clear Highway Conditions";
  let driveAdvice = "High visibility and dry asphalt. Standard braking response.";
  let driveBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (rain > 2 || windGusts > 45) {
    driveScore = 35;
    driveStatus = "Severe Hydroplaning Risk";
    driveAdvice = "Standing water pooling on tarmac. Double your following distance and activate fog lights.";
    driveBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  } else if (rain > 0.2 || windGusts > 28) {
    driveScore = 65;
    driveStatus = "Moderate Dampness";
    driveAdvice = "Damp surface grip. Exercise gentle cornering and reduce cruising speed.";
    driveBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  }

  // 3. Laundry Drying
  let laundryScore = 85;
  let laundryStatus = "Fast Drying (<2h)";
  let laundryAdvice = "Moderate breeze and solar radiation ensure speedy natural evaporation outdoors.";
  let laundryBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (rain > 0.1 || humidity > 85) {
    laundryScore = 15;
    laundryStatus = "Unsuitable (Dry Indoors)";
    laundryAdvice = "High ambient moisture saturation and rainfall will prevent clothes from drying.";
    laundryBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  } else if (humidity > 70 || cloudCover > 70) {
    laundryScore = 55;
    laundryStatus = "Slow Drying (~4-5h)";
    laundryAdvice = "Elevated humidity requires prolonged exposure. Consider sheltered drying racks.";
    laundryBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  }

  // 4. Running & Outdoor Fitness
  let runScore = 80;
  let runStatus = "Great Workout Window";
  let runAdvice = "Comfortable thermal comfort level and clean breathable ambient air quality.";
  let runBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (feelsLike > 34 || aqi > 100) {
    runScore = 30;
    runStatus = "Heat & Air Stress";
    runAdvice = "Elevated heat index. Shift cardio workouts to early morning or climate-controlled gyms.";
    runBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  } else if (rain > 1 || cape > 1500) {
    runScore = 20;
    runStatus = "Postpone Outdoor Runs";
    runAdvice = "Downpours and electrical storm frequency make road running dangerous.";
    runBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  }

  // 5. Drone & UAV Flight Safety
  let droneScore = 90;
  let droneStatus = "Safe Flight Envelope";
  let droneAdvice = "Minimal wind resistance and stable aerodynamic ceiling.";
  let droneBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (windGusts > 35 || rain > 0.1 || cape > 1200) {
    droneScore = 20;
    droneStatus = "Grounded / Hazardous";
    droneAdvice = "Turbulent shear gusts and moisture risk motor failure or GPS drift.";
    droneBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  } else if (windGusts > 25) {
    droneScore = 60;
    droneStatus = "Moderate Gust Turbulence";
    droneAdvice = "Watch for altitude drift near high structures and coastline edges.";
    droneBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  }

  // 6. Astronomy & Sky Sight
  let astroScore = 85;
  let astroStatus = isDay ? "High Solar Clarity" : "Crystal Night Skies";
  let astroAdvice = "Low atmospheric opacity enables sharp deep-sky or solar observation.";
  let astroBadge = "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30";

  if (cloudCover > 70 || rain > 0) {
    astroScore = 20;
    astroStatus = "Heavily Overcast";
    astroAdvice = "Dense cloud ceiling completely obscures celestial bodies.";
    astroBadge = "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30";
  } else if (cloudCover > 40) {
    astroScore = 55;
    astroStatus = "Partly Cloudy";
    astroAdvice = "Intermittent celestial viewing windows between passing cloud formations.";
    astroBadge = "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30";
  }

  // Executive AI Narrative Synthesis
  const generateNarrative = () => {
    let summary = `Live Atmospheric Diagnostic for ${currentCity?.name || "Local Target Area"}: Current temperature is ${formatTemp(temp, tempUnit)} (perceived feels-like ${formatTemp(feelsLike, tempUnit)}). `;
    if (cape > 1500) {
      summary += `Convective Instability Energy (CAPE ${cape} J/kg) indicates elevated thunderstorm and lightning hazard. Disconnect sensitive power lines and remain indoors during rain squalls. `;
    } else if (rain > 0) {
      summary += `Active rainfall recorded (${rain} mm). Ambient relative humidity is sitting at ${humidity}%. `;
    } else {
      summary += `Atmosphere is well-balanced with ${humidity}% humidity and ${windSpeed} km/h wind flow. `;
    }
    summary += `Air Quality Index is ${aqi} (US EPA standard), and peak UV index registers at ${uvMax}.`;
    return summary;
  };

  const narrative = generateNarrative();

  return (
    <div className="lg:col-span-3 glass-panel p-5 sm:p-7 rounded-3xl relative overflow-hidden shadow-xl space-y-6">
      {/* Glow background */}
      <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                SkyPulse AI Meteorologist & Life Advisor
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Active Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Context-Aware Weather Diagnostic & Multi-Domain Outdoor Activity Matrix
            </p>
          </div>
        </div>

        {/* Diagnostic Mode Toggle */}
        <div className="glass-pill p-1 rounded-2xl flex items-center self-start sm:self-auto shadow-xs border border-slate-300 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setBriefMode("detailed")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              briefMode === "detailed"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Detailed Diagnostic</span>
          </button>
          <button
            type="button"
            onClick={() => setBriefMode("concise")}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              briefMode === "concise"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
            }`}
          >
            Summary
          </button>
        </div>
      </div>

      {/* AI Synthesis Briefing Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 shadow-sm relative z-10">
        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          <span>Real-time Atmospheric Synthesis</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
          {narrative}
        </p>
      </div>

      {/* 6 Outdoor Activity Readiness Matrix */}
      <div className="space-y-3 relative z-10">
        <div className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
          Outdoor Activity Readiness Matrix
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Sports & Outdoors */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Outdoor Sports & Field
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${sportsBadge}`}>
                {sportsStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${sportsScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{sportsScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {sportsAdvice}
            </p>
          </div>

          {/* 2. Driving */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-blue-500" />
                Driving & Commuting
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${driveBadge}`}>
                {driveStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${driveScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{driveScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {driveAdvice}
            </p>
          </div>

          {/* 3. Laundry */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Shirt className="w-4 h-4 text-cyan-500" />
                Laundry Drying
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${laundryBadge}`}>
                {laundryStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${laundryScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{laundryScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {laundryAdvice}
            </p>
          </div>

          {/* 4. Running & Workout */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-500" />
                Running & Jogging
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${runBadge}`}>
                {runStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${runScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{runScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {runAdvice}
            </p>
          </div>

          {/* 5. Drone Flight */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Plane className="w-4 h-4 text-purple-500" />
                Drone & UAV Flight
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${droneBadge}`}>
                {droneStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${droneScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{droneScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {droneAdvice}
            </p>
          </div>

          {/* 6. Astronomy */}
          <div className="glass-card p-4 rounded-2xl space-y-2.5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-500" />
                Astronomy / Sky Sight
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${astroBadge}`}>
                {astroStatus}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${astroScore}%` }} />
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{astroScore}%</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-snug">
              {astroAdvice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
