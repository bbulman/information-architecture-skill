#!/usr/bin/env bash
# Installs the information architecture skills into Claude Code.
#
#   ./install.sh      installs into ~/.claude (set CLAUDE_DIR to install elsewhere)
#
# An existing skill with one of these names is kept as backups/<name>.<stamp>/,
# outside skills/ so the copy doesn't load as a second skill.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
STAMP="$(date +%Y%m%d-%H%M%S)"

echo "Installing the information architecture skills into $CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/skills"

count=0
for source in "$HERE"/skills/*/; do
  name="$(basename "$source")"
  target="$CLAUDE_DIR/skills/$name"
  if [ -e "$target" ]; then
    mkdir -p "$CLAUDE_DIR/backups"
    mv "$target" "$CLAUDE_DIR/backups/$name.$STAMP"
    echo "  kept the old $name as backups/$name.$STAMP"
  fi
  cp -R "$source" "$target"
  if ! grep -q "^name: $name\$" "$target/SKILL.md"; then
    echo "  $name: SKILL.md is missing or has the wrong name" >&2
    exit 1
  fi
  count=$((count + 1))
done
echo "  wrote $count skills, each with its SKILL.md in place"

echo
echo "Next: open a new Claude Code session, then describe the problem or run /information-architecture."
