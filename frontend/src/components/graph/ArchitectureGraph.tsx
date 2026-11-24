import React, { useState, useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ModuleNode, ServiceNode, FunctionNode, DatabaseNode } from './CustomNodes';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import {
  Search,
  Download,
  RotateCcw,
  ShieldCheck,
  Crosshair,
} from 'lucide-react';
import { GraphNodeData } from '../../types';

const nodeTypes = {
  moduleNode: ModuleNode,
  serviceNode: ServiceNode,
  functionNode: FunctionNode,
  databaseNode: DatabaseNode,
};

// Layout presets
type LayoutMode = 'dag' | 'layers' | 'horizontal';

// Base initial nodes
const BASE_NODES = [
  {
    id: 'api-gateway',
    type: 'moduleNode',
    position: { x: 420, y: 40 },
    data: {
      label: 'API Gateway & Ingress Router',
      kind: 'module',
      layer: 'ingress',
      path: 'src/api/router.ts',
      language: 'TypeScript',
      symbolsCount: 8,
      loc: 128,
      complexity: 'Low',
      blastRadius: 'Critical',
      status: 'stable',
      badge: 'HTTP / WS Ingress',
      description: 'Central API routing hub intercepting public requests, applying CORS, authentication middleware, and rate limiting.',
      methods: [
        { name: 'mountRoutes', signature: 'mountRoutes(app: Express): void', visibility: 'public', startLine: 12, endLine: 35 },
        { name: 'authMiddleware', signature: 'authMiddleware(req, res, next): Promise<void>', visibility: 'public', isAsync: true, startLine: 37, endLine: 52 },
        { name: 'errorHandler', signature: 'errorHandler(err, req, res, next): void', visibility: 'public', startLine: 55, endLine: 74 },
      ],
      codeSnippet: "export const apiRouter = Router();\napiRouter.use('/auth', authRouter);\napiRouter.use('/repositories', repoRouter);\napiRouter.use('/graph', graphRouter);",
    },
  },
  {
    id: 'auth-service',
    type: 'serviceNode',
    position: { x: 140, y: 240 },
    data: {
      label: 'AuthService & JWT',
      kind: 'class',
      layer: 'domain',
      path: 'src/services/auth.ts',
      language: 'TypeScript',
      symbolsCount: 12,
      loc: 184,
      complexity: 'Medium',
      blastRadius: 'Critical',
      status: 'security-critical',
      badge: 'Domain Security',
      description: 'Manages JWT verification, token revocation checking, public-key verification, and user claims extraction.',
      methods: [
        { name: 'validateToken', signature: 'async validateToken(token: string): Promise<UserClaims>', visibility: 'public', isAsync: true, startLine: 23, endLine: 46 },
        { name: 'isTokenRevoked', signature: 'private async isTokenRevoked(jti: string): Promise<boolean>', visibility: 'private', isAsync: true, startLine: 48, endLine: 51 },
        { name: 'generateSessionToken', signature: 'generateSessionToken(payload: SessionPayload): string', visibility: 'public', startLine: 54, endLine: 70 },
      ],
      codeSnippet: "export class AuthService {\n  async validateToken(token: string): Promise<UserClaims> {\n    return jwt.verify(token, this.publicKey);\n  }\n}",
    },
  },
  {
    id: 'repo-ingestor',
    type: 'serviceNode',
    position: { x: 420, y: 240 },
    data: {
      label: 'IngestionEngine',
      kind: 'class',
      layer: 'domain',
      path: 'src/services/ingestion.py',
      language: 'Python',
      symbolsCount: 15,
      loc: 210,
      complexity: 'High',
      blastRadius: 'Caution',
      status: 'active',
      badge: 'Safe Ingestion',
      description: 'Sanitizes and safely extracts uploaded ZIP archives, checks for zip-slip traversal exploits, and scans repository files.',
      methods: [
        { name: 'process_zip_upload', signature: 'def process_zip_upload(zip_path: str, repo_id: str) -> dict', visibility: 'public', startLine: 14, endLine: 48 },
        { name: 'scan_directory', signature: 'def scan_directory(root_dir: str, repo_id: str) -> tuple', visibility: 'public', startLine: 50, endLine: 88 },
        { name: 'parse_github_url', signature: 'def parse_github_url(url: str) -> tuple', visibility: 'public', startLine: 90, endLine: 105 },
      ],
      codeSnippet: "class IngestionEngine:\n    def process_zip_upload(self, zip_path: str, repo_id: str) -> dict:\n        SecurityGuard.validate_zip(zip_path, target_dir)\n        return scan_directory(target_dir, repo_id)",
    },
  },
  {
    id: 'ai-agent',
    type: 'serviceNode',
    position: { x: 700, y: 240 },
    data: {
      label: 'GeminiContextEngine',
      kind: 'class',
      layer: 'domain',
      path: 'src/services/gemini.py',
      language: 'Python',
      symbolsCount: 9,
      loc: 165,
      complexity: 'Medium',
      blastRadius: 'Caution',
      status: 'ai-ready',
      badge: 'AI Grounding',
      description: 'Connects to Google Gemini API via official Google Gen AI SDK. Budgets tokens and generates grounded citations.',
      methods: [
        { name: 'ask_codebase', signature: 'async def ask_codebase(repo_id: str, query: str) -> ChatQueryResponse', visibility: 'public', isAsync: true, startLine: 18, endLine: 58 },
        { name: 'budget_context_tokens', signature: 'def budget_context_tokens(chunks: list, max_tokens=8000) -> str', visibility: 'private', startLine: 60, endLine: 75 },
      ],
      codeSnippet: "class GeminiContextEngine:\n    async def ask_codebase(self, repo_id: str, query: str):\n        response = client.models.generate_content(model=MODEL, contents=prompt)\n        return parse_grounded_response(response)",
    },
  },
  {
    id: 'ast-parser',
    type: 'functionNode',
    position: { x: 280, y: 440 },
    data: {
      label: 'TreeSitterParser',
      kind: 'function',
      layer: 'analysis',
      path: 'src/parser/ast.py',
      language: 'Python',
      symbolsCount: 24,
      loc: 195,
      complexity: 'High',
      blastRadius: 'Critical',
      status: 'optimized',
      badge: 'Grammar AST',
      description: 'Multi-language grammar parsing engine extracting AST syntax trees, class definitions, function signatures, and calls.',
      methods: [
        { name: 'parse_source_code', signature: 'def parse_source_code(file_path: str, code: str, lang: str) -> list', visibility: 'public', startLine: 15, endLine: 35 },
        { name: '_parse_python_ast', signature: 'def _parse_python_ast(file_path: str, code: str) -> list', visibility: 'private', startLine: 38, endLine: 65 },
        { name: '_parse_js_ts', signature: 'def _parse_js_ts(file_path: str, code: str) -> list', visibility: 'private', startLine: 68, endLine: 110 },
      ],
      codeSnippet: "def parse_source_code(file_path: str, code: str, language: str):\n    tree = ast.parse(code)\n    for node in ast.walk(tree):\n        if isinstance(node, ast.ClassDef): ...",
    },
  },
  {
    id: 'graph-builder',
    type: 'functionNode',
    position: { x: 560, y: 440 },
    data: {
      label: 'GraphBuilderDAG',
      kind: 'function',
      layer: 'analysis',
      path: 'src/graph/builder.py',
      language: 'Python',
      symbolsCount: 18,
      loc: 140,
      complexity: 'Medium',
      blastRadius: 'Caution',
      status: 'graph-core',
      badge: 'DAG Topology',
      description: 'Computes directed acyclic graphs, resolves symbol connections, identifies circular dependencies, and formats for React Flow.',
      methods: [
        { name: 'build_architecture_dag', signature: 'def build_architecture_dag(symbols: list, imports: list) -> GraphResponse', visibility: 'public', startLine: 10, endLine: 45 },
        { name: 'detect_cycles', signature: 'def detect_cycles(edges: list) -> list', visibility: 'private', startLine: 48, endLine: 62 },
      ],
      codeSnippet: "def build_architecture_dag(symbols, imports):\n    nodes = create_graph_nodes(symbols)\n    edges = compute_directed_edges(imports)\n    return ArchitectureGraphResponse(nodes=nodes, edges=edges)",
    },
  },
  {
    id: 'postgres-db',
    type: 'databaseNode',
    position: { x: 220, y: 640 },
    data: {
      label: 'PostgreSQL + pgvector',
      kind: 'database',
      layer: 'storage',
      path: 'src/database/schema.sql',
      language: 'SQL',
      symbolsCount: 6,
      loc: 88,
      complexity: 'Low',
      blastRadius: 'Critical',
      status: 'persisted',
      badge: 'Relational Storage',
      description: 'Stores indexed repositories, files, extracted AST symbols, dependency edges, and conversation histories.',
      methods: [
        { name: 'repositories_table', signature: 'CREATE TABLE repositories (id UUID PRIMARY KEY...)', visibility: 'public', startLine: 5, endLine: 20 },
        { name: 'symbols_table', signature: 'CREATE TABLE symbols (id UUID PRIMARY KEY, name VARCHAR...)', visibility: 'public', startLine: 22, endLine: 45 },
      ],
      codeSnippet: "CREATE EXTENSION IF NOT EXISTS vector;\nCREATE TABLE symbols (\n  id UUID PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  file_path VARCHAR(1000) NOT NULL\n);",
    },
  },
  {
    id: 'vector-index',
    type: 'databaseNode',
    position: { x: 620, y: 640 },
    data: {
      label: 'CodeChunkVectorStore',
      kind: 'database',
      layer: 'storage',
      path: 'src/vectors/store.py',
      language: 'Python',
      symbolsCount: 7,
      loc: 145,
      complexity: 'Medium',
      blastRadius: 'Minimal',
      status: 'vector-search',
      badge: 'HNSW Embeddings',
      description: 'High-dimensional embedding store with HNSW indexing for rapid cosine similarity retrieval of relevant code chunks.',
      methods: [
        { name: 'index_code_chunk', signature: 'async def index_code_chunk(chunk_id: str, vector: list): Promise<void>', visibility: 'public', startLine: 15, endLine: 35 },
        { name: 'find_nearest_neighbors', signature: 'async def find_nearest_neighbors(query_vec: list, top_k=5) -> list', visibility: 'public', startLine: 38, endLine: 60 },
      ],
      codeSnippet: "class CodeChunkVectorStore:\n    async def find_nearest_neighbors(self, query_vec, top_k=5):\n        return await db.execute(select(Chunk).order_by(Chunk.embedding.cosine_distance(query_vec)).limit(top_k))",
    },
  },
];

