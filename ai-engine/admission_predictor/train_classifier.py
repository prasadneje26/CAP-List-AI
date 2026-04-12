# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/admission_predictor/train_classifier.py
# ============================================================

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.pipeline import Pipeline

MODEL_DIR = os.path.dirname(__file__)
DATA_DIR  = os.path.join(MODEL_DIR, "../../data/training-data")

CATEGORY_MAP = {"OPEN":0,"OBC":1,"SC":2,"ST":3,"EWS":4,"TFWS":5,"PWD":6}
EXAM_MAP     = {"CET":0,"JEE":1}


def load_training_data() -> pd.DataFrame:
    path = os.path.join(DATA_DIR, "admission_training.csv")
    if not os.path.exists(path):
        # Generate synthetic training data if CSV not present
        print("⚠ admission_training.csv not found — generating synthetic data")
        return generate_synthetic_data()
    return pd.read_csv(path)


def generate_synthetic_data(n: int = 5000) -> pd.DataFrame:
    """
    Synthetic dataset for bootstrapping.
    Features: percentile, cutoff, gap, category, exam_type
    Target:   admitted (1/0)
    """
    np.random.seed(42)
    percentiles = np.random.uniform(50, 100, n)
    cutoffs     = np.random.uniform(55, 99.5, n)
    gaps        = percentiles - cutoffs
    categories  = np.random.choice(list(CATEGORY_MAP.keys()), n)
    exam_types  = np.random.choice(["CET", "JEE"], n)

    # Admission probability: sigmoid on gap + category bonus
    cat_bonus = np.array([0.5 if c in ("SC","ST","EWS") else 0 for c in categories])
    logit     = 0.8 * gaps + cat_bonus
    prob      = 1 / (1 + np.exp(-logit))
    admitted  = (np.random.uniform(0, 1, n) < prob).astype(int)

    return pd.DataFrame({
        "percentile":        percentiles,
        "cutoff_percentile": cutoffs,
        "gap":               gaps,
        "category":          categories,
        "exam_type":         exam_types,
        "admitted":          admitted,
    })


def build_features(df: pd.DataFrame):
    df = df.copy()
    df["category_enc"]  = df["category"].map(CATEGORY_MAP).fillna(0).astype(int)
    df["exam_type_enc"] = df["exam_type"].map(EXAM_MAP).fillna(0).astype(int)
    df["gap"]           = df["percentile"] - df["cutoff_percentile"]
    df["gap_sq"]        = df["gap"] ** 2
    df["gap_pos"]       = (df["gap"] > 0).astype(int)

    feature_cols = [
        "percentile", "cutoff_percentile", "gap", "gap_sq",
        "gap_pos", "category_enc", "exam_type_enc",
    ]
    X = df[feature_cols].values
    y = df["admitted"].values
    return X, y


def train():
    print("── Loading training data ──")
    df = load_training_data()
    X, y = build_features(df)
    print(f"Dataset: {X.shape[0]} samples | Admitted rate: {y.mean():.2%}")

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s  = scaler.transform(X_test)

    # ── Model ─────────────────────────────────────────────────
    print("\n── Training GradientBoosting Classifier ──")
    gbc = GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.08,
        max_depth=4,
        subsample=0.85,
        random_state=42,
    )
    gbc.fit(X_train_s, y_train)

    y_prob = gbc.predict_proba(X_test_s)[:, 1]
    auc    = roc_auc_score(y_test, y_prob)
    print(f"AUC-ROC: {auc:.4f}")
    print(classification_report(y_test, gbc.predict(X_test_s)))

    # Cross validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_auc = cross_val_score(gbc, scaler.transform(X), y, cv=cv, scoring="roc_auc")
    print(f"CV AUC (5-fold): {cv_auc.mean():.4f} ± {cv_auc.std():.4f}")

    # ── Save ──────────────────────────────────────────────────
    joblib.dump({"model": gbc, "scaler": scaler}, os.path.join(MODEL_DIR, "classifier.pkl"))
    print(f"\n✓ Classifier saved → {MODEL_DIR}/classifier.pkl")


if __name__ == "__main__":
    train()
