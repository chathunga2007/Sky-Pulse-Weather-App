export const getWeatherMeta = (code) => {
  switch (code) {
    case 0:
      return { label: "Clear Sky", icon: "Sun", glow: "from-amber-500/20" };
    case 1:
    case 2:
    case 3:
      return { label: "Partly Cloudy", icon: "CloudSun", glow: "from-blue-500/20" };
    case 45:
    case 48:
      return { label: "Foggy", icon: "CloudFog", glow: "from-slate-500/20" };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
      return { label: "Rain Showers", icon: "CloudRain", glow: "from-cyan-500/20" };
    case 71:
    case 73:
    case 75:
      return { label: "Snow", icon: "Snowflake", glow: "from-indigo-500/20" };
    case 95:
    case 96:
    case 99:
      return { label: "Thunderstorm", icon: "CloudLightning", glow: "from-purple-500/30" };
    default:
      return { label: "Overcast", icon: "Cloud", glow: "from-gray-500/20" };
  }
};