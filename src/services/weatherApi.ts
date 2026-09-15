import axios from "axios";
import type {
  CityItem,
  WeatherForecastResponse,
  AirQualityCurrent,
  AirQualityResponse,
} from "../types/weather";
import {
  sanitizeSearchQuery,
  validateCoordinates,
  throttleNominatim,
  weatherApiLimiter,
  getCached,
  setCached,
  API_TIMEOUT_MS,
  sanitizeErrorMessage,
} from "./apiSecurity";

export const searchCities = async (query: string): Promise<CityItem[]> => {
  const cleanQuery = sanitizeSearchQuery(query);
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const cacheKey = `geo_search_${cleanQuery.toLowerCase()}`;
  const cached = getCached<CityItem[]>(cacheKey);
  if (cached) return cached;

  if (!weatherApiLimiter.allowRequest()) {
    console.warn("Weather API client rate limit hit for search.");
    return [];
  }

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cleanQuery
  )}&count=6&language=en&format=json`;

  try {
    const res = await axios.get<{ results?: any[] }>(url, {
      timeout: API_TIMEOUT_MS,
    });
    if (!res.data || !res.data.results || !Array.isArray(res.data.results)) return [];

    const results: CityItem[] = res.data.results.map((item) => ({
      id: typeof item.id === "number" ? item.id : undefined,
      name: String(item.name || "Unknown"),
      admin1: item.admin1 ? String(item.admin1) : "",
      country: item.country ? String(item.country) : "",
      countryCode: item.country_code ? String(item.country_code).toLowerCase() : "",
      latitude: Number(item.latitude),
      longitude: Number(item.longitude),
      timezone: item.timezone ? String(item.timezone) : undefined,
    }));

    // Cache results for 10 minutes (600,000 ms)
    setCached(cacheKey, results, 600000);
    return results;
  } catch (err) {
    console.error("Geocoding search failed:", sanitizeErrorMessage(err));
    return [];
  }
};

export const fetchComprehensiveWeather = async (
  lat: number,
  lon: number
): Promise<WeatherForecastResponse> => {
  const coordCheck = validateCoordinates(lat, lon);
  if (!coordCheck.valid) {
    throw new Error(coordCheck.error || "Invalid coordinates provided");
  }

  const cacheKey = `forecast_${coordCheck.lat.toFixed(3)}_${coordCheck.lon.toFixed(3)}`;
  const cached = getCached<WeatherForecastResponse>(cacheKey);
  if (cached) return cached;

  if (!weatherApiLimiter.allowRequest()) {
    throw new Error("Client request limit exceeded. Please wait a few seconds.");
  }

  const params = new URLSearchParams({
    latitude: coordCheck.lat.toString(),
    longitude: coordCheck.lon.toString(),
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "is_day",
      "precipitation",
      "rain",
      "weather_code",
      "cloud_cover",
      "pressure_msl",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
      "cape",
      "lightning_potential",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "precipitation_probability",
      "precipitation",
      "weather_code",
      "surface_pressure",
      "visibility",
      "wind_speed_10m",
      "wind_gusts_10m",
      "uv_index",
      "cape",
      "lightning_potential",
    ].join(","),
    minutely_15: [
      "precipitation",
      "weather_code",
      "lightning_potential",
    ].join(","),
    forecast_minutely_15: "24",
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "apparent_temperature_max",
      "apparent_temperature_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
    ].join(","),
    timezone: "auto",
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  try {
    const res = await axios.get<WeatherForecastResponse>(url, {
      timeout: API_TIMEOUT_MS,
    });

    if (!res.data || !res.data.current) {
      throw new Error("Invalid telemetry payload received from weather service.");
    }

    // Cache forecast data for 4 minutes (240,000 ms)
    setCached(cacheKey, res.data, 240000);
    return res.data;
  } catch (err) {
    throw new Error(sanitizeErrorMessage(err, "Failed to fetch comprehensive weather"));
  }
};

export const fetchAirQuality = async (
  lat: number,
  lon: number
): Promise<AirQualityCurrent | null> => {
  const coordCheck = validateCoordinates(lat, lon);
  if (!coordCheck.valid) return null;

  const cacheKey = `aqi_${coordCheck.lat.toFixed(3)}_${coordCheck.lon.toFixed(3)}`;
  const cached = getCached<AirQualityCurrent>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coordCheck.lat}&longitude=${coordCheck.lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
    const res = await axios.get<AirQualityResponse>(url, {
      timeout: API_TIMEOUT_MS,
    });
    const aqiData = res.data?.current || null;
    if (aqiData) {
      // Cache AQI for 10 minutes (600,000 ms)
      setCached(cacheKey, aqiData, 600000);
    }
    return aqiData;
  } catch (err) {
    console.warn("Air quality data not available:", sanitizeErrorMessage(err));
    return null;
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const coordCheck = validateCoordinates(lat, lon);
  if (!coordCheck.valid) {
    return "Unknown Location";
  }

  const cacheKey = `revgeo_${coordCheck.lat.toFixed(3)}_${coordCheck.lon.toFixed(3)}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  try {
    await throttleNominatim();
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordCheck.lat}&lon=${coordCheck.lon}&zoom=10&addressdetails=1`;
    const res = await axios.get<{ address?: Record<string, string> }>(url, {
      headers: { "Accept-Language": "en" },
      timeout: API_TIMEOUT_MS,
    });

    if (res.data && res.data.address) {
      const addr = res.data.address;
      const city =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.suburb ||
        addr.county ||
        "My Location";
      const country = addr.country || "";
      const resultName = country ? `${city}, ${country}` : city;

      // Cache reverse geocode for 30 minutes (1,800,000 ms)
      setCached(cacheKey, resultName, 1800000);
      return resultName;
    }
  } catch (err) {
    console.warn("Reverse geocode failed:", sanitizeErrorMessage(err));
  }

  return `Coordinates: ${coordCheck.lat.toFixed(2)}°, ${coordCheck.lon.toFixed(2)}°`;
};
