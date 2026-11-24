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
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
          dragActive
            ? 'border-indigo-500 bg-indigo-950/20 shadow-glow'
            : 'border-charcoal-700 bg-charcoal-850/50 hover:border-charcoal-600 hover:bg-charcoal-800/60'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          onChange={handleChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="w-14 h-14 rounded-full bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-6 h-6" />
        </div>

        <p className="text-sm font-medium text-slate-200">
          Drop your repository ZIP archive here, or <span className="text-indigo-400 underline">browse</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Supports multi-language codebases up to 50MB (safe path traversal validation included)
        </p>

        {selectedFile && (
          <div className="mt-4 flex items-center gap-2.5 px-3.5 py-2 bg-charcoal-800 rounded-lg border border-charcoal-700 text-xs text-slate-200 font-mono">
            <FileArchive className="w-4 h-4 text-indigo-400" />
            <span>{selectedFile.name}</span>
            <span className="text-slate-400">
              ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-1" />
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 px-3.5 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
