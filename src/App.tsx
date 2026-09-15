import React, { useState, useEffect } from "react";
import { AlertCircle, Cloud, Zap } from "lucide-react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CityChips from "./components/CityChips";
import HeroCard from "./components/HeroCard";
import AirQualityPanel from "./components/AirQualityPanel";
import ForecastChart from "./components/ForecastChart";
import DetailedMetrics from "./components/DetailedMetrics";
import DailyForecast from "./components/DailyForecast";
import LightningThreatPanel from "./components/LightningThreatPanel";
import WeatherVolatilityPanel from "./components/WeatherVolatilityPanel";
import AiMeteorologistPanel from "./components/AiMeteorologistPanel";
import RadarMapPanel from "./components/RadarMapPanel";
import AmbientSoundscape from "./components/AmbientSoundscape";
import LiveWeatherCanvas from "./components/LiveWeatherCanvas";
import MobileNav from "./components/MobileNav";
import Footer from "./components/Footer";
import {
  fetchComprehensiveWeather,
  fetchAirQuality,
  reverseGeocode,
  searchCities,
} from "./services/weatherApi";
import {
  getWeatherMeta,
  getAqiStatus,
  getUvStatus,
  formatTemp,
} from "./utils/weatherCodes";
import type {
  CityItem,
  WeatherForecastResponse,
  AirQualityCurrent,
  TempUnit,
  ChartTab,
} from "./types/weather";
import type { HotspotCity } from "./components/CityChips";
import type { HourlyChartItem } from "./components/ForecastChart";
import "./index.css";

