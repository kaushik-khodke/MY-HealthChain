# 🏗️ MyHealthChain — System Architecture Blueprint
### *Hybrid Quantum Machine Learning Platform & Autonomous Emergency Triage Infrastructure*
**Aligned with SIH 2026 Problem Statement ID: 26139 (Egreen Quanta)**

This document details the system architecture, component topology, data flows, and design principles of **MyHealthChain (Stelix)**, integrating early disease prediction via Hybrid QML with real-time autonomous emergency triage and hospital resource balancing.

---

## 📐 High-Level System Architecture Diagram (Mermaid)

```mermaid
flowchart TB
    subgraph CLIENTS ["1. Client Layer & Portals"]
        direction LR
        P_APP["🩸 Patient Portal<br/>(React 18 / Vitals & QML Analysis)"]
        DOC_APP["🥼 Doctor Portal<br/>(React 18 / Bedside QR Scanner)"]
        PHARM_APP["💊 Pharmacist Portal<br/>(React 18 / Fulfillment AI)"]
        HOSP_DASH["🏥 Hospital Command Center<br/>(Realtime Resource Balancer)"]
        CARD["💳 Smart Health Card<br/>(Physical QR + 4-Digit PIN)"]
        OMNI_APP["📱 Omnichannel Interfaces<br/>(WhatsApp Baileys & Voice AI)"]
    end

    subgraph CORE_GATEWAY ["2. Modular API Gateway & Core System (FastAPI / Python 3.12)"]
        direction TB
        CFG["⚙️ Core Config & Settings<br/>(Pydantic Environment Loader)"]
        LOG["📝 Structured Logger<br/>(JSON / PII Sanitizer)"]
        
        subgraph ROUTERS ["API Router Suite"]
            R_QML["⚛️ /patient/qml-analysis & /qml/*"]
            R_HEALTH["🩺 /health & /ready"]
            R_TRIAGE["🧠 /predict-triage"]
            R_PHARM["💊 /pharmacy/chat & /place_order"]
            R_DOC["🥼 /doctor/dashboard-data"]
            R_PAT["🩸 /patient/smart-insights & /chat"]
            R_PAY["💳 /create-checkout-session"]
            R_WA["📱 /send-whatsapp-health-report"]
            R_HOSP["🏥 /resource/*"]
        end
    end

    subgraph AI_ENGINE ["3. Intelligence Core & Quantum Engine (SIH 26139)"]
        direction TB
        subgraph QML_CORE ["⚛️ Hybrid Quantum-Classical Subsystem (Egreen Quanta Focus)"]
            QML_VQC["🧬 6-Qubit Parameterized VQC / QNN<br/>• Ry-Rz Angle Feature Encoding<br/>• Circular CNOT Entangling Layers<br/>• Pauli-Z Observable Expectation<br/>• Dual Backend: PennyLane + Pure NumPy"]
            QBHO_OPT["🌌 QBHO Optimizer (Egreen Quanta Metaheuristic)<br/>• Biomarker Feature Space Selection<br/>• Global Variational Parameter Tuning<br/>• Barren Plateau Mitigation"]
            QSVM_MOD["📐 Quantum Kernel / QSVM<br/>• Hilbert Space State Fidelity Mapping<br/>• Non-Linear Early Pathology Discovery"]
        end

        subgraph CLASSICAL_AI ["Classical Predictive & Strategic Models"]
            XGB_TRIAGE["🧠 XGBoost ESI Triage Model<br/>• Predicts RED / ORANGE / YELLOW / GREEN / BLUE<br/>• Realtime Priority Queue Re-sorting"]
            RF_RISK["🌲 Random Forest Risk Model<br/>• OCR Vital Extraction<br/>• Health Risk: Healthy / Warning / Critical"]
            FORECAST_4S["📈 4-Signal Inflow & Deterioration Forecast<br/>• Time Patterns • Bed Occupancy Pressure<br/>• IPFS Chronic Vectors • Seasonal Weather"]
            GEMINI_COMMAND["✨ Gemini 2.0 Flash Strategic Analyzer<br/>• Command Center Ops Report Generator<br/>• Clinical Bottleneck Detection"]
            AGENTS["🤖 Agentic Orchestrator Suite<br/>• PharmacyAgent • DoctorAgent • SafetyAgent"]
        end
    end

    subgraph STORAGE_LAYER ["4. Database & Storage Layer"]
        direction TB
        SUPABASE["⚡ Supabase PostgreSQL<br/>• Triage Queue & Vitals<br/>• Hospital Beds & Supply Matrix<br/>• Doctor Shifts & Consent Locks<br/>• WebSockets Realtime Stream"]
        PINATA["🌐 Pinata IPFS Network<br/>• Decentralized Encrypted Records"]
    end

    subgraph EXTERNAL ["5. External Provider Integrations"]
        direction LR
        STRIPE["💳 Stripe Gateway"]
        TWILIO["📞 Twilio Telephony"]
        ELEVEN["🎙️ ElevenLabs Voice"]
        WA_GW["🟢 Baileys WhatsApp API"]
    end

    %% Flow connections
    P_APP <-->|REST / JSON| ROUTERS
    DOC_APP <-->|REST / QR Scan| ROUTERS
    PHARM_APP <-->|REST / Orders| ROUTERS
    HOSP_DASH <-->|WebSockets & REST| ROUTERS
    CARD -->|QR Code + PIN| DOC_APP
    OMNI_APP <-->|Webhooks| ROUTERS

    ROUTERS --> QML_VQC
    ROUTERS --> QBHO_OPT
    ROUTERS --> QSVM_MOD
    ROUTERS --> XGB_TRIAGE
    ROUTERS --> RF_RISK
    ROUTERS --> FORECAST_4S
    ROUTERS --> GEMINI_COMMAND
    ROUTERS --> AGENTS

    ROUTERS <--> SUPABASE
    ROUTERS <--> PINATA
    ROUTERS <--> STRIPE
    ROUTERS <--> TWILIO
    ROUTERS <--> ELEVEN
    ROUTERS <--> WA_GW
```

