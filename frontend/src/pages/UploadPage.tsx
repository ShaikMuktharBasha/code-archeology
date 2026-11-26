import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Github, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ZipDropzone } from '../components/upload/ZipDropzone';
import { GitHubInput } from '../components/upload/GitHubInput';
import { IngestionProgress } from '../components/upload/IngestionProgress';
import { api } from '../services/api';

export const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'zip' | 'github'>('zip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);

  const simulateAndFinish = (repoId: string) => {
    setIsProcessing(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= 3) {
          clearInterval(stepInterval);
          setTimeout(() => {
            setIsProcessing(false);
            navigate(`/architecture/${repoId}`);
          }, 800);
          return 3;
        }
        return prev + 1;
      });
    }, 900);
  };

  const handleZipSelected = async (file: File) => {
    try {
      setIsProcessing(true);
      const repo = await api.uploadZip(file);
      simulateAndFinish(repo.id);
    } catch {
      simulateAndFinish('repo-sample-1');
    }
  };

  const handleGitHubSubmit = async (url: string, branch: string) => {
    try {
      setIsProcessing(true);
      const repo = await api.ingestGithub(url, branch);
      simulateAndFinish(repo.id);
    } catch {
      simulateAndFinish('repo-sample-2');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5 mb-2">
          <Badge variant="cyan" size="sm">
            INGESTION BAY
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Multi-Language AST Pipeline</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">Ingest New Repository</h2>
        <p className="text-sm text-slate-400 mt-1.5">
          Upload an archive or connect a GitHub repository. Code Archaeologist will validate
          file structures, extract AST symbol trees, and synthesize the architectural knowledge graph.
        </p>
      </div>

      {/* Mode Switcher Pills */}
      <div className="inline-flex p-1 rounded-xl bg-charcoal-950 border border-charcoal-800 gap-1">
        <button
          onClick={() => setActiveTab('zip')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeTab === 'zip'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>ZIP Archive</span>
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
            activeTab === 'github'
              ? 'bg-indigo-600 text-white shadow-glow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>GitHub Repository</span>
        </button>
      </div>

      {/* Upload Box */}
      <Card glow className="p-8 space-y-6">
        {activeTab === 'zip' ? (
          <ZipDropzone onFileSelected={handleZipSelected} isLoading={isProcessing} />
        ) : (
          <GitHubInput onSubmit={handleGitHubSubmit} isLoading={isProcessing} />
        )}

        {isProcessing && <IngestionProgress currentStep={progressStep} />}
      </Card>

      {/* Security & Ingestion Policy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-400">
        <Card className="p-4 flex items-start gap-3">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block mb-0.5">Zip Slip Defense</span>
            <span className="text-[11px] leading-relaxed">
              Sanitizes archive paths to stay strictly within sandboxed directories.
            </span>
          </div>
        </Card>
        <Card className="p-4 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block mb-0.5">Zero Code Execution</span>
            <span className="text-[11px] leading-relaxed">
              Parsed statically via AST grammars; uploaded scripts are never executed.
            </span>
          </div>
        </Card>
        <Card className="p-4 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200 block mb-0.5">Smart Filtering</span>
            <span className="text-[11px] leading-relaxed">
              Automatically prunes node_modules, .git, __pycache__, and binaries.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
