import React from 'react';
import { FileCode } from 'lucide-react';
import { FileNode } from '../../types';

interface FileTreeProps {
  files: FileNode[];
  selectedFile: string;
  onSelectFile: (path: string) => void;
}

export const FileTree: React.FC<FileTreeProps> = ({ files, selectedFile, onSelectFile }) => {
  return (
    <div className="font-mono text-xs select-none space-y-0.5">
      {files.map((file) => {
        const isSelected = selectedFile === file.path;
        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file.path)}
            className={`flex items-center justify-between px-3 py-1.5 rounded-md cursor-pointer transition-colors ${
              isSelected
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <FileCode
                className={`w-3.5 h-3.5 flex-shrink-0 ${
                  isSelected ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate">{file.path}</span>
            </div>
            <span className="text-[10px] text-slate-400 ml-2 font-normal">
              {file.line_count}L
            </span>
          </div>
        );
      })}
    </div>
  );
};
