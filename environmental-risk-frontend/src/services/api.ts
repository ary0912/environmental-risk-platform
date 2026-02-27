import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

// 🔹 System health
export const getSystemHealth = () =>
  API.get("/system-health");

// 🔹 Heatmap
export const getHeatmap = () =>
  API.get("/risk-heatmap");

// 🔹 Predict risk
export const predictRisk = (data: {
  temperature: number;
  humidity: number;
  wind_speed: number;
  latitude: number;
  longitude: number;
}) =>
  API.post("/predict-risk", data);

// 🔹 Explain risk  ✅ FIXED
export const explainRisk = (data: {
  temperature: number;
  humidity: number;
  wind_speed: number;
  latitude: number;
  longitude: number;
}) =>
  API.post("/explain-risk", data);

// 🔹 Simulation
export const runSimulation = (data: {
  grid: number[][];
  wind_factor: number;
  steps: number;
}) =>
  API.post("/simulate", data);

export const predictScenario = (scenario: string) =>
  API.post("/predict-scenario", { scenario });