// Initial edges with relation types
const BASE_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: 'api-gateway',
    target: 'auth-service',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'calls: validateToken',
    data: { relationType: 'calls' },
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e1-3',
    source: 'api-gateway',
    target: 'repo-ingestor',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'calls: process_zip',
    data: { relationType: 'calls' },
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e1-4',
    source: 'api-gateway',
    target: 'ai-agent',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'calls: ask_codebase',
    data: { relationType: 'calls' },
    style: { stroke: '#818cf8', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e3-5',
    source: 'repo-ingestor',
    target: 'ast-parser',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'depends_on: AST parser',
    data: { relationType: 'depends_on' },
    style: { stroke: '#10b981', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e5-6',
    source: 'ast-parser',
    target: 'graph-builder',
    sourceHandle: 'right',
    targetHandle: 'left',
    label: 'streams symbols',
    data: { relationType: 'depends_on' },
    style: { stroke: '#10b981', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e6-7',
    source: 'graph-builder',
    target: 'postgres-db',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'imports: DB session',
    data: { relationType: 'imports' },
    style: { stroke: '#c084fc', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#c084fc' },
  },
  {
    id: 'e4-8',
    source: 'ai-agent',
    target: 'vector-index',
    sourceHandle: 'bottom',
    targetHandle: 'top',
    label: 'calls: similarity',
    data: { relationType: 'calls' },
    style: { stroke: '#818cf8', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e8-7',
    source: 'vector-index',
    target: 'postgres-db',
    sourceHandle: 'left',
    targetHandle: 'right',
    label: 'persists embeddings',
    data: { relationType: 'imports' },
    style: { stroke: '#c084fc', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#c084fc' },
  },
];

const InnerArchitectureGraph: React.FC<{ repoId: string }> = ({ repoId }) => {
  const reactFlow = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(BASE_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(BASE_EDGES);

  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [relationFilter, setRelationFilter] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dag');
  const [isolateMode, setIsolateMode] = useState(false);

  // Compute connected nodes (upstream / downstream) for selectedNode
  const connectedNodeIds = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const ids = new Set<string>([selectedNode.id]);

    edges.forEach((edge) => {
      if (edge.source === selectedNode.id) ids.add(edge.target);
      if (edge.target === selectedNode.id) ids.add(edge.source);
    });

    return ids;
  }, [selectedNode, edges]);

  // Apply Layout
  const applyLayout = useCallback(
    (mode: LayoutMode) => {
      setLayoutMode(mode);

      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          let pos = { x: node.position.x, y: node.position.y };

          if (mode === 'dag') {
            // Hierarchical top-down
            const dagPositions: Record<string, { x: number; y: number }> = {
              'api-gateway': { x: 420, y: 40 },
              'auth-service': { x: 140, y: 240 },
              'repo-ingestor': { x: 420, y: 240 },
              'ai-agent': { x: 700, y: 240 },
              'ast-parser': { x: 280, y: 440 },
              'graph-builder': { x: 560, y: 440 },
              'postgres-db': { x: 220, y: 640 },
              'vector-index': { x: 620, y: 640 },
            };
            if (dagPositions[node.id]) pos = dagPositions[node.id];
          } else if (mode === 'layers') {
            // Layer swimlanes
            const layerPositions: Record<string, { x: number; y: number }> = {
              'api-gateway': { x: 420, y: 50 },
              'auth-service': { x: 100, y: 260 },
              'repo-ingestor': { x: 420, y: 260 },
              'ai-agent': { x: 740, y: 260 },
              'ast-parser': { x: 260, y: 470 },
              'graph-builder': { x: 580, y: 470 },
              'postgres-db': { x: 200, y: 680 },
              'vector-index': { x: 640, y: 680 },
            };
            if (layerPositions[node.id]) pos = layerPositions[node.id];
          } else if (mode === 'horizontal') {
            // Left to right stream
            const horizPositions: Record<string, { x: number; y: number }> = {
              'api-gateway': { x: 50, y: 220 },
              'auth-service': { x: 340, y: 80 },
              'repo-ingestor': { x: 340, y: 220 },
              'ai-agent': { x: 340, y: 360 },
              'ast-parser': { x: 630, y: 150 },
              'graph-builder': { x: 630, y: 290 },
              'postgres-db': { x: 920, y: 150 },
              'vector-index': { x: 920, y: 330 },
            };
            if (horizPositions[node.id]) pos = horizPositions[node.id];
          }

          return { ...node, position: pos };
        })
      );

      setTimeout(() => {
        reactFlow.fitView({ padding: 0.25, duration: 600 });
      }, 50);
    },
    [setNodes, reactFlow]
  );

  // Search & Focus on Node
  const handleSearchSelect = (nodeId: string) => {
    const target = nodes.find((n) => n.id === nodeId);
    if (target) {
      setSelectedNode(target);
      reactFlow.setCenter(target.position.x + 120, target.position.y + 60, {
        zoom: 1.3,
        duration: 800,
      });
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Filtered nodes with dimming & focus isolation
  const processedNodes = useMemo(() => {
    return nodes.map((node) => {
      const nodeData = node.data as unknown as GraphNodeData;
      const matchesSearch =
        !searchQuery ||
        nodeData.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        nodeData.path.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesKind =
        activeFilter === 'all' ||
        (activeFilter === 'services' && (node.type === 'serviceNode' || node.type === 'moduleNode')) ||
        (activeFilter === 'functions' && node.type === 'functionNode') ||
        (activeFilter === 'storage' && node.type === 'databaseNode') ||
        (activeFilter === 'critical' && nodeData.blastRadius === 'Critical');

      const isConnected = !selectedNode || connectedNodeIds.has(node.id);
      const isHidden = !matchesSearch || !matchesKind || (isolateMode && !isConnected);

      return {
        ...node,
        hidden: isHidden,
        style: {
          ...((node as any).style || {}),
          opacity: selectedNode && !isConnected ? 0.2 : 1,
          transition: 'all 0.3s ease',
        },
      };
    });
  }, [nodes, searchQuery, activeFilter, selectedNode, connectedNodeIds, isolateMode]);

  // Filtered edges with highlight styling
  const processedEdges = useMemo(() => {
    return edges.map((edge) => {
      const matchesRelation =
        relationFilter === 'all' || edge.data?.relationType === relationFilter;

      const isConnected =
        !selectedNode || edge.source === selectedNode.id || edge.target === selectedNode.id;

      const isOutbound = selectedNode && edge.source === selectedNode.id;
      const isInbound = selectedNode && edge.target === selectedNode.id;

      let edgeColor = '#475569';
      let strokeWidth = 1.5;

      if (edge.data?.relationType === 'calls') edgeColor = '#818cf8';
      else if (edge.data?.relationType === 'depends_on') edgeColor = '#10b981';
      else if (edge.data?.relationType === 'imports') edgeColor = '#c084fc';

      if (selectedNode) {
        if (isOutbound) {
          edgeColor = '#38bdf8'; // Cyan for downstream outgoing calls
          strokeWidth = 2.5;
        } else if (isInbound) {
          edgeColor = '#f59e0b'; // Amber for upstream callers
          strokeWidth = 2.5;
        }
      }

      return {
        ...edge,
        hidden: !matchesRelation,
        animated: isOutbound || (edge.animated && !selectedNode),
        style: {
          stroke: edgeColor,
          strokeWidth,
          opacity: selectedNode && !isConnected ? 0.15 : 1,
          transition: 'all 0.3s ease',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
      };
    });
  }, [edges, relationFilter, selectedNode]);

  // Export Graph JSON
  const handleExportJSON = () => {
    const exportData = {
      repositoryId: repoId,
      nodes,
      edges,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-archaeologist-${repoId}-graph.json`;
    a.click();
  };

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-charcoal-900 select-none">
      {/* Top Floating Controls & Telemetry Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 bg-charcoal-850/90 backdrop-blur-md border border-charcoal-750 px-3 py-2 rounded-xl shadow-panel pointer-events-auto">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.length >= 3) {
                  const found = nodes.find(
                    (n) =>
                      (n.data as any).label.toLowerCase().includes(val.toLowerCase()) ||
                      (n.data as any).path.toLowerCase().includes(val.toLowerCase())
                  );
                  if (found) handleSearchSelect(found.id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const found = nodes.find(
                    (n) =>
                      (n.data as any).label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (n.data as any).path.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (found) handleSearchSelect(found.id);
                }
              }}
              placeholder="Search symbol, path..."
              className="pl-8 pr-3 py-1 bg-charcoal-900 border border-charcoal-750 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-44 font-mono"
            />
          </div>

          <div className="h-4 w-[1px] bg-charcoal-700" />

          {/* Node Category Filters */}
          <div className="flex items-center gap-1 text-xs font-mono">
            {[
              { id: 'all', label: 'All' },
              { id: 'services', label: 'Services' },
              { id: 'functions', label: 'Functions' },
              { id: 'storage', label: 'Storage' },
              { id: 'critical', label: 'Critical' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-2 py-1 rounded-md text-[11px] transition-colors ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-750'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-charcoal-700" />

          {/* Edge Relation Filters */}
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="text-slate-500 text-[10px]">Edges:</span>
            {[
              { id: 'all', label: 'All' },
              { id: 'calls', label: 'Calls', color: 'text-indigo-400' },
              { id: 'depends_on', label: 'Depends', color: 'text-emerald-400' },
              { id: 'imports', label: 'Imports', color: 'text-purple-400' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRelationFilter(r.id)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  relationFilter === r.id
                    ? 'bg-charcoal-700 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-800'
                }`}
              >
                <span className={r.color}>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Toolbar: Layout Presets & Actions */}
        <div className="flex items-center gap-2 bg-charcoal-850/90 backdrop-blur-md border border-charcoal-750 px-3 py-1.5 rounded-xl shadow-panel pointer-events-auto text-xs font-mono">
          {/* Layout Mode Selector */}
          <div className="flex items-center gap-1 bg-charcoal-900 p-1 rounded-lg border border-charcoal-750">
            {[
              { id: 'dag', label: 'DAG' },
              { id: 'layers', label: 'Tiers' },
              { id: 'horizontal', label: 'Stream' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => applyLayout(m.id as LayoutMode)}
                className={`px-2 py-1 rounded text-[11px] transition-colors ${
                  layoutMode === m.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={`Switch layout to ${m.label}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Isolate Subgraph Button */}
          {selectedNode && (
            <button
              onClick={() => setIsolateMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isolateMode
                  ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                  : 'bg-charcoal-800 border-charcoal-700 text-slate-300 hover:bg-charcoal-750'
              }`}
              title="Isolate selected component and its direct dependency neighborhood"
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isolateMode ? 'Show Full' : 'Isolate'}</span>
            </button>
          )}

          {/* Reset View */}
          <button
            onClick={() => reactFlow.fitView({ padding: 0.25, duration: 600 })}
            className="p-1.5 rounded-lg bg-charcoal-900 border border-charcoal-750 text-slate-400 hover:text-white transition-colors"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-750 text-slate-300 hover:text-white hover:border-charcoal-600 transition-colors"
            title="Export Graph JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 bg-charcoal-850/90 backdrop-blur-md border border-charcoal-750 px-3.5 py-1.5 rounded-xl shadow-panel text-[11px] font-mono text-slate-400 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Clean DAG (0 Cycles)</span>
        </div>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span>{processedNodes.filter((n) => !n.hidden).length} Active Nodes</span>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span>{processedEdges.filter((e) => !e.hidden).length} Edges</span>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span className="text-indigo-400">Layout: {layoutMode.toUpperCase()}</span>
      </div>

      {/* Main React Flow Canvas */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={processedNodes}
          edges={processedEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          minZoom={0.2}
          maxZoom={2.0}
        >
          <Background color="#1b2030" gap={20} size={1} />
          <Controls className="!bg-charcoal-850 !border-charcoal-750 !text-slate-300" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'serviceNode') return '#818cf8';
              if (n.type === 'databaseNode') return '#10b981';
              if (n.type === 'functionNode') return '#f59e0b';
              return '#6366f1';
            }}
            maskColor="rgba(9, 10, 15, 0.75)"
          />
        </ReactFlow>
      </div>

      {/* Advanced Inspector Drawer */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          repoId={repoId}
        />
      )}
    </div>
  );
};

export const ArchitectureGraph: React.FC<{ repoId: string }> = ({ repoId }) => {
  return (
    <ReactFlowProvider>
      <InnerArchitectureGraph repoId={repoId} />
    </ReactFlowProvider>
  );
};
