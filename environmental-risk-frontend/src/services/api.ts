import axios from "axios";

// Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000";

// Axios instance
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
  API.post("/simulate-risk", data);

// 🔹 Scenario
export const predictScenario = (scenario: string) =>
  API.post("/predict-scenario", { scenario });