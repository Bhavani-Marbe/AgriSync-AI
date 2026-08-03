# AgriSync AI - Enterprise Smart Agriculture & Precision Farming SaaS Platform

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green.svg)](https://www.python.org/)
[![Django REST](https://img.shields.io/badge/Django_REST-3.15-red.svg)](https://www.django-rest-framework.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**AgriSync AI** is a production-quality Smart Agriculture & Precision Farming SaaS platform built for farmers, agronomists, farm managers, and agricultural enterprises. It integrates Machine Learning crop yield recommendation models, Gemini 3.6 Flash computer vision for crop disease pathology, Penman-Monteith evapotranspiration irrigation modeling, APMC Mandi price tracking, role-based access control (RBAC), and automated PDF worklog generation.

---

## 🌟 Key Platform Features

- **🌾 ML Crop Recommendation Engine**: Scikit-Learn `RandomForestClassifier` with SHAP explainable feature importance ratings, soil compatibility scoring, yield estimation, and profit projection in INR (₹) / Acre.
- **🔬 Vision AI Plant Pathology & Disease Scanner**: Instant leaf image pathology scanning using Gemini 3.6 Flash. Provides disease identification, causal agent analysis, symptoms list, chemical/organic treatment dosages, and KVK / Extension Lab contacts.
- **💧 Smart Evapotranspiration Irrigation**: Penman-Monteith ET₀ calculations based on soil moisture, solar radiation, temperature, and canopy stage.
- **🌱 Soil Nutrient & Fertigation Planner**: NPK nutrient deficit analysis with stage-specific basal and top-dressing dosage schedules for Indian soil types (Black Cotton, Alluvial, Red Loam, Clay).
- **📈 APMC Mandi Market Price Intelligence**: 5-day commodity price movement tracking across major Indian market yards (APMC Kalaburagi, Raichur, Vijayapura, Hubballi) with 30-day forecast models.
- **🤖 Gemini 3.6 Flash AI Agronomist Assistant**: Context-aware conversational chatbot for personalized agronomy advice, fertilizer calculation, and pest control guidelines with text-to-speech support.
- **📑 Dynamic PDF Reports Generator**: ReportLab-powered PDF generation for pathology lab audit reports, farm health logs, and market revenue projections.
- **🔐 Enterprise Security & RBAC**: Multi-role security model tailored for Farmers, Farm Managers, Agronomists, and System Admins with JWT access/refresh token rotation.
- **🖥️ Administrative & Telemetry Portal**: Node status monitoring, API latency telemetry, ML inference counts, and immutable security audit logs.

---

## 🏗️ Architecture & Technology Stack

### System Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client Browser (React 19 SPA)                │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / REST (Port 3000)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Node.js Express Gateway (server.ts)                │
│  - Vite Server Middleware & Static Asset Delivery               │
│  - Gemini 3.6 Flash Vision & Chatbot Proxy Handler              │
│  - Fallback ML Rules & Diagnostic Fallback Engine               │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Internal Proxy (/api/v1/*)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Django REST Framework Core (Port 8000)             │
│  - Modular Architecture (Farms, ML, Pathology, Market, Advisory)│
│  - Scikit-Learn Random Forest Pipeline                           │
│  - ReportLab PDF Report Generation                              │
│  - PostgreSQL / SQLite Database Engine                          │
└─────────────────────────────────────────────────────────────────┘
```

### Stack Specifications

- **Frontend**: React 19, TypeScript 5.5, Vite 6, Tailwind CSS v4, Lucide Icons, Recharts, Motion.
- **Backend Services**: Node.js 20 Express gateway + Python 3.11 Django REST Framework 3.15.
- **Machine Learning**: Scikit-Learn `RandomForestClassifier` (96.8% accuracy), NumPy, Pandas, Joblib.
- **Generative AI**: `@google/genai` SDK with `gemini-3.6-flash` for multimodal leaf inspection and natural language agronomy advice.
- **PDF Engine**: Python `reportlab` & client-side `jspdf` for document synthesis.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+ & npm 9+
- Python 3.10+ & pip
- (Optional) PostgreSQL & Docker

### Quick Start (Development)

1. **Clone repository**:
   ```bash
   git clone https://github.com/your-org/agrisync-ai.git
   cd agrisync-ai
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Install Python backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run Django Database Migrations**:
   ```bash
   PYTHONPATH=backend python3 backend/manage.py migrate
   ```

5. **Execute Unit Test Suite**:
   ```bash
   PYTHONPATH=backend python3 backend/manage.py test apps.authentication.tests apps.farms.tests apps.ml_intelligence.tests apps.disease.tests apps.weather.tests apps.market.tests apps.agronomist.tests apps.smart_irrigation.tests apps.fertilizers.tests apps.notifications.tests apps.reports.tests apps.analytics.tests apps.admin_portal.tests
   ```

6. **Start Application Dev Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## 🧪 Testing & Code Quality

### Run Frontend Linter & Type Check

```bash
npm run lint
```

### Run Full Production Build

```bash
npm run build
```

---

## 🔐 Role-Based Access Matrix

| Role | Access Scope |
| :--- | :--- |
| **FARMER** | My Farms, Crop Recommendation Engine, Disease Scanner, Smart Irrigation, Weather Radar, AI Agronomist, APMC Prices, PDF Reports |
| **FARM_MANAGER** | Manager Dashboard, Farms & Laborers, Fertigation & Pumps, Field Disease Logs, Farm Yield Analytics, Worklog PDF Export |
| **AGRONOMIST** | Agronomist Desk, Farmer Consultations, Pathology Diagnostics, Crop ML Engine, Soil & Fertigation, Outbreak Heatmaps, Agronomy Reports |
| **ADMIN** | Platform & Security Ops, System Telemetry, Audit Logs, Farms Security Audit |

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
