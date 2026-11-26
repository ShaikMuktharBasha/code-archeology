import React from 'react';
import { Copy, Check, FileCode, Code2 } from 'lucide-react';
import { FileContent } from '../../types';

interface FileViewerProps {
  file: FileContent;
}

export const FileViewer: React.FC<FileViewerProps> = ({ file }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = file.content.split('\n');

  return (
    <div className="h-full flex flex-col glass-panel border border-charcoal-750 rounded-2xl overflow-hidden shadow-panel">
      {/* File Header */}
      <div className="h-11 px-4 bg-charcoal-950/90 border-b border-charcoal-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5 text-xs font-mono text-slate-200">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-white">{file.path}</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{file.line_count} lines</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-charcoal-900 border border-charcoal-750 hover:border-charcoal-600 transition-all"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Extracted Symbols Ribbon */}
      {file.symbols && file.symbols.length > 0 && (
        <div className="px-4 py-2 bg-charcoal-900/60 border-b border-charcoal-800/80 flex items-center gap-2 overflow-x-auto flex-shrink-0">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider flex-shrink-0">
            AST Symbols:
          </span>
          {file.symbols.map((sym, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 flex-shrink-0"
            >
              <Code2 className="w-3 h-3 text-cyan-400" />
              <span>{sym.name}</span>
              <span className="text-slate-500 text-[10px]">L{sym.start_line}</span>
            </span>
          ))}
        </div>
      )}

      {/* Code Editor Content with Line Numbers */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300 bg-charcoal-950/60">
        <div className="min-w-full inline-block">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isSymbolLine = file.symbols?.some((s) => s.start_line === lineNum);

            return (
              <div
                key={idx}
                className={`flex hover:bg-charcoal-850/70 rounded px-2 -mx-2 transition-colors ${
                  isSymbolLine ? 'bg-indigo-950/35 border-l-2 border-cyan-400' : ''
                }`}
              >
                <span className="w-10 select-none text-slate-500 text-right pr-4 font-mono">
                  {lineNum}
                </span>
                <span className="whitespace-pre flex-1 text-slate-200">{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
