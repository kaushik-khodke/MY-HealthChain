# 🏥 MyHealthChain — Project Summary & Architecture Blueprint
### *Autonomous Emergency Triage & Real-Time Hospital Command Infrastructure*

> **"Zero-Delay Triage. Intelligent Resource Optimization. Saving Lives in Real Time."**

---

![MyHealthChain Official Cover Banner](./cover.png)

---

## 📌 1. Executive Summary

**MyHealthChain** (also known as **Stelix**) is an enterprise-grade healthcare and emergency clinical ecosystem engineered for **Smart India Hackathon (SIH) 2026 Problem Statement ID: 26139** presented by **Egreen Quanta**: *"Hybrid Quantum Machine Learning Platform for Early Disease Detection"*.

The platform addresses two critical medical bottlenecks:
1. **Sub-Clinical Early Disease Detection via Hybrid QML:** Overcoming classical ML limitations on noisy, correlated biomedical data by deploying a 6-qubit Variational Quantum Classifier (VQC), Quantum Neural Networks (QNN), and Quantum Black Hole Optimization (QBHO) for early cardiovascular, diabetic, and pulmonary risk prediction.
2. **Autonomous Emergency Triage & Command Infrastructure:** Unifying **4 specialized portals** (Patient, Doctor, Pharmacist, and Hospital Command Center) with **ESI 1–5 triage prediction**, **WhatsApp automated bridges**, **voice telephony**, and **decentralized IPFS record storage** to eliminate ER bottlenecks and balance regional bed/oxygen supplies in real time.

---

## 🛠️ 2. Complete Technology Stack

| Layer | Technology / Library | Purpose / Role |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18**, **TypeScript**, **Vite** | Modern, ultra-fast SPA architecture |
| **Styling & UX** | **TailwindCSS**, **Lucide React**, Glassmorphism | Clean, responsive enterprise UI design system |
| **Backend Engine** | **FastAPI (Python 3.12)**, **Uvicorn** | High-performance asynchronous REST API gateway |
| **Database & Realtime** | **Supabase (PostgreSQL)** | Cloud database with instant WebSocket subscriptions |
| **Quantum ML (QML)** | **PennyLane** + **NumPy Statevector Engine** | 6-qubit Variational Quantum Classifier (VQC) with angle encoding & exact Pauli-Z observables |
| **QML Optimization** | **Quantum Black Hole Optimization (QBHO)** | Egreen Quanta quantum-inspired metaheuristic for feature selection & barren plateau avoidance |
| **Primary AI Model** | **Google Gemini 2.0 Flash** | Multimodal clinical strategic analytics, OCR, and document analysis |
| **Triage ML Model** | **XGBoost Classifier** | Real-time Emergency Severity Index (ESI 1-5 / RED-BLUE) triage prediction |
| **Risk Classifier** | **Scikit-Learn (Random Forest)** | RegEx OCR vital extraction & chronic health risk classification |
| **Forecasting Engine** | **Custom 4-Signal Algorithm** | 1-hour and 4-hour patient inflow volume prediction |
| **Decentralized Storage**| **Pinata IPFS Network** | Encrypted, tamper-proof medical document storage |
| **Voice AI & Telephony** | **Twilio** + **ElevenLabs API** | Conversational voice assistant over standard phone calls |
| **Messaging Gateway** | **Node.js (Baileys WhatsApp API)** | Automated WhatsApp shift notifications & PDF health reports |
| **Payment Gateway** | **Stripe API** | Automated checkout link generation for medicine orders & refills |

---

## 🏛️ 3. Comprehensive Breakdown of the 4 Portals & Touchpoints

MyHealthChain connects all healthcare stakeholders through 4 dedicated web portals and 3 integrated physical/telephony touchpoints:

