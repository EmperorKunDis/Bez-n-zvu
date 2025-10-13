#!/bin/bash

# Start all 4 development servers on different ports

echo "=========================================="
echo "Starting all 4 websites..."
echo "=========================================="
echo ""

# Kill any existing processes on these ports
echo "Cleaning up existing processes..."
lsof -ti:3001,3002,3003,3004 | xargs kill -9 2>/dev/null || true
sleep 2

# Start each server in background
echo "Starting Design on port 3001..."
cd pavel_jaros_design && PORT=3001 bun run dev > /dev/null 2>&1 &
DESIGN_PID=$!

echo "Starting Rekonstrukce on port 3002..."
cd ../pavel_jaros_rekonstrukce && PORT=3002 bun run dev > /dev/null 2>&1 &
REKO_PID=$!

echo "Starting Reality on port 3003..."
cd ../pavel_jaros_reality && PORT=3003 bun run dev > /dev/null 2>&1 &
REALITY_PID=$!

echo "Starting Správa on port 3004..."
cd ../pavel_jaros_sprava && PORT=3004 bun run dev > /dev/null 2>&1 &
SPRAVA_PID=$!

cd ..

echo ""
echo "=========================================="
echo "All servers started!"
echo "=========================================="
echo "Design:        http://localhost:3001"
echo "Rekonstrukce:  http://localhost:3002"
echo "Reality:       http://localhost:3003"
echo "Správa:        http://localhost:3004"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "Stopping all servers..."
    kill $DESIGN_PID $REKO_PID $REALITY_PID $SPRAVA_PID 2>/dev/null
    echo "All servers stopped."
    exit 0
}

trap cleanup INT TERM

# Wait for all processes
wait
