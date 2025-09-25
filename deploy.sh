#!/usr/bin/env bash
set -euo pipefail

echo "== SmartLivingBerlin: Content-only Deploy =="
# 1) Checks
git rev-parse --is-inside-work-tree >/dev/null || { echo "❌ Kein Git-Repo"; exit 1; }
[ -f index.html ] || { echo "❌ index.html fehlt (falscher Ordner?)"; exit 1; }

# 2) Große Backups dauerhaft ignorieren (nur lokal behalten)
touch .gitignore
for p in 'backup-*.tar.gz' 'backup-*.tar' '/backups/'; do
  grep -qxF "$p" .gitignore || echo "$p" >> .gitignore
done
git rm -f --cached backup-*.tar.gz backup-*.tar 2>/dev/null || true

# 3) Basis-Ordnerstruktur sicherstellen (idempotent)
mkdir -p assets/css assets/js assets/images data partials

# 4) Robots & Sitemap (einfach, erweiterbar)
SITE_URL="https://smartlivingberlin.github.io/"
cat > robots.txt <<ROB
User-agent: *
Allow: /
Sitemap: ${SITE_URL}sitemap.xml
ROB

cat > sitemap.xml <<SMP
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE_URL}</loc></url>
</urlset>
SMP

# 5) Commit nur, wenn Änderungen vorhanden
git add -A
if git diff --cached --quiet; then
  echo "ℹ️ Keine Änderungen – nichts zu deployen."
else
  git commit -m "Deploy: content-only $(date +'%Y-%m-%d %H:%M')"
fi

# 6) Push (Branch optional als 1. Parameter, Default main)
BRANCH="${1:-main}"
git push origin "$BRANCH"

echo "✅ Fertig. Live: ${SITE_URL}"
