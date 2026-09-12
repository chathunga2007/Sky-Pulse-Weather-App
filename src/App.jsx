import React, { useState, useEffect } from "react";
import { Search, MapPin, Wind, Droplets, Gauge, Sun, CloudRain, ShieldAlert } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getCityCoordinates, fetchComprehensiveWeather } from "./services/weatherApi";
import { getWeatherMeta } from "./utils/weatherCodes";

export default function App() {
  const [cityInput, setCityInput] = useState("");
  const [locationName, setLocationName] = useState("Colombo, Sri Lanka");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = async (lat, lon, label) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchComprehensiveWeather(lat, lon);
      setWeatherData(data);
      if (label) setLocationName(label);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude, "Your Current Location"),
        () => loadWeather(6.9271, 79.8612, "Colombo, Sri Lanka")
      );
    } else {
      loadWeather(6.9271, 79.8612, "Colombo, Sri Lanka");
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!cityInput.trim()) return;
    try {
      setLoading(true);
      const loc = await getCityCoordinates(cityInput);
      await loadWeather(loc.latitude, loc.longitude, `${loc.name}, ${loc.country}`);
      setCityInput("");
    } catch (err) {
      setError(err.message || "Location not found");
      setLoading(false);
    }
  };

  const current = weatherData?.current;
  const meta = current ? getWeatherMeta(current.weather_code) : null;

  const hourlyChartData = weatherData?.hourly?.time?.slice(0, 12).map((time, idx) => ({
    time: time.split("T")[1].slice(0, 5),
    temp: weatherData.hourly.temperature_2m[idx],
  })) || [];

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Neon Glow Ambient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl z-10 space-y-6">
        {/* Search Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold tracking-wide">
            <MapPin className="w-5 h-5 animate-pulse" />
            <span className="text-slate-200 text-lg">{locationName}</span>
          </div>
          <form onSubmit={handleSearch} className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search city..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-slate-950/60 border border-slate-700/60 text-sm focus:outline-none focus:border-cyan-400 transition placeholder:text-slate-500"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-cyan-400 transition">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </header>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="h-96 flex items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-3" />
            Synchronizing live radar data...
          </div>
        ) : (
          <>
            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Card */}
              <div className="md:col-span-2 bg-gradient-to-br from-slate-900/60 to-slate-950/60 border border-slate-800 p-8 rounded-3xl backdrop-blur-2xl relative overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-7xl font-extrabold tracking-tighter text-white">
                      {Math.round(current.temperature_2m)}°<span className="text-cyan-400 text-5xl">C</span>
                    </h1>
                    <p className="text-lg text-cyan-300/90 font-medium mt-1">{meta.label}</p>
                    <p className="text-xs text-slate-400 mt-1">Feels like {Math.round(current.apparent_temperature)}°C</p>
                  </div>
                  <div className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
                    <CloudRain className="w-12 h-12 text-cyan-400" />
                  </div>
                </div>

                {/* Hourly Micro-Graph */}
                <div className="h-32 w-full mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={hourlyChartData}>
                      <defs>
                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F2FE" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00F2FE" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" stroke="#475569" fontSize={11} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px" }} />
                      <Area type="monotone" dataKey="temp" stroke="#00F2FE" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Metrics Column */}
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-lg flex items-center gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400"><Wind className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium">Wind Speed</p>
                    <p className="text-xl font-bold">{current.wind_speed_10m} <span className="text-sm font-normal text-slate-400">km/h</span></p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-lg flex items-center gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Droplets className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium">Humidity</p>
                    <p className="text-xl font-bold">{current.relative_humidity_2m}%</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-lg flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400"><Sun className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium">Max UV Index</p>
                    <p className="text-xl font-bold">{weatherData?.daily?.uv_index_max[0] ?? "N/A"}</p>
                  </div>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl backdrop-blur-lg flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Gauge className="w-6 h-6" /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-medium">Pressure</p>
                    <p className="text-xl font-bold">{Math.round(current.surface_pressure)} <span className="text-sm font-normal text-slate-400">hPa</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* 7-Day Forecast Row */}
            <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-xl">
              <h3 className="text-sm font-semibold uppercase text-slate-400 mb-4 tracking-wider">7-Day Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {weatherData?.daily?.time?.map((date, idx) => (
                  <div key={date} className="bg-slate-950/40 border border-slate-800/50 p-4 rounded-xl flex flex-col items-center justify-between text-center">
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-sm font-semibold my-2 text-cyan-300">
                      {Math.round(weatherData.daily.temperature_2m_max[idx])}°
                    </span>
                    <span className="text-xs text-slate-500">
                      {Math.round(weatherData.daily.temperature_2m_min[idx])}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}