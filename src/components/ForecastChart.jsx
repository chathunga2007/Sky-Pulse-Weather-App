import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock, Thermometer, Droplets, Wind } from "lucide-react";
import WeatherIcon from "./WeatherIcon";

export default function ForecastChart({
  data,
  activeTab,
  setActiveTab,
  tempUnit,
}) {
  if (!data || data.length === 0) return null;

  const getTabConfig = () => {
    switch (activeTab) {
      case "rain":
        return {
          dataKey: "rainProb",
          unit: "%",
          stroke: "#0284c7",
          fill: "url(#rainGrad)",
          label: "Precipitation Probability",
          icon: Droplets,
        };
      case "wind":
        return {
          dataKey: "windSpd",
          unit: " km/h",
          stroke: "#7c3aed",
          fill: "url(#windGrad)",
          label: "Wind Speed",
          icon: Wind,
        };
      case "temp":
      default:
        return {
          dataKey: "temp",
          unit: `°${tempUnit}`,
          stroke: "#0891b2",
          fill: "url(#tempGrad)",
          label: "Temperature Curve",
          icon: Thermometer,
        };
    }
  };

  const config = getTabConfig();

  // Custom Glass Tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="glass-panel px-3.5 py-2.5 rounded-xl border border-cyan-500/40 shadow-xl backdrop-blur-xl text-xs space-y-1">
          <div className="text-slate-600 dark:text-slate-400 font-bold">{p.fullTime?.replace("T", " ")}</div>
          <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-sm">
            <span className="text-cyan-700 dark:text-cyan-400">{config.label}:</span>
            <span>
              {payload[0].value}
              {config.unit}
            </span>
          </div>
          <div className="text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2 pt-0.5 font-bold">
            <span>Rain: {p.rainProb}%</span>
            <span>•</span>
            <span>Wind: {p.windSpd} km/h</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="lg:col-span-3 glass-panel p-5 sm:p-7 rounded-3xl space-y-6 shadow-lg">
      {/* Header with Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 border border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30 icon-glow-cyan shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <span>24-Hour Predictive Telemetry</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
            Dynamic hourly graph tracking temperature, rain probability & wind velocity
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="glass-pill p-1 rounded-2xl flex items-center self-start sm:self-auto shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("temp")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "temp"
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rain")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "rain"
                ? "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Rain Chance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wind")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "wind"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-200"
            }`}
          >
            Wind Speed
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-56 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={config.dataKey}
              stroke={config.stroke}
              strokeWidth={3}
              fill={config.fill}
              dot={false}
              activeDot={{ r: 6, fill: config.stroke, stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hour-by-Hour Horizontal Cards Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-800 dark:text-slate-400 font-black px-1">
          <span>Hourly Snapshot</span>
          <span className="font-semibold text-slate-500">Swipe or scroll horizontally &rarr;</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1">
          {data.map((item, idx) => (
            <div
              key={`${item.fullTime}-${idx}`}
              className="glass-card p-3 rounded-2xl min-w-[85px] sm:min-w-[95px] flex flex-col items-center justify-between gap-2 shrink-0 group hover:border-cyan-500 shadow-xs"
            >
              <span className="text-[11px] font-black text-slate-800 dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition">
                {item.time}
              </span>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 dark:bg-slate-900/60 dark:border-slate-800">
                <WeatherIcon name={item.icon} className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition" />
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {item.temp}°{tempUnit}
              </span>
              {item.rainProb > 0 ? (
                <span className="text-[10px] font-black text-sky-900 dark:text-sky-300 bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-500/30 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  {item.rainProb}%
                </span>
              ) : (
                <span className="text-[10px] text-slate-500 font-bold">0% rain</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
