import React from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  BotMessageSquare,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-charcoal-900 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <header className="h-16 px-6 lg:px-12 border-b border-charcoal-800 flex items-center justify-between sticky top-0 bg-charcoal-900/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-glow">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-semibold text-base tracking-tight text-white">
            Code Archaeologist
          </span>
          <Badge variant="indigo" size="sm" className="hidden sm:inline-flex">
            v1.0 Developer Preview
          </Badge>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture DAG
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Live Dashboard
            </Button>
          </Link>
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
              Ingest Codebase
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-6 lg:px-12 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Subtle background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Next-Gen Codebase Intelligence Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-4xl leading-tight">
          Understand any codebase.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-indigo-300">
            Explore every connection.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          Upload a ZIP repository or link GitHub. Code Archaeologist parses AST trees,
          resolves multi-language symbols, and builds interactive architecture graphs
          grounded by Google Gemini.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/upload">
            <Button variant="primary" size="lg" icon={<ArrowRight className="w-4 h-4" />}>
              Explore Your First Repository
            </Button>
          </Link>
          <Link to="/architecture/repo-sample-1">
            <Button variant="secondary" size="lg" icon={<Network className="w-4 h-4" />}>
              Interactive Graph Demo
            </Button>
          </Link>
        </div>

        {/* Live Mini-Architecture Preview Card */}
        <div className="w-full mt-16 rounded-2xl border border-charcoal-750 bg-charcoal-850/80 p-2 shadow-panel backdrop-blur-md overflow-hidden text-left">
          <div className="h-9 px-4 bg-charcoal-900 rounded-t-xl border-b border-charcoal-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                code-archaeologist-core // architecture.dag
              </span>
            </div>
            <Badge variant="indigo" size="sm">
              Live Interactive DAG
            </Badge>
          </div>

          <div className="p-6 bg-charcoal-900/60 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-charcoal-700 bg-charcoal-800/60">
              <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-2">
                <span>module</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              <h4 className="font-semibold text-sm text-white">API Gateway</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">src/api/router.ts</p>
              <div className="mt-3 pt-2 border-t border-charcoal-750 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Calls: 3 services</span>
                <span className="text-emerald-400">8 symbols</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-indigo-600/40 bg-indigo-950/20 shadow-glow">
              <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-2">
                <span>class</span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              </div>
              <h4 className="font-semibold text-sm text-white">AuthService</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">src/services/auth.ts</p>
              <div className="mt-3 pt-2 border-t border-charcoal-750 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Blast Radius: 68%</span>
                <span className="text-amber-400">Security Critical</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-charcoal-700 bg-charcoal-800/60">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
                <span>database</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <h4 className="font-semibold text-sm text-white">PostgreSQL + pgvector</h4>
              <p className="text-xs text-slate-400 mt-1 font-mono">src/database/schema.sql</p>
              <div className="mt-3 pt-2 border-t border-charcoal-750 text-[11px] text-slate-400 flex items-center justify-between">
                <span>HNSW Indexing</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-charcoal-800">
        <div className="text-center mb-16">
          <Badge variant="outline" size="sm" className="mb-3">
            System Capabilities
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Engineered for Deep Codebase Archaeology
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Traditional AI tools hallucinate code. Code Archaeologist indexes concrete AST symbols,
            dependency edges, and grounds every answer in verifiable lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-charcoal-800 bg-charcoal-850/60 hover:border-charcoal-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Hardware-Accelerated React Flow DAG
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Explore complex module graphs with pan, zoom, custom typed nodes, relationship filtering,
              and live edge highlights.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-charcoal-800 bg-charcoal-850/60 hover:border-charcoal-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Grounded Gemini Intelligence
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask natural-language questions like "How does auth flow work?". Receive answers citing
              exact file paths, symbol signatures, and line boundaries.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-charcoal-800 bg-charcoal-850/60 hover:border-charcoal-700 transition-all">
            <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-4">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">
              Blast Radius & Impact Analysis
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Select any method or class to instantly trace downstream consumers, reverse dependencies,
              and calculate breaking risk scores before editing code.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-charcoal-800">
        <div className="text-center mb-16">
          <Badge variant="outline" size="sm" className="mb-3">
            Workflow Architecture
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">How Code Archaeologist Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Ingest Codebase',
              desc: 'Upload a ZIP archive or connect GitHub. Safe unpacking protects against zip traversal and size bombs.',
            },
            {
              step: '02',
              title: 'AST & Symbol Parsing',
              desc: 'Multi-language grammar analysis extracts classes, functions, interfaces, imports, and docstrings.',
            },
            {
              step: '03',
              title: 'Graph Synthesis',
              desc: 'Call graphs and imports compile into a directed acyclic graph ready for visual navigation.',
            },
            {
              step: '04',
              title: 'AI Code Intelligence',
              desc: 'Gemini retrieves semantic context from pgvector to answer codebase inquiries with verifiable line citations.',
            },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-xl bg-charcoal-850 border border-charcoal-800 relative">
              <span className="font-mono text-2xl font-bold text-indigo-500/40">{item.step}</span>
              <h4 className="text-base font-semibold text-white mt-2 mb-1.5">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal-800 py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Code Archaeologist &copy; 2026. Production Developer Platform.</span>
        </div>
        <div className="flex items-center gap-6 mt-4 sm:mt-0 font-mono">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-200">
            GitHub
          </a>
          <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-slate-200">
            API Docs
          </a>
          <Link to="/settings" className="hover:text-slate-200">
            System Status
          </Link>
        </div>
      </footer>
    </div>
  );
};
