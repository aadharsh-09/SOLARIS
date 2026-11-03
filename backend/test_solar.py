
from app.services.solar_service import (
    calculate_solar_generation,
    calculate_monthly_generation
)


daily_irradiation = 5.634
capacity_kw = 3

daily_generation = calculate_solar_generation(
    daily_irradiation,
    capacity_kw
)

monthly_generation = calculate_monthly_generation(
    daily_generation
)

print("Daily solar generation:", daily_generation, "kWh")
print("Estimated monthly generation:", monthly_generation, "kWh")
