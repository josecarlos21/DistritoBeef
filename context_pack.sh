#!/usr/bin/env bash
set -euo pipefail

# context_pack.sh — Compact repo context pack for Codex/LLM
# Usage:
#   chmod +x context_pack.sh
#   ./context_pack.sh [root=.]
#
# Output:
#   context_pack.md (single paste-friendly file)

root="${1:-.}"
cd "$root"

OUT="context_pack.md"
: > "$OUT"

has() { command -v "$1" >/dev/null 2>&1; }

section() {
  printf "\n## %s\n\n" "$1" >> "$OUT"
}

codeblock() {
  printf "```%s\n" "${1:-text}" >> "$OUT"
  cat >> "$OUT"
  printf "\n```\n\n" >> "$OUT"
}

head_block() {
  local f="$1" n="${2:-160}"
  [[ -f "$f" ]] || return 0
  printf "### %s (head %s)\n\n" "$f" "$n" >> "$OUT"
  { sed -n "1,${n}p" "$f" || true; } | codeblock
}

rg_files() {
  local glob1="$1" glob2="${2:-}"
  if has rg; then
    if [[ -n "$glob2" ]]; then
      rg --files -g"$glob1" -g"$glob2" 2>/dev/null || true
    else
      rg --files -g"$glob1" 2>/dev/null || true
    fi
  else
    # fallback find
    if [[ -n "$glob2" ]]; then
      find . -type f \( -name "${glob1#\*}" -o -name "${glob2#\*}" \) 2>/dev/null | sed 's|^\./||' || true
    else
      find . -type f -name "${glob1#\*}" 2>/dev/null | sed 's|^\./||' || true
    fi
  fi
}

rg_grep() {
  local pattern="$1"
  if has rg; then
    rg -n "$pattern" components src functions App.tsx index.tsx 2>/dev/null | head -n 120 || true
  else
    grep -RIn -- "$pattern" components src functions App.tsx index.tsx 2>/dev/null | head -n 120 || true
  fi
}

# Header
printf "# Context Pack — %s\n\n" "$(basename "$PWD")" >> "$OUT"
printf "Generated: %s\n\n" "$(date -Is)" >> "$OUT"

# Repo meta
section "Repo Meta"
if [[ -f package.json ]] && has node; then
  node - <<'NODE' | codeblock json
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const out = {
  name: pkg.name,
  version: pkg.version,
  private: pkg.private,
  type: pkg.type,
  scripts: pkg.scripts || {},
  dependencies: Object.keys(pkg.dependencies || {}).sort(),
  devDependencies: Object.keys(pkg.devDependencies || {}).sort()
};
console.log(JSON.stringify(out, null, 2));
NODE
else
  printf "_No package.json or node missing_\n\n" >> "$OUT"
fi

# Tree (depth 2, skip heavy)
section "Tree (depth 2, skipping heavy)"
find . \
  \( -path './node_modules' -o -path './dist' -o -path './.git' -o -path './.wrangler' \) -prune -o \
  -maxdepth 2 -print \
| sed 's|^\./||' | sort | codeblock text

# Entrypoints & configs
section "Key Entrypoints / Config (snippets)"
head_block "README.md" 140
head_block "App.tsx" 220
head_block "index.tsx" 220
head_block "vite.config.ts" 220
head_block "tsconfig.json" 220
head_block ".eslintrc.cjs" 220
head_block "vitest.config.ts" 220
head_block "deploy_cloudflare.sh" 220

# Inventory
section "Source Inventory"
printf "### TS/TSX files\n\n" >> "$OUT"
rg_files "*.ts" "*.tsx" | sed 's|^\./||' | sort | codeblock text

printf "### Test-ish files\n\n" >> "$OUT"
if has rg; then
  rg --files -g'*test*' components src test 2>/dev/null | sed 's|^\./||' | sort | codeblock text
else
  find components src test -type f -name '*test*' 2>/dev/null | sed 's|^\./||' | sort | codeblock text
fi

# Architecture signals
section "Architecture Signals (grep summaries)"
printf "### Router / Navigation\n\n" >> "$OUT"
rg_grep "react-router|createBrowserRouter|BrowserRouter|Routes|Route|navigate\\(|useNavigate|NavLink" | codeblock text

printf "### State mgmt\n\n" >> "$OUT"
rg_grep "zustand|redux|useAppStore|create\\(|persist\\(|middleware" | codeblock text

printf "### Data / services\n\n" >> "$OUT"
rg_grep "fetch\\(|axios|datasetProvider|service|provider|supabase|firebase" | codeblock text

printf "### PWA / offline\n\n" >> "$OUT"
rg_grep "serviceWorker|workbox|vite-plugin-pwa|manifest|offline|cache|indexeddb|localStorage" | codeblock text

printf "### i18n / locale\n\n" >> "$OUT"
rg_grep "i18n|locale|Language|Intl|es-MX|mx" | codeblock text

printf "### Auth\n\n" >> "$OUT"
rg_grep "auth|token|login|logout|session|jwt|oauth" | codeblock text

# Focus area snippets (high-signal)
section "Focus Areas (snippets)"
head_block "src/context/DatasetContext.tsx" 260
head_block "src/context/AuthContext.tsx" 260
head_block "src/context/LocaleContext.tsx" 260
head_block "src/services/datasetProvider.ts" 260
head_block "src/store/useAppStore.ts" 280
head_block "src/lib/governance.ts" 280
head_block "components/organisms/Navigation.tsx" 260
head_block "components/organisms/AgendaView.tsx" 260
head_block "components/views/HomeView.tsx" 220
head_block "components/views/ExploreView.tsx" 220
head_block "components/views/MapView.tsx" 220

# Commands
section "Commands"
if [[ -f package.json ]] && has node; then
  node - <<'NODE' | codeblock text
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
for (const k of ["dev","build","preview","lint","test","typecheck","format"]) {
  if (pkg.scripts && pkg.scripts[k]) console.log(`npm run ${k}  # ${pkg.scripts[k]}`);
}
NODE
fi

echo "✅ Wrote: $OUT"
