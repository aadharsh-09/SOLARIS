from typing import Literal

from fastapi import APIRouter, HTTPException, Query

from app.config import FACING_TO_AZIMUTH
from app.services.weather_service import get_weather, process_weather_data

router = APIRouter()


@router.get("/weather")
def weather(
    latitude: float = Query(ge=-90, le=90),
    longitude: float = Query(ge=-180, le=180),
    tilt: float = Query(ge=0, le=90),
    facing: Literal["N", "NE", "E", "SE", "S", "SW", "W", "NW"] = "S"
):
    try:
        data = get_weather(
            latitude,
            longitude,
            tilt,
            FACING_TO_AZIMUTH[facing]
        )

        processed_data = process_weather_data(data)

        return processed_data

    except Exception as error:
        raise HTTPException(status_code=502, detail=str(error))
