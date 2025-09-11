#!/usr/bin/env bash
set -euo pipefail
BASE="https://smartlivingberlin.github.io/smartliving.berlin"
SLUG="${1:-wohnungssuche-5-hebel}"

echo "== HTML Scripts (index) =="
curl -s "$BASE/index.html?cache=$(date +%s)" | grep -nE 'app\.css|app\.js|crisp\.js' | sed -n '1,2p' || true

echo "== HTML Scripts (details) =="
curl -s "$BASE/details/?slug=$SLUG&cache=$(date +%s)" | grep -nE 'app\.css|app\.js|crisp\.js' | sed -n '1,2p' || true

echo "== JSON first titles =="
curl -s "$BASE/content.json?cache=$(date +%s)" | jq '.[0:8] | map(.title)'

echo "== CRISP l.js reachable =="
curl -sI https://client.crisp.chat/l.js | sed -n '1p'
