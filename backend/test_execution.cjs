const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

async function executeLocally(language, sourceCode, stdinStr, timeLimitSeconds) {
  const tmpDir = os.tmpdir();
  const id = crypto.randomBytes(8).toString('hex');
  const dirPath = path.join(tmpDir, `lms_exec_${id}`);
  await fs.mkdir(dirPath, { recursive: true });

  const runWithTimeout = (cmd, args, inputStr) => {
    return new Promise((resolve) => {
      const child = spawn(cmd, args, { cwd: dirPath, stdio: ['pipe', 'pipe', 'pipe'] });
      let out = '';
      let err = '';

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
        resolve({ code: 1, signal: null, stdout: out, stderr: err + `\nError: ${error.message}` });
      });

      child.on('close', (exitCode, exitSignal) => {
        clearTimeout(timer);
        resolve({ code: exitCode, signal: exitSignal, stdout: out, stderr: err });
      });
    });
  };

  try {
    const file = path.join(dirPath, 'main.cpp');
    const outExe = path.join(dirPath, 'a.out');
    await fs.writeFile(file, sourceCode);
    const compileRes = await runWithTimeout('clang++', ['-std=c++17', file, '-o', outExe], '');
    console.log('Compile:', compileRes);
    if (compileRes.code === 0) {
      const runRes = await runWithTimeout(outExe, [], stdinStr);
      console.log('Run:', runRes);
    }
  } finally {
    await fs.rm(dirPath, { recursive: true, force: true });
  }
}

const code = `
#include <iostream>
using namespace std;
int main() {
    long long A, B;
    if (cin >> A >> B) {
        cout << A + B << "\\n";
    }
    return 0;
}
`;
executeLocally('C++', code, '3 7', 2);
