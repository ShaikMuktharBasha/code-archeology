import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Send,
  Sparkles,
  FileCode,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { ChatMessage, Repository } from '../types';

export const AssistantPage: React.FC = () => {
  const { id = 'repo-sample-1' } = useParams<{ id: string }>();
  const [repo, setRepo] = useState<Repository | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  useEffect(() => {
    api.getRepository(id).then((r) => {
      setRepo(r);
      setMessages([
        {
          id: 'msg-init',
          sender: 'assistant',
          content:
            `### Neural Codebase Oracle\n\n` +
            `I have indexed **${r.file_count} files** and **${r.symbol_count} AST symbols** for **${r.name}**.\n\n` +
            `Ask natural-language questions about execution paths, modules, or refactoring impact. Every response is grounded in the repository's actual files and line ranges.`,
          timestamp: 'Online',
          suggested_followups: [
            `Summarize the architecture of ${r.name}`,
            'What are the main entrypoints and modules?',
            'Which files have the most symbols?',
          ],
        },
      ]);
    });
  }, [id]);

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
      <div className="flex items-center justify-between pb-4 border-b border-charcoal-800/80 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-white">Neural Code Assistant</h2>
            <Badge variant="cyan" size="sm">
              Gemini Powered
            </Badge>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Retrieval-grounded Q&A with verified citations from <span className="text-slate-200">{repo?.name || id}</span>
          </p>
        </div>

        <Badge variant="success" size="sm">
          <Cpu className="w-3 h-3 mr-1" />
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
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600/30 to-cyan-500/20 border border-cyan-500/35 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1 shadow-glow-cyan">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-glow border border-indigo-400/30'
                  : 'glass-panel border border-charcoal-750 text-slate-200 shadow-panel'
              }`}
            >
              <div className="prose prose-invert max-w-none whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {msg.content}
              </div>

              {/* Citations Box */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-4 pt-3 border-t border-charcoal-750 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 font-mono">
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Verified Codebase Citations</span>
                  </div>
                  {msg.citations.map((cite, cIdx) => (
                    <div
                      key={cIdx}
                      className="p-3 rounded-xl bg-charcoal-950/80 border border-charcoal-750 font-mono text-[11px]"
                    >
                      <div className="flex items-center justify-between text-indigo-300 mb-1.5">
                        <span className="font-semibold">{cite.file_path}</span>
                        <Badge variant="outline" size="sm">
                          L{cite.start_line}–{cite.end_line}
                        </Badge>
                      </div>
                      {cite.snippet && (
                        <pre className="text-slate-300 overflow-x-auto text-[10px] p-2 bg-charcoal-900 rounded-lg border border-charcoal-800">
                          {cite.snippet}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-charcoal-750/80 flex flex-wrap gap-2">
                  {msg.suggested_followups.map((followup, fIdx) => (
                    <button
                      key={fIdx}
                      onClick={() => handleSend(followup)}
                      className="px-3 py-1.5 rounded-xl bg-charcoal-900/90 hover:bg-indigo-600/20 border border-charcoal-700 hover:border-cyan-500/40 text-slate-300 hover:text-white text-[11px] transition-all flex items-center gap-1.5"
                    >
                      <span>{followup}</span>
                      <ArrowRight className="w-3 h-3 text-cyan-400" />
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
            <div className="w-9 h-9 rounded-xl bg-indigo-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-panel border border-charcoal-750 rounded-2xl p-4 text-xs text-cyan-300 font-mono flex items-center gap-2">
              <span className="animate-pulse">Scanning AST symbols & grounding citations...</span>
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
            className="w-full pl-4 pr-14 py-3.5 glass-panel border border-charcoal-700 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 shadow-panel font-mono"
            disabled={isAsking}
          />
          <button
            type="submit"
            disabled={isAsking || !inputQuery.trim()}
            className="absolute right-2 p-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white disabled:opacity-40 transition-all shadow-glow"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
