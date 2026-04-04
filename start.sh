#!/bin/bash
echo "=== uCoding Business Panel ==="

if [ ! -d "server/node_modules" ]; then
  echo "Installing backend dependencies..."
  cd server && npm install --silent && cd ..
fi

echo "Starting backend (port 3001)..."
node server/server.js &
SERVER_PID=$!

echo "Waiting for backend..."
for i in $(seq 1 30); do
  if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "Backend ready (PID: $SERVER_PID)"
    break
  fi
  sleep 0.5
done

echo "Starting frontend (port 5173)..."
npx vite --host 0.0.0.0 --port 5173