```
                  ┌─────────────────────────────────────────┐
                  │          MyHealthChain Ecosystem         │
                  └────────────────────┬────────────────────┘
                                       │
      ┌────────────────┬───────────────┴───────────────┬────────────────┐
      │                │                               │                │
┌─────▼──────┐  ┌──────▼──────┐                 ┌──────▼──────┐  ┌──────▼──────┐
│ 1. Patient │  │  2. Doctor  │                 │3. Pharmacist│  │ 4. Hospital │
│   Portal   │  │   Portal    │                 │   Portal    │  │Command Center│
└─────┬──────┘  └──────┬──────┘                 └──────┬──────┘  └──────┬──────┘
      │                │                               │                │
      └────────────────┼───────────────────────────────┴────────────────┘
                       │
       ┌───────────────┼────────────────┐
┌──────▼──────┐ ┌──────▼──────┐  ┌──────▼──────┐
│  WhatsApp   │ │  Voice AI   │  │Smart Health │
│  Gateway    │ │ (Telephony) │  │ Card (QR)   │
└─────────────┘ └─────────────┘  └─────────────┘
```

---

### 🩸 3.1 Patient Portal
Designed for individuals to track their health, manage medical records, request prescriptions, and communicate with AI health agents.

* **Main Features & Sub-Pages:**
  * **Dashboard (`Dashboard.tsx`):** Real-time vitals overview (Heart Rate, BP, SpO2, Temp), upcoming appointments, active prescriptions, and emergency triage status.
  * **AI Health Tracker & Analysis (`Analysis.tsx` / `HealthTracker.tsx`):** Upload medical documents or input live vitals for instant Gemini OCR scanning and Random Forest risk categorizations (**Healthy**, **Warning**, **Critical**).
  * **My Medicines & Prescription Management (`MyMedicines.tsx`):** Active medicine inventory, refill counters, single-click order placements, and direct Stripe checkout links.
  * **Pharmacy AI Chat (`PharmacyChat.tsx`):** Interactive AI assistant to check stock availability, medicine usage instructions, and order status.
  * **Clinical AI Agent Chat (`AgentChat.tsx` / `Chat.tsx`):** Gemini 2.0 Flash powered symptom checker providing preliminary guidance and triage advice.
  * **Decentralized Medical Records (`Records.tsx`):** Store and manage medical files encrypted on the Pinata IPFS network.
  * **Granular Consent Management (`Consent.tsx`):** Grant or revoke medical record access to specific doctors with time-bound authorization locks and 4-digit PIN keys.

---

### 🥼 3.2 Doctor Portal
Empowers physicians and emergency room clinical teams to manage patients, review IPFS records, and perform fast QR-based patient intake.

* **Main Features & Sub-Pages:**
  * **Doctor Dashboard (`Dashboard.tsx`):** Assigned patient queue sorted by urgency score, active ER triage alerts, shift schedules, and real-time patient status updates.
  * **Patient Clinical View (`PatientView.tsx`):** Deep dive into patient medical history, view decrypted IPFS records, track vitals trends over time, and write/issue digital prescriptions.
  * **Smart Health Card QR Scanner (`Scan.tsx`):** Physical QR code scanner coupled with 4-digit PIN authentication to instantly unlock emergency patient medical histories bedside or in ambulances.

---

### 💊 3.3 Pharmacist Portal
Enables pharmacies to streamline prescription fulfillment, manage medicine stock, and assist patients with AI inventory tracking.

* **Main Features & Sub-Pages:**
  * **Fulfillment Dashboard (`Dashboard.tsx`):** Real-time incoming prescription orders queue, payment status tracking via Stripe, and stock reservation updates.
  * **Pharmacist AI Assistant (`PharmacistAI.tsx`):** AI-powered tool for drug-drug interaction validation, stock search, dosage verification, and automated customer query resolution.

---

### 🏥 3.4 Hospital Command Center & Emergency Resource Load Balancer
The nerve center for hospital administrators, ER triage leads, and regional health directors to manage capacity and prevent overload.

