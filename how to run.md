# 🚀 How to Run MyHealthChain (Stelix)
### *Complete Developer, Evaluator & Deployment Runbook*
**Smart India Hackathon (SIH 2026) | Problem Statement ID: 26139 (Egreen Quanta)**

---

This guide provides end-to-end instructions to set up, configure, launch, test, and troubleshoot all services of **MyHealthChain (Stelix)** on Windows, Linux, and macOS.

---

## 📋 System Prerequisites

| Component | Minimum Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | v18.0.0+ | v20.x LTS | Required for React 18 frontend & WhatsApp gateway |
| **npm** | v9.0.0+ | v10.x | Node package manager |
| **Python** | v3.10.0+ | v3.11 / v3.12 | Required for FastAPI backend & QML simulator |
| **Git** | v2.30+ | Latest | Version control |
| **Supabase** | Cloud / Local | Cloud PostgreSQL | Managed database with WebSockets enabled |

---

## ⚙️ 1. Environment Configuration

### Step 1: Copy Environment Templates
Create `.env` in the project root and inside `backend/`:

```bash
# On Linux / macOS:
cp backend/.env.example backend/.env

# On Windows (PowerShell):
Copy-Item backend\.env.example backend\.env
```

### Step 2: Configure Environment Variables
Open `backend/.env` and update with your active credentials:

```env
# ── Server Configuration ────────────────────────────────────
PORT=8000
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# ── Supabase (Database & Realtime) ──────────────────────────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# ── Google Gemini AI (Clinical Reasoning & OCR) ─────────────
GEMINI_API_KEY=your_gemini_api_key

# ── Stripe Payment Gateway ──────────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# ── Pinata IPFS (Decentralized Storage) ──────────────────────
PINATA_API_KEY_XRAY=your_pinata_key
PINATA_SECRET_KEY_XRAY=your_pinata_secret
PINATA_JWT_XRAY=your_pinata_jwt

# ── Voice AI & Telephony (Optional) ─────────────────────────
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
ELEVENLABS_API_KEY=your_elevenlabs_key
```

> [!NOTE]
> **Zero-Dependency Resilience:** If any cloud API keys (Supabase, Gemini, Stripe, Twilio) are omitted or unconfigured, the system automatically engages **built-in local mock adapters and deterministic clinical fallback engines**. You can run and evaluate the entire platform offline!

---

## 🗄️ 2. Database Schema Initialization (Supabase)

If utilizing a live Supabase project:
1. Navigate to your **Supabase Dashboard** -> **SQL Editor**.
2. Execute the database migration scripts located in the project root in the following sequence:
   * **`overall.sql`**: Core user profiles, patient records, doctor credentials, orders, and refill routines.
   * **`supabase_hms_all_phases.sql`**: Complete enterprise Hospital Management System tables (UHID registries, OPD tokens, Inpatient ADT, CPOE orders, eMAR administration logs, LIS specimens, RIS PACS studies, OT surgical checklists, and blood bank stocks).
   * **`supabase_fl.sql`**: Federated learning round metadata and decentralized model checkpoint registries.

---

## 🚀 3. Quick Launch Options

### Option A: One-Click Automated Launch Scripts (Recommended)

#### 🪟 Windows (PowerShell):
```powershell
# Automated setup (installs virtualenv & npm dependencies)
.\setup.ps1

# Launches Backend, Frontend, and WhatsApp Gateway concurrently
.\start_all.ps1
```

#### 🐧 Linux / macOS (Bash):
```bash
# Automated setup
chmod +x setup.sh start_all.sh
./setup.sh

# Launch all services
./start_all.sh
```

---

### Option B: Manual Service-by-Service Startup

#### Terminal 1: FastAPI Backend Server
```bash
cd backend

# Create & activate Python virtual environment
python -m venv .venv
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Launch ASGI server with auto-reload
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend initializes at: `http://localhost:8000`*  
*Swagger Documentation: `http://localhost:8000/docs`*

#### Terminal 2: React 18 Frontend Application
```bash
cd frontend

# Install dependencies
npm install

# Launch Vite development server
npm run dev -- --port 3000
```
*Frontend opens at: `http://localhost:3000` (or `http://localhost:5173`)*

#### Terminal 3 (Optional): WhatsApp Gateway Service
```bash
cd whatsapp-gateway
npm install
node index.js
```
*Gateway runs on port 3001, exposing Baileys automated WhatsApp messaging.*

---

## 🧪 4. Running the Automated Test Suite

Verify all mathematical, quantum, triage, and resilience implementations:

```bash
cd backend
python -m pytest tests/ -v
```

### Targeted Test Suites:
* **Hybrid QML Subsystem:**
  ```bash
  python -m pytest tests/test_qml.py -v
  ```
  *Verifies 6-qubit VQC statevector execution, QBHO feature selection, angle vector scaling $[-\pi, \pi]$, and incomplete data rejection.*
* **Emergency ESI Triage Classifier:**
  ```bash
  python -m pytest tests/test_triage_ml.py -v
  ```
  *Validates sub-5ms XGBoost ESI 1–5 classification and vital threshold alerts.*
* **Hospital Surge Forecaster:**
  ```bash
  python -m pytest tests/test_forecasting.py -v
  ```
* **Offline Resilience & Fallbacks:**
  ```bash
  python -m pytest tests/test_resilience_fallbacks.py -v
  ```

---

## 🌐 5. Service Map & Port Directory

| Service | Port / URL | Purpose |
| :--- | :--- | :--- |
| **Patient Portal & QML Engine** | `http://localhost:3000/patient/analysis` | Interactive QML telemetry, lab OCR, QR health cards |
| **Doctor Portal** | `http://localhost:3000/doctor/dashboard` | Bedside QR scanning, ESI queue, digital prescriptions |
| **Hospital Command Center** | `http://localhost:3000/hospital/triage` | Live ESI 1-5 triage queue, bed matrix, surge forecaster |
| **Pharmacist Portal** | `http://localhost:3000/pharmacist/dashboard` | Live fulfillment queue, drug interaction AI, Stripe checkout |
| **FastAPI REST API** | `http://localhost:8000` | Asynchronous backend API gateway |
| **Interactive Swagger Docs** | `http://localhost:8000/docs` | OpenAPI live testing UI |
| **Backend Health Probe** | `http://localhost:8000/health` | System diagnostics & database connectivity probe |
| **WhatsApp Gateway** | `http://localhost:3001` | Baileys Node.js WhatsApp notification service |

---

## 🔧 6. Troubleshooting & FAQs

### Q1: What if PennyLane is not installed on my machine?
> **Zero Problem!** The QML engine incorporates an **exact 64-dimensional complex statevector algebra engine in pure NumPy** (`tensordot` + tensor axis permutation). If `pennylane` is unavailable, the pipeline automatically executes in NumPy with 100% mathematical fidelity.

### Q2: Port 8000 or 3000 is already in use
> Kill existing processes or change the port:
> ```powershell
> # On Windows:
> Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
> ```
> Alternatively, pass `--port 8001` to uvicorn and `--port 3001` to Vite.

### Q3: How do I test the QML API with curl?
```bash
curl -X POST http://localhost:8000/patient/qml-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "TEST-01",
    "vitals": {
      "age": 55,
      "trestbps": 150,
      "chol": 260,
      "thalach": 125,
      "oldpeak": 2.2,
      "cp": 2
    }
  }'
```