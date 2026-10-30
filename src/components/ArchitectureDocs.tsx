/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Database,
  Server,
  Monitor,
  Code2,
  FileCode,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'folder' | 'api'>('architecture');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/auth/register',
      auth: 'Public',
      desc: 'Registers a new user account with hashed password (bcrypt).',
      request: `{\n  "email": "analyst@veritas.ai",\n  "password": "SecurePassword123!",\n  "fullName": "Alex Mercer",\n  "role": "user"\n}`,
      response: `{\n  "access_token": "eyJhbGciOiJIUzI1Ni...",\n  "token_type": "bearer",\n  "user": { "id": "usr_9f4b", "email": "analyst@veritas.ai", "role": "user" }\n}`,
    },
    {
      method: 'POST',
      path: '/api/auth/login',
      auth: 'Public',
      desc: 'Authenticates credentials and generates JWT bearer token.',
      request: `{\n  "email": "analyst@veritas.ai",\n  "password": "SecurePassword123!"\n}`,
      response: `{\n  "access_token": "eyJhbGciOiJIUzI1Ni...",\n  "token_type": "bearer",\n  "user": { "id": "usr_9f4b", "role": "user" }\n}`,
    },
    {
      method: 'POST',
      path: '/api/predict',
      auth: 'Optional Bearer',
      desc: 'Performs full 10-step Bi-LSTM inference on raw news text.',
      request: `{\n  "text": "According to an official release by researchers...",\n  "threshold": 0.50\n}`,
      response: `{\n  "id": "pred_173000000_abc",\n  "predicted_class": "Real News",\n  "confidence_score": 93.8,\n  "fake_probability": 0.062,\n  "real_probability": 0.938,\n  "token_count": 86,\n  "sequence_length": 86,\n  "tokens_attribution": [\n    { "token": "official", "weight": -0.82, "type": "real_indicator" },\n    { "token": "researchers", "weight": -0.80, "type": "real_indicator" }\n  ],\n  "inference_time_ms": 32\n}`,
    },
    {
      method: 'GET',
      path: '/api/history',
      auth: 'Optional Bearer',
      desc: 'Retrieves paginated analysis history with search & category filters.',
      request: `GET /api/history?page=1&limit=10&filter=all&search=rover`,
      response: `{\n  "items": [...],\n  "total": 14,\n  "page": 1,\n  "limit": 10,\n  "totalPages": 2\n}`,
    },
    {
      method: 'POST',
      path: '/api/feedback',
      auth: 'Optional Bearer',
      desc: 'Submits user like/dislike evaluation and comments associated with analysis ID.',
      request: `{\n  "analysisId": "pred_173000000_abc",\n  "rating": "like",\n  "isCorrect": true,\n  "comments": "Accurately noted scientific references."\n}`,
      response: `{\n  "id": "fb_89b2",\n  "analysisId": "pred_173000000_abc",\n  "isCorrect": true\n}`,
    },
    {
      method: 'GET',
      path: '/api/admin/dashboard',
      auth: 'Bearer (Admin Required)',
      desc: 'Retrieves aggregate system-wide performance telemetry & model metrics.',
      request: `GET /api/admin/dashboard`,
      response: `{\n  "totalAnalyzed": 14280,\n  "realNewsCount": 7568,\n  "fakeNewsCount": 6712,\n  "realPercentage": 53.0,\n  "fakePercentage": 47.0,\n  "totalUsers": 1840,\n  "accuracySatisfactionRate": 94.2,\n  "averageLatencyMs": 38.4\n}`,
    },
  ];

  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Deliverables: System Architecture & API Specification
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Formal technical specification covering Deliverables 1, 2, and 3.
              </p>
            </div>
          </div>

          {/* Section Nav */}
          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveSection('architecture')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'architecture'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              1. System Architecture
            </button>
            <button
              onClick={() => setActiveSection('folder')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'folder'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              2. Folder Structure
            </button>
            <button
              onClick={() => setActiveSection('api')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSection === 'api'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              3. RESTful API Spec
            </button>
          </div>
        </div>
      </div>

      {/* Deliverable 1: System Architecture */}
      {activeSection === 'architecture' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Architecture Diagram */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-500" />
              <span>Full-Stack End-to-End System Architecture Diagram</span>
            </h3>

            {/* Architecture Flow Graphic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              {/* Layer 1: Client */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold">
                  <Monitor className="w-4 h-4" />
                  <span>Frontend Client</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  React 19 + TypeScript + Tailwind CSS SPA.
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <div>• News Input Form</div>
                  <div>• Radial Gauge Viz</div>
                  <div>• Token Heatmap</div>
                  <div>• JWT Session Storage</div>
                </div>
              </div>

              {/* Layer 2: API Gateway */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-3">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-bold">
                  <Server className="w-4 h-4" />
                  <span>REST API Gateway</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  FastAPI (Python) / Express (Node.js) middleware.
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <div>• JWT & RBAC Guard</div>
                  <div>• Request Validation</div>
                  <div>• Endpoint Routing</div>
                  <div>• CORS & Rate Limiting</div>
                </div>
              </div>

              {/* Layer 3: Deep Learning Engine */}
              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 space-y-3">
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-bold">
                  <Cpu className="w-4 h-4" />
                  <span>Pre-trained Bi-LSTM</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Single-load deep neural network service.
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <div>• Text Preprocessing</div>
                  <div>• 128-token Padding</div>
                  <div>• Forward/Backward LSTM</div>
                  <div>• Attention Attribution</div>
                </div>
              </div>

              {/* Layer 4: Storage */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-300 font-bold">
                  <Database className="w-4 h-4" />
                  <span>Database Layer</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  PostgreSQL / SQLite with SQLAlchemy ORM.
                </p>
                <div className="space-y-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  <div>• Users & Roles</div>
                  <div>• Predictions History</div>
                  <div>• User Feedback</div>
                  <div>• Model Telemetry</div>
                </div>
              </div>
            </div>

            {/* Prediction Pipeline 10-Step Data Flow Diagram */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                10-Step Prediction Pipeline Data Flow
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                {[
                  '1. Receive News Text',
                  '2. Regex URL & HTML Strip',
                  '3. Lowercase & Clean',
                  '4. Tokenize to Vocab IDs',
                  '5. Sequence Padding (128)',
                  '6. Forward LSTM (h_fwd)',
                  '7. Backward LSTM (h_bwd)',
                  '8. Bidirectional Fusion',
                  '9. Sigmoid Probability',
                  '10. Return Score & XAI',
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono font-medium border border-slate-200/60 dark:border-slate-700/60 text-center"
                  >
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deliverable 2: Project Folder Structure */}
      {activeSection === 'folder' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-4 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <FileCode className="w-5 h-5 text-indigo-500" />
              <span>Project Modular Folder Architecture</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Separation of concerns across backend Python FastAPI, TypeScript full-stack engine, and React UI.
            </p>
          </div>

          <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed border border-slate-800">
{`veritas-fake-news-detector/
├── backend/                        # Deliverable 4: Python FastAPI Backend
│   ├── main.py                     # FastAPI application entry & route definitions
│   ├── model.py                    # Pre-trained Bi-LSTM loader & inference pipeline
│   ├── preprocessing.py            # Exact text-cleaning, tokenization, & sequence padding
│   ├── schemas.py                  # Pydantic validation schemas (PredictRequest, etc.)
│   ├── database.py                 # SQLAlchemy ORM models (User, Prediction, Feedback)
│   ├── auth.py                     # JWT token generation, bcrypt hashing & RBAC dependencies
│   ├── requirements.txt            # Python dependencies (FastAPI, TensorFlow, SQLAlchemy)
│   └── README.md                   # Backend deployment & execution instructions
├── src/                            # Deliverable 5: Frontend React 19 Application
│   ├── components/                 # Reusable UI & Feature components
│   │   ├── Navbar.tsx              # Navigation bar with dark mode & demo role switcher
│   │   ├── LandingHero.tsx         # Hero section, Bi-LSTM visualizer & statistics
│   │   ├── NewsAnalyzer.tsx        # News analysis textarea, gauge & XAI token heatmap
│   │   ├── AnalysisHistory.tsx     # Paginated history table, filters & CSV export
│   │   ├── AdminDashboard.tsx      # Admin telemetry, user permissions & feedback audit
│   │   ├── UserGuide.tsx           # Model guide, interpreting confidence & limitations
│   │   ├── ArchitectureDocs.tsx    # Technical architecture & REST API explorer
│   │   ├── AuthModal.tsx           # Login / Registration modal with validation
│   │   └── UserProfileModal.tsx    # User settings & password change modal
│   ├── context/                    # State Management
│   │   └── AuthContext.tsx         # React Context for authentication & sessions
│   ├── utils/                      # Core Pure Logic & In-Memory Inference
│   │   ├── bilstmEngine.ts         # Bi-LSTM mathematical simulation & preprocessing
│   │   └── bilstmEngine.test.ts    # Node:test unit test suite
│   ├── types.ts                    # TypeScript interface definitions
│   ├── App.tsx                     # Main application container & view coordinator
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS v4 styling
├── server.ts                       # Full-Stack Express Server with REST API & Vite dev middleware
├── package.json                    # Node dependencies & execution scripts
└── metadata.json                   # Applet configuration metadata`}
          </pre>
        </div>
      )}

      {/* Deliverable 3: RESTful API Specification */}
      {activeSection === 'api' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-indigo-500" />
              <span>RESTful API Endpoint Documentation</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Complete specification of request schemas, authentication scopes, and JSON payloads.
            </p>
          </div>

          <div className="space-y-4">
            {apiEndpoints.map((ep, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono font-bold uppercase text-[11px] ${
                        ep.method === 'POST'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{ep.path}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Auth: <strong className="text-indigo-600 dark:text-indigo-400">{ep.auth}</strong>
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300">{ep.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Request */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Request Body (JSON)
                    </span>
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-36">
                      {ep.request}
                    </pre>
                  </div>

                  {/* Response */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Response (200 OK)
                    </span>
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-36">
                      {ep.response}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
