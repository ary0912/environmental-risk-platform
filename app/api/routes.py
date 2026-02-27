from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import text
from app.database import SessionLocal
from app.models.risk_model import RiskModel
from app.models.simulation import simulate_propagation

router = APIRouter()
model = RiskModel()

# -----------------------------
# Request Models
# -----------------------------

class RiskRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    latitude: float
    longitude: float


class ExplainRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float


class ScenarioRequest(BaseModel):
    scenario: str


class SimulationRequest(BaseModel):
    grid: list
    wind_factor: float = 1.0
    steps: int = 3


# -----------------------------
# System Health
# -----------------------------

@router.get("/system-health")
def system_health():
    return {
        "api": "operational",
        "database": "connected",
        "model": "loaded"
    }


# -----------------------------
# Predict Risk
# -----------------------------

@router.post("/predict-risk")
def predict_risk(data: RiskRequest):

    probability = model.predict(
        temperature=data.temperature,
        humidity=data.humidity,
        wind_speed=data.wind_speed
    )

    db = SessionLocal()

    db.execute(
        text("""
            INSERT INTO predictions (
                temperature, humidity, wind_speed,
                risk_probability, latitude, longitude,
                location
            )
            VALUES (
                :temperature, :humidity, :wind_speed,
                :risk_probability, :latitude, :longitude,
                ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
            )
        """),
        {
            "temperature": data.temperature,
            "humidity": data.humidity,
            "wind_speed": data.wind_speed,
            "risk_probability": probability,
            "latitude": data.latitude,
            "longitude": data.longitude,
        }
    )

    db.commit()
    db.close()

    return {
        "risk_probability": probability,
        "risk_level": "HIGH" if probability > 0.6 else "LOW"
    }


# -----------------------------
# Explain Prediction
# -----------------------------

@router.post("/explain-risk")
def explain_risk(data: RiskRequest):

    explanation = model.explain(
        temperature=data.temperature,
        humidity=data.humidity,
        wind_speed=data.wind_speed
    )

    # 🔥 Ensure everything is JSON safe
    cleaned = [
        {
            "feature": str(item["feature"]),
            "contribution": float(item["contribution"])
        }
        for item in explanation
    ]

    return {
        "feature_contributions": cleaned
    }


# -----------------------------
# Heatmap Data
# -----------------------------

@router.get("/risk-heatmap")
def risk_heatmap():
    db = SessionLocal()

    result = db.execute(text("""
        SELECT id,
               temperature,
               humidity,
               wind_speed,
               risk_probability,
               created_at,
               ST_Y(location::geometry) as latitude,
               ST_X(location::geometry) as longitude
        FROM predictions
        ORDER BY created_at ASC
    """))

    rows = result.fetchall()
    db.close()

    return {"results": [dict(row._mapping) for row in rows]}


# -----------------------------
# Scenario Presets
# -----------------------------

@router.post("/predict-scenario")
def predict_scenario(data: ScenarioRequest):

    presets = {
        "baseline": {"temperature": 25, "humidity": 50, "wind_speed": 10},
        "heatwave": {"temperature": 40, "humidity": 30, "wind_speed": 15},
        "high_wind": {"temperature": 20, "humidity": 45, "wind_speed": 35},
        "decarbonised": {"temperature": 22, "humidity": 55, "wind_speed": 8}
    }

    config = presets.get(data.scenario, presets["baseline"])

    probability = model.predict(**config)

    return {
        "scenario": data.scenario,
        "risk_probability": probability
    }


# -----------------------------
# Simulation
# -----------------------------

@router.post("/simulate-risk")
def simulate(data: SimulationRequest):

    result = simulate_propagation(
        grid=data.grid,
        wind_factor=data.wind_factor,
        steps=data.steps
    )

    return {"simulation_result": result}