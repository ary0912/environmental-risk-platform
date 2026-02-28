import axios from "axios";

// 🔥 Production-safe API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

const API = axios.create({
  baseURL: API_BASE_URL,
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

// 🔹 Explain risk
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
  API.post("/simulate-risk", data);  // ✅ FIXED endpoint

// 🔹 Scenario
export const predictScenario = (scenario: string) =>
  API.post("/predict-scenario", { scenario });