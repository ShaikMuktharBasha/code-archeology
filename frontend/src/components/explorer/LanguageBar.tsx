import React from 'react';

interface LanguageBarProps {
  languages: Record<string, number>;
}

export const LanguageBar: React.FC<LanguageBarProps> = ({ languages }) => {
  const colorMap: Record<string, string> = {
    Python: 'bg-indigo-500',
    TypeScript: 'bg-blue-500',
    'TypeScript (React)': 'bg-blue-400',
    JavaScript: 'bg-amber-400',
    SQL: 'bg-emerald-500',
    Java: 'bg-orange-500',
    Go: 'bg-cyan-500',
    Docker: 'bg-sky-500',
    CSS: 'bg-purple-500',
    JSON: 'bg-slate-500',
  };

  return (
    <div className="space-y-2">
      {/* Progress bar */}
      <div className="h-2 w-full bg-charcoal-800 rounded-full overflow-hidden flex">
        {Object.entries(languages).map(([lang, pct]) => (
          <div
            key={lang}
            style={{ width: `${pct}%` }}
            className={`h-full ${colorMap[lang] || 'bg-slate-600'}`}
            title={`${lang}: ${pct}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-400">
        {Object.entries(languages).map(([lang, pct]) => (
          <div key={lang} className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${colorMap[lang] || 'bg-slate-600'}`}
            />
            <span className="text-slate-200">{lang}</span>
            <span>{pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
