#!/usr/bin/env node

const path = require('path');
const { scanProjectForEnvUsage } = require('../src/scanner');
const { formatEnvFile } = require('../src/format');

const args = process.argv.slice(2);

const command = args[0]; // e.g., "format" or undefined

if (command === 'format') {
  const inputFile = args[1] || '.env'; // default file
  const options = {
    inputFile,
    fix: args.includes('--fix'),
    sort: args.includes('--sort'),
  };

  // Check for --output <filename>
  const outputIndex = args.indexOf('--output');
  if (outputIndex !== -1 && args[outputIndex + 1]) {
    options.outputFile = args[outputIndex + 1];
  }

  formatEnvFile(options);
  process.exit(0); // Exit after format
}

// Default behavior: run scanner
let envFile = '.env';
args.forEach((arg) => {
  if (arg.startsWith('--env-file=')) {
    envFile = arg.split('=')[1];
  }
});

(async () => {
  const targetDir = process.cwd();
  console.log(`🔍 Running envAudit on: ${targetDir}`);
  console.log(`📄 Using env file: ${envFile}\n`);

  try {
    await scanProjectForEnvUsage(targetDir, envFile);
  } catch (err) {
    console.error('[envAudit] Unexpected error:', err.message);
  }
})();
