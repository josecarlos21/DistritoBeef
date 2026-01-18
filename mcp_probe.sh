#!/usr/bin/env bash
set -euo pipefail

# mcp_probe.sh — quick MCP sanity check for Codex CLI
# Usage: ./mcp_probe.sh

echo "== codex version =="
codex --version || true
echo

echo "== codex mcp resources =="
# In Codex interactive, /mcp list is typical; this tries non-interactive best-effort.
# If it fails, open codex and run: /mcp
codex /mcp 2>/dev/null || echo "(Run inside Codex: /mcp)"
