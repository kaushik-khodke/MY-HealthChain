# 📖 MyHealthChain (Stelix) — Official REST & Realtime API Specification

**Base URL (Local):** `http://localhost:8000`  
**Base URL (Production):** `https://cx029-stelix.onrender.com`  
**Interactive Swagger UI:** `http://localhost:8000/docs`  
**ReDoc Documentation:** `http://localhost:8000/redoc`

---

## 📑 API Domain Index
* [1. Hybrid Quantum Machine Learning (QML) APIs (SIH 26139)](#1-hybrid-quantum-machine-learning-qml-apis-sih-26139)
* [2. Emergency Triage & Clinical Machine Learning](#2-emergency-triage--clinical-machine-learning)
* [3. Hospital Management System (HMS) Core Suite](#3-hospital-management-system-hms-core-suite)
* [4. HMS Diagnostics (LIS/PACS) & Revenue Cycle (RCM)](#4-hms-diagnostics-lispacs--revenue-cycle-rcm)
* [5. HMS Surgical Suite (OT), Blood Bank & ABDM Interoperability](#5-hms-surgical-suite-ot-blood-bank--abdm-interoperability)
* [6. Hospital Resource Inflow & Bed Balancing Forecaster](#6-hospital-resource-inflow--bed-balancing-forecaster)
* [7. Pharmacy, AI Refills & Orders](#7-pharmacy-ai-refills--orders)
* [8. Doctor & Patient Portal Services](#8-doctor--patient-portal-services)
* [9. Payments & Omnichannel Gateways (WhatsApp / Voice)](#9-payments--omnichannel-gateways-whatsapp--voice)
* [10. Collaborative Federated Retraining Engine](#10-collaborative-federated-retraining-engine)
* [11. System Health & Diagnostic Probes](#11-system-health--diagnostic-probes)

---

## ⚛️ 1. Hybrid Quantum Machine Learning (QML) APIs (SIH 26139)

### `POST /patient/qml-analysis`
*Aliases:* `/qml/predict`, `/qml-analysis`  
Executes the **4-Stage Hybrid QML Clinical Disease Prediction Pipeline**:
1. Egreen Quanta QBHO Biomarker Selection.
2. Classical Angle Embedding with Barren Plateau Mitigation.
3. Dual Quantum Classification: 6-Qubit Parameterized VQC + Quantum Support Vector Machine (QSVM).
4. Hybrid Stacking Meta-Learner (0.50 VQC + 0.30 QSVM + 0.20 XGBoost).

#### Request Body
```json
{
  "patient_id": "PT-90412",
  "vitals": {
    "age": 58,
    "trestbps": 145,
    "chol": 260,
    "thalach": 130,
    "oldpeak": 2.3,
    "cp": 2
  },
  "medical_data": {
    "fasting_blood_sugar": 126
  }
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "model": "Egreen Quanta Hybrid QML Pipeline (VQC + QSVM + QBHO + Stacking)",
  "framework": "PennyLane.default.qubit & Exact Statevector Simulator",
  "model_version": "2.0.0",
  "prediction": {
    "disease": "cardiovascular_disease",
    "disease_label": "Cardiovascular Disease / Coronary Heart Disease Indication",
    "class_label": 1,
    "probability": 0.768,
    "risk_level": "HIGH",
    "confidence": 0.536
  },
  "features_used": ["trestbps", "chol", "thalach", "oldpeak", "cp", "age"],
  "circuit_telemetry": {
    "qubit_count": 6,
    "circuit_depth": 12,
    "entanglement_gates": 12,
    "observable": "<Z_0>",
    "raw_expectation_value": 0.428,
    "status": "EXECUTED_REAL_CIRCUIT"
  },
  "explainability": [
    {
      "biomarker": "trestbps",
      "display_name": "Resting Blood Pressure",
      "value": 145.0,
      "reference_normal": "< 120 mmHg",
      "impact": "HIGH_RISK_DRIVER",
      "impact_direction": "INCREASES_RISK",
      "z_score": 0.74,
      "clinical_note": "Elevated systolic pressure increases myocardial wall tension and arterial shearing strain."
    }
  ],
  "benchmark_comparison": [
    {
      "model_name": "Hybrid Stacking Ensemble (Ours)",
      "family": "Quantum",
      "accuracy": 0.852,
      "precision": 0.846,
      "recall": 0.9167,
      "f1_score": 0.880,
      "roc_auc": 0.908,
      "latency_ms": 5.2
    }
  ],
  "qbho_selection": {
    "stage": 1,
    "method": "Quantum Black Hole Optimizer",
    "absorbed_redundant_variables": 8,
    "output_qubit_count": 6
  },
  "clinical_disclaimer": "AI-Assisted Assessment — Requires Clinician Confirmation. This output is computed by a 4-Stage Hybrid Quantum Machine Learning pipeline for clinical decision support and is not a final medical diagnosis.",
  "insufficient_data": false,
  "error": null
}
```

---

### `GET /patient/qml-benchmarks`
*Alias:* `/qml/benchmarks`  
Returns empirical benchmark metrics comparing the Hybrid QML models against classical algorithms (Random Forest, Logistic Regression, XGBoost) on the UCI Cleveland Heart Disease dataset.

#### Query Parameters
* `model_id` *(string, optional, default: "cardiovascular_vqc")*

#### Response (200 OK)
```json
{
  "success": true,
  "dataset": "UCI Cleveland Heart Disease",
  "evaluation_strategy": "80/20 Stratified Train/Test Split (Seed 42)",
  "total_samples": 303,
  "test_samples": 61,
  "best_iteration": 4,
  "last_updated": "2026-08-20T14:30:00Z",
  "benchmarks": [
    {
      "model_name": "Hybrid Stacking Ensemble (Ours)",
      "family": "Quantum",
      "accuracy": 0.852,
      "precision": 0.846,
      "recall": 0.9167,
      "f1_score": 0.880,
      "roc_auc": 0.908,
      "latency_ms": 5.2
    },
    {
      "model_name": "6-Qubit Parameterized VQC",
      "family": "Quantum",
      "accuracy": 0.836,
      "precision": 0.824,
      "recall": 0.875,
      "f1_score": 0.849,
      "roc_auc": 0.892,
      "latency_ms": 3.4
    }
  ]
}
```

---

### `GET /patient/qml-demo-profiles`
*Alias:* `/qml/demo-profiles`  
Returns curated clinical test profiles for evaluator demonstrations (Patient A: Low Risk, Patient B: High Risk, Patient C: Incomplete / Safe Refusal).

#### Response (200 OK)
```json
{
  "success": true,
  "profiles": [
    {
      "id": "demo_low_risk",
      "label": "Patient A — Preserved Cardiovascular Function (Low Risk)",
      "vitals": { "age": 42, "trestbps": 118, "chol": 185, "thalach": 168, "oldpeak": 0.0, "cp": 0 }
    },
    {
      "id": "demo_high_risk",
      "label": "Patient B — High Coronary Arterial Risk (High Risk)",
      "vitals": { "age": 64, "trestbps": 165, "chol": 295, "thalach": 112, "oldpeak": 3.4, "cp": 3 }
    },
    {
      "id": "demo_insufficient",
      "label": "Patient C — Incomplete Record (Safety Boundary Refusal)",
      "vitals": { "age": 52 }
    }
  ]
}
```

---

## 🩺 2. Emergency Triage & Clinical Machine Learning

### `POST /predict-triage`
Evaluates emergency room vital signs and chief complaints using XGBoost to classify Emergency Severity Index (ESI 1–5 / RED to BLUE) in < 5 ms.

#### Request Body
```json
{
  "chief_complaint": "Acute severe crushing substernal chest pressure radiating to jaw",
  "age": 56,
  "systolic_bp": 165,
  "diastolic_bp": 102,
  "heart_rate": 118,
  "spo2": 91,
  "temp_celsius": 37.4
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "priority": "RED",
  "urgency_score": 95,
  "esi_level": 1,
  "reasoning": "Hypertensive crisis accompanied by tachycardia and acute hypoxemia (SpO2 91%) with classic anginal radiation pattern.",
  "recommended_bed_type": "Resuscitation / Trauma Bay",
  "disclaimer": "AI-Assisted Assessment — Requires Clinician Confirmation"
}
```

---

### `POST /analyze_health`
Comprehensive patient diagnostic pipeline combining OCR document parsing, Scikit-Learn Random Forest risk modeling, and the Hybrid QML engine.

---

## 🏥 3. Hospital Management System (HMS) Core Suite

### `POST /hms/patient/fuzzy-check`
Performs Levenshtein distance deduplication against master patient demographic registries to prevent duplicate UHIDs.

#### Request Body
```json
{
  "full_name": "Rohan Deshmukh",
  "phone": "+919876543210",
  "date_of_birth": "1988-06-14"
}
```

#### Response (200 OK)
```json
{
  "duplicate_found": true,
  "similarity_score": 0.94,
  "existing_patient": {
    "uhid": "UHID-2026-0042",
    "full_name": "Rohan M. Deshmukh",
    "phone": "+919876543210"
  },
  "action_recommended": "LINK_EXISTING_UHID"
}
```

---

### `POST /hms/patient/register-uhid`
Generates a verified Unique Health Identifier (UHID) compliant with national healthcare identifier standards.

---

### `POST /hms/cpoe/order`
Computerized Physician Order Entry (CPOE) with real-time Clinical Decision Support System (CDSS) for automated drug-allergy and contraindication verification.

---

### `POST /hms/emar/administer`
Bedside nursing medication administration record verifying the **5-Rights of Clinical Safety** (Right Patient, Right Drug, Right Dose, Right Route, Right Time) via barcode scanner.

---

## 🔬 4. HMS Diagnostics (LIS/PACS) & Revenue Cycle (RCM)

### `GET /hms/diagnostics-rcm/specimens`
Lists laboratory specimens with real-time analyzer statuses, abnormal value flags, and automated historical delta check alerts.

### `GET /hms/diagnostics-rcm/pacs/studies`
Retrieves Radiology Information System (RIS) study worklists and DICOM web viewer series for X-Ray, CT, and MRI acquisitions.

### `POST /hms/diagnostics-rcm/claims/pre-auth`
Compiles clinical justification dossiers and initiates cashless insurance pre-authorization with Third-Party Administrators (TPAs).

---

## 🩸 5. HMS Surgical Suite (OT), Blood Bank & ABDM Interoperability

### `GET /hms/surgical-interop/ot/surgeries`
Retrieves live Operation Theater procedures with WHO Surgical Safety Checklist milestones (Sign-In, Time-Out, Sign-Out), ASA physical status, and PACU Aldrete recovery scores.

### `GET /hms/surgical-interop/blood-bank/inventory`
Monitors real-time cross-matched blood inventory (Packed Red Blood Cells, Fresh Frozen Plasma, Platelets) by blood group and expiry date.

### `GET /hms/surgical-interop/fhir/bundle`
Exports a certified **HL7 FHIR v4.0 Resource Bundle** containing Patient, Encounter, Condition, and Observation resources mapped to standard SNOMED CT and LOINC codes.

### `POST /hms/surgical-interop/abdm/generate-abha`
Issues a 14-digit Ayushman Bharat Health Account (ABHA) address and generates an ABHA card QR bundle.

### `GET /hms/surgical-interop/audit/logs`
Streams immutable, cryptographically hashed (SHA-256) audit logs ensuring HIPAA, NABH, and DPDP Act compliance.

---

## 📈 6. Hospital Resource Inflow & Bed Balancing Forecaster

### `GET /resource/status`
Returns real-time hospital occupancy across ICU, Trauma, ER, and General Ward beds, alongside oxygen cylinder and ventilator reserves.

### `GET /resource/forecast`
Runs the **4-Signal Surge Forecaster** to predict patient arrival volume for +1h and +4h horizons:
* Signal 1: 4-Week Rolling Hourly Time-Series Trend
* Signal 2: Regional Bed Occupancy Pressure Multiplier
* Signal 3: IPFS Chronic Disease Vector Scans
* Signal 4: Seasonal Weather Adjustments (Summer 1.05×, Monsoon 1.15×, Winter 1.10×)

---

## 💊 7. Pharmacy, AI Refills & Orders

### `POST /pharmacy/chat`
Conversational clinical pharmacy agent querying active inventories, interactions, and remaining patient refills.

### `POST /place_order`
Creates a confirmed medication order and generates a Stripe checkout session for automated payment.

---

## 🥼 8. Doctor & Patient Portal Services

### `GET /doctor/dashboard-data`
Returns active emergency triage queues, physician shift assignments, and pending consent requests.

### `POST /patient/smart-insights`
Summarizes patient medical histories and vital trends into plain-language clinical insights.

---

## 💳 9. Payments & Omnichannel Gateways

### `POST /create-checkout-session`
Initiates a Stripe checkout session returning a secure hosted redirect URL.

### `POST /send-whatsapp-health-report`
Triggers the Node.js Baileys gateway to send automated PDF health summaries and shift updates over WhatsApp.

---

## 🔄 10. Collaborative Federated Retraining Engine

### `POST /federation/train-local`
Executes local on-premise model retraining with Differential Privacy (DP-SGD: $C=1.0, \epsilon \le 5.0$) on private hospital radiographs.

### `GET /federation/models`
Lists decentralized model checkpoints pinned on Pinata IPFS with parent-child SHA-256 provenance hashes.

---

## 🩺 11. System Health & Diagnostic Probes

### `GET /health`
Returns system status, database connectivity, Python runtime, and server timestamp.

```json
{
  "status": "ok",
  "database": "healthy",
  "python_version": "3.10.6",
  "server_time": 1727702400.0,
  "timestamp": "2026-09-30T16:00:00.000Z"
}
```

### `GET /ready`
Readiness probe verifying that all ML models (VQC, QSVM, XGBoost) and cache services are warm and accepting traffic.
