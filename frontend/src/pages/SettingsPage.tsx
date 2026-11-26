import React, { useState } from 'react';
import { Sparkles, Key, Monitor, Shield, CheckCircle2, Cpu } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="indigo" size="sm">
            SYSTEM CORE
          </Badge>
          <span className="text-xs font-mono text-slate-500">ENVIRONMENT & SECURITY</span>
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Platform Preferences & Settings
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure AI credentials, AST analysis thresholds, and interface telemetry.
        </p>
      </div>

      {/* AI Credentials Configuration */}
      <Card glow className="space-y-5">
        <div className="flex items-center justify-between pb-3.5 border-b border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Google Gemini Integration</h3>
          </div>
          <Badge variant="cyan" size="sm">
            Official Gen AI SDK
          </Badge>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-300 tracking-wide uppercase">
              Gemini API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4 text-indigo-400" />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-4 py-2.5 bg-charcoal-950/80 border border-charcoal-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Keys are strictly read from backend environment variables and never exposed to client bundles.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Model: <strong className="text-cyan-300">gemini-2.5-flash</strong>
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : undefined}
            >
              {saved ? 'Credentials Updated' : 'Update Credentials'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Indexing Configuration */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-charcoal-800">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Ingestion & Security Policies</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-charcoal-950/70 border border-charcoal-750">
            <span className="font-semibold text-slate-200 block mb-1">Max Archive Payload</span>
            <span className="text-cyan-300 font-mono">50 MB per repository</span>
          </div>
          <div className="p-3.5 rounded-xl bg-charcoal-950/70 border border-charcoal-750">
            <span className="font-semibold text-slate-200 block mb-1">Zip Slip Traversal Guard</span>
            <span className="text-emerald-400 font-mono">Enforced (Strict Sandbox)</span>
          </div>
        </div>
      </Card>

      {/* Interface Preferences */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3.5 border-b border-charcoal-800">
          <Monitor className="w-4 h-4 text-indigo-400" />
          <h3 className="text-base font-bold text-white">Theme & Display</h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div>
            <span className="font-semibold block">Obsidian Cyber-HUD Theme</span>
            <span className="text-slate-400">Deep space charcoal (#07080d) with glass panels</span>
          </div>
          <Badge variant="success" size="sm">
            Active
          </Badge>
        </div>
      </Card>
    </div>
  );
};
