import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Github, Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runIngestion = async (task: () => Promise<{ id: string }>) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 600);

    try {
      const repo = await task();
      clearInterval(stepInterval);
      setProgressStep(3);
      setTimeout(() => {
        setIsProcessing(false);
        navigate(`/architecture/${repo.id}`);
      }, 600);
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      let msg = (err as Error).message || 'Failed to analyze repository.';
      try {
        const parsed = JSON.parse(msg);
        if (parsed.detail) msg = parsed.detail;
      } catch {
        // use raw message
      }
      setErrorMsg(msg);
    }
  };

  const handleZipSelected = async (file: File) => {
    await runIngestion(() => api.uploadZip(file));
  };

  const handleGitHubSubmit = async (url: string, branch: string) => {
    await runIngestion(() => api.ingestGithub(url, branch));
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
          Upload an archive or connect a GitHub repository. Code Archaeologist will download and validate
          file structures, extract real AST symbol trees, and synthesize the architectural knowledge graph.
        </p>
      </div>

      {/* Mode Switcher Pills */}
      <div className="inline-flex p-1 rounded-xl bg-charcoal-950 border border-charcoal-800 gap-1">
        <button
          onClick={() => {
            setActiveTab('zip');
            setErrorMsg(null);
          }}
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
          onClick={() => {
            setActiveTab('github');
            setErrorMsg(null);
          }}
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

        {errorMsg && (
          <div className="flex items-start gap-2.5 text-xs text-rose-300 bg-rose-950/50 border border-rose-500/30 px-4 py-3 rounded-xl font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
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
