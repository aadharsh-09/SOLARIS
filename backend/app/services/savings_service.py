def calculate_savings(
    monthly_generation,
    monthly_consumption,
    grid_tariff,
    export_tariff
):
    """
    Calculate financial benefits from solar electricity.

    grid_tariff: Cost of purchasing electricity from the grid (₹/kWh)
    export_tariff: Credit received for exporting electricity (₹/kWh)
    """

    if monthly_generation < 0:
        raise ValueError("Solar generation cannot be negative.")

    if monthly_consumption < 0:
        raise ValueError("Electricity consumption cannot be negative.")

    if grid_tariff < 0 or export_tariff < 0:
        raise ValueError("Electricity tariffs cannot be negative.")

    # Cost of electricity without solar
    grid_cost_without_solar = (
        monthly_consumption * grid_tariff
    )

    # Solar electricity used by the household
    solar_energy_used = min(
        monthly_generation,
        monthly_consumption
    )

    # Money saved by not purchasing that electricity
    money_saved = solar_energy_used * grid_tariff

    # Remaining electricity exported to the grid
    surplus_exported = max(
        monthly_generation - monthly_consumption,
        0
    )

    # Credit earned from exported electricity
    export_credit = surplus_exported * export_tariff

    # Electricity still bought from the grid after using solar
    grid_energy_needed = max(
        monthly_consumption - monthly_generation,
        0
    )

    # Grid bill with solar, and net bill after subtracting the export credit
    grid_cost_with_solar = grid_energy_needed * grid_tariff
    net_bill_with_solar = grid_cost_with_solar - export_credit

    # Total financial benefit
    total_benefit = money_saved + export_credit

    return {
        "grid_tariff_inr_per_kwh": grid_tariff,
        "export_tariff_inr_per_kwh": export_tariff,
        "grid_energy_needed_kwh": round(
            grid_energy_needed, 3
        ),
        "grid_cost_with_solar_inr": round(
            grid_cost_with_solar, 2
        ),
        "net_bill_with_solar_inr": round(
            net_bill_with_solar, 2
        ),
        "grid_cost_without_solar_inr": round(
            grid_cost_without_solar, 2
        ),
        "solar_energy_used_kwh": round(
            solar_energy_used, 3
        ),
        "money_saved_inr": round(
            money_saved, 2
        ),
        "surplus_exported_kwh": round(
            surplus_exported, 3
        ),
        "export_credit_inr": round(
            export_credit, 2
        ),
        "total_monthly_benefit_inr": round(
            total_benefit, 2
        )
    }