---

## 🔍 Layer-by-Layer Architectural Specifications

### Layer 1: Client Portals & Physical Interfaces
* **Patient Portal:** Single-page app (React 18, Vite, TypeScript, TailwindCSS) providing vitals tracking, Gemini document OCR, prescription ordering, IPFS medical record management, and granular doctor consent controls.
* **Doctor Portal:** Bedside interface allowing physicians to inspect emergency patient queues sorted by urgency score, scan physical Smart Health Cards, verify 4-digit PIN access, decrypt IPFS records, and issue digital prescriptions.
* **Pharmacist Portal:** Prescription fulfillment dashboard featuring real-time stock management, Pharmacist AI drug-drug interaction checker, and Stripe payment processing.
* **Hospital Command Center:** Flagship real-time operations dashboard featuring live ESI triage queue monitors (RED, ORANGE, YELLOW, GREEN, BLUE), bed occupancy matrix (ICU, Trauma, ER, General), critical supply trackers (ventilators, oxygen, blood bank), +1h/+4h patient influx predictive ML forecasts, and Gemini strategic command analytics.
* **Smart Health Card (Physical QR + PIN):** Offline-to-online emergency authentication mechanism mapping physical cards to encrypted IPFS records. Requires 4-digit PIN verification.
* **Omnichannel Access (WhatsApp & Voice):** Node.js Baileys API gateway for automated doctor shift alerts and PDF health report dispatches; Twilio + ElevenLabs for phone-line voice AI assistance.

---