* **Main Features & Sub-Pages:**
  * **Real-Time Triage Command Dashboard (`Dashboard.tsx`):** High-density live display of the Emergency Severity Index (ESI) priority queue:
    * 🔴 **RED (ESI 1 - Resuscitation):** Immediate life threat.
    * 🟠 **ORANGE (ESI 2 - Emergent):** High risk, acute chest pain/stroke.
    * 🟡 **YELLOW (ESI 3 - Urgent):** Multiple resources needed, stable vitals.
    * 🟢 **GREEN (ESI 4 - Less Urgent):** Simple consultation/wound.
    * 🔵 **BLUE (ESI 5 - Non-Urgent):** Routine checkup/refill.
  * **Resource Load Balancer (`ResourceLoadBalancer.tsx`):** Real-time tracking of:
    * **Bed Occupancy Matrix:** ICU, General Ward, ER Bays, Trauma Beds.
    * **Critical Supplies:** Ventilators, Oxygen Cylinders, Blood Bank Units.
    * **Staffing Management:** Doctor and nurse shift assignments and load distribution.
  * **4-Signal Inflow & Deterioration Forecast Engine:** AI forecast predicting +1h and +4h incoming patient volumes using time-series trends, bed pressure multipliers, chronic disease vectors, and weather patterns.
  * **Gemini Strategic Command Analyzer:** Executive AI report generator identifying systemic operational bottlenecks and recommending actionable resource re-allocation strategies.
  * **Manual Triage Intake Modal (`TriageAssessmentModal.tsx`):** Allows immediate manual vital entry and priority overriding for walk-in or ambulance arrivals.

---

### 📱 3.5 Physical & Telephony Touchpoints

* **🟢 WhatsApp Gateway (Node.js Baileys API):** Sends automated doctor shift alerts, instant emergency surge notifications, and dispatches official PDF AI health reports directly to patient numbers.
* **📞 Voice AI Telephony (Twilio + ElevenLabs):** Enables elderly or non-smartphone users to call a dedicated phone line to check symptoms, request prescriptions, and receive automated voice guidance.
* **💳 Physical Smart Health Card (QR + PIN):** Enables offline-to-online emergency data access without requiring patient login during critical accidents.

---

## 🧠 4. Artificial Intelligence & Machine Learning Architecture

