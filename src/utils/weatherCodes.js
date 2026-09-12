/**
 * Comprehensive WMO Weather Codes mapping
 * 100% English descriptions, day/night awareness, icons, and dynamic UI theme colors
 */
export const getWeatherMeta = (code, isDay = 1) => {
  const isNight = isDay === 0;

  switch (code) {
    case 0:
      return {
        label: isNight ? "Clear Night" : "Sunny & Clear",
        subLabel: isNight ? "Clear Skies" : "Bright Sunshine",
        icon: isNight ? "Moon" : "Sun",
        glow: isNight ? "from-indigo-600/30 to-blue-900/30" : "from-amber-400/30 to-orange-500/20",
        orb1: isNight ? "rgba(79, 70, 229, 0.25)" : "rgba(245, 158, 11, 0.25)",
        orb2: isNight ? "rgba(30, 58, 138, 0.25)" : "rgba(14, 165, 233, 0.20)",
        color: isNight ? "text-indigo-400" : "text-amber-500",
        badgeBg: isNight ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30",
        category: "clear",
      };
    case 1:
      return {
        label: isNight ? "Mainly Clear" : "Mostly Sunny",
        subLabel: isNight ? "Scattered Starlight" : "Passing Sun",
        icon: isNight ? "CloudMoon" : "CloudSun",
        glow: isNight ? "from-slate-600/30 to-indigo-900/30" : "from-amber-300/25 to-sky-500/20",
        orb1: isNight ? "rgba(99, 102, 241, 0.2)" : "rgba(251, 191, 36, 0.2)",
        orb2: "rgba(56, 189, 248, 0.2)",
        color: isNight ? "text-indigo-400" : "text-amber-500",
        badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        category: "clear",
      };
    case 2:
      return {
        label: "Partly Cloudy",
        subLabel: "Scattered Clouds",
        icon: isNight ? "CloudMoon" : "CloudSun",
        glow: "from-sky-600/20 to-slate-700/30",
        orb1: "rgba(56, 189, 248, 0.2)",
        orb2: "rgba(100, 116, 139, 0.25)",
        color: "text-sky-400",
        badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/30",
        category: "clouds",
      };
    case 3:
      return {
        label: "Overcast",
        subLabel: "Dense Cloud Cover",
        icon: "Cloud",
        glow: "from-slate-600/30 to-slate-800/40",
        orb1: "rgba(100, 116, 139, 0.25)",
        orb2: "rgba(71, 85, 105, 0.25)",
        color: "text-slate-400",
        badgeBg: "bg-slate-700/40 text-slate-300 border-slate-600/40",
        category: "clouds",
      };
    case 45:
    case 48:
      return {
        label: "Dense Fog",
        subLabel: "Reduced Visibility",
        icon: "CloudFog",
        glow: "from-teal-600/20 to-slate-700/30",
        orb1: "rgba(45, 212, 191, 0.15)",
        orb2: "rgba(148, 163, 184, 0.2)",
        color: "text-teal-400",
        badgeBg: "bg-teal-500/20 text-teal-300 border-teal-500/30",
        category: "fog",
      };
    case 51:
    case 53:
    case 55:
      return {
        label: "Light Drizzle",
        subLabel: "Intermittent Mist",
        icon: "CloudDrizzle",
        glow: "from-cyan-600/25 to-blue-700/30",
        orb1: "rgba(6, 182, 212, 0.25)",
        orb2: "rgba(59, 130, 246, 0.2)",
        color: "text-cyan-400",
        badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        category: "rain",
      };
    case 61:
    case 63:
    case 65:
      return {
        label: code === 65 ? "Heavy Rain" : "Moderate Rain",
        subLabel: code === 65 ? "Torrential Downpour" : "Steady Showers",
        icon: "CloudRain",
        glow: "from-cyan-500/30 to-blue-800/40",
        orb1: "rgba(6, 182, 212, 0.3)",
        orb2: "rgba(37, 99, 235, 0.25)",
        color: "text-blue-400",
        badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        category: "rain",
      };
    case 71:
    case 73:
    case 75:
      return {
        label: "Snowfall",
        subLabel: "Wintry Flurries",
        icon: "Snowflake",
        glow: "from-indigo-400/25 to-blue-600/30",
        orb1: "rgba(165, 180, 252, 0.25)",
        orb2: "rgba(59, 130, 246, 0.2)",
        color: "text-indigo-400",
        badgeBg: "bg-indigo-500/20 text-indigo-200 border-indigo-500/30",
        category: "snow",
      };
    case 80:
    case 81:
    case 82:
      return {
        label: "Violent Showers",
        subLabel: "Heavy Precipitation",
        icon: "CloudRain",
        glow: "from-blue-600/35 to-indigo-900/40",
        orb1: "rgba(37, 99, 235, 0.35)",
        orb2: "rgba(99, 102, 241, 0.25)",
        color: "text-sky-400",
        badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        category: "rain",
      };
    case 95:
    case 96:
    case 99:
      return {
        label: "Thunderstorm",
        subLabel: "Lightning Activity",
        icon: "CloudLightning",
        glow: "from-violet-600/35 to-fuchsia-800/30",
        orb1: "rgba(139, 92, 246, 0.35)",
        orb2: "rgba(217, 70, 239, 0.25)",
        color: "text-violet-400",
        badgeBg: "bg-violet-500/20 text-violet-300 border-violet-500/30",
        category: "thunder",
      };
    default:
      return {
        label: "Passing Clouds",
        subLabel: "Breezy Conditions",
        icon: "Cloud",
        glow: "from-slate-600/25 to-blue-900/25",
        orb1: "rgba(56, 189, 248, 0.2)",
        orb2: "rgba(100, 116, 139, 0.2)",
        color: "text-slate-400",
        badgeBg: "bg-slate-700/30 text-slate-300 border-slate-600/30",
        category: "clouds",
      };
  }
};

