# 🎬 MyHealthChain (Stelix) — Official Evaluation & Demo Walkthrough Guide
### *5-to-7 Minute Step-by-Step Live Evaluator & Judge Walkthrough*
**Smart India Hackathon (SIH 2026) | Problem Statement ID: 26139 (Egreen Quanta)**

---

Welcome evaluators and judges! This guide provides a structured 5–7 minute evaluation sequence to inspect, test, and score every core pillar of the **MyHealthChain** ecosystem across our 4 synchronized portals, the 4-Stage Hybrid QML engine, Enterprise HMS, and collaborative federated learning.

---

## ⚡ 1-Minute Quick Start

```powershell
# Windows (PowerShell):
.\start_all.ps1

# Linux / macOS (Bash):
./start_all.sh
```

* **Frontend Client Portal:** `http://localhost:3000` (or `http://localhost:5173`)
* **FastAPI Backend Gateway:** `http://localhost:8000`
* **Interactive OpenAPI Swagger Docs:** `http://localhost:8000/docs`
* **Health Diagnostic Probe:** `http://localhost:8000/health`

---

## 🧭 Step-by-Step Evaluation Walkthrough (7 Key Steps)

```
  STEP 1              STEP 2              STEP 3              STEP 4              STEP 5              STEP 6              STEP 7
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Hybrid QML   │───►│ Patient ML   │───►│ Hospital     │───►│ Doctor QR    │───►│ Pharmacist   │───►│ Enterprise   │───►│ Federated    │
│ Disease Pred │    │ ESI Triage   │    │ Command      │    │ Bedside Scan │    │ Fulfillment  │    │ HMS & ABDM   │    │ Retraining   │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
```

---

### ⚛️ Step 1: Hybrid QML Early Disease Prediction Engine (SIH 26139 Flagship)
1. Open your browser and navigate to **Patient Analysis** (`http://localhost:3000/patient/analysis`).
2. Scroll to the **Hybrid QML Disease Prediction Engine (SIH 26139)** section.
3. Observe live telemetry:
   - **6 Qubit Wires:** Parameterized register mapped to patient vitals.
   - **12 Circuit Depth:** Two strongly entangling layers with circular CNOT topology.
   - **QBHO Feature Selection:** Displays absorbed redundant variables and active biomarkers.
4. Click **Run QML Prediction**:
   - Evaluates the 6-qubit VQC and QSVM kernel in real time.
   - Displays calibrated disease probability, Hilbert margin, and **91.67% Sensitivity** benchmark score.
   - Inspect individual **Biomarker Contribution Factors** (Blood Pressure, Cholesterol, Heart Rate) and clinical explainability notes.
5. **Safety Boundary Demonstration:** Test with empty vitals to verify safe refusal (`insufficient_data = True`).

---

### 🩺 Step 2: Patient Emergency Intake & XGBoost ESI Triage
1. Navigate to **Patient Health Tracker** (`http://localhost:3000/patient/health-tracker`).
2. Input emergency symptoms: *"Severe acute crushing chest pressure radiating to left arm, shortness of breath"*.
3. Input physiological vitals: `BP: 165/102`, `Heart Rate: 118`, `SpO2: 91%`.
4. Click **Submit Triage Assessment**:
   - The backend XGBoost model (`POST /predict-triage`) processes the input in **< 5 ms**.
   - Outputs **RED (ESI 1 / Urgency 95/100)** with an explicit clinical safety disclaimer badge (`AI-Assisted Assessment — Requires Clinician Confirmation`).

---

### 🏥 Step 3: Hospital Command Center (Flagship Operations Dashboard)
1. Navigate to **Hospital Command Center** (`http://localhost:3000/hospital/triage`).
2. **Observe Instant WebSocket Sync:** The RED priority patient immediately surfaces at the very top of the live emergency queue.
3. **Inspect Regional Bed & Supply Matrix:** View real-time availability across ICU, Trauma, ER, and General Ward beds, alongside Oxygen cylinders and Ventilators.
4. **Test 4-Signal Surge Forecaster:** View the predictive influx curve forecasting patient volume surges for +1h and +4h horizons based on historical rolling trends and weather factors.
5. **Gemini Strategic Command Analyzer:** Inspect AI-generated recommendations for ward load balancing.

---

### 🥼 Step 4: Doctor Bedside Scan & Smart Health Card Authentication
1. Navigate to **Doctor Portal** (`http://localhost:3000/doctor/dashboard`).
2. Select the top RED patient or open the **Bedside QR Scanner** (`/doctor/scan`).
3. Enter the patient's 4-digit PIN to decrypt and unlock the emergency record stored on Pinata IPFS.
4. **Physician Override Authority:** Test the clinical override toggle to reclassify patient priority or adjust treatment protocols.
5. Author digital prescription (*Amoxicillin 500mg*) and dispatch directly to the pharmacy.

---

### 💊 Step 5: Pharmacist Portal & Stripe Automated Checkout
1. Navigate to **Pharmacist Portal** (`http://localhost:3000/pharmacist/dashboard`).
2. Verify that the newly authored prescription appears in the incoming order queue.
3. **Test Pharmacist AI:** Ask the AI agent: *"Verify contraindications for Amoxicillin with Warfarin"*.
4. Click **Generate Checkout Link** to test automated Stripe checkout URL generation (`/create-checkout-session`).

---

### 🏢 Step 6: Enterprise HMS Operations & National ABDM Interoperability
1. Test **UHID Fuzzy Deduplication** (`POST /hms/patient/fuzzy-check`): demonstrates Levenshtein string matching preventing duplicate patient registration.
2. Inspect **Bedside eMAR** (`POST /hms/emar/administer`): demonstrates 5-Rights barcode validation before medication administration.
3. Review **WHO Surgical Safety Checklist** and **PACU Aldrete Recovery Scores** in the Operation Theater suite.
4. Verify **ABDM Integration**: Generate a 14-digit Ayushman Bharat ABHA ID and view the certified **HL7 FHIR v4.0 Resource Bundle**.

---

### 🔄 Step 7: Collaborative Federated Retraining Simulation
1. Navigate to **Federated Intelligence Console** (`http://localhost:3000/hospital/federation`).
2. Trigger an on-premise training round across simulated hospital silos (Apollo, Fortis, AIIMS).
3. **Simulate Adversarial Attack:** Inject an inverted gradient or poisoned update from a rogue node.
4. **Observe Byzantine Sentinel Defense:** The system flags the poisoned update via Directional Cosine Screening and Multi-Krum outlier ranking, automatically quarantining the rogue node while aggregating verified weights.

---

## 🧪 Automated Test Suite Verification

Run the comprehensive pytest suite verifying all 46+ unit and integration tests:

```bash
cd backend
python -m pytest tests/ -v
```
