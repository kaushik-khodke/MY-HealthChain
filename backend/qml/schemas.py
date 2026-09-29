"""
Pydantic Data Schemas for Hybrid QML Clinical Disease Prediction
Aligned with SIH Problem Statement 26139
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class ClinicalVitalsInput(BaseModel):
    """Normalized clinical inputs for cardiovascular disease prediction."""
    age: Optional[float] = Field(None, description="Patient age in years (1-120)")
    sex: Optional[int] = Field(1, description="Biological sex (1=Male, 0=Female)")
    cp: Optional[int] = Field(None, description="Chest pain type (0=Typical Angina, 1=Atypical, 2=Non-anginal, 3=Asymptomatic)")
    trestbps: Optional[float] = Field(None, description="Resting systolic blood pressure (mmHg)")
    chol: Optional[float] = Field(None, description="Serum cholesterol (mg/dL)")
    fbs: Optional[int] = Field(0, description="Fasting blood sugar > 120 mg/dL (1=True, 0=False)")
    restecg: Optional[int] = Field(0, description="Resting ECG results (0=Normal, 1=ST-T wave abnormality, 2=LV hypertrophy)")
    thalach: Optional[float] = Field(None, description="Maximum heart rate achieved (bpm)")
    exang: Optional[int] = Field(0, description="Exercise-induced angina (1=Yes, 0=No)")
    oldpeak: Optional[float] = Field(None, description="ST depression induced by exercise relative to rest")
    slope: Optional[int] = Field(1, description="Slope of peak exercise ST segment (0, 1, 2)")
    ca: Optional[int] = Field(0, description="Number of major vessels colored by fluoroscopy (0-3)")
    thal: Optional[int] = Field(2, description="Thallium stress test result (1=Normal, 2=Fixed defect, 3=Reversible defect)")


class QMLAnalysisRequest(BaseModel):
    """Incoming request for Hybrid QML Clinical Disease Prediction."""
    patient_id: Optional[str] = "4720f774-69e0-4485-9b88-6f14cf8c287f"
    medical_data: Optional[Dict[str, Any]] = None
    vitals: Optional[Dict[str, Any]] = None
    document_text: Optional[str] = None
    source: Optional[str] = "patient_portal"


class QuantumCircuitTelemetry(BaseModel):
    """Telemetry describing the variational quantum circuit execution."""
    qubit_count: int = 6
    circuit_depth: int = 12
    ansatz_type: str = "StronglyEntanglingVariationalLayers"
    feature_map: str = "AngleFeatureMap_Ry_Rz"
    entanglement_gates: int = 12
    backend_name: str = "PennyLane.default.qubit (Exact Statevector Simulator)"
    expectation_value: float
    quantum_execution_status: str = "EXECUTED_REAL_CIRCUIT"


class ClinicalFactorContribution(BaseModel):
    """Explainability factor describing a specific biomarker's clinical impact."""
    feature_name: str
    feature_label: str
    raw_value: Any
    normal_range: str
    impact_score: float
    direction: str  # "elevating" | "protective" | "neutral"
    clinical_insight: str


class QMLPredictionResult(BaseModel):
    """Detailed prediction output from the Variational Quantum Classifier."""
    disease: str = "cardiovascular_disease"
    disease_label: str = "Cardiovascular Disease / Coronary Heart Disease Indication"
    class_label: int = Field(..., description="0 = Low Risk / Healthy, 1 = Disease Indication")
    probability: float = Field(..., description="Calibrated disease probability [0.0 - 1.0]")
    risk_level: str = Field(..., description="LOW | MODERATE | HIGH")
    confidence: float = Field(..., description="Model predictive confidence [0.0 - 1.0]")


class ModelBenchmarkMetrics(BaseModel):
    """Measured performance metrics for QML vs Classical Baselines."""
    model_name: str
    model_family: str  # "Quantum" | "Classical"
    accuracy: float
    precision: float
    recall: float
    specificity: float
    f1_score: float
    roc_auc: float
    latency_ms: float


class QMLAnalysisResponse(BaseModel):
    """Full response payload for QML Clinical Disease Prediction."""
    success: bool
    model: str = "Hybrid Quantum-Classical VQC"
    framework: str = "PennyLane / Quantum Statevector Simulator"
    model_version: str = "1.0.0"
    prediction: Optional[QMLPredictionResult] = None
    features_used: List[str] = []
    circuit_telemetry: Optional[QuantumCircuitTelemetry] = None
    explainability: List[ClinicalFactorContribution] = []
    benchmark_comparison: List[ModelBenchmarkMetrics] = []
    clinical_disclaimer: str = (
        "AI-Assisted Assessment — Requires Clinician Confirmation. "
        "This output is computed by a Hybrid Quantum Machine Learning model for clinical decision support "
        "and is not a final medical diagnosis."
    )
    qbho_selection: Optional[Dict[str, Any]] = None
    barren_plateau_mitigation: Optional[Dict[str, Any]] = None
    qsvm_prediction: Optional[Dict[str, Any]] = None
    ensemble_fusion: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    insufficient_data: bool = False
