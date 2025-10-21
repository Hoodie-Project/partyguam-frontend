/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable simple-import-sort/imports */
const { execSync } = require('child_process');

const os = require('os');
const platform = os.platform();

if (platform === 'win32') {
  console.log('Detected Windows. Running PowerShell script...');
  execSync('powershell -ExecutionPolicy Bypass -File ./start.ps1', { stdio: 'inherit' });
} else {
  console.log('Detected Unix-based OS. Running Bash script...');
  execSync('sh ./start.sh', { stdio: 'inherit' });
}
