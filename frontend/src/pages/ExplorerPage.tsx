import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { FileTree } from '../components/explorer/FileTree';
import { FileViewer } from '../components/explorer/FileViewer';
import { LanguageBar } from '../components/explorer/LanguageBar';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { FileNode, FileContent, Repository } from '../types';

export const ExplorerPage: React.FC = () => {
  const { id = 'repo-sample-1' } = useParams<{ id: string }>();
  const [repository, setRepository] = useState<Repository | null>(null);
  const [files, setFiles] = useState<FileNode[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>('src/services/auth.ts');
  const [currentContent, setCurrentContent] = useState<FileContent | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getRepository(id).then(setRepository);
    api.getFiles(id).then((fileList) => {
      setFiles(fileList);
      if (fileList.length > 0) {
        setSelectedPath(fileList[1]?.path || fileList[0].path);
      }
    });
  }, [id]);

  useEffect(() => {
    if (selectedPath) {
      api.getFileContent(id, selectedPath).then(setCurrentContent);
    }
  }, [id, selectedPath]);

  const filteredFiles = files.filter((f) =>
    f.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-6 space-y-4">
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-charcoal-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold tracking-tight text-white">Repository Explorer</h2>
            <Badge variant="indigo" size="sm">
              AST Indexed
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Target: {repository?.name || id} ({files.length} indexed files)
          </p>
        </div>

        {/* Language breakdown */}
        {repository?.languages && (
          <div className="w-full sm:w-80">
            <LanguageBar languages={repository.languages} />
          </div>
        )}
      </div>

      {/* Main split view: File tree on left, Source viewer on right */}
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Left file navigator pane */}
        <div className="w-72 bg-charcoal-850 border border-charcoal-750 rounded-xl p-3 flex flex-col overflow-hidden">
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-8 pr-3 py-1.5 bg-charcoal-900 border border-charcoal-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            <FileTree
              files={filteredFiles}
              selectedFile={selectedPath}
              onSelectFile={setSelectedPath}
            />
          </div>
        </div>

        {/* Right Source Code View */}
        <div className="flex-1 h-full overflow-hidden">
          {currentContent ? (
            <FileViewer file={currentContent} />
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs font-mono">
              Select a file to inspect AST symbols and source lines
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
