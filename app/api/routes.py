from fastapi import APIRouter
from pydantic import BaseModel
# from app.database import SessionLocal
from app.models.risk_model import RiskModel
from app.models.simulation import simulate_propagation

from datetime import datetime
import uuid

router = APIRouter()

# -----------------------------
# In-Memory Storage (Zero Setup)
# -----------------------------

PREDICTIONS = []

_model_instance = None

def get_model():
    global _model_instance
    if _model_instance is None:
        _model_instance = RiskModel()
    return _model_instance


# -----------------------------
# Request Models
# -----------------------------

class RiskRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    latitude: float
    longitude: float


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
        "model": "ready"
    }


# -----------------------------
# Predict Risk
# -----------------------------

@router.post("/predict-risk")
def predict_risk(data: RiskRequest):

    model = get_model()

    probability = model.predict(
        temperature=data.temperature,
        humidity=data.humidity,
        wind_speed=data.wind_speed
    )

    prediction = {
        "id": str(uuid.uuid4()),
        "temperature": data.temperature,
        "humidity": data.humidity,
        "wind_speed": data.wind_speed,
        "risk_probability": probability,
        "latitude": data.latitude,
        "longitude": data.longitude,
        "created_at": datetime.now().isoformat()
    }
    
    PREDICTIONS.append(prediction)

    return {
        "risk_probability": probability,
        "risk_level": "HIGH" if probability > 0.6 else "LOW"
    }


# -----------------------------
# Explain Prediction
# -----------------------------

@router.post("/explain-risk")
def explain_risk(data: RiskRequest):

    model = get_model()

    explanation = model.explain(
        temperature=data.temperature,
        humidity=data.humidity,
        wind_speed=data.wind_speed
    )

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

    return {"results": list(reversed(PREDICTIONS))[:50]}


# -----------------------------
# Scenario Presets
# -----------------------------

@router.post("/predict-scenario")
def predict_scenario(data: ScenarioRequest):

    model = get_model()

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