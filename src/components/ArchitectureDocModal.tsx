import React, { useState } from 'react';
import {
  X,
  Server,
  Database,
  Code2,
  FileText,
  MapPin,
  CheckCircle2,
  Layers,
  Terminal,
  Cpu,
  Workflow,
  ShieldCheck,
  Copy,
  Check,
} from 'lucide-react';

interface ArchitectureDocModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocModal: React.FC<ArchitectureDocModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'erd' | 'api' | 'folders' | 'devops' | 'roadmap'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                AgriSync AI — Software Architecture & Systems Blueprint
              </h2>
              <p className="text-xs text-slate-400">
                Production Engineering Design Document • Enterprise Grade Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Navigation */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 flex items-center gap-2 overflow-x-auto py-2">
          {[
            { id: 'architecture', label: '1. Software Architecture', icon: Server },
            { id: 'erd', label: '2. Database & ERD', icon: Database },
            { id: 'api', label: '3. API Design & Specs', icon: Code2 },
            { id: 'folders', label: '4. Folder Structure', icon: FileText },
            { id: 'devops', label: '5. DevOps & Infrastructure', icon: Terminal },
            { id: 'roadmap', label: '6. Development Roadmap', icon: Workflow },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-sm text-slate-300">
          {/* SECTION 1: SOFTWARE ARCHITECTURE */}
          {activeSection === 'architecture' && (
            <div className="space-y-6">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4">
                <h3 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5" /> Clean Enterprise Architecture Overview
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  AgriSync AI is architected using domain-driven Clean Architecture principles. Business domain models are decoupled from frameworks, transport layers, and databases through Service Layers, Repositories, and Async Message Queues.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Presentation Layer</span>
                  <h4 className="font-bold text-white text-base">React 19 + Vite Frontend</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>TypeScript strict mode & component modularity</li>
                    <li>Tailwind CSS for responsive SaaS UI</li>
                    <li>Recharts for high-throughput farm data visualization</li>
                    <li>TanStack Query for client-side API caching</li>
                  </ul>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Core Service Layer</span>
                  <h4 className="font-bold text-white text-base">Express / Python API Gateway</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>REST APIs with OpenAPI / Swagger contracts</li>
                    <li>JWT Authentication with short-lived access & refresh tokens</li>
                    <li>Rate limiting, XSS, and SQL Injection prevention middleware</li>
                    <li>Repository pattern for database abstraction</li>
                  </ul>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Async & AI Tier</span>
                  <h4 className="font-bold text-white text-base">Celery, Redis & Gemini AI</h4>
                  <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                    <li>Gemini 3.6 Flash SDK for plant pathology & chatbot</li>
                    <li>Scikit-Learn ML Crop Engine with SHAP feature explanations</li>
                    <li>Celery + Redis for async weather polling & SMS/Email alerts</li>
                    <li>PostgreSQL relational database with normalized schema</li>
                  </ul>
                </div>
              </div>

              {/* Architectural Workflow ASCII Diagram */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                <p className="text-slate-400 text-[10px] mb-2">// HIGH LEVEL SYSTEM DATA FLOW DIAGRAM</p>
                <pre>{`
[ Client Browser / Mobile ] 
           │
           ▼ HTTP / REST (JWT Auth)
[ Nginx Reverse Proxy / Port 3000 ]
           │
           ├───► [ API Gateway & Service Layer ]
           │            │
           │            ├───► [ Repository Layer ] ───► [ PostgreSQL DB ]
           │            │
           │            ├───► [ ML Engine (Scikit-Learn) ] ───► SHAP Explainable AI
           │            │
           │            └───► [ Gemini AI Client SDK ] ───► Vision / Chat
           │
           └───► [ Redis Memory Cache ] ◄───► [ Celery Task Workers ]
                                                     │
                                                     └───► Weather API Poller
                                                     └───► SMS / Email Alerts
                `}</pre>
              </div>
            </div>
          )}

          {/* SECTION 2: DATABASE DESIGN & ERD */}
          {activeSection === 'erd' && (
            <div className="space-y-6">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" /> PostgreSQL Normalized Schema Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Fully 3NF normalized schema with Foreign Key constraints, Indexes on frequent query paths (userId, farmId, timestamp), and Audit Log retention.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Table: users */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-emerald-400 text-xs">users</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">PK: id</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• email: VARCHAR(255) UNIQUE</li>
                    <li>• password_hash: VARCHAR(255)</li>
                    <li>• full_name: VARCHAR(100)</li>
                    <li>• role: VARCHAR(20) [FARMER|ADMIN]</li>
                    <li>• is_email_verified: BOOLEAN</li>
                    <li>• created_at: TIMESTAMP</li>
                  </ul>
                </div>

                {/* Table: farms */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-teal-400 text-xs">farms</span>
                    <span className="text-[10px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">FK: user_id</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• user_id: UUID (FK -&gt; users.id)</li>
                    <li>• farm_name: VARCHAR(150)</li>
                    <li>• location_name: VARCHAR(255)</li>
                    <li>• area_acres: NUMERIC(10,2)</li>
                    <li>• soil_type: VARCHAR(50)</li>
                    <li>• water_source: VARCHAR(50)</li>
                  </ul>
                </div>

                {/* Table: soil_data */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">soil_data</span>
                    <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">FK: farm_id</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• farm_id: UUID (FK -&gt; farms.id)</li>
                    <li>• nitrogen_ppm: NUMERIC(6,2)</li>
                    <li>• phosphorus_ppm: NUMERIC(6,2)</li>
                    <li>• potassium_ppm: NUMERIC(6,2)</li>
                    <li>• ph_level: NUMERIC(3,1)</li>
                    <li>• tested_at: TIMESTAMP</li>
                  </ul>
                </div>

                {/* Table: crop_recommendations */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-amber-400 text-xs">crop_recommendations</span>
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">XAI Predictions</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• farm_id: UUID (FK)</li>
                    <li>• recommended_crop: VARCHAR(100)</li>
                    <li>• confidence_score: NUMERIC(5,2)</li>
                    <li>• yield_estimate_tons: NUMERIC(8,2)</li>
                    <li>• shap_feature_weights: JSONB</li>
                    <li>• reasoning_text: TEXT</li>
                  </ul>
                </div>

                {/* Table: disease_logs */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-rose-400 text-xs">disease_logs</span>
                    <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-800">Vision AI</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• farm_id: UUID (FK)</li>
                    <li>• image_url: TEXT</li>
                    <li>• disease_name: VARCHAR(150)</li>
                    <li>• severity: VARCHAR(20)</li>
                    <li>• treatment_plan: JSONB</li>
                  </ul>
                </div>

                {/* Table: audit_logs */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono font-bold text-indigo-400 text-xs">audit_logs</span>
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">System Logs</span>
                  </div>
                  <ul className="text-[11px] font-mono space-y-1 text-slate-300">
                    <li>• id: UUID (PK)</li>
                    <li>• user_id: UUID (FK)</li>
                    <li>• action: VARCHAR(100)</li>
                    <li>• module: VARCHAR(50)</li>
                    <li>• ip_address: VARCHAR(45)</li>
                    <li>• timestamp: TIMESTAMP</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: API DESIGN */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-emerald-400" /> REST API Specification Contracts
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    OpenAPI 3.0 compliant endpoints. All requests require Authorization Bearer token header.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    method: 'POST',
                    path: '/api/auth/login',
                    desc: 'Authenticate user & issue JWT Access/Refresh tokens.',
                    payload: '{\n  "email": "bhavani.farmer@agrisync.ai",\n  "password": "••••••••"\n}',
                  },
                  {
                    method: 'POST',
                    path: '/api/crops/recommend',
                    desc: 'ML Model Crop prediction with SHAP Explainable AI weights.',
                    payload: '{\n  "temperature": 28.5,\n  "humidity": 65,\n  "rainfall": 450,\n  "nitrogen": 140,\n  "phosphorus": 45,\n  "potassium": 210,\n  "ph": 6.8,\n  "season": "Kharif"\n}',
                  },
                  {
                    method: 'POST',
                    path: '/api/disease/diagnose',
                    desc: 'Gemini Vision AI leaf image disease diagnosis & treatment plan.',
                    payload: '{\n  "imageBase64": "data:image/jpeg;base64,...",\n  "cropType": "Tomato"\n}',
                  },
                  {
                    method: 'POST',
                    path: '/api/assistant/chat',
                    desc: 'Gemini 3.6 Flash Agronomist Chatbot with streaming history support.',
                    payload: '{\n  "message": "How do I fix yellow leaves on my tomato crop?",\n  "farmId": "farm_01"\n}',
                  },
                  {
                    method: 'GET',
                    path: '/api/weather',
                    desc: 'Real-time 7-day weather forecast with automated farming actions.',
                    payload: '// Query params: ?lat=36.74&lon=-119.77',
                  },
                ].map((ep, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {ep.method}
                        </span>
                        <span className="font-mono font-bold text-white text-xs">{ep.path}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">200 OK • JSON</span>
                    </div>
                    <p className="text-xs text-slate-400">{ep.desc}</p>
                    <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-[11px] text-slate-300">
                      <button
                        onClick={() => handleCopy(ep.payload, `ep_${idx}`)}
                        className="absolute top-2 right-2 p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white"
                      >
                        {copiedCode === `ep_${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <pre>{ep.payload}</pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: FOLDER STRUCTURE */}
          {activeSection === 'folders' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" /> Enterprise Codebase Organization
                </h3>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
                <pre>{`
/
├── .env.example                # Environment variables blueprint
├── Dockerfile                  # Multi-stage production container build
├── docker-compose.yml          # Container orchestration (App, Redis, PostgreSQL, Celery)
├── metadata.json               # Platform metadata & Gemini API capabilities
├── package.json                # Dependencies & Node build scripts
├── server.ts                   # Express Backend Entry point & Gemini API proxy
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # Vite + Tailwind CSS plugin setup
├── src/
│   ├── main.tsx                # Client React DOM entry point
│   ├── App.tsx                 # App layout & Tab navigation routing
│   ├── types.ts                # TypeScript global Interfaces & Domain Enums
│   ├── data/
│   │   └── mockData.ts         # Initial mock datasets, market trends & logs
│   ├── components/
│   │   ├── Navbar.tsx          # Main Header & Notification Drawer
│   │   ├── ArchitectureDocModal.tsx # System Architecture & Docs Viewer
│   │   ├── DashboardView.tsx   # Farmer Overview Dashboard
│   │   ├── FarmsView.tsx       # Multi-farm management & Soil health
│   │   ├── CropRecommendationView.tsx # ML Crop Engine & Explainable AI
│   │   ├── DiseaseDetectionView.tsx   # Vision AI disease scanner
│   │   ├── IrrigationFertilizerView.tsx # Irrigation calculator & NPK schedule
│   │   ├── WeatherView.tsx     # 7-day weather forecast
│   │   ├── AiAssistantView.tsx # Gemini Agronomist Chatbot
│   │   ├── MarketView.tsx      # Market trends & price forecasting
│   │   ├── ReportsView.tsx     # PDF report generator
│   │   ├── AnalyticsView.tsx   # Production charts & yield analytics
│   │   └── AdminView.tsx       # Model ops & live system telemetry
                `}</pre>
              </div>
            </div>
          )}

          {/* SECTION 5: DEVOPS */}
          {activeSection === 'devops' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-emerald-400" /> Containerization & CI/CD Deployment Files
                </h3>
              </div>

              {/* Docker Compose Snippet */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="font-mono font-bold text-xs text-teal-400">docker-compose.yml</span>
                <pre className="bg-slate-900 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto">{`version: '3.8'

services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
      - DATABASE_URL=postgres://agrisync:secret@postgres:5432/agrisync_db
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: agrisync_db
      POSTGRES_USER: agrisync
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  pgdata:`}</pre>
              </div>
            </div>
          )}

          {/* SECTION 6: ROADMAP */}
          {activeSection === 'roadmap' && (
            <div className="space-y-4">
              <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Workflow className="w-5 h-5 text-emerald-400" /> AgriSync AI Engineering Roadmap
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  { phase: 'Phase 1: Architecture & Auth', status: 'Completed', details: 'JWT auth, Clean Architecture, PostgreSQL database schema, Express proxy.' },
                  { phase: 'Phase 2: ML Engine & Explainable AI', status: 'Completed', details: 'Scikit-learn model logic, SHAP feature importance calculations, profit estimations.' },
                  { phase: 'Phase 3: Vision AI Disease Scanner', status: 'Completed', details: 'Gemini 3.6 Flash multimodal image disease diagnosis & medicine suggestions.' },
                  { phase: 'Phase 4: Smart Irrigation & Fertilizers', status: 'Completed', details: 'Evapotranspiration calculations, NPK deficit analysis, schedule calendar.' },
                  { phase: 'Phase 5: Market & Weather Intelligence', status: 'Completed', details: 'Price trend charts, 7-day forecast API, automated suggestions.' },
                  { phase: 'Phase 6: PDF Reports & Admin Ops', status: 'Completed', details: 'jsPDF exporter, audit logs, model performance telemetry.' },
                ].map((item, index) => (
                  <div key={index} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.phase}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{item.details}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>AgriSync AI Engineering Team • Confidential Blueprint</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-900/40"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
