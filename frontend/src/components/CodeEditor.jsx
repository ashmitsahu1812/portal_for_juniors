import { useState, useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { compileCode } from '../api/client';
import api from '../api/client';
import {
  Play, Send, ChevronDown, Terminal, CheckCircle, XCircle,
  AlertTriangle, Clock, Loader, RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Language config ─────────────────────────────────────────────────────── */
const LANGUAGE_CONFIG = {
  Python : { monacoId: 'python',  color: '#3572A5', label: 'Python 3'    },
  'C++'  : { monacoId: 'cpp',    color: '#f34b7d', label: 'C++ (GCC)'  },
  C      : { monacoId: 'c',      color: '#555555', label: 'C (GCC)'    },
  Java   : { monacoId: 'java',   color: '#b07219', label: 'Java 15'     },
};

/* ─── Verdict helpers ─────────────────────────────────────────────────────── */
const verdictMeta = {
  Accepted           : { cls: 'accepted', Icon: CheckCircle, text: 'Accepted' },
  'Wrong Answer'     : { cls: 'wrong',    Icon: XCircle,     text: 'Wrong Answer' },
  'Runtime Error'    : { cls: 'error',    Icon: AlertTriangle, text: 'Runtime Error' },
  'Compilation Error': { cls: 'error',    Icon: AlertTriangle, text: 'Compilation Error' },
  'Time Limit Exceeded': { cls: 'error',  Icon: Clock,        text: 'Time Limit Exceeded' },
};

/* ─────────────────────────────────────────────────────────────────────────────
   CodeEditor — Monaco + terminal console + verdict banner
───────────────────────────────────────────────────────────────────────────── */
export default function CodeEditor({ problem, onSuccess }) {
  const allowedLangs  = problem?.allowedLanguages ?? Object.keys(LANGUAGE_CONFIG);
  const [language, setLanguage]       = useState(allowedLangs[0] || 'Python');
  const [code, setCode]               = useState(
    problem?.starterCode?.[allowedLangs[0]] ?? DEFAULT_CODE[allowedLangs[0]] ?? ''
  );
  const [status, setStatus]           = useState('idle'); // idle | running | done | error
  const [verdict, setVerdict]         = useState(null);   // null | overallVerdict string
  const [consoleLines, setConsoleLines] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab]     = useState(0);
  const editorRef                     = useRef(null);
  const { refreshUser }               = useAuth();

  /* Language switch */
  const switchLanguage = (lang) => {
    setLanguage(lang);
    const starter = problem?.starterCode?.[lang] ?? DEFAULT_CODE[lang] ?? '';
    setCode(starter);
    setVerdict(null);
    setConsoleLines([]);
    setTestResults([]);
  };

  /* Append to console */
  const log = useCallback((text, type = 'default') => {
    setConsoleLines((prev) => [...prev, { text, type }]);
  }, []);

  /* Clear everything */
  const clearConsole = () => {
    setConsoleLines([]);
    setVerdict(null);
    setTestResults([]);
    setStatus('idle');
  };

  /* ── Run (visible test cases only) ──────────────────────────────────────── */
  const handleRun = async () => {
    if (!problem) return;
    setStatus('running');
    setVerdict(null);
    setConsoleLines([]);
    log(`▶  Running against sample test cases…`, 'info');

    try {
      const res = await compileCode({
        problemId: problem._id,
        language,
        sourceCode: code,
        mode: 'run',
      });

      setTestResults(res.results);
      log(`   ${res.passedCount}/${res.totalCount} sample test cases passed.`,
        res.overallVerdict === 'Accepted' ? 'accepted' : 'error');

      res.results.forEach((r, i) => {
        log(`\n── Test ${i + 1}: ${r.verdict}`, r.verdict === 'Accepted' ? 'accepted' : 'error');
        if (r.input !== null) log(`   Input    : ${r.input || '(empty)'}`, 'default');
        if (r.verdict !== 'Accepted' && r.expectedOutput !== null) {
          log(`   Expected : ${r.expectedOutput}`, 'warn');
          log(`   Got      : ${r.actualOutput || '(no output)'}`, 'error');
        }
        if (r.stderr) log(`   Stderr   : ${r.stderr}`, 'error');
        if (r.compileOutput) log(`   Compile  : ${r.compileOutput}`, 'error');
      });

      setVerdict(res.overallVerdict);
      setStatus('done');
    } catch (err) {
      log(`✖  Error: ${err.message}`, 'error');
      setStatus('error');
    }
  };

  /* ── Submit (all test cases) ─────────────────────────────────────────────── */
  const handleSubmit = async () => {
    if (!problem) return;
    setStatus('running');
    setVerdict(null);
    setConsoleLines([]);
    log(`⬆  Submitting to all test cases…`, 'info');

    try {
      const res = await compileCode({
        problemId: problem._id,
        language,
        sourceCode: code,
        mode: 'submit',
      });

      setTestResults(res.results);
      setVerdict(res.overallVerdict);

      const passed = res.passedCount;
      const total  = res.totalCount;
      log(`\n   Result: ${res.overallVerdict}`, res.overallVerdict === 'Accepted' ? 'accepted' : 'error');
      log(`   Score : ${passed}/${total} test cases passed.`,
        res.overallVerdict === 'Accepted' ? 'accepted' : 'warn');

      res.results.forEach((r, i) => {
        const hidden = r.isHidden ? '[hidden]' : `Test ${i + 1}`;
        log(`   ${hidden}: ${r.verdict}`, r.verdict === 'Accepted' ? 'accepted' : 'error');
      });

      setStatus('done');

      // Record progress if user is authenticated and submission is Accepted
      if (res.overallVerdict === 'Accepted') {
        if (onSuccess) onSuccess();
        try {
          await api.post('/progress/problem', {
            problemId: problem._id,
            verdict: res.overallVerdict,
          });
          if (refreshUser) refreshUser(); // Update the global progress context
        } catch (err) {
          console.error('Failed to update problem progress', err);
        }
      }
    } catch (err) {
      log(`✖  Error: ${err.message}`, 'error');
      setStatus('error');
    }
  };

  const isRunning  = status === 'running';
  const vm         = verdict ? verdictMeta[verdict] ?? verdictMeta['Runtime Error'] : null;
  const langCfg    = LANGUAGE_CONFIG[language] ?? {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className="arena-pane-header">
        {/* Language selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: langCfg.color ?? '#6382ff', flexShrink: 0,
          }} />
          <select
            className="select-styled"
            value={language}
            onChange={(e) => switchLanguage(e.target.value)}
          >
            {allowedLangs.map((l) => (
              <option key={l} value={l}>{LANGUAGE_CONFIG[l]?.label ?? l}</option>
            ))}
          </select>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-ghost btn-sm" onClick={clearConsole} title="Clear output">
            <RotateCcw size={14} />
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleRun}
            disabled={isRunning || !problem}
          >
            {isRunning ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Running</> : <><Play size={14} /> Run</>}
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={handleSubmit}
            disabled={isRunning || !problem}
          >
            {isRunning ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Judging</> : <><Send size={14} /> Submit</>}
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={langCfg.monacoId ?? 'plaintext'}
          value={code}
          onChange={(val) => {
            setCode(val ?? '');
            if (problem && problem.isBattle) {
              // Custom battle logic could be passed, but we'll let BattleArena handle socket typing via a wrapper or we don't strictly need real-time typing events yet, just compiling status.
            }
          }}
          onMount={(editor) => { editorRef.current = editor; }}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            renderLineHighlight: 'line',
            cursorBlinking: 'smooth',
            smoothScrolling: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* ── Verdict Banner ────────────────────────────────────────────────── */}
      <div style={{ minHeight: '80px', padding: '0 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        {verdict && vm && (
          <div className={`verdict-banner ${vm.cls}`} style={{ margin: '0.5rem 0' }}>
            <vm.Icon size={18} />
            <span>{vm.text}</span>
            {testResults.length > 0 && (
              <span style={{ marginLeft: 'auto', fontSize: '0.82rem', fontWeight: 500 }}>
                {testResults.filter(r => r.verdict === 'Accepted').length}/{testResults.length} passed
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Console Output ────────────────────────────────────────────────── */}
      <div style={{ padding: '0 1rem 1rem', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.75rem',
        }}>
          <Terminal size={12} />
          <span>OUTPUT CONSOLE</span>
        </div>
        <div className="console-box" style={{ height: '220px', minHeight: '220px', maxHeight: '220px' }}>
          {consoleLines.length === 0 ? (
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Run or submit your code to see output here…
            </span>
          ) : (
            consoleLines.map((line, i) => (
              <div key={i} className={
                line.type === 'accepted' ? 'line-accepted'
                  : line.type === 'error' ? 'line-error'
                  : line.type === 'warn'  ? 'line-warn'
                  : line.type === 'info'  ? 'line-info'
                  : ''
              }>
                {line.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Default starter code templates ────────────────────────────────────────── */
const DEFAULT_CODE = {
  Python: `# Write your solution here
`,
  'C++': `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Write your solution here
    
    return 0;
}
`,
  C: `#include <stdio.h>

int main() {
    // Write your solution here
    
    return 0;
}
`,
  Java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Write your solution here
    }
}
`,
};
