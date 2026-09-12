import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
} from "lucide-react";

const ICON_MAP = {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
};

export default function WeatherIcon({ name, className = "w-6 h-6" }) {
  const IconComponent = ICON_MAP[name] || Cloud;
  return <IconComponent className={className} />;
}
