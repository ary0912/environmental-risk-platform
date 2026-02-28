import os
import xgboost as xgb
import pandas as pd
import shap
from typing import List, Dict


class RiskModel:
    def __init__(self):
        self.model = None
        self.booster = None
        self.explainer = None

    def _load_model(self):
        if self.model is None:
            model_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "risk_model.json")
            )

            self.model = xgb.XGBClassifier()
            self.model.load_model(model_path)
            self.booster = self.model.get_booster()

    def _load_explainer(self):
        if self.explainer is None:
            self._load_model()
            self.explainer = shap.TreeExplainer(self.booster)

    def predict(self, temperature: float, humidity: float, wind_speed: float) -> float:
        self._load_model()

        df = pd.DataFrame([{
            "temperature": float(temperature),
            "humidity": float(humidity),
            "wind_speed": float(wind_speed)
        }])

        probability = self.model.predict_proba(df)[0][1]
        return float(probability)

    def explain(self, temperature: float, humidity: float, wind_speed: float) -> List[Dict[str, float]]:
        self._load_explainer()

        df = pd.DataFrame([{
            "temperature": float(temperature),
            "humidity": float(humidity),
            "wind_speed": float(wind_speed)
        }])

        shap_values = self.explainer.shap_values(df)

        explanation = []
        for feature, value in zip(df.columns, shap_values[0]):
            explanation.append({
                "feature": str(feature),
                "contribution": float(value)
            })

        return explanation