```
                                 ┌─────────────────────────┐
                                 │   Incoming Patient Data │
                                 └────────────┬────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
     ┌────────▼────────┐             ┌────────▼────────┐             ┌────────▼────────┐
     │  XGBoost Engine │             │  Random Forest  │             │ 4-Signal Engine │
     │  (ESI Triage)   │             │ (Health Risk)   │             │  (Inflow Model) │
     └────────┬────────┘             └────────┬────────┘             └────────┬────────┘
              │                               │                               │
              └───────────────────────────────┼───────────────────────────────┘
                                              │
                     ┌────────────────────────┼────────────────────────┐
                     │                        │                        │
            ┌────────▼────────┐      ┌────────▼────────┐      ┌────────▼────────┐
            │  Hybrid QML VQC │      │  QBHO Optimizer │      │ Gemini 2.0 Flash│
            │ (PennyLane/NumPy)│     │(Feature Select) │      │ (Strategic AI)  │
            └─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. **Hybrid Quantum-Classical VQC Engine (`backend/qml/`):**
   * **6-Qubit Parameterized Circuit:** Maps 6 standardized clinical biomarkers into quantum angles ($\phi = 2\arctan(z)$) via $R_y(\phi)$ and $R_z(\phi/2)$ rotations.
   * **2 Entangling Layers:** 36 variational angles ($R_x, R_y, R_z$) interconnected by circular CNOT gates.
   * **Exact Measurement:** Pauli-$Z$ observable expectation value ($\langle Z_0 \rangle, \langle Z_1 \rangle$) with calibrated sigmoid probability output.
   * **Dual Backends:** PennyLane `default.qubit` simulator + zero-dependency exact NumPy statevector fallback.
2. **Egreen Quanta Algorithmic Extensions:**
   * **Quantum Black Hole Optimization (QBHO):** Quantum-inspired metaheuristic for optimal biomarker feature selection and escaping barren plateaus in variational angle tuning.
   * **Quantum Neural Networks (QNN) & Quantum Gates:** Modeled after Egreen Quanta's stem cell discovery architecture to capture multi-analyte sub-clinical degenerative signatures.
   * **Quantum Support Vector Machines (QSVM):** Quantum kernel matrix evaluation ($K(x_i, x_j) = |\langle\phi(x_i)|\phi(x_j)\rangle|^2$) for complex non-linear classification.
3. **XGBoost ESI Triage Classifier (`ml_triage.py`):** Evaluates systolic BP, diastolic BP, heart rate, SpO2, body temperature, age, and chief complaint to assign an ESI priority rating (RED to BLUE) and an urgency score (0-100).
4. **Random Forest Chronic Risk Engine (`ml_engine.py`):** Combines RegEx document parsing with Random Forest classification to categorize overall patient health risk (**Healthy**, **Warning**, **Critical**).
5. **4-Signal Inflow Forecasting Engine (`resource_load.py`):**
   * *Signal 1:* 4-week rolling time-series average.
   * *Signal 2:* Bed occupancy pressure multiplier.
   * *Signal 3:* IPFS chronic disease vector scans.
   * *Signal 4:* Seasonal weather multipliers (Summer, Monsoon, Winter).
6. **Gemini 2.0 Flash Strategic Analyzer (`ai_config.py`):** Generates high-level executive command summaries, detects operational bottlenecks, and suggests automated resource transfers between regional wards.

---

## 🗄️ 5. Database Schema & Storage Model (Supabase PostgreSQL)

* **`triage_queue`:** Stores active ER patients, vital signs, assigned ESI priority level, urgency score, and status (`WAITING`, `IN_TRIAGE`, `TREATED`).
* **`hospital_beds`:** Tracks total, occupied, and available beds across wards (ICU, General, ER, Trauma).
* **`medical_resources`:** Inventory tracking for Oxygen cylinders, Ventilators, PPE, and Blood Bank units.
* **`doctors_shifts`:** Doctor availability, active shift status, department assignment, and contact metadata.
* **`load_snapshots`:** Hourly historical system load logs for time-series forecasting.
* **`ipfs_document_chunks`:** Vector embeddings and IPFS hashes for encrypted decentralized medical record lookup.
* **`patient_consents`:** Trackable doctor access grants, expiration timestamps, and PIN verification hashes.

---

## 🔌 6. Primary API Endpoints Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/patient/qml-analysis` | **Executes 6-qubit Hybrid VQC disease prediction & circuit telemetry** |
| `GET` | `/patient/qml-benchmarks` | **Returns measured benchmarks: QML vs RF, Logistic Regression, XGBoost** |
| `GET` | `/patient/qml-models` | Lists registered disease-specific QML models & quantum specs |
| `GET` | `/patient/qml-demo-profiles` | Returns test profiles (Low Risk, High Risk, Incomplete Records) |
| `GET` | `/health` | Diagnostics & database connectivity check |
| `POST` | `/predict-triage` | Evaluates vitals via XGBoost ML model and returns ESI priority |
| `POST` | `/pharmacy/chat` | AI Pharmacy chatbot query handling |
| `POST` | `/place_order` | Places medicine order and returns Stripe payment URL |
| `POST` | `/send-whatsapp-health-report` | Sends AI health insight PDF report via Baileys WhatsApp Gateway |
| `POST` | `/forecast/inflow` | Triggers 4-Signal patient inflow prediction engine |
| `POST` | `/command/analysis` | Invokes Gemini 2.0 Flash for strategic command center reports |

---

## 🚀 7. Installation & Quick Start Guide

### Prerequisites
* **Node.js** (v18+)
* **Python** (v3.10+)
* **Supabase Account** & **Google Gemini API Key**

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*Backend API runs on `http://localhost:8000` (Swagger UI at `/docs`)*

### 3. WhatsApp Gateway Setup (Optional)
```bash
cd whatsapp-gateway
npm install
node index.js
```

---

## 🛡️ 8. Security & Privacy Framework
* **Decentralized Storage:** Patient medical files are encrypted prior to pinning on IPFS via Pinata.
* **PIN-Protected Health Cards:** Access to sensitive patient data via physical QR card requires a 4-digit PIN entry.
* **Time-Bound Consent:** Patients retain granular control over which doctors can inspect their health records, with automated expiration of access privileges.
* **Row-Level Security (RLS):** Supabase database policies restrict record access based on authenticated user roles.

---

### 📄 Summary Document Metadata
* **Document Version:** 1.0.0 (Production Blueprint)
* **Project Name:** MyHealthChain / Stelix Emergency System
* **Author:** Development Team
* **License:** Proprietary Hackathon Edition
