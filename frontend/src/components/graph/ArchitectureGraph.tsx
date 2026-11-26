import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
  Node,
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
  Loader2,
} from 'lucide-react';
import { GraphNodeData } from '../../types';
import { api } from '../../services/api';

const nodeTypes = {
  moduleNode: ModuleNode,
  serviceNode: ServiceNode,
  functionNode: FunctionNode,
  databaseNode: DatabaseNode,
};

type LayoutMode = 'dag' | 'layers' | 'horizontal';

function computeDynamicLayout(currentNodes: Node[], mode: LayoutMode): Node[] {
  if (mode === 'horizontal') {
    const layers = ['ingress', 'domain', 'analysis', 'storage'];
    const buckets: Record<string, Node[]> = { ingress: [], domain: [], analysis: [], storage: [] };
    currentNodes.forEach((n) => {
      const layer = ((n.data as GraphNodeData)?.layer) || 'domain';
      (buckets[layer] || buckets.domain).push(n);
    });

    const positioned: Node[] = [];
    layers.forEach((layerName, colIdx) => {
      const bucket = buckets[layerName];
      const x = 60 + colIdx * 340;
      const startY = Math.max(40, 260 - ((bucket.length - 1) * 180) / 2);
      bucket.forEach((n, rowIdx) => {
        positioned.push({
          ...n,
          position: { x, y: Math.round(startY + rowIdx * 200) },
        });
      });
    });
    return positioned;
  }

  // 'dag' or 'layers' top-down layout
  const layers = ['ingress', 'domain', 'analysis', 'storage'];
  const buckets: Record<string, Node[]> = { ingress: [], domain: [], analysis: [], storage: [] };
  currentNodes.forEach((n) => {
    const layer = ((n.data as GraphNodeData)?.layer) || 'domain';
    (buckets[layer] || buckets.domain).push(n);
  });

  const yStep = mode === 'layers' ? 230 : 210;
  const positioned: Node[] = [];
  let rowIndex = 0;

  layers.forEach((layerName) => {
    const bucket = buckets[layerName];
    if (bucket.length === 0) return;
    const y = 40 + rowIndex * yStep;
    const spacingX = 320;
    const startX = Math.max(60, 480 - ((bucket.length - 1) * spacingX) / 2);
    bucket.forEach((n, colIdx) => {
      positioned.push({
        ...n,
        position: { x: Math.round(startX + colIdx * spacingX), y },
      });
    });
    rowIndex++;
  });

  return positioned;
}

