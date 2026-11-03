from app.services.weather_service import get_weather

data = get_weather(13.0827, 80.2707, 20, 0)

print(data["latitude"])
print(data["longitude"])
print(data["hourly"]["global_tilted_irradiance"])