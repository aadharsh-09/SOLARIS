from fastapi import FastAPI

from app.routes.health import router as health_router
from app.routes.weather import router as weather_router
from app.routes.solar import router as solar_router


app = FastAPI(title="SOLARIS API")


@app.get("/")
def home():
    return {"message": "SOLARIS backend is running!"}


app.include_router(health_router)
app.include_router(weather_router)
app.include_router(solar_router)
