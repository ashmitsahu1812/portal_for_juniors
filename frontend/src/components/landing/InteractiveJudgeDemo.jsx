import React, { useState } from 'react';
import { Play, CheckCircle2, Clock, Cpu, RefreshCw } from 'lucide-react';

const SNIPPETS = {
  python: {
    lang: 'Python',
    code: `def find_target_pair(arr, target):
    # Hash map for O(n) optimal lookup
    seen = {}
    for i, num in enumerate(arr):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Executing test in sandboxed judge
arr = [2, 7, 11, 15]
target = 9
print(find_target_pair(arr, target))`,
    output: `[0, 1]`,
    runtime: '8 ms',
    memory: '14.1 MB',
  },
  cpp: {
    lang: 'C++',
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
    lang: 'Java',
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

  const current = SNIPPETS[selectedLang];

  const handleRun = () => {
    setIsRunning(true);
    setHasRun(false);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 600);
  };

  return (
    <div
      style={{
        background: '#0d0d0d',
        border: '3px solid #0085ff',
        boxShadow: '6px 6px 0px 0px #0085ff',
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
          padding: '0.65rem 1rem',
          background: '#000000',
          borderBottom: '2px solid #222222',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {Object.entries(SNIPPETS).map(([key, data]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLang(key);
                setHasRun(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: selectedLang === key ? '2px solid #0085ff' : '2px solid #222',
                background: selectedLang === key ? '#0085ff' : '#141414',
                color: '#ffffff',
                fontFamily: "'Space Grotesk', sans-serif",
                transition: 'all 0.1s ease',
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
            padding: '5px 12px',
            background: '#0085ff',
            border: '2px solid #000000',
            boxShadow: '2px 2px 0px 0px #000000',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {isRunning ? (
            <>
              <RefreshCw size={13} style={{ animation: 'spin 0.8s linear infinite' }} />
              COMPILING...
            </>
          ) : (
            <>
              <Play size={13} fill="#fff" />
              RUN ONLINE JUDGE
            </>
          )}
        </button>
      </div>

      {/* Code Editor Preview */}
      <div
        style={{
          padding: '1rem',
          background: '#050505',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
          lineHeight: 1.6,
          color: '#e2e8f0',
          overflowX: 'auto',
          maxHeight: '250px',
          borderBottom: '2px solid #222222',
        }}
      >
        <pre style={{ margin: 0 }}>
          <code>{current.code}</code>
        </pre>
      </div>

      {/* Output Console Box */}
      <div style={{ padding: '0.85rem 1rem', background: '#0d0d0d' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#888888', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Verdict Console
          </span>

          {hasRun && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#a0a0a0' }}>
                <Clock size={11} /> {current.runtime}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#a0a0a0' }}>
                <Cpu size={11} /> {current.memory}
              </span>
              <span
                style={{
                  background: '#0085ff',
                  color: '#ffffff',
                  padding: '1px 6px',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  border: '1px solid #000',
                }}
              >
                ACCEPTED
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            background: '#000000',
            border: '2px solid #222222',
            padding: '0.6rem 0.85rem',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.78rem',
            color: hasRun ? '#0085ff' : '#666666',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isRunning ? (
            <span style={{ color: '#0085ff' }}>Executing against hidden test cases...</span>
          ) : hasRun ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={15} color="#0085ff" />
                <span>Output: <strong style={{ color: '#fff' }}>{current.output}</strong> (All 5/5 cases passed)</span>
              </div>
              <span style={{ color: '#0085ff', fontWeight: 700, fontSize: '0.7rem' }}>Verdict: Correct</span>
            </>
          ) : (
            <span>Click "RUN ONLINE JUDGE" to simulate execution.</span>
          )}
        </div>
      </div>
    </div>
  );
}
