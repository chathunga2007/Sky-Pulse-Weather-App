import axios from "axios";

/**
 * Search cities with autocomplete support via Open-Meteo Geocoding API
 */
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  try {
    const res = await axios.get(url);
    if (!res.data || !res.data.results) return [];
    return res.data.results.map((item) => ({
      id: item.id,
      name: item.name,
      admin1: item.admin1 || "",
      country: item.country || "",
      countryCode: item.country_code ? item.country_code.toLowerCase() : "",
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone,
    }));
  } catch (err) {
    console.error("Geocoding search failed:", err);
    return [];
  }
};

/**
 * Fetch comprehensive weather forecast (current, hourly 24h, daily 7d)
 */
export const fetchComprehensiveWeather = async (lat, lon) => {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
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
      "uv_index",
    ].join(","),
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
  const res = await axios.get(url);
  return res.data;
};

/**
 * Fetch Air Quality index and pollutant concentrations
 */
export const fetchAirQuality = async (lat, lon) => {
  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`;
    const res = await axios.get(url);
    return res.data?.current || null;
  } catch (err) {
    console.warn("Air quality data not available:", err);
    return null;
  }
};

/**
 * Reverse geocode latitude & longitude to a human readable city name
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
    const res = await axios.get(url, { headers: { "Accept-Language": "en" } });
    if (res.data && res.data.address) {
      const addr = res.data.address;
      const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "My Location";
      const country = addr.country || "";
      return country ? `${city}, ${country}` : city;
    }
  } catch {
    // Fallback if rate limited or unavailable
  }
  return `Coordinates: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
};