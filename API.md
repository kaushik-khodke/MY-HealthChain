# 📖 Stelix (MyHealthChain) — Official REST API Specification

**Base URL**: `http://localhost:8000` (Local) / `https://cx029-stelix.onrender.com` (Production)  
**OpenAPI / Interactive Documentation**: `/docs` (Swagger UI) or `/redoc` (ReDoc)

---

## 🏥 1. System Health & Diagnostics

### `GET /health`
Returns system status, database connectivity health, Python version, and server timestamp.

#### Response (200 OK)
```json
{
  "status": "ok",
  "database": "healthy",
  "python_version": "3.12.0",
  "server_time": 1722510000.123,
  "timestamp": "2026-08-01T21:00:00.123456"
}
```

---

## 💊 2. Pharmacy & Order Management

### `POST /pharmacy/chat`
Submits a query to the specialized Pharmacy AI Agent to check stock, query medicines, or resolve refill requirements.

#### Request Body
```json
{
  "message": "Do I have any pending refills for Paracetamol?",
  "patient_id": "4720f774-69e0-4485-9b88-6f14cf8c287f",
  "language": "en"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "response": "You currently have 1 active refill available for Paracetamol (500mg)."
}
```

---

### `POST /place_order`
Webhook endpoint for ElevenLabs Voice AI or client interfaces to place pending medicine orders.

#### Request Body
```json
{
  "medicine_name": "Paracetamol",
  "quantity": "four",
  "patient_id": "4720f774-69e0-4485-9b88-6f14cf8c287f"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Order successfully placed for 4 units of Paracetamol.",
  "order_id": "e4252024-da83-47eb-a160-1c1338b47676",
  "checkout_url": "https://checkout.stripe.com/c/pay/cs_test_..."
}
```

---

## 🩺 3. Clinical Triage & ML Prediction

### `POST /predict-triage`
Evaluates patient vital signs and chief complaint using Scikit-Learn / XGBoost ML models to predict Emergency Severity Index (ESI) priority level.

#### Request Body
```json
{
  "chief_complaint": "Severe acute chest pain radiating to left arm",
  "age": 54,
  "systolic_bp": 155,
  "diastolic_bp": 95,
  "heart_rate": 112,
  "spo2": 93,
  "temp_celsius": 37.2
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "priority": "RED",
  "urgency_score": 92,
  "metrics_evaluated": {
    "chief_complaint": "Severe acute chest pain radiating to left arm",
    "vitals": {
      "bp": "155/95",
      "heart_rate": 112,
      "spo2": 93
    }
  }
}
```

---

## 📱 4. WhatsApp Integration

### `POST /send-whatsapp-health-report`
Dispatches an official AI Health Insight report directly to a patient's WhatsApp number via Baileys gateway.

#### Request Body
```json
{
  "user_id": "4720f774-69e0-4485-9b88-6f14cf8c287f",
  "phone": "8806275531"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Official AI Health Report sent via WhatsApp to 8806275531!"
}
```

---

## ⚛️ 5. Hybrid Quantum Machine Learning (SIH 26139: Egreen Quanta)

### `POST /patient/qml-analysis`
Executes real 6-qubit Variational Quantum Classifier (VQC) early disease prediction. Evaluates patient vitals using angle encoding and circular CNOT entanglement over PennyLane/NumPy engines, returning calibrated disease probability, risk level, clinical explainability drivers, and quantum circuit telemetry.

#### Request Body
```json
{
  "patient_id": "4720f774-69e0-4485-9b88-6f14cf8c287f",
  "vitals": {
    "age": 64,
    "sex": 1,
    "trestbps": 165,
    "chol": 290,
    "thalach": 118,
    "oldpeak": 2.8,
    "cp": 0
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "model": "Hybrid Quantum-Classical VQC",
  "framework": "PennyLane.default.qubit (Exact Statevector Simulator)",
  "model_version": "1.0.0",
  "prediction": {
    "disease": "cardiovascular_disease",
    "disease_label": "Cardiovascular Disease / Coronary Heart Disease Indication",
    "class_label": 1,
    "probability": 0.8842,
    "risk_level": "HIGH",
    "confidence": 0.7684
  },
  "features_used": ["age", "trestbps", "chol", "thalach", "oldpeak", "cp"],
  "circuit_telemetry": {
    "qubit_count": 6,
    "circuit_depth": 12,
    "ansatz_type": "StronglyEntanglingVariationalLayers",
    "feature_map": "AngleFeatureMap_Ry_Rz",
    "entanglement_gates": 12,
    "backend_name": "PennyLane.default.qubit (Exact Statevector Simulator)",
    "expectation_value": 0.6214,
    "quantum_execution_status": "EXECUTED_REAL_CIRCUIT"
  },
  "explainability": [
    {
      "feature_name": "oldpeak",
      "feature_label": "ST Segment Depression (Ischemia Marker)",
      "raw_value": 2.8,
      "normal_range": "0.0 - 0.5 mm (Normal Repolarization)",
      "impact_score": 22.8,
      "direction": "elevating",
      "clinical_insight": "Substantial exercise-induced ST depression is a strong indicator of subendocardial ischemia."
    }
  ],
  "benchmark_comparison": [
    {
      "model_name": "Hybrid VQC (Quantum-Classical)",
      "model_family": "Quantum",
      "accuracy": 0.8361,
      "precision": 0.8235,
      "recall": 0.875,
      "specificity": 0.7931,
      "f1_score": 0.8485,
      "roc_auc": 0.8922,
      "latency_ms": 3.42
    }
  ],
  "clinical_disclaimer": "AI-Assisted Assessment — Requires Clinician Confirmation. This output is computed by a Hybrid Quantum Machine Learning model for clinical decision support and is not a final medical diagnosis."
}
```

---

### `GET /patient/qml-benchmarks`
Returns empirical benchmark metrics comparing the Hybrid VQC against classical models (Random Forest, Logistic Regression, XGBoost) on the UCI Cleveland Heart Disease dataset.

---

### `GET /patient/qml-models`
Lists all registered QML disease classification models, required clinical biomarkers, and quantum specifications.

---

### `GET /patient/qml-demo-profiles`
Returns pre-configured test profiles (`low_risk_patient`, `high_risk_patient`, `incomplete_record`) for clinical testing.

