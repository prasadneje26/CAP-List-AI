# ============================================================
# AI COLLEGE CAP COUNSELING PLATFORM
# File: ai-engine/cutoff_predictor/preprocess.py
# ============================================================

import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder, StandardScaler
import joblib
import os

PROCESSED_DIR = os.path.join(os.path.dirname(__file__), "../../data/processed")
MODEL_DIR     = os.path.dirname(__file__)

CATEGORY_MAP = {
    "OPEN": 0, "OBC": 1, "SC": 2, "ST": 3,
    "EWS": 4, "TFWS": 5, "PWD": 6,
}
EXAM_MAP = {"CET": 0, "JEE": 1}


def load_raw_cutoffs(data_dir: str) -> pd.DataFrame:
    """Load and merge all yearly cutoff CSVs."""
    frames = []
    for year in [2022, 2023, 2024, 2025]:
        path = os.path.join(data_dir, f"cutoff_{year}.csv")
        if os.path.exists(path):
            df = pd.read_csv(path)
            df["year"] = year
            frames.append(df)
    if not frames:
        raise FileNotFoundError("No cutoff CSV files found in raw-cutoffs/")
    return pd.concat(frames, ignore_index=True)


def clean(df: pd.DataFrame) -> pd.DataFrame:
    """Clean and normalize a raw cutoffs DataFrame."""
    df = df.copy()

    # Standardize column names
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # Required columns
    required = ["college_code", "branch", "category", "exam_type",
                "cutoff_percentile", "year"]
    df = df.dropna(subset=required)

    # Type coercions
    df["cutoff_percentile"] = pd.to_numeric(df["cutoff_percentile"], errors="coerce")
    df["year"]              = pd.to_numeric(df["year"], errors="coerce").astype(int)

    # Drop invalid
    df = df.dropna(subset=["cutoff_percentile"])
    df = df[df["cutoff_percentile"].between(0, 100)]

    # Encode categoricals
    df["category_enc"]  = df["category"].map(CATEGORY_MAP).fillna(0).astype(int)
    df["exam_type_enc"] = df["exam_type"].map(EXAM_MAP).fillna(0).astype(int)

    # Label-encode branch and college_code
    le_branch  = LabelEncoder()
    le_college = LabelEncoder()
    df["branch_enc"]  = le_branch.fit_transform(df["branch"].astype(str))
    df["college_enc"] = le_college.fit_transform(df["college_code"].astype(str))

    # Save encoders
    joblib.dump(le_branch,  os.path.join(MODEL_DIR, "le_branch.pkl"))
    joblib.dump(le_college, os.path.join(MODEL_DIR, "le_college.pkl"))

    return df


def build_features(df: pd.DataFrame):
    """
    Build feature matrix X and target y for cutoff prediction.

    Features per row:
      college_enc, branch_enc, category_enc, exam_type_enc,
      year, prev_year_cutoff, 2yr_trend
    """
    df = df.sort_values(["college_code", "branch", "category", "exam_type", "year"])

    # Lag features
    group_keys = ["college_code", "branch", "category", "exam_type"]
    df["prev_cutoff"] = df.groupby(group_keys)["cutoff_percentile"].shift(1)
    df["trend_2yr"]   = df["cutoff_percentile"] - df.groupby(group_keys)["cutoff_percentile"].shift(2)

    # Drop rows without lag (first year per group)
    df = df.dropna(subset=["prev_cutoff"])

    feature_cols = [
        "college_enc", "branch_enc", "category_enc",
        "exam_type_enc", "year", "prev_cutoff", "trend_2yr",
    ]
    X = df[feature_cols].fillna(0).values
    y = df["cutoff_percentile"].values

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, os.path.join(MODEL_DIR, "scaler_cutoff.pkl"))

    return X_scaled, y, df


if __name__ == "__main__":
    raw_dir = os.path.join(os.path.dirname(__file__), "../../data/raw-cutoffs")
    df_raw  = load_raw_cutoffs(raw_dir)
    df_clean = clean(df_raw)
    X, y, df_feat = build_features(df_clean)
    print(f"Features shape: {X.shape}, Samples: {len(y)}")
    print("Preprocessing complete.")
