#!/bin/bash
STAMP=$(date +"%Y-%m-%d_%H-%M-%S")
FILE="backup-$STAMP.tar.gz"
tar -czf "$FILE" . && echo "✅ Backup erstellt: $FILE"
