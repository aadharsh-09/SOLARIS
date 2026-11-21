// Fetches weather straight from Open-Meteo in the visitor's browser.
// Each visitor uses their own IP, so the shared-IP rate limits that block
// hosted servers (e.g. Render) don't apply.

const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast';

// Open-Meteo convention: 0 = south, -90 = east, 90 = west, +/-180 = north
const FACING_TO_AZIMUTH = {
  S: 0, SW: 45, W: 90, NW: 135, N: 180, NE: -135, E: -90, SE: -45,
};

const CURRENT_FIELDS =
  'temperature_2m,apparent_temperature,relative_humidity_2m,' +
  'is_day,precipitation,weather_code,cloud_cover,wind_speed_10m';

export const fetchWeatherDirect = async ({ latitude, longitude, tilt, facing }) => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: CURRENT_FIELDS,
    hourly: 'global_tilted_irradiance,temperature_2m',
    tilt: String(tilt),
    azimuth: String(FACING_TO_AZIMUTH[facing] ?? 0),
    timezone: 'auto',
    forecast_days: '1',
  });

  const response = await fetch(`${OPEN_METEO_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Weather request failed (${response.status})`);
  }
  const data = await response.json();

  const hourly = data.hourly.time.map((time, i) => {
    const gti = data.hourly.global_tilted_irradiance[i];
    return {
      time,
      irradiance: gti,
      temperature: data.hourly.temperature_2m[i],
      energy_kwh_m2: gti === null || gti === undefined ? null : gti / 1000,
    };
  });

  const dailyEnergy = hourly.reduce((sum, h) => sum + (h.energy_kwh_m2 ?? 0), 0);

  const c = data.current || {};
  return {
    current: {
      time: c.time,
      temperature: c.temperature_2m,
      feels_like: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      cloud_cover: c.cloud_cover,
      wind_speed: c.wind_speed_10m,
      precipitation: c.precipitation,
      weather_code: c.weather_code,
      is_day: Boolean(c.is_day),
    },
    hourly,
    daily_energy_kwh_m2: Math.round(dailyEnergy * 1000) / 1000,
  };
};
