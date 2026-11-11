from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.health import router as health_router
from app.routes.weather import router as weather_router
from app.routes.solar import router as solar_router


app = FastAPI(title="SOLARIS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://solaris-lac.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "SOLARIS backend is running!"}


app.include_router(health_router)
app.include_router(weather_router)
app.include_router(solar_router)
