#!/usr/bin/env bash
set -euo pipefail

# Compact repo explorer to reduce token usage in MCP runs.
# Usage: ./context_scan.sh [root=.]

root="${1:-.}"
cd "$root"

echo "== meta =="
node - <<'NODE'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log(JSON.stringify({
  name: pkg.name,
  version: pkg.version,
  scripts: pkg.scripts,
  dependencies: Object.keys(pkg.dependencies || []),
  devDependencies: Object.keys(pkg.devDependencies || [])
}, null, 2));
NODE

echo
echo "== tree (depth 2, skipping heavy dirs) =="
find . \( -path './node_modules' -o -path './dist' -o -path './.git' \) -prune -o -maxdepth 2 -type f -print | sed 's|^\./||' | sort

echo
echo "== TypeScript files =="
rg --files -g'*.ts' -g'*.tsx' components src || true

echo
echo "== test files =="
rg --files -g'*test*' components src test || true

echo
echo "== configs =="
rg --files -g'*.json' -g'*.cjs' -g'*.ts' --max-depth 1 . || true
