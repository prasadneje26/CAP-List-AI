# Model Training Guide - CAP List AI Platform

This guide explains how to train all machine learning models in the CAP (College Admission Predictor) List AI project.

## Overview

The project includes the following trainable models:

1. **Admission Predictor Classifier** (`admission_predictor/train_classifier.py`)
   - Predicts whether a student will be admitted to a college
   - Algorithm: Gradient Boosting Classifier
   - Input: Student percentile, cutoff, category, exam type
   - Output: Admission probability (0-1)

2. **Cutoff Predictor Regressor** (`cutoff_predictor/train_model.py`)
   - Predicts college admission cutoff percentiles
   - Algorithms: Gradient Boosting Regressor + Random Forest (ensemble)
   - Input: Historical cutoff data (2022-2025)
   - Output: Predicted cutoff percentile

## Prerequisites

### System Requirements
- Python 3.8 or higher
- pip (Python package manager)
- ~500MB free disk space for models and data

### Install Dependencies

Navigate to the `ai-engine` directory and install required packages:

```bash
cd ai-engine
pip install -r requirements.txt
```

**Required Packages:**
- scikit-learn: Machine learning algorithms
- pandas: Data manipulation
- numpy: Numerical computing
- joblib: Model serialization
- fastapi: API framework (optional for serving)

## Training Data

The project expects training data in the following structure:

```
data/
├── training-data/
│   ├── admission_training.csv      # Admission records
│   └── cutoff_training.csv         # Not used in current pipeline
└── raw-cutoffs/
    ├── cutoff_2022.csv             # Historical cutoff data
    ├── cutoff_2023.csv
    ├── cutoff_2024.csv
    └── cutoff_2025.csv
```

### Data Format

**admission_training.csv** columns:
- `percentile`: Student's exam percentile (0-100)
- `cutoff_percentile`: College's cutoff percentile
- `gap`: Difference between percentile and cutoff
- `category`: Admission category (OPEN, OBC, SC, ST, EWS, TFWS, PWD)
- `exam_type`: Exam type (CET, JEE)
- `admitted`: Target variable (0=not admitted, 1=admitted)

**cutoff_20XX.csv** columns:
- `college_code`: Unique college identifier
- `branch`: Engineering branch
- `category`: Admission category
- `exam_type`: Exam type
- `cutoff_percentile`: Cutoff percentile for that year
- `year`: Year of data

**If training data is missing:** The scripts will generate synthetic data for bootstrapping.

## Quick Start

### Option 1: Using PowerShell (Windows)

```powershell
# From project root directory
.\train_models.ps1
```

### Option 2: Using Command Prompt (Windows)

```cmd
# From project root directory
train_models.bat
```

### Option 3: Using Bash (Linux/macOS)

```bash
# From project root directory
chmod +x train_models.sh
./train_models.sh
```

### Option 4: Using Python Directly

```bash
cd ai-engine
python train_all_models.py
```

## What the Training Script Does

When you run the training script, it will:

1. **Verify Training Data** ✓
   - Check for required CSV files
   - Show warnings if data is missing (synthetic data will be used)

2. **Train Admission Predictor** 
   - Loads admission training data
   - Builds feature matrix
   - Trains Gradient Boosting Classifier
   - Performs 5-fold cross-validation
   - Saves model to `admission_predictor/classifier.pkl`
   - Saves scaler to `admission_predictor/scaler.pkl`

3. **Train Cutoff Predictor**
   - Loads and merges historical cutoff data (2022-2025)
   - Cleans and preprocesses data
   - Builds lag features (previous year cutoff, 2-year trend)
   - Trains Gradient Boosting Regressor
   - Trains Random Forest Regressor
   - Creates ensemble model
   - Saves models to `cutoff_predictor/model.pkl`
   - Saves encoders and scaler for preprocessing

4. **Display Summary**
   - Shows training status for each model
   - Reports metrics (AUC-ROC, MAE, R²)
   - Total training time

## Training Metrics

