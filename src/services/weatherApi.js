import axios from "axios";

export const getCityCoordinates = async (cityName) => {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
  const res = await axios.get(url);
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error("City not found");
  }
  const { name, country, latitude, longitude } = res.data.results[0];
  return { name, country, latitude, longitude };
};

export const fetchComprehensiveWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;
  const res = await axios.get(url);
  return res.data;
};