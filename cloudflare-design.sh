#!/bin/bash

# Cloudflare Tunnel for PJ-Design

echo "=========================================="
echo "PJ-Design - Cloudflare Tunnel"
echo "=========================================="
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Create logs directory
mkdir -p logs

PORT=3001

# Kill existing process on this port
echo "Cleaning up port $PORT..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 1

# Start development server
echo "Starting Design server on port $PORT..."
(cd pavel_jaros_design && PORT=$PORT bun run dev) &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 10

# Check if server is running
if ! lsof -ti:$PORT > /dev/null; then
    echo "ERROR: Server failed to start on port $PORT!"
    exit 1
fi

echo ""
echo "=========================================="
echo "Design server is running on port $PORT"
echo "Local: http://localhost:$PORT"
echo "=========================================="
echo ""
echo "Starting Cloudflare Tunnel..."
echo ""

# Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:$PORT

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null; lsof -ti:$PORT | xargs kill -9 2>/dev/null" EXIT
