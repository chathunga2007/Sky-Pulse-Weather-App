import React from "react";
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
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
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

interface WeatherIconProps {
  name: string;
  className?: string;
}

export default function WeatherIcon({ name, className = "w-6 h-6" }: WeatherIconProps) {
  const IconComponent = ICON_MAP[name] || Cloud;
  return <IconComponent className={className} />;
}
