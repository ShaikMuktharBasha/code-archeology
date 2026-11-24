export interface Repository {
  id: string;
  name: string;
  description?: string;
  source_type: 'zip' | 'github';
  source_url?: string;
  branch?: string;
  status: 'ready' | 'indexing' | 'pending' | 'failed';
  file_count: number;
  symbol_count: number;
  languages: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface FileNode {
  id: string;
  repository_id: string;
  path: string;
  name: string;
  extension?: string;
  language?: string;
  size_bytes: number;
  line_count: number;
  is_directory: boolean;
  parent_path?: string | null;
  symbols_count: number;
}

export interface FileContent {
  id: string;
  path: string;
  name: string;
  language?: string;
  line_count: number;
  content: string;
  symbols: Array<{
    name: string;
    type: string;
    start_line: number;
    end_line: number;
  }>;
}

export interface SymbolItem {
  id: string;
  repository_id: string;
  file_id?: string;
  name: string;
  symbol_type: 'module' | 'class' | 'function' | 'method' | 'interface' | 'endpoint';
  language: string;
  file_path: string;
  start_line: number;
  end_line: number;
  signature?: string;
  docstring?: string;
  metadata_json?: Record<string, any>;
}

export interface GraphNodeData {
  label: string;
  kind: 'module' | 'class' | 'function' | 'database';
  path: string;
  language: string;
  symbolsCount: number;
  status: string;
  badge: string;
}

export interface ImpactAnalysis {
  symbol_id: string;
  target_name: string;
  target_type: string;
  target_path: string;
  blast_radius_score: number;
  affected_files_count: number;
  summary: string;
  direct_dependencies: Array<{
    id: string;
    name: string;
    type: string;
    path: string;
    reason: string;
    impact_level: 'high' | 'medium' | 'low';
  }>;
  reverse_dependencies: Array<{
    id: string;
    name: string;
    type: string;
    path: string;
    reason: string;
    impact_level: 'high' | 'medium' | 'low';
  }>;
}

export interface Citation {
  file_path: string;
  start_line?: number;
  end_line?: number;
  symbol_name?: string;
  snippet?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  suggested_followups?: string[];
}
