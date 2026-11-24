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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ModuleNode, ServiceNode, FunctionNode, DatabaseNode } from './CustomNodes';
import { NodeDetailDrawer } from './NodeDetailDrawer';
import { Search } from 'lucide-react';
import { Badge } from '../common/Badge';

const nodeTypes = {
  moduleNode: ModuleNode,
  serviceNode: ServiceNode,
  functionNode: FunctionNode,
  databaseNode: DatabaseNode,
};

// Initial nodes
const INITIAL_NODES = [
  {
    id: 'api-gateway',
    type: 'moduleNode',
    position: { x: 380, y: 40 },
    data: {
      label: 'API Gateway & Router',
      kind: 'module',
      path: 'src/api/router.ts',
      language: 'TypeScript',
      symbolsCount: 8,
      badge: 'Core Router',
    },
  },
  {
    id: 'auth-service',
    type: 'serviceNode',
    position: { x: 120, y: 190 },
    data: {
      label: 'AuthService & JWT',
      kind: 'class',
      path: 'src/services/auth.ts',
      language: 'TypeScript',
      symbolsCount: 12,
      badge: 'Authentication',
    },
  },
  {
    id: 'repo-ingestor',
    type: 'serviceNode',
    position: { x: 380, y: 190 },
    data: {
      label: 'IngestionEngine',
      kind: 'class',
      path: 'src/services/ingestion.py',
      language: 'Python',
      symbolsCount: 15,
      badge: 'Ingestion',
    },
  },
  {
    id: 'ai-agent',
    type: 'serviceNode',
    position: { x: 640, y: 190 },
    data: {
      label: 'GeminiContextEngine',
      kind: 'class',
      path: 'src/services/gemini.py',
      language: 'Python',
      symbolsCount: 9,
      badge: 'AI Retrieval',
    },
  },
  {
    id: 'ast-parser',
    type: 'functionNode',
    position: { x: 260, y: 350 },
    data: {
      label: 'TreeSitterParser',
      kind: 'function',
      path: 'src/parser/ast.py',
      language: 'Python',
      symbolsCount: 24,
      badge: 'AST Resolution',
    },
  },
  {
    id: 'graph-builder',
    type: 'functionNode',
    position: { x: 500, y: 350 },
    data: {
      label: 'GraphBuilderDAG',
      kind: 'function',
      path: 'src/graph/builder.py',
      language: 'Python',
      symbolsCount: 18,
      badge: 'Topology',
    },
  },
  {
    id: 'postgres-db',
    type: 'databaseNode',
    position: { x: 220, y: 500 },
    data: {
      label: 'PostgreSQL + pgvector',
      kind: 'database',
      path: 'src/database/schema.sql',
      language: 'SQL',
      symbolsCount: 6,
      badge: 'Relational DB',
    },
  },
  {
    id: 'vector-index',
    type: 'databaseNode',
    position: { x: 540, y: 500 },
    data: {
      label: 'CodeChunkVectorStore',
      kind: 'database',
      path: 'src/vectors/store.py',
      language: 'Python',
      symbolsCount: 7,
      badge: 'HNSW Index',
    },
  },
];

// Initial edges
const INITIAL_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: 'api-gateway',
    target: 'auth-service',
    label: 'authenticates',
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e1-3',
    source: 'api-gateway',
    target: 'repo-ingestor',
    label: 'dispatches upload',
    animated: true,
    style: { stroke: '#818cf8', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
  },
  {
    id: 'e1-4',
    source: 'api-gateway',
    target: 'ai-agent',
    label: 'queries context',
    style: { stroke: '#475569', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
  },
  {
    id: 'e3-5',
    source: 'repo-ingestor',
    target: 'ast-parser',
    label: 'extracts AST',
    style: { stroke: '#475569', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
  },
  {
    id: 'e5-6',
    source: 'ast-parser',
    target: 'graph-builder',
    label: 'streams symbols',
    style: { stroke: '#475569', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
  },
  {
    id: 'e6-7',
    source: 'graph-builder',
    target: 'postgres-db',
    label: 'persists relations',
    style: { stroke: '#10b981', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
  {
    id: 'e4-8',
    source: 'ai-agent',
    target: 'vector-index',
    label: 'similarity search',
    style: { stroke: '#6366f1', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
  },
  {
    id: 'e8-7',
    source: 'vector-index',
    target: 'postgres-db',
    label: 'embeddings',
    style: { stroke: '#10b981', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
  },
];

interface ArchitectureGraphProps {
  repoId: string;
}

export const ArchitectureGraph: React.FC<ArchitectureGraphProps> = ({ repoId }) => {
  const [nodes, , onNodesChange] = useNodesState(INITIAL_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

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

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    return nodes.map((node) => {
      const matchesSearch =
        !searchQuery ||
        node.data.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.data.path.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'services' && (node.type === 'serviceNode' || node.type === 'moduleNode')) ||
        (activeFilter === 'functions' && node.type === 'functionNode') ||
        (activeFilter === 'storage' && node.type === 'databaseNode');

      return {
        ...node,
        hidden: !matchesSearch || !matchesFilter,
      };
    });
  }, [nodes, searchQuery, activeFilter]);

  return (
    <div className="relative w-full h-full flex overflow-hidden bg-charcoal-900">
      {/* Top Floating Controls Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-charcoal-850/90 backdrop-blur-md border border-charcoal-750 px-3 py-2 rounded-xl shadow-panel">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search nodes..."
            className="pl-8 pr-3 py-1 bg-charcoal-900 border border-charcoal-750 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-40"
          />
        </div>

        <div className="h-4 w-[1px] bg-charcoal-700" />

        {/* Filter buttons */}
        <div className="flex items-center gap-1 text-xs">
          {['all', 'services', 'functions', 'storage'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2 py-1 rounded-md capitalize font-mono text-[11px] transition-colors ${
                activeFilter === f
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-750'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="h-4 w-[1px] bg-charcoal-700" />

        <Badge variant="indigo" size="sm">
          {filteredNodes.filter((n) => !n.hidden).length} Active Nodes
        </Badge>
      </div>

      {/* Main Flow Canvas */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.2}
          maxZoom={2.0}
        >
          <Background color="#1e2330" gap={20} size={1} />
          <Controls className="!bg-charcoal-850 !border-charcoal-750 !text-slate-300" />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'serviceNode') return '#818cf8';
              if (n.type === 'databaseNode') return '#10b981';
              if (n.type === 'functionNode') return '#f59e0b';
              return '#475569';
            }}
            maskColor="rgba(9, 10, 15, 0.7)"
          />
        </ReactFlow>
      </div>

      {/* Slide-out Inspector Drawer */}
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
