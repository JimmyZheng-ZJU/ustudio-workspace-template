#!/bin/bash
echo "[ustudio] Running setup.sh..."

cd /workspace/project/ustudio-workspace-template

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "[ustudio] Installing dependencies..."
  npm install
  echo "[ustudio] Dependencies installed."
else
  echo "[ustudio] node_modules already exists, skipping install."
fi

# 后台启动 Vite dev server
echo "[ustudio] Starting Vite dev server..."
nohup npx vite --host 0.0.0.0 --port 8011 > /tmp/vite.log 2>&1 &
echo "[ustudio] Vite dev server starting on port 8011 (background)"

echo "[ustudio] Setup complete."
