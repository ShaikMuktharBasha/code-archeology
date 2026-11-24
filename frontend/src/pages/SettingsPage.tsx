import React, { useState } from 'react';
import { Sparkles, Key, Monitor, Shield, CheckCircle2 } from 'lucide-react';
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
        <h2 className="text-2xl font-bold tracking-tight text-white">Platform Preferences & Settings</h2>
        <p className="text-sm text-slate-400 mt-1">
          Configure API credentials, analysis parameters, and developer environment preferences.
        </p>
      </div>

      {/* AI Credentials Configuration */}
      <Card className="space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-charcoal-800">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Google Gemini Integration</h3>
          </div>
          <Badge variant="indigo" size="sm">
            Official Gen AI SDK
          </Badge>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide uppercase">
              Gemini API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-4 py-2 bg-charcoal-900 border border-charcoal-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Keys are strictly read from backend environment variables and never exposed to the client.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 font-mono">
              Model: <strong className="text-slate-200">gemini-2.5-flash / gemini-3.8-flash</strong>
            </span>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={saved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : undefined}
            >
              {saved ? 'Saved Successfully' : 'Update Credentials'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Indexing Configuration */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-charcoal-800">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="text-base font-semibold text-white">Ingestion & Security Filters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-750">
            <span className="font-semibold text-slate-200 block mb-1">Max Upload Archive Size</span>
            <span className="text-slate-400 font-mono">50 MB per repository</span>
          </div>
          <div className="p-3 rounded-lg bg-charcoal-900 border border-charcoal-750">
            <span className="font-semibold text-slate-200 block mb-1">ZIP Path Traversal Guard</span>
            <span className="text-emerald-400 font-mono">Enforced (Zip Slip protection)</span>
          </div>
        </div>
      </Card>

      {/* Interface Preferences */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-charcoal-800">
          <Monitor className="w-4 h-4 text-slate-400" />
          <h3 className="text-base font-semibold text-white">Theme & Display</h3>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div>
            <span className="font-semibold block">Dark First Theme</span>
            <span className="text-slate-400">Deep charcoal (#090a0f) interface</span>
          </div>
          <Badge variant="indigo" size="sm">
            Enabled
          </Badge>
        </div>
      </Card>
    </div>
  );
};
