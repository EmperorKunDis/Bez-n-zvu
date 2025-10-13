#!/bin/bash

# Script to build, serve, and share all 4 websites via Cloudflare Tunnel

set -e

echo "=========================================="
echo "Pavel Jaroš - Multi-site Cloudflare Share"
echo "=========================================="
echo ""

# Build all websites
echo "Step 1/3: Building all websites..."
./build-all.sh

echo ""
echo "Step 2/3: Starting local server on port 8080..."

# Start server in background
cd dist
python3 -m http.server 8080 &
SERVER_PID=$!
cd ..

# Wait for server to start
sleep 2

echo ""
echo "Step 3/3: Creating Cloudflare Tunnel..."
echo ""
echo "=========================================="
echo "Cloudflare Tunnel is starting..."
echo "Your websites will be accessible via the URL below:"
echo "=========================================="
echo ""

# Start Cloudflare Tunnel
cloudflared tunnel --url http://localhost:8080

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null" EXIT
