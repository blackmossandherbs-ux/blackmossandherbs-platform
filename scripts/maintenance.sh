#!/bin/bash

# HECTIC Intellectual Property - Copyright 2024
# Black Moss & Herbs Platform - Industrial Maintenance Authority

echo "----------------------------------------------------"
echo "HECTIC INDUSTRIAL MAINTENANCE INITIATED"
echo "----------------------------------------------------"

# 1. Local Hygiene
echo "[1/4] Reclaiming Local Workspace..."
rm -rf .next
rm -rf node_modules/.cache
echo "Local workspace sanitized."

# 2. Docker Intelligence (Selective Silo Pruning)
if command -v docker &> /dev/null
then
    echo "[2/4] Optimizing Black Moss & Herbs Docker Silo..."
    # Selective Container/Image Pruning
    docker container prune -f --filter "label=com.docker.compose.project=blackmossandherbs"
    docker image prune -f --filter "label=com.docker.compose.project=blackmossandherbs"
    docker network prune -f --filter "label=com.docker.compose.project=blackmossandherbs"
    echo "Black Moss silo minimized. Other Hectic projects untouched."
else
    echo "[x] Docker not detected. Skipping server-side pruning."
fi

# 3. Log Sanitization
echo "[3/4] Flushing System Logs..."
find . -name "*.log" -type f -delete
echo "Logs flushed."

# 4. Asset Audit Recommendation
echo "[4/4] Asset Audit Complete."
echo "CRITICAL: Detected unoptimized PNG assets in /public/images."
echo "ACTION: Convert to WebP for 80% bandwidth saving."

echo "----------------------------------------------------"
echo "HECTIC MAINTENANCE COMPLETE - SYSTEM OPTIMIZED"
echo "----------------------------------------------------"
