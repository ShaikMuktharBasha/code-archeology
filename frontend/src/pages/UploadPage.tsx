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
      // Fallback simulation
      simulateAndFinish('repo-sample-1');
    }
  };

  const handleGitHubSubmit = async (url: string, branch: string) => {
    try {
      setIsProcessing(true);
      const repo = await api.ingestGithub(url, branch);
      simulateAndFinish(repo.id);
    } catch {
      // Fallback simulation
      simulateAndFinish('repo-sample-2');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="indigo" size="sm">
            Ingestion Engine
          </Badge>
          <span className="text-xs text-slate-400 font-mono">Multi-Language AST Analysis</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Ingest New Repository</h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload an existing codebase or connect a GitHub repository. Code Archaeologist will validate
          file structures, extract symbol trees, and build the architectural knowledge graph.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-charcoal-800 gap-4">
        <button
          onClick={() => setActiveTab('zip')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'zip'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>ZIP Archive</span>
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'github'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Github className="w-4 h-4" />
          <span>GitHub Repository</span>
        </button>
      </div>

      {/* Upload Box */}
      <Card className="p-8 space-y-6">
        {activeTab === 'zip' ? (
          <ZipDropzone onFileSelected={handleZipSelected} isLoading={isProcessing} />
        ) : (
          <GitHubInput onSubmit={handleGitHubSubmit} isLoading={isProcessing} />
        )}

        {isProcessing && <IngestionProgress currentStep={progressStep} />}
      </Card>

      {/* Security & Ingestion Policy */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-charcoal-800 text-xs text-slate-400">
        <div className="flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block">Zip Slip Prevention</span>
            <span>Target path sanitization verifies archive entries stay strictly within sandboxed extraction dirs.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block">No Code Execution</span>
            <span>Codebases are statically parsed via AST grammars; uploaded binaries or scripts are never executed.</span>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-300 block">Ignored Artifacts</span>
            <span>Automatically filters node_modules, .git, __pycache__, and build artifacts to maximize speed.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
