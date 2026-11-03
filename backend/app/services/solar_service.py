
def calculate_solar_generation(
    daily_irradiation,
    capacity_kw,
    performance_ratio=0.8
):
    """
    Calculate estimated daily solar electricity generation.

    daily_irradiation: kWh/m²/day
    capacity_kw: Installed solar capacity in kWp
    performance_ratio: Accounts for system losses
    """

    if daily_irradiation < 0:
        raise ValueError("Daily irradiation cannot be negative.")

    if capacity_kw <= 0:
        raise ValueError("Solar capacity must be greater than zero.")

    if not 0 < performance_ratio <= 1:
        raise ValueError("Performance ratio must be between 0 and 1.")

    generation = (
        daily_irradiation
        * capacity_kw
        * performance_ratio
    )

    return round(generation, 3)


def calculate_monthly_generation(daily_generation):
    """
    Simplified monthly estimate assuming 30 identical days.
    """

    if daily_generation < 0:
        raise ValueError("Daily generation cannot be negative.")

    return round(daily_generation * 30, 3)
