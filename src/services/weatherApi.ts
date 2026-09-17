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

// Sri Lankan district and province keywords for intelligent matching & ranking
const LK_REGIONS = [
  "colombo", "gampaha", "kalutara", "kandy", "matale", "nuwara eliya",
  "galle", "matara", "hambantota", "jaffna", "kilinochchi", "mannar",
  "vavuniya", "mullaitivu", "batticaloa", "ampara", "trincomalee",
  "kurunegala", "puttalam", "anuradhapura", "polonnaruwa", "badulla",
  "monaragala", "ratnapura", "kegalle", "western", "central", "southern",
  "northern", "eastern", "north western", "north central", "uva", "sabaragamuwa"
];

export const searchCities = async (query: string): Promise<CityItem[]> => {
  const cleanQuery = sanitizeSearchQuery(query);
  if (!cleanQuery || cleanQuery.length < 2) return [];

  const cacheKey = `geo_search_v2_${cleanQuery.toLowerCase()}`;
  const cached = getCached<CityItem[]>(cacheKey);
  if (cached) return cached;

  if (!weatherApiLimiter.allowRequest()) {
    console.warn("Weather API client rate limit hit for search.");
    return [];
  }

  // Detect if query specifies Sri Lanka or Lankan terms
  const isSriLankaQuery = /(?:,\s*|\s+)?\b(sri\s*lanka|lanka|lk|ceylon)\b/i.test(cleanQuery);
  const withoutCountry = cleanQuery.replace(/(?:,\s*|\s+)?\b(sri\s*lanka|lanka|lk|ceylon)\b/gi, "").trim();

  // Detect if query has multiple words (e.g. "Nagoda Galle", "Nagoda Southern", "Nagoda Gampaha")
  const tokens = withoutCountry.split(/[\s,]+/).filter(Boolean);
  let primaryName = withoutCountry;
  let filterKeyword = "";

  if (tokens.length >= 2) {
    const lastToken = tokens[tokens.length - 1].toLowerCase();
    const secondLastToken = tokens.slice(1).join(" ").toLowerCase();

    // Check if the extra words match a known district/province
    const matchedRegion = LK_REGIONS.find((r) => secondLastToken.includes(r) || lastToken === r);
    if (matchedRegion) {
      primaryName = tokens[0];
      filterKeyword = matchedRegion;
    }
  }

  const queryTerm = primaryName.length >= 2 ? primaryName : withoutCountry;

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    queryTerm
  )}&count=20&language=en&format=json`;

  try {
    let rawResults: any[] = [];
    try {
      const res = await axios.get<{ results?: any[] }>(url, {
        timeout: API_TIMEOUT_MS,
      });
      if (res.data?.results && Array.isArray(res.data.results)) {
        rawResults = res.data.results;
      }
    } catch (openMeteoErr) {
      console.warn("Open-Meteo geocoding search failed, trying fallback:", openMeteoErr);
    }

    // Fallback to OpenStreetMap Nominatim if Open-Meteo returned no results
    if (rawResults.length === 0) {
      try {
        await throttleNominatim();
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cleanQuery
        )}&addressdetails=1&limit=10`;
        const nomRes = await axios.get<any[]>(nomUrl, {
          headers: { "Accept-Language": "en" },
          timeout: API_TIMEOUT_MS,
        });

        if (nomRes.data && Array.isArray(nomRes.data) && nomRes.data.length > 0) {
          const nomResults: CityItem[] = nomRes.data.map((item: any) => {
            const addr = item.address || {};
            const localName =
              addr.city ||
              addr.town ||
              addr.village ||
              addr.suburb ||
              addr.hamlet ||
              item.name ||
              "Unknown";
            const district = addr.district || addr.county || "";
            const state = addr.state || "";
            const adminParts = [district, state].filter(Boolean);
            return {
              id: item.osm_id ? Number(item.osm_id) : undefined,
              name: String(localName),
              admin1: adminParts.join(", "),
              admin2: district,
              district: district,
              province: state,
              country: String(addr.country || ""),
              countryCode: addr.country_code ? String(addr.country_code).toLowerCase() : "",
              latitude: Number(item.lat),
              longitude: Number(item.lon),
            };
          });

          setCached(cacheKey, nomResults, 600000);
          return nomResults;
        }
      } catch (nomErr) {
        console.warn("Nominatim fallback geocoding search failed:", nomErr);
      }
      return [];
    }

    const mapped: (CityItem & { isLk: boolean; score: number })[] = rawResults.map((item) => {
      const isLk =
        item.country_code?.toLowerCase() === "lk" ||
        item.country?.toLowerCase() === "sri lanka";

      const district = item.admin2 ? String(item.admin2) : "";
      const province = item.admin1 ? String(item.admin1) : "";
      const division = item.admin3 ? String(item.admin3) : "";

      // Format administrative hierarchy without duplicating the town name
      const adminParts: string[] = [];
      if (division && division.toLowerCase() !== item.name?.toLowerCase()) {
        adminParts.push(division);
      }
      if (district && !adminParts.includes(district)) {
        adminParts.push(district);
      }
      if (province && !adminParts.includes(province)) {
        adminParts.push(province);
      }
      const admin1String = adminParts.length > 0 ? adminParts.join(", ") : province || district || "";

      // Smart scoring for relevance
      let score = 0;
      if (isLk) score += 100;

      // Boost exact name match
      if (item.name?.toLowerCase() === queryTerm.toLowerCase()) {
        score += 50;
      }

      // If user provided a district/province keyword (e.g. "Galle" in "Nagoda Galle")
      if (filterKeyword) {
        const fullHierarchy = `${district} ${province} ${division}`.toLowerCase();
        if (fullHierarchy.includes(filterKeyword)) {
          score += 200; // Strong priority for requested district!
        }
      }

      return {
        id: typeof item.id === "number" ? item.id : undefined,
        name: String(item.name || "Unknown"),
        admin1: admin1String,
        admin2: district,
        district: district,
        province: province,
        country: String(item.country || ""),
        countryCode: item.country_code ? String(item.country_code).toLowerCase() : "",
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        timezone: item.timezone ? String(item.timezone) : undefined,
        isLk,
        score,
      };
    });

    // Sort by relevance score descending
    mapped.sort((a, b) => b.score - a.score);

    // Deduplicate by coordinates (within ~2km) and name
    const seen = new Set<string>();
    const deduplicated: CityItem[] = [];

    for (const item of mapped) {
      const coordKey = `${item.name.toLowerCase()}_${item.latitude.toFixed(2)}_${item.longitude.toFixed(2)}`;
      if (!seen.has(coordKey)) {
        seen.add(coordKey);
        const { isLk, score, ...rest } = item;
        deduplicated.push(rest);
      }
    }

    const results: CityItem[] = deduplicated.slice(0, 10);

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

