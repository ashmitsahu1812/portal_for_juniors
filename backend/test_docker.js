const { spawnSync } = require('child_process');
const fs = require('fs');

const cppCode = `
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
fs.writeFileSync('test.cpp', cppCode);
const comp = spawnSync('clang++', ['-std=c++17', 'test.cpp', '-o', 'test_out']);
console.log('Compile code:', comp.status, 'stderr:', comp.stderr.toString());

const run = spawnSync('./test_out', [], { input: '3 7' });
console.log('Run code:', run.status, 'stdout:', run.stdout.toString(), 'stderr:', run.stderr.toString());
