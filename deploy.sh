#!/bin/bash
STAMP=$(date +"%Y-%m-%d_%H-%M-%S")
tar -czf "backup-$STAMP.tar.gz" . && echo "✅ Backup erstellt: backup-$STAMP.tar.gz"

git add -A
git commit -m "🚀 Update: Auto-Deploy $STAMP"
git push origin main

echo "🌍 Fertig! Online prüfen unter: https://smartlivingberlin.github.io/"
