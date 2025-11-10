#!/bin/bash

# Stop all Cloudflare Tunnels and development servers

echo "=========================================="
echo "Stopping all Cloudflare Tunnels..."
echo "=========================================="
echo ""

# Kill all cloudflared processes
echo "Stopping Cloudflare Tunnels..."
pkill -f cloudflared 2>/dev/null && echo "✓ Cloudflare Tunnels stopped" || echo "✗ No Cloudflare Tunnels running"

# Kill all development servers
echo "Stopping development servers..."
lsof -ti:3001,3002,3003,3004 | xargs kill -9 2>/dev/null && echo "✓ Development servers stopped" || echo "✗ No development servers running"

echo ""
echo "=========================================="
echo "All processes stopped!"
echo "=========================================="
