/**
 * routes/compile.js — Code submission & execution route.
 *
 * POST /api/compile
 *
 * Uses LOCAL code execution for this prototype using child_process.
 * NOTE: Local execution is NOT secure for production! In production, this
 * should be routed to a containerised sandbox (like Judge0, Piston, or isolate).
 */

import express from 'express';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import Problem from '../models/Problem.js';

const router = express.Router();

/**
 * Execute code locally using installed compilers.
 *
 * @param {string} language   - "C", "C++", "Python", or "Java"
 * @param {string} sourceCode
 * @param {string} stdinStr
 * @param {number} timeLimitSeconds
 */
async function executeLocally(language, sourceCode, stdinStr, timeLimitSeconds) {
  const tmpDir = os.tmpdir();
  const id = crypto.randomBytes(8).toString('hex');
  const dirPath = path.join(tmpDir, `lms_exec_${id}`);
  await fs.mkdir(dirPath, { recursive: true });

  let stdout = '';
  let stderr = '';
  let compile_output = '';
  let code = 0;
  let signal = null;

  const runWithTimeout = (cmd, args, inputStr) => {
    return new Promise((resolve) => {
      const child = spawn(cmd, args, { cwd: dirPath, stdio: ['pipe', 'pipe', 'pipe'] });
      let out = '';
      let err = '';

      // Set timeout
      const timer = setTimeout(() => {
        child.kill('SIGKILL');
      }, timeLimitSeconds * 1000);

      if (inputStr) {
        child.stdin.write(inputStr);
      }
      child.stdin.end();

      child.stdout.on('data', (data) => { out += data.toString(); });
      child.stderr.on('data', (data) => { err += data.toString(); });

      child.on('error', (error) => {
        clearTimeout(timer);
        resolve({ code: 1, signal: null, stdout: out, stderr: err + `\nProcess execution failed: ${error.message}` });
      });

      child.on('close', (exitCode, exitSignal) => {
        clearTimeout(timer);
        resolve({ code: exitCode, signal: exitSignal, stdout: out, stderr: err });
      });
    });
  };

  try {
    if (language === 'Python') {
      const file = path.join(dirPath, 'main.py');
      await fs.writeFile(file, sourceCode);
      const res = await runWithTimeout('python3', [file], stdinStr);
      stdout = res.stdout;
      stderr = res.stderr;
      code = res.code;
      signal = res.signal;
    } else if (language === 'C') {
      const file = path.join(dirPath, 'main.c');
      const outExe = path.join(dirPath, 'a.out');
      await fs.writeFile(file, sourceCode);
      const compileRes = await runWithTimeout('clang', [file, '-o', outExe], '');
      if (compileRes.code !== 0) {
        compile_output = compileRes.stderr || compileRes.stdout;
        code = compileRes.code;
      } else {
        const runRes = await runWithTimeout(outExe, [], stdinStr);
        stdout = runRes.stdout;
        stderr = runRes.stderr;
        code = runRes.code;
        signal = runRes.signal;
      }
    } else if (language === 'C++') {
      const file = path.join(dirPath, 'main.cpp');
      const outExe = path.join(dirPath, 'a.out');
      await fs.writeFile(file, sourceCode);
      // Disable some warnings to keep output clean, enable basic C++
      const compileRes = await runWithTimeout('clang++', ['-std=c++17', file, '-o', outExe], '');
      if (compileRes.code !== 0) {
        compile_output = compileRes.stderr || compileRes.stdout;
        code = compileRes.code;
      } else {
        const runRes = await runWithTimeout(outExe, [], stdinStr);
        stdout = runRes.stdout;
        stderr = runRes.stderr;
        code = runRes.code;
        signal = runRes.signal;
      }
    } else if (language === 'Java') {
      const file = path.join(dirPath, 'Main.java');
      await fs.writeFile(file, sourceCode);
      
      const homebrewJavac = '/opt/homebrew/opt/openjdk/bin/javac';
      const homebrewJava = '/opt/homebrew/opt/openjdk/bin/java';
      let javacCmd = 'javac';
      let javaCmd = 'java';
      
      try {
        await fs.access(homebrewJavac);
        javacCmd = homebrewJavac;
        javaCmd = homebrewJava;
      } catch (e) {
        // Fallback to 'javac'/'java' in PATH
      }
      
      const compileRes = await runWithTimeout(javacCmd, [file], '');
      if (compileRes.code !== 0) {
        compile_output = compileRes.stderr || compileRes.stdout;
        code = compileRes.code;
      } else {
        const runRes = await runWithTimeout(javaCmd, ['-cp', dirPath, 'Main'], stdinStr);
        stdout = runRes.stdout;
        stderr = runRes.stderr;
        code = runRes.code;
        signal = runRes.signal;
      }
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
  } finally {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch(e) {}
  }

  return { stdout, stderr, compile_output, code, signal };
}

/**
 * Normalise output so "3\n" and "3" compare equal.
 */
function normaliseOutput(str) {
  return (str ?? '').trim().replace(/\r\n/g, '\n');
}

/**
 * Derive a human-readable verdict from execution results.
 */
function deriveVerdict(result) {
  if (result.compile_output && !result.stdout && !result.stderr) {
    return 'Compilation Error';
  }
  if (result.signal === 'SIGKILL' || result.signal === 'SIGTERM') {
    return 'Time Limit Exceeded';
  }
  if (result.code !== 0 && result.stderr) {
    return 'Runtime Error';
  }
  return null;
}

// ── POST /api/compile ─────────────────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { problemId, language, sourceCode, mode = 'submit' } = req.body;

    if (!problemId || !language || sourceCode === undefined) {
      return res.status(400).json({
        success: false,
        message: '`problemId`, `language`, and `sourceCode` are all required.',
      });
    }

    if (typeof sourceCode !== 'string' || sourceCode.length > 50_000) {
      return res.status(400).json({
        success: false,
        message: 'Source code must be a string with at most 50,000 characters.',
      });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: 'Problem not found.' });
    }

    if (!problem.allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: `Language "${language}" is not allowed for this problem.`,
      });
    }

    const testCases =
      mode === 'run'
        ? problem.testCases.filter((tc) => !tc.isHidden)
        : problem.testCases;

    const results = [];
    let overallVerdict = 'Accepted';

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      let execResult;
      try {
        execResult = await executeLocally(language, sourceCode, tc.input ?? '', problem.timeLimitSeconds);
      } catch (apiErr) {
        return res.status(502).json({
          success: false,
          message: apiErr.message,
        });
      }

      let verdict = deriveVerdict(execResult);
      if (!verdict) {
        verdict =
          normaliseOutput(execResult.stdout) === normaliseOutput(tc.expectedOutput)
            ? 'Accepted'
            : 'Wrong Answer';
      }

      if (verdict !== 'Accepted' && overallVerdict === 'Accepted') {
        overallVerdict = verdict;
      }

      results.push({
        testCaseIndex : i,
        isHidden      : tc.isHidden,
        verdict,
        input          : tc.isHidden ? null : tc.input,
        expectedOutput : tc.isHidden ? null : tc.expectedOutput,
        actualOutput   : execResult.stdout,
        stderr         : execResult.stderr,
        compileOutput  : execResult.compile_output,
      });
    }

    res.json({
      success        : true,
      overallVerdict,
      passedCount    : results.filter((r) => r.verdict === 'Accepted').length,
      totalCount     : results.length,
      results,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
