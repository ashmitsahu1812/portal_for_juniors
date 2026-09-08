import React, { useState } from 'react';
import { Play, CheckCircle2, Terminal, Code2, Clock, Cpu, Sparkles, RefreshCw, Layers } from 'lucide-react';

const SNIPPETS = {
  python: {
    lang: 'Python 3',
    code: `def find_target_pair(arr, target):
    # Hash map for O(n) optimal lookup
    seen = {}
    for i, num in enumerate(arr):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution with Judge sandbox
arr = [2, 7, 11, 15]
target = 9
print(find_target_pair(arr, target))`,
    output: `[0, 1]`,
    runtime: '8 ms',
    memory: '14.1 MB',
  },
  cpp: {
    lang: 'C++ 20',
    code: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) return {mp[complement], i};
        mp[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}`,
    output: `[0, 1]`,
    runtime: '2 ms',
    memory: '8.4 MB',
  },
  java: {
    lang: 'Java 17',
    code: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println(Arrays.toString(res));
    }
}`,
    output: `[0, 1]`,
    runtime: '14 ms',
    memory: '22.6 MB',
  },
};

export default function InteractiveJudgeDemo() {
  const [selectedLang, setSelectedLang] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [activeTab, setActiveTab] = useState('test1');

  const current = SNIPPETS[selectedLang];

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 750);
  };

  return (
    <div
      style={{
        background: '#0a0d14',
        border: '2px solid rgba(0, 133, 255, 0.4)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(0, 133, 255, 0.1)',
        overflow: 'hidden',
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Top Bar with Language Tabs & Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.25rem',
          background: '#101522',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '6px', marginRight: '0.5rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
          </div>

          {Object.entries(SNIPPETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLang(key);
                setHasRun(false);
              }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedLang === key ? '1px solid var(--accent-blue)' : '1px solid transparent',
                background: selectedLang === key ? 'rgba(0, 133, 255, 0.2)' : 'transparent',
                color: selectedLang === key ? '#00e5ff' : '#888',
                transition: 'all 0.15s ease',
              }}
            >
              {data.lang}
            </button>
          ))}
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '6px 14px',
            background: 'linear-gradient(135deg, #0085ff, #00e5ff)',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)',
            transition: 'transform 0.1s ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isRunning ? (
            <>
              <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
              COMPILING...
            </>
          ) : (
            <>
              <Play size={13} fill="#000" />
              RUN ONLINE JUDGE
            </>
          )}
        </button>
      </div>

      {/* Editor & Output Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0' }}>
        {/* Code Area */}
        <div
          style={{
            padding: '1.25rem',
            background: '#07090e',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.82rem',
            lineHeight: 1.6,
            color: '#cbd5e1',
            overflowX: 'auto',
            maxHeight: '260px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <pre style={{ margin: 0 }}>
            <code>{current.code}</code>
          </pre>
        </div>

        {/* Live Judge Output Box */}
        <div style={{ padding: '1rem 1.25rem', background: '#0e131f' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Online Sandbox Execution
            </span>

            {hasRun && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={12} /> {current.runtime}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Cpu size={12} /> {current.memory}
                </span>
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #10b981',
                  }}
                >
                  ACCEPTED (100%)
                </span>
              </div>
            )}
          </div>

          <div
            style={{
              background: '#06080d',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.78rem',
              color: hasRun ? '#10b981' : '#64748b',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {isRunning ? (
              <span style={{ color: '#00e5ff' }}>Executing in isolated Docker container...</span>
            ) : hasRun ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={16} color="#10b981" />
                  <span>Output: <strong>{current.output}</strong> — All 5 Hidden Cases Passed!</span>
                </div>
                <span style={{ color: '#00e5ff', fontSize: '0.7rem' }}>Verdict: Correct Answer</span>
              </>
            ) : (
              <span>Click "RUN ONLINE JUDGE" to test real-time code evaluation.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
