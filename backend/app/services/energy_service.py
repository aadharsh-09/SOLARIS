
def calculate_monthly_consumption(daily_consumption):
    """
    Calculate estimated monthly household electricity consumption.

    daily_consumption: Average daily usage in kWh
    """

    if daily_consumption < 0:
        raise ValueError("Daily consumption cannot be negative.")

    monthly_consumption = daily_consumption * 30

    return round(monthly_consumption, 3)


def compare_energy(monthly_generation, monthly_consumption):
    """
    Compare monthly solar generation with household consumption.
    """

    difference = monthly_generation - monthly_consumption

    if monthly_consumption > 0:
        coverage_percentage = min(
            (monthly_generation / monthly_consumption) * 100,
            100
        )
        coverage_percentage = round(coverage_percentage, 2)
    else:
        coverage_percentage = None

    if difference > 0:
        energy_status = "surplus"
    elif difference < 0:
        energy_status = "deficit"
    else:
        energy_status = "balanced"

    return {
        "difference_kwh": round(difference, 3),
        "coverage_percentage": coverage_percentage,
        "status": energy_status
    }
