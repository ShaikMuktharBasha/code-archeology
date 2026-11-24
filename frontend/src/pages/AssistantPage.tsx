import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Sparkles,
  FileCode,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { ChatMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const { id = 'repo-sample-1' } = useParams<{ id: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      content:
        '### Code Archaeologist Intelligence\n\n' +
        'I have indexed the AST symbols, file relations, and vector chunks for **code-archaeologist-core**.\n\n' +
        'You can ask natural-language questions about how the codebase operates, trace execution paths, or request refactoring impact assessments. All answers cite verified repository files and line boundaries.',
      timestamp: '10:45 AM',
      suggested_followups: [
        'How does authentication work?',
        'Where is the database connection initialized?',
        'What happens when a user logs in?',
        'Which files depend on AuthService?',
      ],
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const handleSend = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery.trim();
    if (!q || isAsking) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsAsking(true);

    try {
      const response = await api.askCodebase(id, q);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: 'Unable to query repository context. Please check API server status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal-800 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-white">AI Codebase Assistant</h2>
            <Badge variant="indigo" size="sm">
              Gemini Powered
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strictly grounded semantic answers with source citations from {id}.
          </p>
        </div>

        <Badge variant="success" size="sm">
          AST Grounding Active
        </Badge>
      </div>

      {/* Chat Messages Pane */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-subtle'
                  : 'bg-charcoal-850 border border-charcoal-750 text-slate-200'
              }`}
            >
              <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-xs">
                {msg.content}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-charcoal-750 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 font-mono">
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Verified Codebase Citations:</span>
                  </div>
                  {msg.citations.map((cite, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-2.5 rounded bg-charcoal-900 border border-charcoal-750 font-mono text-[11px]"
                    >
                      <div className="flex items-center justify-between text-indigo-300 mb-1">
                        <span className="font-semibold">{cite.file_path}</span>
                        <span className="text-slate-400">
                          L{cite.start_line}–{cite.end_line}
                        </span>
                      </div>
                      {cite.snippet && (
                        <pre className="text-slate-300 overflow-x-auto text-[10px] p-1.5 bg-charcoal-950/80 rounded">
                          {cite.snippet}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-charcoal-750 flex flex-wrap gap-2">
                  {msg.suggested_followups.map((followup, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSend(followup)}
                      className="px-2.5 py-1 rounded bg-charcoal-800 hover:bg-charcoal-750 border border-charcoal-700 text-slate-300 text-[11px] transition-colors flex items-center gap-1"
                    >
                      <span>{followup}</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-slate-400 font-mono block text-right mt-2">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isAsking && (
          <div className="flex gap-3.5 justify-start">
            <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-charcoal-850 border border-charcoal-750 rounded-xl p-4 text-xs text-slate-300 font-mono flex items-center gap-2">
              <span className="animate-pulse">Retrieving AST symbols & grounding citations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex-shrink-0 pt-2"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about the codebase (e.g. 'How does authentication work?')..."
            className="w-full pl-4 pr-12 py-3 bg-charcoal-850 border border-charcoal-750 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-panel"
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={isAsking || !inputQuery.trim()}
            className="absolute right-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
