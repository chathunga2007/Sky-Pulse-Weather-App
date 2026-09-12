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
          stroke: "#38bdf8",
          fill: "url(#rainGrad)",
          label: "Precipitation Probability",
          icon: Droplets,
        };
      case "wind":
        return {
          dataKey: "windSpd",
          unit: " km/h",
          stroke: "#a855f7",
          fill: "url(#windGrad)",
          label: "Wind Speed",
          icon: Wind,
        };
      case "temp":
      default:
        return {
          dataKey: "temp",
          unit: `°${tempUnit}`,
          stroke: "#06b6d4",
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
          <div className="text-slate-400 font-semibold">{p.fullTime?.replace("T", " ")}</div>
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <span className="text-cyan-400">{config.label}:</span>
            <span>
              {payload[0].value}
              {config.unit}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-0.5">
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
    <div className="lg:col-span-3 glass-panel p-6 sm:p-7 rounded-3xl space-y-6">
      {/* Header with Tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 icon-glow-cyan">
              <Clock className="w-4 h-4" />
            </div>
            <span>24-Hour Predictive Telemetry</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic hourly graph tracking temperature, rain probability & wind velocity
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="glass-pill p-1 rounded-2xl flex items-center self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("temp")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "temp"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Temperature
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rain")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "rain"
                ? "bg-gradient-to-r from-blue-500 to-sky-600 text-white shadow-md shadow-blue-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Rain Chance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("wind")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "wind"
                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
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
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
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
              activeDot={{ r: 6, fill: config.stroke, stroke: "#040711", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hour-by-Hour Horizontal Cards Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Hourly Snapshot</span>
          <span>Swipe or scroll horizontally &rarr;</span>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 pt-1">
          {data.map((item, idx) => (
            <div
              key={`${item.fullTime}-${idx}`}
              className="glass-card p-3 rounded-2xl min-w-[85px] sm:min-w-[95px] flex flex-col items-center justify-between gap-2 shrink-0 group hover:border-cyan-400/50"
            >
              <span className="text-[11px] font-bold text-slate-400 group-hover:text-cyan-300 transition">
                {item.time}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                <WeatherIcon name={item.icon} className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              </div>
              <span className="text-sm font-black text-white">
                {item.temp}°{tempUnit}
              </span>
              {item.rainProb > 0 ? (
                <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  {item.rainProb}%
                </span>
              ) : (
                <span className="text-[10px] text-slate-500">0% rain</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
