
import ssl
import time
import certifi
import json
from threading import Lock
from urllib.error import HTTPError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE_URL = "https://api.open-meteo.com/v1/forecast"

# Open-Meteo's free tier is rate limited per IP, so identical requests
# (same place, tilt and facing) are served from memory for a few minutes.
CACHE_TTL_SECONDS = 600
MAX_CACHE_ENTRIES = 500
_cache = {}
_cache_lock = Lock()

RETRY_DELAYS = (1, 3)  # seconds to wait before retrying after a 429

CURRENT_FIELDS = (
    "temperature_2m,apparent_temperature,relative_humidity_2m,"
    "is_day,precipitation,weather_code,cloud_cover,wind_speed_10m"
)


def _cache_get(key):
    with _cache_lock:
        entry = _cache.get(key)
        if entry and time.time() - entry[0] < CACHE_TTL_SECONDS:
            return entry[1]
    return None


def _cache_set(key, data):
    with _cache_lock:
        if len(_cache) >= MAX_CACHE_ENTRIES:
            now = time.time()
            for old_key in [
                k for k, (t, _) in _cache.items()
                if now - t >= CACHE_TTL_SECONDS
            ]:
                del _cache[old_key]
            if len(_cache) >= MAX_CACHE_ENTRIES:
                _cache.clear()
        _cache[key] = (time.time(), data)


def _error_reason(error):
    """Open-Meteo explains a rejected call in the JSON body ({"reason": ...})."""
    try:
        return json.loads(error.read().decode("utf-8")).get("reason")
    except Exception:
        return None


def get_weather(latitude, longitude, tilt, azimuth):

    # ~1 km precision is plenty: the weather model grid is much coarser
    cache_key = (round(latitude, 2), round(longitude, 2), round(tilt), azimuth)
    cached = _cache_get(cache_key)
    if cached is not None:
        return cached

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": CURRENT_FIELDS,
        "hourly": "global_tilted_irradiance,temperature_2m",
        "tilt": tilt,
        "azimuth": azimuth,
        "timezone": "auto",
        "forecast_days": 1,
    }

    url = f"{BASE_URL}?{urlencode(params)}"

    request = Request(
        url,
        headers={"User-Agent": "SOLARIS-student-project/1.0"}
    )

    ssl_context = ssl.create_default_context(cafile=certifi.where())

    last_error = None
    last_reason = None

    for delay in (0, *RETRY_DELAYS):
        if delay:
            time.sleep(delay)

        try:
            with urlopen(request, timeout=20, context=ssl_context) as response:
                data = json.load(response)

            _cache_set(cache_key, data)
            return data

        except HTTPError as error:
            last_error = error
            last_reason = _error_reason(error)
            if error.code != 429:
                break

        except Exception as error:
            last_error = error
            break

    if isinstance(last_error, HTTPError) and last_error.code == 429:
        raise RuntimeError(
            "Weather service rate limit reached: "
            + (last_reason or "too many requests from this network.")
        )

    raise RuntimeError(f"Could not fetch weather data: {last_error}")


def process_weather_data(data):

    hourly = data["hourly"]

    times = hourly["time"]
    irradiance = hourly["global_tilted_irradiance"]
    temperatures = hourly["temperature_2m"]

    processed_data = []
    daily_energy = 0

    for time, gti, temp in zip(times, irradiance, temperatures):

        energy = gti / 1000 if gti is not None else None

        processed_data.append({
            "time": time,
            "irradiance": gti,
            "temperature": temp,
            "energy_kwh_m2": energy
        })

        if energy is not None:
            daily_energy += energy

    current = data.get("current") or {}

    current_weather = {
        "time": current.get("time"),
        "temperature": current.get("temperature_2m"),
        "feels_like": current.get("apparent_temperature"),
        "humidity": current.get("relative_humidity_2m"),
        "cloud_cover": current.get("cloud_cover"),
        "wind_speed": current.get("wind_speed_10m"),
        "precipitation": current.get("precipitation"),
        "weather_code": current.get("weather_code"),
        "is_day": bool(current.get("is_day")),
    }

    return {
        "latitude": data["latitude"],
        "longitude": data["longitude"],
        "timezone": data["timezone"],
        "current": current_weather,
        "hourly": processed_data,
        "daily_energy_kwh_m2": round(daily_energy, 3)
    }
