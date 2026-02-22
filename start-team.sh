#!/bin/bash

SESSION="merchant-portal"
PROJECT_DIR="$HOME/work/code/merchant-portal"

# Kill any existing session
tmux kill-session -t $SESSION 2>/dev/null
sleep 1

# Start fresh tmux session
# Window 1 = "Team", Window 2 = "QA", Window 3 = "Monitor"
tmux new-session -d -s $SESSION -n "Team" -x 220 -y 55

# ── Build the 4-pane layout ──
# After new-session: 1 pane exists → 1.1
# split-window -h splits current pane horizontally → adds 1.2
tmux split-window -h -t $SESSION:1

# Select left pane (1.1), split vertically → adds 1.3
tmux select-pane -t $SESSION:1.1
tmux split-window -v -t $SESSION:1.1

# Select top-right pane (1.2), split vertically → adds 1.4
tmux select-pane -t $SESSION:1.2
tmux split-window -v -t $SESSION:1.2

# Final layout:
# ┌─────────────┬─────────────┐
# │   1.1 LEAD  │  1.2 ARCH   │
# ├─────────────┼─────────────┤
# │  1.3 BACK   │  1.4 FRONT  │
# └─────────────┴─────────────┘

# Set pane titles
tmux select-pane -t $SESSION:1.1 -T "LEAD"
tmux select-pane -t $SESSION:1.2 -T "ARCHITECT"
tmux select-pane -t $SESSION:1.3 -T "BACKEND-DEV"
tmux select-pane -t $SESSION:1.4 -T "FRONTEND-DEV"

# ── QA window (window 2) ──
tmux new-window -t $SESSION -n "QA"
tmux select-pane -t $SESSION:2.1 -T "QA"

# ── Monitor window (window 3) ──
tmux new-window -t $SESSION -n "Monitor"
tmux split-window -h -t $SESSION:3.1
tmux select-pane -t $SESSION:3.1 -T "Git Log"
tmux select-pane -t $SESSION:3.2 -T "DB Monitor"

# ── Send commands to each pane ──
tmux select-window -t $SESSION:1

# LEAD — launches claude
tmux select-pane -t $SESSION:1.1
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== LEAD ===' && claude" Enter

# ARCHITECT
tmux select-pane -t $SESSION:1.2
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== ARCHITECT (waiting for Lead to spawn) ==='" Enter

# BACKEND-DEV
tmux select-pane -t $SESSION:1.3
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== BACKEND-DEV (waiting for Lead to spawn) ==='" Enter

# FRONTEND-DEV
tmux select-pane -t $SESSION:1.4
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== FRONTEND-DEV (waiting for Lead to spawn) ==='" Enter

# QA
tmux select-window -t $SESSION:2
tmux select-pane -t $SESSION:2.1
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== QA (waiting for Backend signal) ==='" Enter

# Monitor
tmux select-window -t $SESSION:3
tmux select-pane -t $SESSION:3.1
tmux send-keys "cd $PROJECT_DIR && clear && watch -n 3 'git log --oneline -15 2>/dev/null || echo no commits yet'" Enter
tmux select-pane -t $SESSION:3.2
tmux send-keys "cd $PROJECT_DIR && clear && echo '=== DB Monitor ===' && echo 'run: psql \$DATABASE_URL'" Enter

# Return focus to LEAD
tmux select-window -t $SESSION:1
tmux select-pane -t $SESSION:1.1

echo ""
echo "✅ Session ready — attaching now"
echo ""
echo "Controls:"
echo "  mouse click        → focus any pane"
echo "  Ctrl+b + arrow     → move between panes"  
echo "  Ctrl+b + 1         → Team tab"
echo "  Ctrl+b + 2         → QA tab"
echo "  Ctrl+b + 3         → Monitor tab"
echo "  Ctrl+b + z         → zoom pane fullscreen"
echo "  Ctrl+b + d         → detach (keeps running)"
echo "  Ctrl+b + q         → show pane numbers"
echo ""

tmux attach-session -t $SESSION
