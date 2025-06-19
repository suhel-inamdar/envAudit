# 🛡️ envlens

> Lightweight CLI tool to detect missing or unused environment variables in your Node.js projects.

---

## 📦 Why use envlens?

Environment variables are critical for configuration, but it's easy to:

- ❌ Forget to define a variable in `.env` that's used in code
- ❌ Leave unused or outdated keys in `.env` files
- 🚫 Accidentally deploy with incomplete env configs

**`envlens`** helps you audit these issues **without breaking your project**.

---

## 🚀 Features

- ✅ Scans `.js` and `.ts` files recursively
- ✅ Detects all `process.env.*` and `process.env['...']` usages
- ✅ Compares against the `.env` file
- ✅ Warns about:
  - Missing in `.env` but used in code
  - Present in `.env` but not used in code
- ✅ CLI flag to scan custom `.env` files
- ✅ Blazing fast — handles large projects in seconds
- 🪶 Zero dependencies (no chalk, no yargs)

---

## 🛠️ Installation

```bash
npm install -g envlens

Then run it from anywhere:
envlens


🔍 **Usage**

**Default: scan** .env
npx envlens

**Custom** .env **file**
npx envlens --env-file=.env.production
npx envlens --env-file=.env.staging
npx envlens --env-file=.env.local

📘 **Example Output**
🔍 Scanned .env keys: DB_HOST, SECRET_KEY

⚠️  [envlens] DB_USER → Used in code ✅ but Missing in .env ❌
ℹ️  [envlens] SECRET_KEY → Present in .env ✅ but Unused in code ❌

✅ Scan complete: 15 files checked.


🤝 **Contributing**
Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a PR.
