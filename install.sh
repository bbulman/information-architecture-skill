#!/usr/bin/env bash
# Installs the information-architecture skill into Claude Code.
#
#   ./install.sh      installs into ~/.claude (set CLAUDE_DIR to install elsewhere)
#
# An existing skill of this name is kept as backups/information-architecture.<stamp>/,
# outside skills/ so the copy doesn't load as a second skill.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_DIR="${CLAUDE_DIR:-$HOME/.claude}"
STAMP="$(date +%Y%m%d-%H%M%S)"
TARGET="$CLAUDE_DIR/skills/information-architecture"

echo "Installing the information-architecture skill into $CLAUDE_DIR"
mkdir -p "$CLAUDE_DIR/skills"
if [ -e "$TARGET" ]; then
  mkdir -p "$CLAUDE_DIR/backups"
  mv "$TARGET" "$CLAUDE_DIR/backups/information-architecture.$STAMP"
  echo "  kept the old skill as backups/information-architecture.$STAMP"
fi
cp -R "$HERE/skills/information-architecture" "$TARGET"
echo "  wrote skills/information-architecture/"

echo "Checking"
if grep -q '^name: information-architecture$' "$TARGET/SKILL.md"; then
  echo "  SKILL.md is in place"
else
  echo "  SKILL.md is missing or has the wrong name" >&2
  exit 1
fi

echo
echo "Next: open a new Claude Code session, then describe the problem or run /information-architecture."
