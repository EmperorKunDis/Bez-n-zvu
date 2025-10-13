#!/bin/bash

# Script to serve all 4 websites locally and expose via Cloudflare Tunnel

set -e

echo "Building all websites..."
./build-all.sh

echo ""
echo "Starting local server on port 8080..."
echo ""

# Start simple HTTP server in the dist directory
cd dist

echo "====================================================="
echo "Local server running at: http://localhost:8080"
echo ""
echo "To expose via Cloudflare Tunnel, run in another terminal:"
echo "cloudflared tunnel --url http://localhost:8080"
echo "====================================================="
echo ""

# Start Python HTTP server (Python 3)
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m http.server 8080
else
    echo "Python not found. Please install Python to run the server."
    exit 1
fi