export interface ResolvedPlace {
  name: string;
  region: string;
  country: string;
  fullName: string;
}

export const reverseGeocodePlace = async (
  lat: number,
  lon: number
): Promise<ResolvedPlace> => {
  const coordCheck = validateCoordinates(lat, lon);
  if (!coordCheck.valid) {
    return {
      name: "Unknown Location",
      region: "",
      country: "",
      fullName: "Unknown Location",
    };
  }

  const cacheKey = `revplace_${coordCheck.lat.toFixed(4)}_${coordCheck.lon.toFixed(4)}`;
  const cached = getCached<ResolvedPlace>(cacheKey);
  if (cached) return cached;

  try {
    await throttleNominatim();
    // Use zoom=15 for precise village, town, suburb, hamlet or neighborhood
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordCheck.lat}&lon=${coordCheck.lon}&zoom=15&addressdetails=1`;
    const res = await axios.get<{
      name?: string;
      display_name?: string;
      address?: Record<string, string>;
    }>(url, {
      headers: { "Accept-Language": "en" },
      timeout: API_TIMEOUT_MS,
    });

    if (res.data) {
      const addr = res.data.address || {};
      const primary =
        addr.village ||
        addr.suburb ||
        addr.town ||
        addr.hamlet ||
        addr.neighbourhood ||
        addr.city ||
        addr.municipality ||
        addr.quarter ||
        res.data.name ||
        "";

      const district = addr.state_district || addr.district || addr.county || "";
      const province = addr.state || "";
      const country =
        addr.country ||
        (coordCheck.lat >= 5.8 && coordCheck.lat <= 9.9 && coordCheck.lon >= 79.5 && coordCheck.lon <= 82.0
          ? "Sri Lanka"
          : "");

      let name = primary;
      if (!name) {
        if (res.data.display_name) {
          name = res.data.display_name.split(",")[0].trim();
        } else {
          name = district || province || `Location (${coordCheck.lat.toFixed(2)}°, ${coordCheck.lon.toFixed(2)}°)`;
        }
      }

      const regionParts = [
        district && district !== name ? district : null,
        province && province !== district ? province : null,
      ].filter(Boolean);
      const region = regionParts.join(", ");

      const fullParts = [name, region, country].filter(Boolean);
      const fullName = fullParts.join(", ");

      const result: ResolvedPlace = {
        name,
        region,
        country: country || region || "",
        fullName,
      };

      // Cache reverse geocode for 30 minutes (1,800,000 ms)
      setCached(cacheKey, result, 1800000);
      return result;
    }
  } catch (err) {
    console.warn("Reverse geocode failed:", sanitizeErrorMessage(err));
  }

  const fallbackName = `Coordinates (${coordCheck.lat.toFixed(3)}°, ${coordCheck.lon.toFixed(3)}°)`;
  return {
    name: fallbackName,
    region: "",
    country: "",
    fullName: fallbackName,
  };
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  const details = await reverseGeocodePlace(lat, lon);
  return details.fullName;
};
