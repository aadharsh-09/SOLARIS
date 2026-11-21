
import ssl
import certifi
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

BASE_URL = "https://api.open-meteo.com/v1/forecast"

CURRENT_FIELDS = (
    "temperature_2m,apparent_temperature,relative_humidity_2m,"
    "is_day,precipitation,weather_code,cloud_cover,wind_speed_10m"
)


def get_weather(latitude, longitude, tilt, azimuth):

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

    try:
        with urlopen(request, timeout=20, context=ssl_context) as response:
            data = json.load(response)

        return data

    except Exception as error:
        raise RuntimeError(f"Could not fetch weather data: {error}")


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
