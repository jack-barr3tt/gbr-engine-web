#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSION="gbr-dev"

for cmd in tmux atlas air go node npm; do
  command -v "$cmd" &>/dev/null || { echo "ERROR: $cmd not found." >&2; exit 1; }
done
[[ -f "$REPO_ROOT/gbr-engine/.env" ]] || { echo "ERROR: gbr-engine/.env not found." >&2; exit 1; }

if tmux has-session -t "$SESSION" 2>/dev/null; then
  exec tmux attach-session -t "$SESSION"
fi

"$REPO_ROOT/gbr-engine/dev.sh" --no-attach

tmux new-window -t "$SESSION" -n web
tmux send-keys -t "$SESSION:web" "cd \"$REPO_ROOT\" && npm run dev" Enter

echo "Session $SESSION (web + backend). Attaching..."
exec tmux attach-session -t "$SESSION"