const POPULAR_CITIES: HotspotCity[] = [
  { name: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
  { name: "Kandy", country: "Sri Lanka", lat: 7.2906, lon: 80.6337 },
  { name: "Galle", country: "Sri Lanka", lat: 6.0535, lon: 80.221 },
  { name: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
  { name: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708 },
  { name: "Paris", country: "France", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093 },
  { name: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198 },
];

export default function App() {
  // ==== Search States ====
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CityItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  // ==== City & Weather States ====
  const [currentCity, setCurrentCity] = useState<{
    name: string;
    country: string;
    lat: number;
    lon: number;
  }>({
    name: "Colombo",
    country: "Sri Lanka",
    lat: 6.9271,
    lon: 79.8612,
  });

  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityCurrent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [locating, setLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ==== Preferences ====
  const [tempUnit, setTempUnit] = useState<TempUnit>("C");
  const [activeChartTab, setActiveChartTab] = useState<ChartTab>("temp");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [dismissSevereAlert, setDismissSevereAlert] = useState<boolean>(false);
  const [fxEnabled, setFxEnabled] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("skyPulseDarkMode");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Mobile navigation scroll handler
  const handleSelectMobileSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Clock Ticker
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Dark Mode Sync
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem("skyPulseDarkMode", JSON.stringify(darkMode));
    } catch (e) {
      console.warn("Storage not available:", e);
    }
  }, [darkMode]);

  // Load weather and AQI
  const loadWeatherData = async (
    lat: number,
    lon: number,
    cityName?: string,
    countryName?: string,
    isRefresh: boolean = false
  ) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const [weather, aqi] = await Promise.all([
        fetchComprehensiveWeather(lat, lon),
        fetchAirQuality(lat, lon),
      ]);

      setWeatherData(weather);
      setAirQuality(aqi);

      if (cityName) {
        setCurrentCity({
          name: cityName,
          country: countryName || "",
          lat,
          lon,
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please check network connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLocating(false);
    }
  };

  // Initial Load on mount
  useEffect(() => {
    let ignore = false;
    const init = async () => {
      try {
        const [weather, aqi] = await Promise.all([
          fetchComprehensiveWeather(currentCity.lat, currentCity.lon),
          fetchAirQuality(currentCity.lat, currentCity.lon),
        ]);
        if (!ignore) {
          setWeatherData(weather);
          setAirQuality(aqi);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (!ignore) {
          setError("Failed to initialize telemetry. Please refresh.");
          setLoading(false);
        }
      }
    };
    init();
    return () => {
      ignore = true;
    };
  }, []);

  // Select city handler
  const handleSelectCity = (item: CityItem) => {
    setQuery("");
    setSuggestions([]);
    setShowDropdown(false);
    loadWeatherData(
      item.latitude,
      item.longitude,
      item.name,
      item.country ? `${item.admin1 ? item.admin1 + ", " : ""}${item.country}` : item.admin1
    );
  };

  // Search submit handler
  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (suggestions.length > 0) {
      handleSelectCity(suggestions[0]);
    } else {
      setIsSearching(true);
      const results = await searchCities(query);
      setIsSearching(false);
      if (results.length > 0) {
        handleSelectCity(results[0]);
      } else {
        setError(`City "${query}" could not be located. Try another city.`);
      }
    }
  };

  // Current GPS location trigger
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const placeName = await reverseGeocode(latitude, longitude);
        await loadWeatherData(latitude, longitude, placeName, "Live GPS Location");
      },
      (geoErr) => {
        console.warn("Geolocation denied or error:", geoErr);
        setLocating(false);
        setError("Unable to retrieve location. Please check browser permissions.");
      },
      { timeout: 10000 }
    );
  };

  // Refresh current city
  const handleRefresh = () => {
    loadWeatherData(
      currentCity.lat,
      currentCity.lon,
      currentCity.name,
      currentCity.country,
      true
    );
  };

  // ==== Derived Data ====
  const current = weatherData?.current || null;
  const daily = weatherData?.daily;
  const hourly = weatherData?.hourly;

  const meta = current
    ? getWeatherMeta(current.weather_code, current.is_day)
    : getWeatherMeta(0, 1);

  const aqiInfo = airQuality ? getAqiStatus(airQuality.us_aqi) : null;
  const uvInfo = daily?.uv_index_max?.[0] != null ? getUvStatus(daily.uv_index_max[0]) : null;

  // Next 24 hours array for chart and hourly strip
  const currentHourTime = current?.time ? current.time.slice(0, 13) : "";
  let startIndex = 0;
  if (hourly?.time && currentHourTime) {
    const foundIdx = hourly.time.findIndex((t) => t.startsWith(currentHourTime));
    if (foundIdx !== -1) startIndex = foundIdx;
  }

  const next24Hours: HourlyChartItem[] = hourly?.time
    ? hourly.time.slice(startIndex, startIndex + 24).map((timeStr, i) => {
        const actualIdx = startIndex + i;
        const rawTemp = hourly.temperature_2m[actualIdx] ?? 0;
        const displayTemp =
          tempUnit === "F" ? Math.round((rawTemp * 9) / 5 + 32) : Math.round(rawTemp);
        const rainProb = hourly.precipitation_probability?.[actualIdx] ?? 0;
        const windSpd = Math.round(hourly.wind_speed_10m?.[actualIdx] ?? 0);
        const code = hourly.weather_code?.[actualIdx] ?? 0;
        const hourMeta = getWeatherMeta(code, 1);
        const timeFormatted = timeStr.split("T")[1]?.slice(0, 5) || timeStr;

        return {
          time: timeFormatted,
          fullTime: timeStr,
          temp: displayTemp,
          rainProb,
          windSpd,
          weatherCode: code,
          icon: hourMeta.icon,
        };
      })
    : [];

  const formatTimeStr = (isoString?: string) => {
    if (!isoString) return "--:--";
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    } catch {
      return "--:--";
    }
  };

  const sunriseFormatted = daily?.sunrise?.[0] ? formatTimeStr(daily.sunrise[0]) : "6:05 AM";
  const sunsetFormatted = daily?.sunset?.[0] ? formatTimeStr(daily.sunset[0]) : "6:15 PM";

  return (
    <div
      className={`min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-[#030508] text-slate-100"
          : "bg-gradient-to-br from-sky-50 via-slate-50 to-blue-100 text-slate-900"
      }`}
    >
      {/* Dynamic Animated Ambient Orbs */}
      <div
        className="fixed -top-36 -left-36 w-[550px] h-[550px] rounded-full blur-[140px] pointer-events-none transition-colors duration-1000 orb-a"
        style={{ backgroundColor: meta.orb1 || "rgba(6, 182, 212, 0.22)" }}
      />
      <div
        className="fixed -bottom-36 -right-36 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none transition-colors duration-1000 orb-b"
        style={{ backgroundColor: meta.orb2 || "rgba(99, 102, 241, 0.22)" }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-900/10 rounded-full blur-[180px] pointer-events-none orb-c" />

      {/* Real-time Atmospheric Live Particle FX (Falling Rain, Lightning Bolts, Sun Bokeh) */}
      <LiveWeatherCanvas
        weatherCode={current?.weather_code ?? 0}
        cape={current?.cape ?? 0}
        isDay={current?.is_day === 1}
        windSpeed={current?.wind_speed_10m ?? 10}
        enabled={fxEnabled}
        darkMode={darkMode}
      />

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-36 lg:pb-10 z-10 space-y-4 sm:space-y-6">
        {/* Unified Top Glass Header with Integrated Controls */}
        <Header
          currentTime={currentTime}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          locating={locating}
          handleCurrentLocation={handleCurrentLocation}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
          refreshing={refreshing}
          loading={loading}
          handleRefresh={handleRefresh}
          fxEnabled={fxEnabled}
          setFxEnabled={setFxEnabled}
          audioComponent={
            <AmbientSoundscape
              weatherCode={current?.weather_code}
              isDay={current?.is_day === 1}
              cape={current?.cape}
            />
          }
          searchComponent={
            <SearchBar
              query={query}
              setQuery={setQuery}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              isSearching={isSearching}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              handleSelectCity={handleSelectCity}
              handleSearchSubmit={handleSearchSubmit}
            />
          }
        />

        {/* Quick Hotspot Cities Carousel */}
        <CityChips
          cities={POPULAR_CITIES}
          currentCity={currentCity}
          onSelect={(city) =>
            loadWeatherData(city.lat, city.lon, city.name, city.country)
          }
        />

        {/* Real-time Severe Thunderstorm & Lightning Alert Banner */}
        {current &&
          !dismissSevereAlert &&
          ((current.weather_code >= 95 && current.weather_code <= 99) ||
            (current.cape ?? 0) >= 1200 ||
            (current.wind_gusts_10m ?? 0) >= 48) && (
            <div className="glass-panel p-4 sm:p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-500/50 text-amber-950 dark:text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/30 animate-pulse shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 font-black text-sm text-slate-900 dark:text-amber-300">
                    <span>SEVERE CONVECTIVE & LIGHTNING ADVISORY</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 uppercase tracking-wider font-black">
                      Severe Lightning Warning
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5">
                    Convective Energy (CAPE) elevated at {current?.cape ?? 0} J/kg with peak gusts{" "}
                    {Math.round(current?.wind_gusts_10m ?? 0)} km/h. Avoid open grounds and apply 30/30 rule.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDismissSevereAlert(true)}
                className="self-end sm:self-center text-xs px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 font-black cursor-pointer transition text-amber-950 dark:text-amber-200 shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

        {/* Error Alert */}
        {error && (
          <div className="glass-panel p-4 rounded-2xl bg-rose-100/90 border border-rose-300 text-rose-950 dark:bg-rose-500/15 dark:border-rose-500/30 dark:text-rose-200 text-sm flex items-center justify-between gap-3 animate-fade-in shadow-xs">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs px-3 py-1.5 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-950 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 dark:text-rose-200 font-bold cursor-pointer transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Content */}
        {loading ? (
          <div className="glass-panel h-[480px] rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-500 dark:text-slate-400 shadow-lg">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-cyan-600 dark:text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-black text-slate-900 dark:text-slate-200">
                Fetching Atmospheric & Radar Telemetry...
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                Connecting to High-Resolution Satellite Feeds
              </p>
            </div>
          </div>
        ) : weatherData && current ? (
          <div className="space-y-6">
            {/* Primary Hero Row: Weather Display + Air Quality Panel */}
            <div id="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-24">
              <HeroCard
                current={current}
                daily={daily}
                meta={meta}
                currentCity={currentCity}
                currentTime={currentTime}
                tempUnit={tempUnit}
                formatTemp={formatTemp}
                sunrise={sunriseFormatted}
                sunset={sunsetFormatted}
              />
              <AirQualityPanel
                airQuality={airQuality}
                aqiInfo={aqiInfo}
                current={current}
              />
            </div>

            {/* 1. Flagship: Lightning Strike & Severe Thunderstorm Threat Center */}
            <div id="lightning" className="scroll-mt-24">
              <LightningThreatPanel
                current={current}
                hourly={hourly}
                currentCity={currentCity}
              />
            </div>

            {/* 2. Flagship: Rapid Weather Change & Volatility Radar */}
            <div id="volatility" className="scroll-mt-24">
              <WeatherVolatilityPanel
                current={current}
                hourly={hourly}
                minutely15={weatherData?.minutely_15}
                tempUnit={tempUnit}
              />
            </div>

            {/* 24-Hour Forecast Curve & Hourly Strip */}
            <ForecastChart
              data={next24Hours}
              activeTab={activeChartTab}
              setActiveTab={setActiveChartTab}
              tempUnit={tempUnit}
            />

            {/* Atmospheric Sensor Telemetry (6 Cards) */}
            <DetailedMetrics
              current={current}
              daily={daily}
              uvInfo={uvInfo}
              tempUnit={tempUnit}
              formatTemp={formatTemp}
            />

            {/* 3. Flagship: Atmospheric Radar & Vector Streamline Simulator */}
            <div id="radar" className="scroll-mt-24">
              <RadarMapPanel
                current={current}
                currentCity={currentCity}
                darkMode={darkMode}
              />
            </div>

            {/* 4. Flagship: SkyPulse AI Meteorologist & Life Activities Index */}
            <div id="ai" className="scroll-mt-24">
              <AiMeteorologistPanel
                current={current}
                daily={daily}
                airQuality={airQuality}
                currentCity={currentCity}
                tempUnit={tempUnit}
                formatTemp={formatTemp}
              />
            </div>

            {/* 7-Day Extended Weekly Outlook */}
            <DailyForecast
              daily={daily}
              tempUnit={tempUnit}
              formatTemp={formatTemp}
            />
          </div>
        ) : null}

        {/* Footer */}
        <Footer />

        {/* Mobile Sticky Floating Navigation Dock */}
        <MobileNav
          activeSection={activeSection}
          onSelectSection={handleSelectMobileSection}
        />
      </div>
    </div>
  );
}
