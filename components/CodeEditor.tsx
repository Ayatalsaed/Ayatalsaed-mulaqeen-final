import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, MessageSquare, CheckCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { checkCodeWithGemini } from '../services/geminiService';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  onRun: () => void;
  isRunning: boolean;
  logs: string[];
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, onRun, isRunning, logs }) => {
  const [activeTab, setActiveTab] = useState<'python' | 'blocks'>('python');
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Auto-indentation helper (basic)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      // Need to defer cursor set slightly in React
      setTimeout(() => {
        if(e.currentTarget) e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      }, 0);
    }
  };

  const handleAICheck = async () => {
    setIsChecking(true);
    setAiFeedback(null);
    const feedback = await checkCodeWithGemini(code, "Move the robot to coordinates (300, 300) while avoiding obstacles.");
    setAiFeedback(feedback);
    setIsChecking(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
      
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('python')}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'python' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Python
          </button>
          <button 
            onClick={() => setActiveTab('blocks')}
            className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab === 'blocks' ? 'border-emerald-500 text-white' : 'border-transparent text-slate-400 hover:text-white'}`}
          >
            Blocks (مرئي)
          </button>
        </div>
        
        <div className="flex items-center gap-2">
            <button 
                onClick={handleAICheck}
                disabled={isChecking}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-lg text-sm transition-all"
            >
                <Sparkles size={14} />
                <span>{isChecking ? 'جاري التحليل...' : 'مُـلَقِّن AI'}</span>
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative flex">
        {/* Line Numbers */}
        <div className="w-10 bg-slate-900 text-slate-600 text-right pr-2 pt-4 font-mono text-sm select-none border-l border-slate-800">
          {code.split('\n').map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>

        {activeTab === 'python' ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-slate-900 text-slate-100 p-4 font-mono text-sm leading-6 outline-none resize-none"
            spellCheck={false}
          />
        ) : (
          <div className="flex-1 bg-slate-800/50 flex flex-col items-center justify-center text-slate-500 gap-4">
             <div className="w-64 h-32 bg-slate-700/50 rounded border-2 border-dashed border-slate-600 flex items-center justify-center">
                <span>Move Forward (100)</span>
             </div>
             <div className="w-64 h-32 bg-slate-700/50 rounded border-2 border-dashed border-slate-600 flex items-center justify-center">
                <span>Turn Right (90)</span>
             </div>
             <p>واجهة السحب والإفلات (تجريبي)</p>
          </div>
        )}

        {/* AI Feedback Overlay */}
        {aiFeedback && (
            <div className="absolute bottom-4 right-4 left-14 bg-slate-800/95 backdrop-blur border border-indigo-500/50 p-4 rounded-xl shadow-2xl animate-fadeIn z-20">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-indigo-400 font-bold flex items-center gap-2">
                        <BotIcon /> نصائح المُـلَقِّن
                    </h4>
                    <button onClick={() => setAiFeedback(null)} className="text-slate-400 hover:text-white">&times;</button>
                </div>
                <div className="text-sm text-slate-300 whitespace-pre-wrap max-h-32 overflow-y-auto">
                    {aiFeedback}
                </div>
            </div>
        )}
      </div>

      {/* Action Bar & Console */}
      <div className="h-40 bg-slate-950 border-t border-slate-800 flex flex-col">
        <div className="flex items-center justify-between p-2 bg-slate-900 border-b border-slate-800">
            <span className="text-xs text-slate-500 font-mono px-2">CONSOLE / TERMINAL</span>
            <div className="flex gap-2">
                <button 
                  onClick={() => setCode('# Resetting code...\nrobot.setup()\n')}
                  className="p-2 text-slate-400 hover:text-white transition-colors" title="إعادة تعيين"
                >
                    <RotateCcw size={16} />
                </button>
                <button 
                  onClick={onRun}
                  disabled={isRunning}
                  className={`flex items-center gap-2 px-6 py-1.5 rounded-lg font-bold text-sm transition-all ${isRunning ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'}`}
                >
                    <Play size={16} fill="currentColor" />
                    <span>تشغيل</span>
                </button>
            </div>
        </div>
        <div className="flex-1 p-3 font-mono text-xs overflow-y-auto text-emerald-400/90 space-y-1">
            <div className="text-slate-500">root@mulaqqin:~/robot_v1$ python main.py</div>
            {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className="text-slate-600">{'>'}</span>
                    <span>{log}</span>
                </div>
            ))}
            {isRunning && <div className="animate-pulse">_</div>}
        </div>
      </div>
    </div>
  );
};

const BotIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>
    </svg>
);

export default CodeEditor;