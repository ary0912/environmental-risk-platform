import xgboost as xgb
import pandas as pd
import shap
from typing import List, Dict


class RiskModel:

    def __init__(self):
        # Load trained XGBoost model
        self.model = xgb.XGBClassifier()
        self.model.load_model("app/risk_model.json")

        # Use Booster for SHAP (more stable)
        self.booster = self.model.get_booster()
        self.explainer = shap.TreeExplainer(self.booster)

    # ----------------------------------
    # Predict Risk Probability
    # ----------------------------------
    def predict(
        self,
        temperature: float,
        humidity: float,
        wind_speed: float
    ) -> float:

        df = pd.DataFrame([{
            "temperature": float(temperature),
            "humidity": float(humidity),
            "wind_speed": float(wind_speed)
        }])

        probability = self.model.predict_proba(df)[0][1]

        # 🔥 Convert numpy.float32 → native float
        return float(probability)

    # ----------------------------------
    # Explain Prediction (SHAP)
    # ----------------------------------
    def explain(
        self,
        temperature: float,
        humidity: float,
        wind_speed: float
    ) -> List[Dict[str, float]]:

        df = pd.DataFrame([{
            "temperature": float(temperature),
            "humidity": float(humidity),
            "wind_speed": float(wind_speed)
        }])

        shap_values = self.explainer.shap_values(df)

        # shap_values[0] → numpy array of contributions
        feature_names = df.columns
        feature_values = shap_values[0]

        explanation = []

        for feature, value in zip(feature_names, feature_values):
            explanation.append({
                "feature": str(feature),
                "contribution": float(value)  # 🔥 CRITICAL FIX
            })

        return explanation