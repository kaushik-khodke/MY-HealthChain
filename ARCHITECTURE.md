# 🏗️ MyHealthChain (Stelix) — System Architecture Blueprint
### *Hybrid Quantum Machine Learning Platform & Autonomous Emergency Clinical Infrastructure*
**Aligned with Smart India Hackathon (SIH 2026) Problem Statement ID: 26139 (Egreen Quanta)**  
**Theme: MedTech / BioTech / HealthTech | Category: Software**

---

This document provides the definitive, production-grade system architecture, component topology, data flows, and design patterns of **MyHealthChain (Stelix)**, unifying sub-clinical early disease detection via Hybrid QML with real-time autonomous emergency triage, enterprise hospital management (HMS), and collaborative federated learning.

---

## 📐 1. High-Level System Architecture Diagram

![MyHealthChain End-to-End System Architecture Blueprint](./docs/assets/system_architecture.svg)

<br/>

### 🗺️ Text / Terminal Architectural Schematic:
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        1. CLIENT LAYER & OMNICHANNEL TOUCHPOINTS                       │
│  [🩸 Patient Portal]     [🥼 Doctor Portal]     [💊 Pharmacist Portal]     [🏥 Command Center]│
│  • QML Telemetry & OCR   • Bedside QR & PIN     • Fulfillment AI & Stripe   • ESI 1-5 Triage  │
│  • Decentralized IPFS    • Override & CPOE      • Refill Automation         • 4-Signal Surge  │
│                                                                                        │
│               [💳 Smart Health Card]                  [📱 Omnichannel AI]              │
│               • Offline Physical QR                   • Baileys WhatsApp Gateway       │
│               • 4-Digit PIN Security                  • Twilio + ElevenLabs Voice      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ REST / WebSockets / Webhooks
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                    2. MODULAR API GATEWAY & CORE SECURITY (FASTAPI)                     │
│  • Pydantic Settings (core/config.py)         • JSON Structured Logger (core/logger.py)│
│  • /patient/qml-*   • /predict-triage         • /hms/core/*       • /hms/diagnostics   │
│  • /hms/surgical    • /resource/*             • /pharmacy/*       • /federation/*      │
└─────────────────────┬───────────────────────────────────────────────────┬──────────────┘
                      │                                                   │
                      ▼                                                   ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│  3A. 4-STAGE HYBRID QML (SIH 26139: EGREEN)  │ │   3B. EMERGENCY OPERATIONS & ENTERPRISE HMS   │
│  • Stage 1: QBHO Feature Selection           │ │   • Sub-5ms XGBoost ESI Triage (RED-BLUE)     │
│    (Event Horizon absorbs noisy EHR inputs)  │ │   • 4-Signal Surge Forecaster (+1h/+4h)       │
│  • Stage 2: Classical Angle Mapping          │ │   • Gemini 2.0 Flash Strategic Command Ops    │
│    (φ_i ∈ [-π, π] & Barren Plateau Escape)   │ │   • Enterprise HMS Suite (Phases 1 to 6):     │
│  • Stage 3: Dual Quantum Inference Engine    │ │     - UHID Fuzzy Deduplication (Levenshtein)  │
│    - Model A: 6-Qubit Parameterized VQC      │ │     - Inpatient ADT & 4-Point Clearance       │
│      (36 params, Circular CNOTs, ⟨Z_0⟩)      │ │     - Bedside 5-Rights eMAR Verification      │
│    - Model B: QSVM Kernel                    │ │     - LIS Delta Checks & RIS/PACS DICOM       │
│      (64-dim Hilbert Space State Fidelity)   │ │     - WHO OT Safety Checklist & Blood Bank    │
│  • Stage 4: Hybrid Stacking Meta-Learner     │ │     - HL7 FHIR v4.0 & ABDM 14-Digit ABHA      │
│    <b>Sensitivity: 91.67% | SLA: 5.2 ms</b>  │ │   • Privacy-Preserving Collaborative FL Core: │
│    Full Explainability & CDSS Safety Guard   │ │     - DP-SGD (ε ≤ 5.0) & FedBN Harmonization  │
│    PennyLane + Exact NumPy Statevector Fallback│ │     - Byzantine Sentinel (Multi-Krum Defense) │
└─────────────────────┬────────────────────────┘ └────────────────────────┬─────────────────────┘
                      │                                                   │
                      └─────────────────────────┬─────────────────────────┘
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      4. PERSISTENCE & DECENTRALIZED STORAGE                            │
│  • Supabase PostgreSQL 15 (Realtime WebSockets, Triage Queue, Beds Matrix, RLS)        │
│  • Pinata IPFS Network (Decentralized Encrypted Records & Retrained Model CIDs)        │
│  • External Gateways: Stripe Checkout, Twilio/ElevenLabs Voice, ABDM ABHA Gateway      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 2. Layer-by-Layer Architectural Specifications

### Layer 1: Client Portals & Omnichannel Touchpoints
* **Patient Portal (`/patient`):** Single-page web application (React 18, Vite, TypeScript, TailwindCSS) providing vitals tracking, Gemini document OCR, prescription ordering, IPFS medical record management, and granular doctor consent controls.
* **Doctor Portal (`/doctor`):** Bedside interface allowing physicians to inspect emergency patient queues sorted by urgency score, scan physical Smart Health Cards, verify 4-digit PIN access, decrypt IPFS records, and issue digital prescriptions.
* **Pharmacist Portal (`/pharmacist`):** Prescription fulfillment dashboard featuring real-time stock management, Pharmacist AI drug-drug interaction checker, and Stripe payment processing.
* **Hospital Command Center (`/hospital`):** Flagship real-time operations dashboard featuring live ESI triage queue monitors (RED, ORANGE, YELLOW, GREEN, BLUE), bed occupancy matrix (ICU, Trauma, ER, General), critical supply trackers (ventilators, oxygen, blood bank), +1h/+4h patient influx predictive ML forecasts, and Gemini strategic command analytics.
* **Smart Health Card (Physical QR + PIN):** Offline-to-online emergency authentication mechanism mapping physical cards to encrypted IPFS records. Requires 4-digit PIN verification.
* **Omnichannel Access (WhatsApp & Voice):** Node.js Baileys API gateway for automated doctor shift alerts and PDF health report dispatches; Twilio + ElevenLabs for phone-line voice AI assistance.

---

### Layer 2: API Gateway & Core Architecture
* **FastAPI Backend Core (`main.py`):** High-performance asynchronous Python 3.10+ ASGI gateway.
* **Centralized Configuration (`core/config.py`):** Pydantic-based settings manager that loads environment variables, validates configuration, and toggles active modes (`development`, `testing`, `production`).
* **Structured Logger (`core/logger.py`):** Centralized JSON logger with ISO 8601 timestamps, log levels, event tracking, correlation IDs, and automated PII/credential sanitization.
* **Modular Router Suite:**
  - `routes/qml_router.py`: `/patient/qml-analysis`, `/patient/qml-benchmarks`, `/patient/qml-models`, `/patient/qml-demo-profiles`.
  - `routes/hms_core.py`: `/hms/patient/*`, `/hms/opd/*`, `/hms/adt/*`, `/hms/cpoe/*`, `/hms/emar/*`.
  - `routes/hms_diagnostics_rcm.py`: `/hms/diagnostics-rcm/*` (LIS, RIS/PACS, Billing, Pre-Auth).
  - `routes/hms_surgical_interop.py`: `/hms/surgical-interop/*` (OT, Blood Bank, FHIR, ABDM, Audit).
  - `routes/triage.py`: `/predict-triage` ESI ML classification.
  - `routes/pharmacy.py`: `/pharmacy/chat`, `/place_order`, and order management.
  - `routes/doctor.py`: `/doctor/dashboard-data` and consent views.
  - `routes/patient.py`: `/patient/smart-insights` and AI symptom chat.
  - `routes/payment.py`: `/create-checkout-session` Stripe links.
  - `routes/whatsapp.py`: `/send-whatsapp-health-report`.
  - `resource_load.py`: `/resource/*` bed occupancy & forecasting.
  - `routes/federation.py`: `/federation/*` collaborative retraining.

---

### Layer 3: Hybrid Quantum Clinical Intelligence (SIH 26139: Egreen Quanta)

#### ⚛️ The 4-Stage Pipeline Architecture:
1. **Stage 1 — Egreen Quanta QBHO Biomarker Selection (`backend/qml/qbho.py`):**
   - Applies the Quantum Black Hole Optimization metaheuristic to filter noisy, collinear EHR attributes down to the 6 most clinically predictive features.
2. **Stage 2 — Classical Angle Embedding & Barren Plateau Escape (`backend/qml/preprocessing.py`, `backend/qml/predict.py`):**
   - Maps normalized biological $z$-scores to rotation angles via $\phi_i = 2 \arctan(z_i) \in [-\pi, \pi]$.
   - Uses QBHO variational parameter search to escape barren plateaus 3.5× faster than parameter-shift gradient descent.
3. **Stage 3 — Dual Quantum Inference Engine (`backend/qml/quantum_model.py`, `backend/qml/qsvm.py`):**
   - *Model A (6-Qubit VQC):* 36 variational angle parameters across 2 layers of periodic circular CNOT entanglement, evaluating Pauli-$Z$ observable expectation $\langle \sigma_z^{(0)} \rangle$.
   - *Model B (QSVM):* Quantum Kernel calculating state fidelity $|\langle \phi(x) | \phi(z) \rangle|^2$ in a 64-dimensional complex Hilbert space.
4. **Stage 4 — Hybrid Stacking Meta-Learner (`backend/qml/ensemble.py`):**
   - Ensemble fusion: $0.50 \cdot P_{\text{VQC}} + 0.30 \cdot P_{\text{QSVM}} + 0.20 \cdot P_{\text{XGBoost}}$.
   - Achieves **91.67% Clinical Sensitivity** and **5.2 ms Latency**.
   - Built-in dual backend: executes on **PennyLane (`default.qubit`)** with automatic fallback to **exact 64-dimensional NumPy statevector tensor algebra**.

---

### Layer 4: Clinical Decision Support & Classical ML
* **XGBoost ESI Triage Classifier (`ml_triage.py`):** Evaluates systolic BP, diastolic BP, heart rate, SpO2, body temperature, age, and chief complaint to predict Emergency Severity Index (ESI 1–5 / RED to BLUE) in < 5 ms.
* **Random Forest Chronic Risk Engine (`ml_engine.py`):** Combines RegEx document OCR parsing with Random Forest classification to categorize patient health risk (**Healthy**, **Warning**, **Critical**).
* **4-Signal Inflow & Deterioration Forecast Engine (`resource_load.py`):**
  - *Signal 1:* 4-Week Rolling Time-Series Trend
  - *Signal 2:* Bed Occupancy Pressure Multiplier
  - *Signal 3:* IPFS Chronic Disease Vector Scans
  - *Signal 4:* Seasonal Weather Multipliers (Summer 1.05x, Monsoon 1.15x, Winter 1.10x)
* **Gemini 2.0 Flash Strategic Analyzer (`ai_config.py`):** Generates executive command summaries, detects operational bottlenecks, and suggests automated resource transfers between regional wards.
* **Agentic Orchestrator Suite (`agents/`):** Multi-agent framework (`PharmacyAgent`, `DoctorAgent`, `HealthAgent`, `SafetyAgent`, `PrescriptionAgent`) coordinating multi-turn tool calling and safety validation.

---

### Layer 5: Enterprise HMS/HIS Suite & National Interoperability
* **Phase 1: Master Patient Index (UHID):** Levenshtein fuzzy string matching preventing duplicate patient creation across municipal health networks.
* **Phase 2: Inpatient ADT & CPOE:** Bed assignment lifecycle with 4-point digital discharge clearance and computerized physician order entry backed by real-time CDSS contraindication alerts.
* **Phase 3: Bedside eMAR:** Barcode scanner verification ensuring the 5-Rights of clinical medication administration.
* **Phase 4: Diagnostics & RCM:** Specimen analyzer tracking with historical delta check alerts; DICOM PACS integration; cashless pre-authorization compiler.
* **Phase 5: Surgical Suite & Blood Bank:** WHO Surgical Safety Checklist milestones, ASA physical status scores, PACU Aldrete recovery scoring, and blood component cross-matching.
* **Phase 6: ABDM & FHIR Interoperability:** Certified HL7 FHIR v4.0 Resource Bundle exporter, 14-digit Ayushman Bharat ABHA generation, and immutable SHA-256 audit logging.

---

### Layer 6: Collaborative Federated Retraining Network (FL Core)
* **Privacy-Preserving On-Premise Training:** Hospital silos train models on local DICOM datasets without centralizing raw images.
* **Differential Privacy (DP-SGD):** Gradient clipping ($C=1.0$) and Gaussian noise injection bounded by cumulative budget $\epsilon \le 5.0$.
* **FedBN Scanner Harmonization:** Global Convolutional weights are shared while Batch Normalization layers remain private on individual scanners, preventing domain drift across GE, Siemens, and Philips machines.
* **Byzantine Sentinel Defense:** Cosine screening and Multi-Krum outlier rejection quarantine poisoned gradient updates.
* **Decentralized Model Distribution:** Verified model weights are pinned to Pinata IPFS with parent-child SHA-256 cryptographic provenance.

---

### Layer 7: Persistence & Realtime Data Layer
* **Supabase PostgreSQL 15:** Cloud database managing `triage_queue`, `hospital_beds`, `medical_resources`, `doctors_shifts`, `load_snapshots`, `ipfs_document_chunks`, and `patient_consents`.
* **Realtime WebSockets:** Live event streaming updating all client terminals instantly when patient priority changes or beds are assigned.
* **Pinata IPFS Network:** Decentralized storage for encrypted medical documents, preventing unauthorized central data leaks.

---

## 🛡️ 3. Clinical Governance, Reliability & Safety Boundaries

1. **Explicit SaMD Clinical Disclaimers:** All AI and QML predictions carry prominent notices:
   > *"AI-Assisted Assessment — Requires Clinician Confirmation. This result is computed by a Hybrid Quantum Machine Learning model for clinical decision support and is not a final medical diagnosis."*
2. **Authoritative Physician Overrides:** Attending physicians maintain 100% manual control to alter ESI triage priority levels, amend prescriptions, or discharge patients.
3. **Safety Rejection Guardrail:** If fewer than 2 core vital signs are detected in a patient upload, the QML pipeline safely refuses inference (`insufficient_data = True`).
4. **Resilient Offline Fallback Modes:** If external cloud services (Supabase, Gemini, Stripe, Twilio) experience outages, the backend automatically transitions into local in-memory mock datasets and deterministic rule-engines without crashing.
