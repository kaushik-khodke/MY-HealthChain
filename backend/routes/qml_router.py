"""
Hybrid Quantum Machine Learning (QML) API Router
Aligned with SIH Problem Statement 26139: Early Disease Detection
==================================================================
Endpoints:
- POST /patient/qml-analysis    : Executes 6-qubit VQC disease prediction
- GET  /patient/qml-benchmarks  : Returns measured QML vs Classical benchmarks
- GET  /patient/qml-models      : Lists registered disease-specific QML models
- GET  /patient/qml-demo-profiles: Returns test patient profiles (Low/High/Incomplete)
"""

from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, BackgroundTasks
from core.logger import logger

from qml.schemas import (
    QMLAnalysisRequest,
    QMLAnalysisResponse,
    ModelBenchmarkMetrics
)
from qml.predict import run_qml_disease_prediction, get_demo_clinical_profiles
from qml.model_registry import model_registry


router = APIRouter(tags=["Hybrid Quantum Machine Learning"])


@router.post("/patient/qml-analysis", response_model=QMLAnalysisResponse)
@router.post("/qml/predict", response_model=QMLAnalysisResponse)
@router.post("/qml-analysis", response_model=QMLAnalysisResponse)
async def patient_qml_analysis(req: QMLAnalysisRequest):
    """
    Executes real Hybrid Quantum-Classical VQC early disease prediction.
    Extracts clinical features, applies classical preprocessing & angle encoding,
    evaluates the parameterized quantum circuit, and returns calibrated disease probability,
    risk level, explainability factors, and model benchmarks.
    """
    try:
        # Merge input sources (vitals, medical_data, flat dict)
        combined_data: Dict[str, Any] = {}
        if req.medical_data:
            combined_data.update(req.medical_data)
        if req.vitals:
            combined_data.update(req.vitals)
        if req.document_text:
            combined_data["document_text"] = req.document_text

        # If empty, also check if client passed direct fields
        if not combined_data and hasattr(req, "__dict__"):
            combined_data.update(req.__dict__)

        logger.info(
            "qml_prediction_requested",
            context={"patient_id": req.patient_id, "keys": list(combined_data.keys())}
        )

        response = run_qml_disease_prediction(combined_data, patient_id=req.patient_id)
        return response

    except Exception as e:
        logger.error("qml_prediction_failed", error=e)
        raise HTTPException(
            status_code=500,
            detail=f"QML prediction pipeline encountered an internal error: {str(e)}"
        )


@router.get("/patient/qml-benchmarks")
@router.get("/qml/benchmarks")
async def get_qml_benchmarks(model_id: str = "cardiovascular_vqc"):
    """
    Returns real experimental performance benchmarks comparing the Hybrid VQC
    against classical baselines (Logistic Regression, Random Forest, XGBoost)
    dynamically loaded from the latest loop engineering evaluation report.
    """
    report = model_registry.get_evaluation_report_full(model_id)
    return {
        "success": True,
        "dataset": report["dataset"],
        "evaluation_strategy": report["train_test_split"],
        "total_samples": report["total_samples"],
        "test_samples": report["test_samples"],
        "best_iteration": report["best_iteration"],
        "last_updated": report["last_updated"],
        "benchmarks": report["benchmarks"]
    }


@router.get("/patient/qml-training-history")
@router.get("/qml/training-history")
async def get_qml_training_history(model_id: str = "cardiovascular_vqc"):
    """Returns the overtime history of loop engineering iterations and checkpoints."""
    history_path = model_registry.base_dir / model_id / "training_history.json"
    if history_path.exists():
        try:
            import json
            with open(history_path, "r") as f:
                history = json.load(f)
                return {"success": True, "history": history}
        except Exception as e:
            logger.error("error_loading_training_history", error=e)
    return {"success": True, "history": []}


@router.post("/patient/qml-train-loop")
@router.post("/qml/train-loop")
async def trigger_loop_training(background_tasks: BackgroundTasks):
    """Triggers the LoopEngineeringTrainer to scale data and optimize models in background."""
    from qml.loop_trainer import run_loop_training
    background_tasks.add_task(run_loop_training)
    return {
        "success": True,
        "message": "Loop Engineering Training job started in background. Check /patient/qml-benchmarks for updated metrics."
    }



@router.get("/patient/qml-models")
@router.get("/qml/models")
async def list_qml_models():
    """Returns metadata for all registered QML disease classification models."""
    return {
        "success": True,
        "models": model_registry.list_models()
    }


@router.get("/patient/qml-demo-profiles")
@router.get("/qml/demo-profiles")
async def get_demo_profiles():
    """
    Returns curated clinical patient profiles for verification & demo:
    - Patient A: Low Risk Profile
    - Patient B: High Risk Cardiovascular Profile
    - Patient C: Incomplete Report (Testing safety boundaries)
    """
    return {
        "success": True,
        "profiles": get_demo_clinical_profiles()
    }
