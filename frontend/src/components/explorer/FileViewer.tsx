import React from 'react';
import { Copy, Check, FileCode } from 'lucide-react';
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
    <div className="h-full flex flex-col bg-charcoal-900 border border-charcoal-800 rounded-xl overflow-hidden shadow-subtle">
      {/* File Header */}
      <div className="h-10 px-4 bg-charcoal-850 border-b border-charcoal-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-200">
          <FileCode className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold">{file.path}</span>
          <span className="text-slate-400">({file.line_count} lines)</span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-charcoal-750 transition-colors"
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

      {/* Code Editor Content with Line Numbers */}
      <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
        <div className="min-w-full inline-block">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isSymbolLine = file.symbols?.some((s) => s.start_line === lineNum);

            return (
              <div
                key={idx}
                className={`flex hover:bg-charcoal-850/60 rounded px-1 -mx-1 ${
                  isSymbolLine ? 'bg-indigo-950/30 border-l-2 border-indigo-500' : ''
                }`}
              >
                <span className="w-10 select-none text-slate-400 text-right pr-4 font-mono">
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
