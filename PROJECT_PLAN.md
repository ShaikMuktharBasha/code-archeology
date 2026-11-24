# Code Archaeologist — Project Plan & Architecture Roadmap

> **Tagline:** "Understand any codebase. Explore every connection."
> **Mission:** Transform unfamiliar, complex codebases into intuitive, interactive knowledge graphs with deep semantic understanding, multi-language AST symbol resolution, and contextual AI intelligence powered by Google Gemini.

---

## 1. Executive Architecture Overview

Code Archaeologist is an enterprise-grade codebase intelligence and exploration platform engineered for senior developers, architects, and engineering teams. It bridges the gap between raw AST/symbol trees, dependency graphs, and large language model intelligence.

### High-Level Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Browser (Client)                            │
│  React 18 + TypeScript + Vite + Tailwind CSS + @xyflow/react + Query   │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │ HTTP / JSON / Streaming
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FastAPI Backend Engine                          │
│  - Ingestion (ZIP & GitHub)      - Safe Unpack & Traversal Guard       │
│  - Language Detector             - AST & Tree-Sitter Symbol Extractor  │
│  - Dependency & Graph Builder    - pgvector Semantic Indexer           │
│  - Gemini AI Context Engine      - Impact Analysis Graph Traversal     │
└──────────────────┬───────────────────────────────┬─────────────────────┘
                   │                               │
                   ▼                               ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│        PostgreSQL + pgvector         │  │     Google Gemini Pro /      │
│  - Repositories & Files              │  │     Flash 2.5/3.8 API        │
│  - Symbols & AST Hierarchies         │  │  - Context-Bounded Q&A       │
│  - Edges & Graph Relationships       │  │  - Architecture Summaries    │
│  - Vector Code Chunk Embeddings      │  │  - Impact Explanations       │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

---

## 2. Phased Development Roadmap

### Phase 1: Milestone 1 — Scaffolding & Unified Developer Interface (Current)
- [x] Project Scaffolding: `.gitignore`, `.env.example`, `docker-compose.yml`, `PROJECT_PLAN.md`, `README.md`.
- [x] Frontend Setup: Vite + React 18 + TypeScript + Tailwind CSS + `@xyflow/react` + Lucide Icons + TanStack Query + React Router v6.
- [x] Backend Foundation: FastAPI application skeleton, clean layered architecture (routers, schemas, services, config, db).
- [x] Premium Dark-First UI Design System (Linear / Vercel / Raycast aesthetics, deep charcoal `#090a0f`, subtle border `#1e2330`, monospace typography).
- [x] Landing Page: Hero, live mini-architecture interactive preview, feature matrix, upload CTA, how it works, footer.
- [x] Main Dashboard: Statistics (repositories, files indexed, languages), recent activity log, repository cards, quick upload trigger.
- [x] Repository Ingestion Interface: ZIP drag & drop with validation, GitHub repository URL parser, multi-stage progress indicator, safe file filters preview.
- [x] Repository Explorer: Tree directory navigator, file metadata inspector, language breakdown, searchable source viewer with syntax line numbering.
- [x] Architecture Explorer: Interactive graph canvas via `@xyflow/react` with custom nodes (Module, Class, Function, API Endpoint), edge relationship types (Imports, Extends, Calls, DependsOn), filter controls, search, node inspector panel, and minimap.
- [x] AI Code Assistant View: Contextual Q&A interface with sample codebase queries, source-cited responses with exact file and line references.
- [x] Impact Analysis View: Blast radius graph, direct dependencies, reverse dependencies, affected files matrix.
- [x] Settings & Preferences: API key status, theme configuration, repository filter rules, max file size thresholds.

### Phase 2: Ingestion & Tree-Sitter Multi-Language Engine
- Safe ZIP unpacking with zip-slip prevention and file size budgeting.
- GitHub Git cloning with shallow depth and rate-limiting resilience.
- Language detection (`py`, `ts`, `js`, `tsx`, `jsx`, `java`, `go`).
- Tree-sitter parsers integration for Python, TypeScript/JavaScript, Java, and Go:
  - Symbol extraction (Classes, Interfaces, Functions, Methods, Variables, Decorators).
  - Import extraction and module resolution.
  - Call graph extraction.

### Phase 3: Graph Storage & Vector Database Integration
- SQLAlchemy 2.0 async models with PostgreSQL.
- pgvector vector similarity index for code chunk retrieval.
- Graph relation builder: nodes (`file`, `module`, `class`, `function`) and edges (`imports`, `calls`, `inherits`, `references`).
- Circular dependency detection and cluster modularization.

### Phase 4: Gemini AI Codebase Intelligence
- Official Google Gen AI SDK for Python (`google-genai`).
- Multi-stage retrieval: symbol lookup + semantic vector chunk search + dependency neighborhood context.
- Grounding verification: force model to cite specific file paths and line ranges.
- Natural language query answering: "How does auth flow work?", "Where is DB initialized?", "What breaks if I rename X?".

### Phase 5: Production Hardening & CI/CD
- Dockerized multi-stage builds for frontend and backend.
- Background worker task queue (Celery/ARQ with Redis) for async repo parsing.
- E2E testing suite (Playwright) and unit tests (pytest, vitest).
- Comprehensive API documentation (OpenAPI / Swagger).

---

## 3. Technology Stack Specification

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18, TypeScript | Type-safe declarative client architecture |
| **Build Tool** | Vite | Instant HMR and optimized production bundles |
| **Styling** | Tailwind CSS | Consistent, bespoke dark design system |
| **Graph Visualization** | `@xyflow/react` (React Flow) | Hardware-accelerated architecture DAGs |
| **Icons** | Lucide React | Clean, standard developer interface iconography |
| **Routing & State** | React Router v6, TanStack Query | Client routing & resilient server-state caching |
| **Backend Framework** | FastAPI (Python 3.11+) | Async high-performance REST API |
| **Validation & Schema** | Pydantic v2 | Strictly validated request/response payloads |
| **ORM & Database** | SQLAlchemy 2.0, PostgreSQL | Relational storage & relational graph mapping |
| **Vector Engine** | pgvector | High-dimensional embedding storage & ANN search |
| **AI SDK** | Google Gen AI SDK (`google-genai`) | Gemini 2.5/3.8 Flash & Pro integration |
| **Parsing Engine** | Tree-sitter & Python AST | Multi-language semantic code parsing |

---

## 4. UI/UX Design System Specification

- **Primary Background:** `#090a0f` (Deep charcoal, near pitch black)
- **Secondary Background:** `#0e121b` (Panel and card surface)
- **Subtle Surface:** `#141824` (Hover states and active tabs)
- **Border Gradients / Lines:** `#1f2638` (Precision 1px hairpins)
- **Accent Primary:** `#6366f1` (Indigo 500) & `#3b82f6` (Blue 500)
- **Accent Emerald / Success:** `#10b981` (Verified AST nodes / ready status)
- **Accent Amber / Warning:** `#f59e0b` (Impact blast radius / caution warnings)
- **Accent Rose / Critical:** `#ef4444` (Breaking changes / error boundaries)
- **Typography:**
  - UI Text: Inter / system-ui sans-serif
  - Code & Symbols: JetBrains Mono / Fira Code monospace
