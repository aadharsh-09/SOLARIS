
from app.services.energy_service import calculate_monthly_consumption

daily_consumption = 12

monthly_consumption = calculate_monthly_consumption(
    daily_consumption
)

print("Daily consumption:", daily_consumption, "kWh")
print("Monthly consumption:", monthly_consumption, "kWh")
