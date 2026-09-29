"""
Classical Preprocessing & Feature Engineering Layer for Hybrid QML
Aligned with SIH Problem Statement 26139
==================================================================
Handles:
1. Lexical field normalization (OCR/Report terminology to standard clinical features).
2. Physiological boundary validation.
3. Imputation of secondary parameters with clinical baselines.
4. Standardization and Angle Encoding mapping into [-pi, pi] for quantum rotation gates.
"""

import math
import numpy as np
from typing import Dict, Any, Tuple, Optional, List
from qml.schemas import ClinicalVitalsInput


# Canonical 6 features selected for the 6-qubit quantum circuit
SELECTED_FEATURES = ["age", "trestbps", "chol", "thalach", "oldpeak", "cp"]

# Domain physiological ranges: (min_valid, max_valid, default_median)
FEATURE_BOUNDS = {
    "age": (18.0, 110.0, 54.0),
    "trestbps": (70.0, 240.0, 130.0),   # Resting systolic BP in mmHg
    "chol": (100.0, 550.0, 240.0),      # Serum cholesterol in mg/dL
    "thalach": (50.0, 220.0, 150.0),    # Maximum heart rate in bpm
    "oldpeak": (0.0, 7.0, 1.0),         # ST depression
    "cp": (0, 3, 0)                     # Chest pain type (0=typical, 1=atypical, 2=non-anginal, 3=asymptomatic)
}

# Empirical training population statistics (Mean & Std Dev from Cleveland dataset)
TRAINING_STATS = {
    "age": {"mean": 54.37, "std": 9.08},
    "trestbps": {"mean": 131.62, "std": 17.54},
    "chol": {"mean": 246.26, "std": 51.83},
    "thalach": {"mean": 149.65, "std": 22.91},
    "oldpeak": {"mean": 1.04, "std": 1.16},
    "cp": {"mean": 0.97, "std": 1.03}
}


import re

def _extract_float(val: Any) -> Optional[float]:
    """Robustly extracts floating point numerical value from string representations with units."""
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip()
    if "/" in s:
        s = s.split("/")[0].strip()
    match = re.search(r"[-+]?\d*\.?\d+", s)
    if match:
        try:
            return float(match.group(0))
        except (ValueError, TypeError):
            return None
    return None


def normalize_input_dictionary(raw_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Translates unstructured report keys and aliases into canonical clinical feature names.
    Handles variations like 'bp', 'systolic_bp', 'resting_blood_pressure', etc.
    """
    normalized: Dict[str, Any] = {}
    
    # Flatten nested dictionaries if user passed {vitals: {...}}
    flat_data: Dict[str, Any] = {}
    for k, v in raw_data.items():
        if isinstance(v, dict):
            for sub_k, sub_v in v.items():
                flat_data[str(sub_k).lower().strip()] = sub_v
        else:
            flat_data[str(k).lower().strip()] = v

    # 1. Age
    for alias in ["age", "biological_age", "patient_age", "years_old"]:
        if alias in flat_data and flat_data[alias] is not None:
            num = _extract_float(flat_data[alias])
            if num is not None:
                normalized["age"] = num
                break

    # 2. Resting Blood Pressure (Systolic)
    for alias in ["trestbps", "systolic", "systolic_bp", "bp_systolic", "bp", "resting_blood_pressure", "blood_pressure"]:
        if alias in flat_data and flat_data[alias] is not None:
            num = _extract_float(flat_data[alias])
            if num is not None:
                normalized["trestbps"] = num
                break

    # 3. Serum Cholesterol
    for alias in ["chol", "cholesterol", "serum_cholesterol", "total_cholesterol", "lipid_cholesterol"]:
        if alias in flat_data and flat_data[alias] is not None:
            num = _extract_float(flat_data[alias])
            if num is not None:
                normalized["chol"] = num
                break

    # 4. Maximum Heart Rate (thalach)
    for alias in ["thalach", "heart_rate", "max_heart_rate", "pulse", "pulse_rate", "hr", "bpm"]:
        if alias in flat_data and flat_data[alias] is not None:
            num = _extract_float(flat_data[alias])
            if num is not None:
                normalized["thalach"] = num
                break

    # 5. ST Depression (oldpeak)
    for alias in ["oldpeak", "st_depression", "st_segment_depression", "st_change", "st_drop"]:
        if alias in flat_data and flat_data[alias] is not None:
            num = _extract_float(flat_data[alias])
            if num is not None:
                normalized["oldpeak"] = num
                break

    # 6. Chest Pain (cp)
    for alias in ["cp", "chest_pain", "chest_pain_type", "angina_type"]:
        if alias in flat_data and flat_data[alias] is not None:
            val = flat_data[alias]
            if isinstance(val, str):
                val_lower = val.lower()
                if "asymptomatic" in val_lower:
                    normalized["cp"] = 3
                elif "non-anginal" in val_lower or "non anginal" in val_lower:
                    normalized["cp"] = 2
                elif "atypical" in val_lower:
                    normalized["cp"] = 1
                else:
                    normalized["cp"] = 0
            else:
                try:
                    normalized["cp"] = int(val)
                except (ValueError, TypeError):
                    pass
            if "cp" in normalized:
                break

    return normalized


def validate_and_preprocess(
    raw_data: Dict[str, Any]
) -> Tuple[bool, Optional[np.ndarray], Dict[str, Any], Optional[str]]:
    """
    Validates patient data, handles imputation, checks sufficiency,
    and scales the 6 features to the quantum rotation interval [-pi, pi].

    Returns:
        (is_valid, scaled_quantum_vector, cleaned_features, error_message)
    """
    clean_dict = normalize_input_dictionary(raw_data)

    # Check for sufficient data: At least 2 of (age, trestbps, thalach, chol) must be present
    present_core_count = sum(
        1 for key in ["age", "trestbps", "thalach", "chol"] if key in clean_dict and clean_dict[key] is not None
    )

    if present_core_count < 2:
        return (
            False,
            None,
            clean_dict,
            "Insufficient structured clinical data for reliable QML prediction. "
            "Please ensure at least two core vital markers (e.g. Blood Pressure, Heart Rate, Age, or Cholesterol) are provided."
        )

    # Impute missing features with validated clinical medians and enforce physiological bounds
    final_features: Dict[str, float] = {}
    for feat in SELECTED_FEATURES:
        min_v, max_v, default_v = FEATURE_BOUNDS[feat]
        if feat in clean_dict and clean_dict[feat] is not None:
            val = float(clean_dict[feat])
            # Clamp to physiologically plausible bounds
            clamped_val = max(min_v, min(max_v, val))
            final_features[feat] = clamped_val
        else:
            final_features[feat] = default_v

    # Standardize and map to angle range [-pi, pi]
    # z = (x - mean) / std
    # angle = 2.0 * arctan(z) which strictly maps (-inf, +inf) to (-pi, pi) smoothly
    feature_vector = np.zeros(len(SELECTED_FEATURES), dtype=np.float64)
    for i, feat in enumerate(SELECTED_FEATURES):
        val = final_features[feat]
        mean = TRAINING_STATS[feat]["mean"]
        std = TRAINING_STATS[feat]["std"]
        z_score = (val - mean) / (std if std > 1e-6 else 1.0)
        # Smooth angle mapping into (-pi, pi)
        angle = 2.0 * math.atan(z_score)
        feature_vector[i] = angle

    return True, feature_vector, final_features, None
