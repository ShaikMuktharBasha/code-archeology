import React, { useState, useRef } from 'react';
import { Upload, FileArchive, CheckCircle2, AlertCircle } from 'lucide-react';

interface ZipDropzoneProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
}

export const ZipDropzone: React.FC<ZipDropzoneProps> = ({ onFileSelected, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!file.name.endsWith('.zip')) {
      setError('Only .zip repository archives are supported');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds the 50MB limit');
      return;
    }
    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all group ${
          dragActive
            ? 'border-cyan-400 bg-cyan-950/20 shadow-glow-cyan'
            : 'border-charcoal-700 bg-charcoal-900/60 hover:border-indigo-500/50 hover:bg-charcoal-850/80'
        }`}
      >
        {/* Subtle scanner beam on drag */}
        {dragActive && (
          <div className="absolute inset-x-0 h-16 bg-gradient-to-b from-cyan-400/20 to-transparent animate-scan pointer-events-none" />
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-charcoal-800 to-charcoal-900 border border-charcoal-700 group-hover:border-indigo-500/50 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-all shadow-glow">
          <Upload className="w-7 h-7" />
        </div>

        <p className="text-sm font-semibold text-slate-100">
          Drop repository ZIP archive here, or{' '}
          <span className="text-cyan-400 underline decoration-cyan-500/40 underline-offset-4">
            browse filesystem
          </span>
        </p>
        <p className="text-xs text-slate-400 mt-1.5 font-mono">
          Max 50MB • Static AST parsing • Zip-Slip path sanitization enforced
        </p>

        {selectedFile && (
          <div className="mt-5 flex items-center gap-2.5 px-4 py-2 bg-charcoal-800/90 rounded-xl border border-emerald-500/30 text-xs text-slate-200 font-mono shadow-subtle">
            <FileArchive className="w-4 h-4 text-cyan-400" />
            <span>{selectedFile.name}</span>
            <span className="text-slate-400">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 px-4 py-2.5 rounded-xl font-mono">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
