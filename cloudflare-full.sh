#!/bin/bash

# Complete script to start all servers and Cloudflare Tunnel

echo "=========================================="
echo "Pavel Jaroš - Cloudflare Tunnel Setup"
echo "=========================================="
echo ""

# Kill existing processes
echo "Cleaning up existing processes..."
lsof -ti:3001,3002,3003,3004,8000 | xargs kill -9 2>/dev/null || true
sleep 2

# Start all development servers
echo "Starting all development servers..."
cd pavel_jaros_design && PORT=3001 bun run dev > ../logs/design.log 2>&1 &
cd ../pavel_jaros_rekonstrukce && PORT=3002 bun run dev > ../logs/rekonstrukce.log 2>&1 &
cd ../pavel_jaros_reality && PORT=3003 bun run dev > ../logs/reality.log 2>&1 &
cd ../pavel_jaros_sprava && PORT=3004 bun run dev > ../logs/sprava.log 2>&1 &
cd ..

echo "Waiting for servers to start..."
sleep 10

# Start proxy server
echo "Starting proxy server on port 8000..."
bun proxy-server.ts > logs/proxy.log 2>&1 &
PROXY_PID=$!

sleep 3

echo ""
echo "=========================================="
echo "All servers are running!"
echo "=========================================="
echo "Local access: http://localhost:8000"
echo ""
echo "Starting Cloudflare Tunnel..."
echo "=========================================="
echo ""

# Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:8000

# Cleanup on exit
trap "kill $PROXY_PID; lsof -ti:3001,3002,3003,3004,8000 | xargs kill -9 2>/dev/null" EXIT
