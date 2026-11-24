import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Network,
  BotMessageSquare,
  Activity,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Code2,
  FileCode,
  Lock,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const LandingPage: React.FC = () => {
  const [activePreviewTab, setActivePreviewTab] = useState<'graph' | 'ai' | 'impact'>('graph');
  const [selectedDemoNode, setSelectedDemoNode] = useState<string>('auth');

  return (
    <div className="min-h-screen bg-charcoal-900 text-slate-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden font-sans">
      {/* Background ambient lighting & grid pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-indigo-600/15 via-blue-600/5 to-transparent blur-[140px] rounded-full" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Navbar */}
      <header className="h-16 px-6 lg:px-12 border-b border-charcoal-800/80 flex items-center justify-between sticky top-0 bg-charcoal-900/85 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-glow">
            <Layers className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">
            Code Archaeologist
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            v1.0 Preview
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
          <a href="#interactive-demo" className="hover:text-white transition-colors">
            Interactive Demo
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Capabilities
          </a>
          <a href="#pipeline" className="hover:text-white transition-colors">
            Pipeline Architecture
          </a>
          <a href="#languages" className="hover:text-white transition-colors">
            Languages
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-xs">
              Open Dashboard
            </Button>
          </Link>
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />} className="text-xs">
              Ingest Codebase
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 lg:px-12 max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Release Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-mono mb-8 backdrop-blur-md shadow-subtle hover:border-indigo-400/50 transition-colors cursor-default">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AST Codebase Intelligence • Powered by Google Gemini</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            pgvector Ready
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          Understand any codebase.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-300">
            Explore every connection.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-normal">
          Stop guessing unfamiliar architectures. Drop a ZIP repository or link GitHub to generate
          hardware-accelerated React Flow dependency graphs, calculate method blast radius, and ask
          naturally grounded questions verified by exact line citations.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link to="/upload">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-3 text-sm font-semibold shadow-glow hover:shadow-indigo-500/25"
            >
              Start Analyzing Codebase (Free)
            </Button>
          </Link>
          <Link to="/architecture/repo-sample-1">
            <Button
              variant="secondary"
              size="lg"
              icon={<Network className="w-4 h-4 text-indigo-400" />}
              className="px-6 py-3 text-sm font-semibold"
            >
              Explore Live Architecture DAG
            </Button>
          </Link>
        </div>

        {/* Micro-guarantees badge row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Safe AST Sandbox (Zero Code Execution)
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Instant Tree-Sitter & Python AST
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            Zip Slip Traversal Protected
          </span>
        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE WORKSPACE PREVIEW APPARATUS */}
        {/* ======================================================== */}
        <div
          id="interactive-demo"
          className="w-full mt-14 rounded-2xl border border-charcoal-750 bg-charcoal-850/90 shadow-2xl backdrop-blur-xl overflow-hidden text-left transition-all duration-300 hover:border-charcoal-600"
        >
          {/* Mac-style Window Title Bar */}
          <div className="h-11 px-4 bg-charcoal-900 border-b border-charcoal-750 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-80 transition-opacity" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-80 transition-opacity" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-80 transition-opacity" />
              </div>
              <div className="h-4 w-[1px] bg-charcoal-700 ml-1" />
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                code-archaeologist-core // visualizer.runtime
              </span>
            </div>

            {/* Interactive Mode Tabs */}
            <div className="flex items-center gap-1 bg-charcoal-800 p-1 rounded-lg border border-charcoal-700 text-xs font-mono">
              <button
                onClick={() => setActivePreviewTab('graph')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  activePreviewTab === 'graph'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Network className="w-3 h-3" />
                <span>Architecture DAG</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('ai')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  activePreviewTab === 'ai'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BotMessageSquare className="w-3 h-3" />
                <span>Gemini Q&A</span>
              </button>
              <button
                onClick={() => setActivePreviewTab('impact')}
                className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                  activePreviewTab === 'impact'
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Blast Radius</span>
              </button>
            </div>
          </div>

          {/* Interactive Preview Canvas */}
          <div className="p-6 bg-charcoal-900/70 min-h-[380px] flex flex-col justify-center">
            {activePreviewTab === 'graph' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>Click any node card to inspect its active dependency trail:</span>
                  <span className="text-indigo-400">Interactive Preview</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Node 1: API Router */}
                  <div
                    onClick={() => setSelectedDemoNode('router')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedDemoNode === 'router'
                        ? 'border-indigo-500 bg-indigo-950/30 ring-2 ring-indigo-500/40 shadow-glow'
                        : 'border-charcoal-700 bg-charcoal-800/60 hover:border-charcoal-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>ingress module</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    </div>
                    <h4 className="font-semibold text-sm text-white">API Gateway & Router</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">src/api/router.ts</p>
                    <div className="mt-3 pt-2.5 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>Calls: 3 services</span>
                      <span className="text-emerald-400">8 AST symbols</span>
                    </div>
                  </div>

                  {/* Node 2: AuthService */}
                  <div
                    onClick={() => setSelectedDemoNode('auth')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedDemoNode === 'auth'
                        ? 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-500/50 shadow-glow'
                        : 'border-charcoal-700 bg-charcoal-800/60 hover:border-charcoal-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-indigo-300 font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>domain service</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High impact" />
                    </div>
                    <h4 className="font-semibold text-sm text-white">AuthService & JWT</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">src/services/auth.ts</p>
                    <div className="mt-3 pt-2.5 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-rose-400">Blast Radius: 68%</span>
                      <span className="text-indigo-300">12 methods</span>
                    </div>
                  </div>

                  {/* Node 3: Storage */}
                  <div
                    onClick={() => setSelectedDemoNode('db')}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedDemoNode === 'db'
                        ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/40 shadow-glow'
                        : 'border-charcoal-700 bg-charcoal-800/60 hover:border-charcoal-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-mono mb-2">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span>persistence</span>
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <h4 className="font-semibold text-sm text-white">PostgreSQL + pgvector</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">src/database/schema.sql</p>
                    <div className="mt-3 pt-2.5 border-t border-charcoal-750 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span className="text-emerald-400">HNSW Vector Index</span>
                      <span className="text-slate-400">Active</span>
                    </div>
                  </div>
                </div>

                {/* Node details ribbon */}
                <div className="mt-3 p-3 rounded-lg bg-charcoal-850 border border-charcoal-750 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-slate-500">Selected:</span>
                    <span className="text-indigo-400 font-semibold">
                      {selectedDemoNode === 'auth'
                        ? 'AuthService.validateToken'
                        : selectedDemoNode === 'router'
                        ? 'apiRouter'
                        : 'PostgreSQL Vector Store'}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">
                      {selectedDemoNode === 'auth'
                        ? 'Used by 4 downstream middleware routes'
                        : selectedDemoNode === 'router'
                        ? 'Root ingress endpoint dispatcher'
                        : 'Stores high-dimensional code embeddings'}
                    </span>
                  </div>
                  <Link
                    to="/architecture/repo-sample-1"
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>Open in Full Graph Canvas</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}

            {activePreviewTab === 'ai' && (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-charcoal-800 border border-charcoal-700 text-slate-200">
                  <span className="text-indigo-400 font-bold">QUERY &gt;</span>
                  <span>How does authentication validate tokens across services?</span>
                </div>

                <div className="p-4 rounded-xl bg-charcoal-850 border border-charcoal-750 space-y-3">
                  <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-charcoal-750">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      Gemini Grounded Intelligence
                    </span>
                    <span className="text-emerald-400">Confidence: 98%</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans text-xs">
                    Authentication is intercepted by <code className="text-indigo-300 font-mono">src/api/router.ts</code> and verified via asymmetric public keys inside <code className="text-indigo-300 font-mono">AuthService.validateToken()</code>. If signature validation succeeds, user claims are injected into the request state.
                  </p>
                  <div className="p-2.5 rounded bg-charcoal-900 border border-charcoal-750 text-[11px] text-slate-300">
                    <span className="text-indigo-400 block font-semibold mb-1">
                      Citation: src/services/auth.ts (Lines 23–46)
                    </span>
                    <code className="text-slate-400">
                      async validateToken(token: string): Promise&lt;UserClaims&gt; &#123; return jwt.verify(token, this.publicKey); &#125;
                    </code>
                  </div>
                </div>
              </div>
            )}

            {activePreviewTab === 'impact' && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/50 flex items-center justify-between">
                  <div>
                    <span className="text-amber-400 font-semibold block text-sm">
                      Blast Radius Score: 68% (High Risk)
                    </span>
                    <span className="text-slate-400 text-[11px] mt-0.5 block">
                      Target: AuthService.validateToken in src/services/auth.ts
                    </span>
                  </div>
                  <Badge variant="warning" size="md">
                    Breaking Risk
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-750">
                    <span className="text-slate-400 text-[10px] block mb-1">OUTGOING CALLS</span>
                    <p className="text-slate-200">2 dependencies (jsonwebtoken, SessionStore)</p>
                  </div>
                  <div className="p-3 rounded-lg bg-charcoal-850 border border-charcoal-750">
                    <span className="text-slate-400 text-[10px] block mb-1">AFFECTED DOWNSTREAM FILES</span>
                    <p className="text-rose-400 font-semibold">4 files (router.ts, guard.ts, socket.ts, hook.ts)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* CAPABILITIES SHOWCASE SECTION */}
      {/* ======================================================== */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-6xl mx-auto border-t border-charcoal-800 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="indigo" size="sm" className="mb-3">
            Core Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered for Comprehensive Codebase Archaeology
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
            Generic AI chatbots hallucinate imaginary function names. Code Archaeologist indexes
            real AST grammars and binds dependency topology with semantic embeddings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-charcoal-750 bg-charcoal-850/60 hover:border-charcoal-600 transition-all group shadow-subtle hover:shadow-panel">
            <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform shadow-glow">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
              Hardware-Accelerated React Flow DAG
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore complex module graphs with pan, zoom, multi-layout engines (DAG, Tiers, Stream),
              relationship filters, and interactive method expansion trays.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-charcoal-750 bg-charcoal-850/60 hover:border-charcoal-600 transition-all group shadow-subtle hover:shadow-panel">
            <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform shadow-glow">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
              Grounded Gemini Intelligence
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ask natural-language questions like "How does auth flow work?". Receive answers strictly
              grounded in actual repository files, complete with verified line boundaries.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-charcoal-750 bg-charcoal-850/60 hover:border-charcoal-600 transition-all group shadow-subtle hover:shadow-panel">
            <div className="w-11 h-11 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform shadow-glow">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2 tracking-tight">
              Blast Radius & Impact Analysis
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Select any method or class to instantly trace downstream consumers, reverse dependencies,
              and calculate breaking risk scores before modifying a line of code.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* PIPELINE ARCHITECTURE (HOW IT WORKS) */}
      {/* ======================================================== */}
      <section id="pipeline" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto border-t border-charcoal-800 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" size="sm" className="mb-3">
            Execution Stages
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white">How Code Archaeologist Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: '01',
              title: 'Safe Archive Unpacking',
              desc: 'Upload ZIP or connect GitHub. Path traversal verification ensures zero zip-slip attacks.',
              tag: 'Security Guard',
            },
            {
              step: '02',
              title: 'Multi-Language AST Parse',
              desc: 'Extracts classes, functions, interfaces, imports, and docstrings across Python, TS, Java, and Go.',
              tag: 'Tree-Sitter / AST',
            },
            {
              step: '03',
              title: 'Graph Synthesis & DAG',
              desc: 'Calls, imports, and inheritance compile into a directed acyclic graph ready for visual navigation.',
              tag: 'React Flow Canvas',
            },
            {
              step: '04',
              title: 'Grounded Retrieval Q&A',
              desc: 'Gemini retrieves semantic context from pgvector to answer codebase inquiries with verifiable line citations.',
              tag: 'Google Gen AI SDK',
            },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl bg-charcoal-850 border border-charcoal-750 relative hover:border-charcoal-600 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-2xl font-bold text-indigo-500/40">{item.step}</span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1.5">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SUPPORTED LANGUAGES BAR */}
      {/* ======================================================== */}
      <section id="languages" className="py-16 px-6 lg:px-12 max-w-6xl mx-auto border-t border-charcoal-800 relative z-10 text-center">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-6">
          Supported Programming Languages & Syntaxes
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {[
            { name: 'Python', ext: '.py', color: 'border-indigo-800/60 text-indigo-300 bg-indigo-950/30' },
            { name: 'TypeScript', ext: '.ts, .tsx', color: 'border-blue-800/60 text-blue-300 bg-blue-950/30' },
            { name: 'JavaScript', ext: '.js, .jsx', color: 'border-amber-800/60 text-amber-300 bg-amber-950/30' },
            { name: 'Java', ext: '.java', color: 'border-orange-800/60 text-orange-300 bg-orange-950/30' },
            { name: 'Go', ext: '.go', color: 'border-cyan-800/60 text-cyan-300 bg-cyan-950/30' },
            { name: 'SQL', ext: '.sql', color: 'border-emerald-800/60 text-emerald-300 bg-emerald-950/30' },
            { name: 'Rust', ext: '.rs', color: 'border-rose-800/60 text-rose-300 bg-rose-950/30' },
          ].map((l) => (
            <div
              key={l.name}
              className={`px-3.5 py-2 rounded-xl border ${l.color} font-mono text-xs flex items-center gap-2`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="font-semibold">{l.name}</span>
              <span className="text-[10px] text-slate-400">{l.ext}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* FINAL CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-20 px-6 lg:px-12 max-w-4xl mx-auto text-center relative z-10">
        <div className="p-10 rounded-3xl border border-charcoal-750 bg-gradient-to-b from-charcoal-850 to-charcoal-900 shadow-panel relative overflow-hidden">
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-[350px] h-[150px] bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Map Your Codebase?
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Ingest your first repository in seconds. Explore interactive dependency graphs,
            run blast radius audits, and get grounded AI answers without leaving your browser.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/upload">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                className="px-6 py-3 text-sm font-semibold shadow-glow"
              >
                Upload Codebase Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="px-6 py-3 text-sm font-semibold">
                Explore Demo Repositories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-charcoal-800 py-8 px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 relative z-10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Code Archaeologist &copy; 2026. Production Developer Platform.</span>
        </div>
        <div className="flex items-center gap-6 mt-4 sm:mt-0 font-mono">
          <a
            href="https://github.com/ShaikMuktharBasha/code-archeology"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 transition-colors"
          >
            GitHub Repository
          </a>
          <a href="/docs" target="_blank" rel="noreferrer" className="hover:text-slate-200 transition-colors">
            API Docs
          </a>
          <Link to="/settings" className="hover:text-slate-200 transition-colors">
            Preferences & Settings
          </Link>
        </div>
      </footer>
    </div>
  );
};
