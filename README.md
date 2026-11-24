# Code Archaeologist 🏛️🔍

> **Understand any codebase. Explore every connection.**
>
> A production-quality developer intelligence platform that converts raw code repositories into interactive architecture graphs, semantic dependency maps, and grounded AI-powered explanations.

---

## Features

- ⚡ **Interactive Architecture Graph (`@xyflow/react`):** Visualize modules, classes, functions, and import/call dependencies with zoom, pan, node isolation, edge highlighting, and minimap.
- 📁 **Repository Explorer:** Browse directory structures, view file metadata, inspect language distributions, and review source code with line-numbered monospace viewing.
- 🤖 **Contextual AI Code Assistant:** Query codebase architecture, request workflow explanations ("How does authentication work?"), and receive strictly grounded answers with verified file paths and line ranges.
- 💥 **Impact & Blast Radius Analysis:** Select any class, function, or file to identify direct dependencies, reverse dependencies, and downstream affected components.
- 📦 **Dual Ingestion Engine:** Upload ZIP archives or connect public/private GitHub repositories with automatic size budgeting and security scanning (ZIP traversal prevention).
- 🎨 **Linear-Inspired Developer UI:** Refined dark-first interface built with Tailwind CSS, custom hairpins, glass borders, and keyboard-first accessibility.

---

## Architecture Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, `@xyflow/react`, Lucide React, TanStack Query, React Router v6.
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, PostgreSQL with pgvector.
- **AI Intelligence:** Google Gemini API via official Google Gen AI SDK (`google-genai`).
- **Code Parsing:** Tree-sitter multi-language grammar parser & Python AST.

---

## Quickstart

### Prerequisites

- Node.js (v18+)
- Python (3.11+)
- Docker & Docker Compose (optional for full-stack containerization)

### 1. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173`.

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The FastAPI backend will start at `http://localhost:8000` with interactive API documentation at `http://localhost:8000/docs`.

---

## Milestone 1 Deliverables

- [x] Full-featured Vite + React + TypeScript frontend with dark theme design system.
- [x] Marketing & Overview Landing Page with interactive mini-graph visualization.
- [x] Central Dashboard with metrics, language distribution, and repository registry.
- [x] Multi-format Repository Upload view (ZIP upload & GitHub URL connector with interactive simulation).
- [x] Full Repository Explorer with collapsible file tree, search, metadata, and syntax viewer.
- [x] Architecture Explorer powered by `@xyflow/react` with custom nodes, edge types, filters, and inspector drawer.
- [x] Impact Analysis view with blast radius diagram and affected files matrix.
- [x] AI Assistant Q&A interface with realistic sample codebase contexts and source citations.
- [x] Settings page with API key configuration and preferences.
- [x] FastAPI modular backend with endpoints for repositories, files, symbols, graph, impact, and chat.
