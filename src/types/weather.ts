export interface CityItem {
  id?: number;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherCurrent {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  cape?: number;
  lightning_potential?: number;
  time?: string;
}

export interface WeatherHourly {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m?: number[];
  precipitation_probability?: number[];
  precipitation?: number[];
  weather_code: number[];
  surface_pressure?: number[];
  visibility?: number[];
  wind_speed_10m?: number[];
  wind_gusts_10m?: number[];
  uv_index?: number[];
  cape?: number[];
  lightning_potential?: number[];
}

export interface WeatherDaily {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max?: number[];
  apparent_temperature_min?: number[];
  sunrise?: string[];
  sunset?: string[];
  uv_index_max?: number[];
  precipitation_sum?: number[];
  precipitation_probability_max?: number[];
  wind_speed_10m_max?: number[];
  wind_direction_10m_dominant?: number[];
}

export interface WeatherMinutely15 {
  time?: string[];
  precipitation?: number[];
  weather_code?: number[];
  lightning_potential?: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms?: number;
  utc_offset_seconds?: number;
  timezone: string;
  timezone_abbreviation?: string;
  elevation?: number;
  current: WeatherCurrent;
  hourly: WeatherHourly;
  daily: WeatherDaily;
  minutely_15?: WeatherMinutely15;
}

export interface AirQualityCurrent {
  european_aqi?: number;
  us_aqi: number;
  pm10?: number;
  pm2_5?: number;
  carbon_monoxide?: number;
  nitrogen_dioxide?: number;
  sulphur_dioxide?: number;
  ozone?: number;
  time?: string;
}

export interface AirQualityResponse {
  latitude: number;
  longitude: number;
  timezone?: string;
  current: AirQualityCurrent;
}

export interface WeatherMeta {
  label: string;
  subLabel: string;
  icon: string;
  glow: string;
  orb1: string;
  orb2: string;
  color: string;
  badgeBg: string;
  category: "clear" | "clouds" | "fog" | "drizzle" | "rain" | "snow" | "thunderstorm" | string;
}

export interface AqiStatus {
  label: string;
  color: string;
  bg: string;
  pct: number;
  advice: string;
}

export interface UvStatus {
  label: string;
  color: string;
  bg: string;
  advice: string;
}

export type TempUnit = "C" | "F";
export type ChartTab = "temp" | "rain" | "wind" | "pressure";
export type MobileSection = "overview" | "radar" | "volatility" | "details" | "daily";