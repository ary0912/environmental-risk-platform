from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.api.routes import router
from app.database import engine
from app.models.prediction_log import PredictionLog


# ----------------------------------
# Configure Logging
# ----------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ----------------------------------
# Create FastAPI App
# ----------------------------------

app = FastAPI(
    title="Environmental Risk Modelling API",
    description="Industrial-grade environmental risk forecasting system",
    version="1.0.0"
)


# ----------------------------------
# CORS Configuration
# ----------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://environmental-risk-platform.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------
# Startup Event (Safe DB Init)
# ----------------------------------

@app.on_event("startup")
async def startup_event():
    try:
        PredictionLog.metadata.create_all(bind=engine)
        logger.info("Database tables verified successfully.")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")


# ----------------------------------
# Register Routes
# ----------------------------------

app.include_router(router)


# ----------------------------------
# Root Health Check
# ----------------------------------

@app.get("/")
def root():
    return {
        "status": "API running successfully 🚀"
    }