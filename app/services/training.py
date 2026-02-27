import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score

def generate_synthetic_data(n=1000):
    np.random.seed(42)

    temperature = np.random.normal(30, 5, n)
    humidity = np.random.normal(50, 10, n)
    wind_speed = np.random.normal(10, 3, n)

    risk_label = (
        (temperature > 32) &
        (humidity < 45) &
        (wind_speed > 12)
    ).astype(int)

    df = pd.DataFrame({
        "temperature": temperature,
        "humidity": humidity,
        "wind_speed": wind_speed,
        "risk_label": risk_label
    })

    return df


def train_model():

    df = generate_synthetic_data()

    X = df[["temperature", "humidity", "wind_speed"]]
    y = df["risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )

    model = xgb.XGBClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05
    )

    model.fit(X_train, y_train)

    preds = model.predict_proba(X_test)[:, 1]
    auc = roc_auc_score(y_test, preds)

    print(f"ROC-AUC: {auc:.4f}")

    model.save_model("risk_model.json")

    print("Model saved successfully.")

if __name__ == "__main__":
    train_model()