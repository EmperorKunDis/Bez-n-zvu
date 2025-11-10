#!/bin/bash

# Start all 4 Cloudflare Tunnels in separate terminal windows

echo "=========================================="
echo "Pavel Jaroš - 4x Cloudflare Tunnel"
echo "=========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Clean up any existing processes
echo "Cleaning up existing processes..."
lsof -ti:3001,3002,3003,3004 | xargs kill -9 2>/dev/null || true
pkill -f cloudflared 2>/dev/null || true
sleep 2

echo ""
echo "Opening 4 terminal windows..."
echo "Each will run its own Cloudflare Tunnel"
echo ""

# Open Design terminal
osascript <<EOF
tell application "Terminal"
    do script "cd '$SCRIPT_DIR' && ./cloudflare-design.sh"
    set custom title of front window to "PJ-Design Cloudflare Tunnel"
end tell
EOF

sleep 2

# Open Reality terminal
osascript <<EOF
tell application "Terminal"
    do script "cd '$SCRIPT_DIR' && ./cloudflare-reality.sh"
    set custom title of front window to "PJ-Reality Cloudflare Tunnel"
end tell
EOF

sleep 2

# Open Rekonstrukce terminal
osascript <<EOF
tell application "Terminal"
    do script "cd '$SCRIPT_DIR' && ./cloudflare-rekonstrukce.sh"
    set custom title of front window to "PJ-Rekonstrukce Cloudflare Tunnel"
end tell
EOF

sleep 2

# Open Správa terminal
osascript <<EOF
tell application "Terminal"
    do script "cd '$SCRIPT_DIR' && ./cloudflare-sprava.sh"
    set custom title of front window to "PJ-Správa Cloudflare Tunnel"
end tell
EOF

echo ""
echo "=========================================="
echo "4 terminals opened!"
echo "=========================================="
echo ""
echo "Each terminal shows:"
echo "  - Server logs"
echo "  - Cloudflare Tunnel URL"
echo ""
echo "To stop all tunnels, run: ./stop-all.sh"
echo "Or press Ctrl+C in each terminal window"
echo "=========================================="
