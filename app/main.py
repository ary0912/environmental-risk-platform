from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.database import engine
from app.models.prediction_log import PredictionLog


app = FastAPI(
    title="Environmental Risk Modelling API",
    description="Industrial-grade environmental risk forecasting system",
    version="1.0.0"
)

# 🔹 CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Create tables on startup
PredictionLog.metadata.create_all(bind=engine)

# 🔹 Register API routes
app.include_router(router)

# 🔹 Root health check
@app.get("/")
def root():
    return {"status": "API running successfully"}

# 🔹 System health endpoint (frontend expects this)
@app.get("/system-health")
def system_health():
    return {
        "status": "healthy",
        "database": "connected"
    }