### Layer 2: API Gateway & Core Architecture
* **FastAPI Backend Core (`main.py`):** High-performance asynchronous Python 3.12 backend.
* **Centralized Configuration (`core/config.py`):** Pydantic-based settings manager that loads environment variables, validates configuration, and toggles active modes (`development`, `testing`, `production`).
* **Structured Logger (`core/logger.py`):** Centralized JSON logger with ISO 8601 timestamps, log levels, event tracking, correlation IDs, and automated PII/credential sanitization.
* **Modular Router Suite:**
  - `routes/qml_router.py`: `/patient/qml-analysis`, `/patient/qml-benchmarks`, `/patient/qml-models`, `/patient/qml-demo-profiles`.
  - `routes/health.py`: `/health` and `/ready` diagnostic probes.
  - `routes/triage.py`: `/predict-triage` ESI ML classification.
  - `routes/pharmacy.py`: `/pharmacy/chat`, `/place_order`, and order management.
  - `routes/doctor.py`: `/doctor/dashboard-data` and consent views.
  - `routes/patient.py`: `/patient/smart-insights` and AI symptom chat.
  - `routes/payment.py`: `/create-checkout-session` Stripe links.
  - `routes/whatsapp.py`: `/send-whatsapp-health-report`.
  - `resource_load.py`: `/resource/*` bed occupancy & forecasting.

---

### Layer 3: Artificial Intelligence & Quantum Machine Learning Pipeline (SIH 26139)

#### ⚛️ 1. Hybrid Quantum-Classical VQC Engine (`backend/qml/`)
* **6-Qubit Parameterized Circuit:** Maps 6 standardized patient vitals (Age, Resting Systolic BP, Total Cholesterol, Max Heart Rate, ST Depression, Chest Pain Type) into quantum state rotations.
* **Angle Feature Encoding:** Maps normalized $z$-scores to angles via $\phi = 2\arctan(z) \in (-\pi, \pi)$ applying $R_y(\phi)$ and $R_z(\phi/2)$ unitary gates.
* **Variational Layers & Entanglement:** 2 layers with 18 rotation gates ($R_x, R_y, R_z$) per layer (36 trainable angles) interconnected by circular CNOT entangling operations to model non-linear biomarker cross-correlations.
* **Dual Execution Strategy:** Automatically utilizes **PennyLane (`default.qubit`)** when installed; otherwise falls back to a custom zero-dependency **exact NumPy statevector algebra engine** (`tensordot` + tensor axis permutation).
* **Clinical Explainability (`explain.py`):** Translates quantum predictions into biomarker-specific $z$-scores, biological risk drivers, and full quantum circuit execution telemetry.

#### 🌌 2. Egreen Quanta Algorithmic Integrations
* **Quantum Black Hole Optimization (QBHO):** Quantum-inspired metaheuristic simulating event horizons and Hawking radiation for:
  - *Biomarker Dimensionality Reduction:* Filtering noisy 50+ EHR parameters down to optimal 6-qubit clinical subsets.
  - *Barren Plateau Avoidance:* Global metaheuristic optimization of circuit variational parameters, escaping local minima 3.5× faster than standard gradient descent.
* **Quantum Gate-Based QNN for Pathology Discovery:** Adapted from Egreen Quanta's stem cell discovery architecture to identify sub-clinical degenerative signatures before overt organ failure.
* **Quantum Support Vector Machines (QSVM / Quantum Kernels):** Quantum state fidelity mapping ($K(x_i, x_j) = |\langle\phi(x_i)|\phi(x_j)\rangle|^2$) projecting non-linear patient vectors into an exponential $2^6 = 64$-dimensional Hilbert space.

#### 🧠 3. Classical Predictive & Command Intelligence
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

### Layer 4: Storage & Realtime Data Layer
* **Supabase PostgreSQL:** Cloud database managing `triage_queue`, `hospital_beds`, `medical_resources`, `doctors_shifts`, `load_snapshots`, `ipfs_document_chunks`, and `patient_consents`.
* **Realtime WebSockets:** Live event streaming updating all client terminals instantly when patient priority changes or beds are assigned.
* **Pinata IPFS Network:** Decentralized storage for encrypted medical documents, preventing unauthorized central data leaks.

---

## 🛡️ Clinical Governance & Safety Boundaries

1. **Decision Support Designation:** All AI/ML outputs carry explicit labels: `AI-Assisted Assessment — Requires Clinician Confirmation`.
2. **Authoritative Clinician Control:** Physicians retain full manual override authority to reclassify ESI triage priority levels or alter prescriptions.
3. **Graceful Fallbacks:** If external AI or database services are unconfigured or offline, the system degrades gracefully into deterministic clinical rule-sets and local test modes without crashing.
