const fetch = require('node-fetch');

async function test() {
  const sourceCode = `
import os
os.system("which clang")
os.system("which javac")
os.system("cat /etc/os-release")
print("Hello from Python")
`;

  const res = await fetch('https://portal-for-juniors.onrender.com/api/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      problemId: '66743bdf3785fc5d0458df2b', // Need a valid problem ID. Wait! If I don't have a valid ID, it will return 404!
      language: 'Python',
      sourceCode: sourceCode,
      mode: 'run'
    })
  });
  console.log(await res.json());
}
test();