### Admission Predictor Metrics
- **AUC-ROC**: Area under the Receiver Operating Characteristic curve (0-1, higher is better)
- **5-fold CV AUC**: Cross-validation score for robustness
- **Classification Report**: Precision, Recall, F1-score

### Cutoff Predictor Metrics
- **MAE (Mean Absolute Error)**: Average prediction error in percentile points
- **R² Score**: Coefficient of determination (0-1, higher is better)
- **5-fold CV MAE**: Cross-validation score

## Output Files

After training, the following model files are created:

```
ai-engine/
├── admission_predictor/
│   ├── classifier.pkl          # Trained model + scaler
│   └── predict_probability.py  # Inference script
├── cutoff_predictor/
│   ├── model.pkl               # Trained models (GBR, RFR, ensemble)
│   ├── le_branch.pkl           # Branch encoder
│   ├── le_college.pkl          # College code encoder
│   ├── scaler_cutoff.pkl       # Feature scaler
│   └── predict.py              # Inference script
```

## Using Trained Models

### Admission Predictor

```python
import joblib
from admission_predictor.predict_probability import predict_admission_probability

# Load model
model_data = joblib.load("admission_predictor/classifier.pkl")

# Make predictions
probability = predict_admission_probability(
    percentile=85.5,
    cutoff_percentile=78.0,
    category="OPEN",
    exam_type="JEE"
)
print(f"Admission Probability: {probability:.2%}")
```

### Cutoff Predictor

```python
from cutoff_predictor.predict import predict_cutoff

# Make predictions
predicted_cutoff = predict_cutoff(
    college_code="COL001",
    branch="CSE",
    category="OPEN",
    exam_type="JEE"
)
print(f"Predicted Cutoff: {predicted_cutoff:.2f}%")
```

## Troubleshooting

### Issue: "Python not found"
**Solution:** Install Python 3.8+ from [python.org](https://www.python.org/downloads/) or use your package manager.

### Issue: "ModuleNotFoundError: No module named 'sklearn'"
**Solution:** Install dependencies:
```bash
pip install -r ai-engine/requirements.txt
```

### Issue: "FileNotFoundError: No such file or directory: 'cutoff_2024.csv'"
**Solution:** This is expected if actual training data is not available. The script will generate synthetic data automatically.

### Issue: Training is very slow
**Solution:** 
- Consider reducing `n_estimators` in model configurations
- Use a smaller subset of training data for initial testing
- Ensure you're not running other heavy processes

### Issue: "PermissionError" on Windows scripts
**Solution:** Allow script execution:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Retraining Models

To retrain models with new data:

1. Update the CSV files in `data/training-data/` and `data/raw-cutoffs/`
2. Run the training script again
3. The new models will overwrite previous versions

## Advanced Options

### Training Individual Models

```bash
cd ai-engine

# Train only admission predictor
python admission_predictor/train_classifier.py

# Train only cutoff predictor
python cutoff_predictor/train_model.py
```

### Custom Configuration

Edit model parameters in the respective training files:
- `admission_predictor/train_classifier.py` (lines ~60-80)
- `cutoff_predictor/train_model.py` (lines ~25-55)

## Performance Considerations

- **Training Time**: 2-10 minutes depending on data size and system specs
- **Model Size**: ~5-20 MB per model
- **Memory Usage**: 500MB - 2GB during training
- **Inference Time**: <100ms per prediction

## API Integration

If using the FastAPI server, models are automatically loaded on startup:

```bash
cd ai-engine
python api/main.py
```

Then make predictions via HTTP:

```bash
curl -X POST http://localhost:8000/api/predict/admission \
  -H "Content-Type: application/json" \
  -d '{"percentile": 85.5, "cutoff": 78.0, "category": "OPEN", "exam_type": "JEE"}'
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review model performance metrics in training output
3. Verify training data format and completeness
4. Check system requirements (Python version, disk space, memory)

---

**Last Updated:** April 2025  
**Project:** CAP List AI Platform  
**Version:** 1.0.0
