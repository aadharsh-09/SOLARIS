
from fastapi import APIRouter, HTTPException, Query

from app.services.weather_service import (
    get_weather,
    process_weather_data
)

from app.services.solar_service import (
    calculate_solar_generation,
    calculate_monthly_generation
)


router = APIRouter()


@router.get("/solar")
def solar(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
    tilt: float = Query(ge=0, le=90),
    azimuth: float = Query(ge=-180, le=180),
    capacity_kw: float = Query(gt=0),
    performance_ratio: float = Query(default=0.8, gt=0, le=1)
):

    try:
        # Step 1: Fetch weather data
        weather_data = get_weather(
            latitude,
            longitude,
            tilt,
            azimuth
        )

        # Step 2: Process weather data
        processed_weather = process_weather_data(weather_data)

        daily_irradiation = processed_weather["daily_energy_kwh_m2"]

        # Step 3: Calculate daily solar generation
        daily_generation = calculate_solar_generation(
            daily_irradiation,
            capacity_kw,
            performance_ratio
        )

        # Step 4: Estimate monthly generation
        monthly_generation = calculate_monthly_generation(
            daily_generation
        )

        # Step 5: Return the results
        return {
            "location": {
                "latitude": processed_weather["latitude"],
                "longitude": processed_weather["longitude"],
                "timezone": processed_weather["timezone"]
            },

            "solar_system": {
                "capacity_kw": capacity_kw,
                "tilt": tilt,
                "azimuth": azimuth,
                "performance_ratio": performance_ratio
            },

            "solar_irradiation": {
                "daily_kwh_m2": daily_irradiation
            },

            "generation": {
                "daily_kwh": daily_generation,
                "estimated_monthly_kwh": monthly_generation
            }
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=502,
            detail=str(error)
        )