/**
 * Interpret US Air Quality Index (AQI) values
 */
export const getAqiStatus = (aqi) => {
  if (aqi == null || isNaN(aqi)) {
    return { label: "Unknown", color: "text-slate-400", bg: "bg-slate-500/20", pct: 0, advice: "No data available" };
  }
  if (aqi <= 50) {
    return { label: "Good", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30", pct: Math.min(100, (aqi / 50) * 25), advice: "Air quality is satisfactory; clean and fresh air." };
  }
  if (aqi <= 100) {
    return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30", pct: 25 + Math.min(25, ((aqi - 50) / 50) * 25), advice: "Acceptable air; sensitive people should take care." };
  }
  if (aqi <= 150) {
    return { label: "Sensitive", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", pct: 50 + Math.min(25, ((aqi - 100) / 50) * 25), advice: "Sensitive groups may experience health effects." };
  }
  if (aqi <= 200) {
    return { label: "Unhealthy", color: "text-rose-400", bg: "bg-rose-500/20 border-rose-500/30", pct: 75 + Math.min(20, ((aqi - 150) / 50) * 20), advice: "Everyone may experience slight health effects." };
  }
  return { label: "Hazardous", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30", pct: 100, advice: "Health warning: Emergency atmospheric conditions." };
};

/**
 * Interpret UV Index values
 */
export const getUvStatus = (uv) => {
  if (uv == null || isNaN(uv)) {
    return { label: "N/A", color: "text-slate-400", bg: "bg-slate-500/20", advice: "Not available" };
  }
  if (uv <= 2) {
    return { label: "Low", color: "text-emerald-400", bg: "bg-emerald-500/20 border-emerald-500/30", advice: "No sun protection required" };
  }
  if (uv <= 5) {
    return { label: "Moderate", color: "text-amber-400", bg: "bg-amber-500/20 border-amber-500/30", advice: "Wear sunglasses & sun lotion" };
  }
  if (uv <= 7) {
    return { label: "High", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-500/30", advice: "Seek shade during midday hours" };
  }
  if (uv <= 10) {
    return { label: "Very High", color: "text-rose-400", bg: "bg-rose-500/20 border-rose-500/30", advice: "Extra precaution: avoid direct sun" };
  }
  return { label: "Extreme", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-500/30", advice: "Take all outdoor precautions" };
};

/**
 * Convert wind direction angle in degrees to compass direction string
 */
export const getWindDirection = (deg) => {
  if (deg == null) return "N";
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

/**
 * Temperature converter helper
 */
export const formatTemp = (celsius, unit = "C") => {
  if (celsius == null || isNaN(celsius)) return "--";
  if (unit === "F") {
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
};