const InnerArchitectureGraph: React.FC<{ repoId: string }> = ({ repoId }) => {
  const reactFlow = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [relationFilter, setRelationFilter] = useState<string>('all');
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('dag');
  const [isolateMode, setIsolateMode] = useState(false);

  // Fetch real architecture graph for repoId
  useEffect(() => {
    let active = true;
    setLoading(true);
    setSelectedNode(null);
    setIsolateMode(false);

    api.getArchitectureGraph(repoId).then((graphData) => {
      if (!active) return;
      if (graphData && Array.isArray(graphData.nodes)) {
        const mappedNodes: Node[] = graphData.nodes.map((n: any) => ({
          id: n.id,
          type: n.type || 'serviceNode',
          position: n.position || { x: 100, y: 100 },
          data: n.data || {},
        }));

        const mappedEdges: Edge[] = (graphData.edges || []).map((e: any) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          label: e.label,
          animated: Boolean(e.animated),
          data: { relationType: e.relation_type || 'imports' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#818cf8' },
        }));

        setNodes(computeDynamicLayout(mappedNodes, 'dag'));
        setEdges(mappedEdges);
        setTimeout(() => {
          reactFlow.fitView({ padding: 0.25, duration: 500 });
        }, 80);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [repoId, setNodes, setEdges, reactFlow]);

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
      setNodes((currentNodes) => computeDynamicLayout(currentNodes, mode));
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
        zoom: 1.25,
        duration: 700,
      });
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
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
        (nodeData.label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (nodeData.path || '').toLowerCase().includes(searchQuery.toLowerCase());

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
          edgeColor = '#38bdf8';
          strokeWidth = 2.5;
        } else if (isInbound) {
          edgeColor = '#f59e0b';
          strokeWidth = 2.5;
        }
      }

      return {
        ...edge,
        hidden: !matchesRelation,
        animated: Boolean(isOutbound || (edge.animated && !selectedNode)),
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
        <div className="flex flex-wrap items-center gap-2.5 glass-panel border border-charcoal-750 px-3 py-2 rounded-2xl shadow-panel pointer-events-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                if (val.length >= 3) {
                  const found = nodes.find(
                    (n) =>
                      ((n.data as GraphNodeData).label || '').toLowerCase().includes(val.toLowerCase()) ||
                      ((n.data as GraphNodeData).path || '').toLowerCase().includes(val.toLowerCase())
                  );
                  if (found) handleSearchSelect(found.id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const found = nodes.find(
                    (n) =>
                      ((n.data as GraphNodeData).label || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ((n.data as GraphNodeData).path || '').toLowerCase().includes(searchQuery.toLowerCase())
                  );
                  if (found) handleSearchSelect(found.id);
                }
              }}
              placeholder="Search symbol, path..."
              className="pl-8 pr-3 py-1 bg-charcoal-950/90 border border-charcoal-750 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44 font-mono"
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
                className={`px-2 py-1 rounded-lg text-[11px] transition-colors ${
                  activeFilter === f.id
                    ? 'bg-indigo-600 text-white font-semibold shadow-glow'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-800'
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
        <div className="flex items-center gap-2 glass-panel border border-charcoal-750 px-3 py-1.5 rounded-2xl shadow-panel pointer-events-auto text-xs font-mono">
          <div className="flex items-center gap-1 bg-charcoal-950 p-1 rounded-xl border border-charcoal-800">
            {[
              { id: 'dag', label: 'DAG' },
              { id: 'layers', label: 'Tiers' },
              { id: 'horizontal', label: 'Stream' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => applyLayout(m.id as LayoutMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  layoutMode === m.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {selectedNode && (
            <button
              onClick={() => setIsolateMode((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors ${
                isolateMode
                  ? 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                  : 'bg-charcoal-900 border-charcoal-750 text-slate-300 hover:bg-charcoal-800'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{isolateMode ? 'Show Full' : 'Isolate'}</span>
            </button>
          )}

          <button
            onClick={() => reactFlow.fitView({ padding: 0.25, duration: 600 })}
            className="p-1.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-slate-400 hover:text-white transition-colors"
            title="Reset Canvas View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-charcoal-900 border border-charcoal-750 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors"
            title="Export Graph JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 glass-panel border border-charcoal-750 px-3.5 py-1.5 rounded-xl shadow-panel text-[11px] font-mono text-slate-400 pointer-events-auto">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AST Graph Verified</span>
        </div>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span>{processedNodes.filter((n) => !n.hidden).length} Nodes</span>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span>{processedEdges.filter((e) => !e.hidden).length} Edges</span>
        <div className="h-3 w-[1px] bg-charcoal-700" />
        <span className="text-cyan-400">Layout: {layoutMode.toUpperCase()}</span>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 bg-charcoal-950/70 backdrop-blur-sm flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-glow-cyan">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Synthesizing Architecture DAG for {repoId}...</span>
          </div>
        </div>
      )}

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
          <Background color="#1b2030" gap={22} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(n) => {
              if (n.type === 'serviceNode') return '#818cf8';
              if (n.type === 'databaseNode') return '#34d399';
              if (n.type === 'functionNode') return '#fbbf24';
              return '#22d3ee';
            }}
            maskColor="rgba(7, 8, 13, 0.75)"
          />
        </ReactFlow>
      </div>

      {/* Advanced Inspector Drawer */}
      {selectedNode && (
        <NodeDetailDrawer
          node={selectedNode}
          allNodes={nodes}
          allEdges={edges}
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
