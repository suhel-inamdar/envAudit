const fs = require('fs');
const path = require('path');

function needsQuoting(value) {
  return /\s|#|=|["']/.test(value);
}

function quote(value) {
  const escaped = value.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

function formatEnvFile({ inputFile, outputFile, fix = false, sort = false }) {
  try {
    const inputPath = path.resolve(process.cwd(), inputFile);
    if (!fs.existsSync(inputPath)) {
      console.error(`❌ File not found: ${inputFile}`);
      return;
    }

    const lines = fs.readFileSync(inputPath, 'utf-8').split(/\r?\n/);
    const seenKeys = new Set();
    const formattedLines = [];

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];

      const trimmed = line.trim();

      if (trimmed === '') {
        formattedLines.push(''); // preserve blank line
        continue;
      }

      if (trimmed.startsWith('#')) {
        formattedLines.push(line); // preserve full comment line
        continue;
      }

      const eqIndex = line.indexOf('=');
      if (eqIndex === -1) {
        console.warn(`⚠️ Line ${idx + 1} is malformed: ${line}`);
        continue;
      }

      let key = line.slice(0, eqIndex).trim();
      let value = line.slice(eqIndex + 1).trim();

      if (!key || key === '=' || key.includes(' ')) {
        console.warn(`⚠️ Invalid key at line ${idx + 1}: "${key}"`);
        continue;
      }

      if (seenKeys.has(key)) {
        console.warn(`⚠️ Duplicate key at line ${idx + 1}: "${key}" — skipping`);
        continue;
      }

      seenKeys.add(key);

      if (value === '') {
        // leave empty value as-is
      } else if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        // already quoted, leave as-is
      } else if (needsQuoting(value)) {
        value = quote(value);
      }

      formattedLines.push(`${key}=${value}`);
    }

    const finalLines = sort
      ? [...formattedLines].sort((a, b) => {
          // keep comments and empty lines in place
          if (a.startsWith('#') || a === '') return -1;
          if (b.startsWith('#') || b === '') return 1;
          return a.localeCompare(b);
        })
      : formattedLines;

    const output = finalLines.join('\n') + '\n';

    if (outputFile) {
      fs.writeFileSync(path.resolve(process.cwd(), outputFile), output, 'utf-8');
      console.log(`✅ Formatted .env saved to: ${outputFile}`);
    } else if (fix) {
      fs.writeFileSync(inputPath, output, 'utf-8');
      console.log(`✅ .env formatted and overwritten.`);
    } else {
      console.log('🧼 Formatted .env output:\n');
      console.log(output);
    }
  } catch (err) {
    console.error('[envAudit:format] Error:', err.message);
  }
}

module.exports = { formatEnvFile };
