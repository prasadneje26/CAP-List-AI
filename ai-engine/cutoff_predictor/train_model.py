# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/cutoff_predictor/train_model.py
# ============================================================

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
from preprocess import load_raw_cutoffs, clean, build_features

MODEL_DIR = os.path.dirname(__file__)
DATA_DIR  = os.path.join(MODEL_DIR, "../../data/raw-cutoffs")


def train():
    print("── Loading and preprocessing data ──")
    df_raw   = load_raw_cutoffs(DATA_DIR)
    df_clean = clean(df_raw)
    X, y, _  = build_features(df_clean)

    print(f"Dataset: {X.shape[0]} samples, {X.shape[1]} features")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # ── Model 1: Gradient Boosting (primary) ─────────────────
    print("\n── Training Gradient Boosting Regressor ──")
    gbr = GradientBoostingRegressor(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=5,
        min_samples_split=4,
        subsample=0.85,
        random_state=42,
    )
    gbr.fit(X_train, y_train)

    y_pred_gbr = gbr.predict(X_test)
    mae_gbr    = mean_absolute_error(y_test, y_pred_gbr)
    r2_gbr     = r2_score(y_test, y_pred_gbr)
    print(f"GBR  → MAE: {mae_gbr:.4f} | R²: {r2_gbr:.4f}")

    # ── Model 2: Random Forest (ensemble backup) ──────────────
    print("\n── Training Random Forest Regressor ──")
    rfr = RandomForestRegressor(
        n_estimators=200,
        max_depth=10,
        min_samples_leaf=2,
        n_jobs=-1,
        random_state=42,
    )
    rfr.fit(X_train, y_train)

    y_pred_rfr = rfr.predict(X_test)
    mae_rfr    = mean_absolute_error(y_test, y_pred_rfr)
    r2_rfr     = r2_score(y_test, y_pred_rfr)
    print(f"RFR  → MAE: {mae_rfr:.4f} | R²: {r2_rfr:.4f}")

    # ── Ensemble: weighted average ────────────────────────────
    y_pred_ens = 0.6 * y_pred_gbr + 0.4 * y_pred_rfr
    mae_ens    = mean_absolute_error(y_test, y_pred_ens)
    r2_ens     = r2_score(y_test, y_pred_ens)
    print(f"\nEnsemble → MAE: {mae_ens:.4f} | R²: {r2_ens:.4f}")

    # Cross-validation on GBR
    cv_scores = cross_val_score(gbr, X, y, cv=5, scoring="neg_mean_absolute_error")
    print(f"CV MAE (5-fold): {-cv_scores.mean():.4f} ± {cv_scores.std():.4f}")

    # ── Save best model ───────────────────────────────────────
    best_model = gbr if mae_gbr <= mae_rfr else rfr
    model_path = os.path.join(MODEL_DIR, "model.pkl")
    joblib.dump({"gbr": gbr, "rfr": rfr, "primary": best_model}, model_path)
    print(f"\n✓ Model saved → {model_path}")

    return {
        "gbr_mae": round(mae_gbr, 4),
        "rfr_mae": round(mae_rfr, 4),
        "ensemble_mae": round(mae_ens, 4),
        "r2": round(r2_ens, 4),
    }


if __name__ == "__main__":
    metrics = train()
    print("\n── Training Complete ──")
    for k, v in metrics.items():
        print(f"  {k}: {v}")
