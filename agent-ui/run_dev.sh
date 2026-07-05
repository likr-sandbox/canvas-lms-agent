#!/bin/bash

# Navigate to the script's directory
cd "$(dirname "$0")"

echo "============================================="
echo " Starting Antigravity Web Wrapper Application"
echo "============================================="

# Set database environment variables for local Docker container
export DATABASE_URL="postgresql://canvas_lms_agent:G2P5W9TV7nFD6kqJqahX@35.187.197.185/canvas_lms_agent"
export GOOGLE_CLIENT_ID="687186412701-04087u9tmtd5avel7ltuhva2nuv8koip.apps.googleusercontent.com"
export CANVAS_BASE_URL="https://nu.instructure.com/"

# Trap exits to kill background processes
trap "kill 0" EXIT

echo "1. Starting FastAPI Backend on http://localhost:8000..."
../.venv/bin/python -m uvicorn api.index:app --reload --port 8000 &

echo "2. Launching Vite React Frontend on http://localhost:5173..."
npm run dev

# Wait for all background jobs
wait
