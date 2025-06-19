const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const dotenv = require('dotenv');

const envRegex = /process\.env(?:\.([a-zA-Z_][a-zA-Z0-9_]*)|\[\s*['"]([a-zA-Z_][a-zA-Z0-9_]*)['"]\s*\])/g;

function extractEnvKeysFromCode(content) {
  const found = new Set();
  let match;
  while ((match = envRegex.exec(content)) !== null) {
    const key = match[1] || match[2];
    if (key) found.add(key);
  }
  return found;
}

function extractEnvKeysFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return extractEnvKeysFromCode(content);
  } catch {
    return new Set();
  }
}

function loadDotEnvKeys(envPath) {
  if (!fs.existsSync(envPath)) return new Set();
  const parsed = dotenv.parse(fs.readFileSync(envPath));
  return new Set(Object.keys(parsed));
}

async function scanProjectForEnvUsage(targetDir, envFileName = '.env') {
  const files = await fg(['*.js', '**/*.js', '*.ts', '**/*.ts'], {
    cwd: targetDir,
    ignore: ['node_modules', 'dist', 'build', '.git'],
    absolute: true,
  });

  const usedEnvKeys = new Set();
  for (const file of files) {
    const fileKeys = extractEnvKeysFromFile(file);
    fileKeys.forEach((k) => usedEnvKeys.add(k));
  }

  const envPath = path.join(targetDir, envFileName);
  const definedEnvKeys = loadDotEnvKeys(envPath);

  console.log(`🔍 Scanned ${envFileName} keys: ${[...definedEnvKeys].join(', ') || 'None'}\n`);

  // Warn for keys used in code but not in env file
  for (const key of usedEnvKeys) {
    if (!definedEnvKeys.has(key)) {
      console.warn(`⚠️  [envAudit] ${key} → Used in code ✅ but Missing in ${envFileName} ❌`);
    }
  }

  // Info for keys present in env file but not used
  for (const key of definedEnvKeys) {
    if (!usedEnvKeys.has(key)) {
      console.info(`ℹ️  [envAudit] ${key} → Present in ${envFileName} ✅ but Unused in code ❌`);
    }
  }

  console.log(`\n✅ Scan complete: ${files.length} files checked.`);
}

module.exports = {
  scanProjectForEnvUsage,
};
