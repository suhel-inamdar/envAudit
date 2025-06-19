#!/usr/bin/env node

const path = require('path');
const { scanProjectForEnvUsage } = require('../src/scanner');

// Parse CLI args
const args = process.argv.slice(2);
let envFile = '.env'; // default

args.forEach((arg) => {
  if (arg.startsWith('--env-file=')) {
    envFile = arg.split('=')[1];
  }
});

(async () => {
  const targetDir = process.cwd(); // directory where the CLI is run
  console.log(`🔍 Running envAudit on: ${targetDir}`);
  console.log(`📄 Using env file: ${envFile}\n`);

  try {
    await scanProjectForEnvUsage(targetDir, envFile);
  } catch (err) {
    console.error('[envAudit] Unexpected error:', err.message);
  }
})();
