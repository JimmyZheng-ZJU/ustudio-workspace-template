#!/bin/bash

echo "=== uStudio Full-Stack Template ==="

# Install backend deps if needed
if [ ! -d "server/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd server && npm install --silent && cd ..
fi

# Start backend
echo "Starting backend (port 3001)..."
node server/server.js &
SERVER_PID=$!

# Wait for backend to be ready
echo "Waiting for backend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "Backend ready (PID: $SERVER_PID)"
    break
  fi
  sleep 0.5
done

# Start frontend
echo "Starting frontend (port 8011)..."
npx vite --host 0.0.0.0 --port 8011
