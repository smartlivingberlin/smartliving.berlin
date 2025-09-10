#!/usr/bin/env bash
# usage:
# ./add_item.sh "Titel" "Topic(miete|kauf|foerderung|markt|zvg|recht)" "Bildpfad(./card_1.jpg)" \
#               "URL(https://... oder #anchor)" "Quelle(z.B. kfw|bgh|smartliving)" \
#               "tag1,tag2,tag3" "Kurzer Teaser/Excerpt ..."
set -euo pipefail

title="${1:-}"; topic="${2:-}"; img="${3:-}"; url="${4:-}"; source="${5:-smartliving}"
tags_csv="${6:-}"; shift 6 || true; excerpt="${*:-}"

# --- Eingaben prüfen ---
[[ -z "$title"  ]] && { echo "Fehlt: Titel"; exit 1; }
[[ -z "$topic"  ]] && { echo "Fehlt: Topic (miete|kauf|foerderung|markt|zvg|recht)"; exit 1; }
case "$topic" in miete|kauf|foerderung|markt|zvg|recht) ;; *) echo "Ungültiges Topic: $topic"; exit 1;; esac
[[ -z "$img"    ]] && { echo "Fehlt: Bildpfad (./card_1.jpg ..)"; exit 1; }
[[ "$url" =~ ^https?://|^# ]] || { echo "URL muss mit http(s) beginnen oder #anchor sein"; exit 1; }
[[ -z "$excerpt" ]] && { echo "Hinweis: Excerpt leer (optional)"; }

# --- Hilfsfunktionen ---
slugify() {
  # einfache Slug-Funktion
  echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]+/-/g; s/ /-/g; s/-\+/-/g; s/^-//; s/-$//'
}

# Tags -> JSON-Array
IFS=',' read -ra TG <<< "$tags_csv"
json_tags="[]"
if [[ "${#TG[@]}" -gt 0 && -n "${TG[0]}" ]]; then
  json_tags=$(printf '"%s",' "${TG[@]}"); json_tags="[${json_tags%,}]"
fi

date_iso="$(date +%F)"
id="$(slugify "$title")"

# content.json initialisieren, falls nicht vorhanden
[[ -f content.json ]] || echo "[]" > content.json

# Duplikate: gleicher Titel oder gleicher id-Slug?
if jq --arg t "$title" --arg id "$id" \
     'map(.title==$t or .id==$id) | any' content.json | grep -q true; then
  echo "Schon vorhanden (Titel oder id): $title"
  exit 0
fi

# Eintrag (vorn) einfügen – JSON-sicher mit jq
tmp="$(mktemp)"
jq --arg title "$title" \
   --arg topic "$topic" \
   --arg img   "$img" \
   --arg url   "$url" \
   --arg date  "$date_iso" \
   --arg excerpt "$excerpt" \
   --arg source "$source" \
   --arg id    "$id" \
   --argjson tags "$json_tags" \
   '([{
       id:$id, title:$title, topic:$topic, img:$img,
       url:$url, source:$source, date:$date,
       tags:$tags, excerpt:$excerpt
     }] + .)' content.json > "$tmp" && mv "$tmp" content.json

echo "OK: hinzugefügt → [$topic] $title  (id: $id, datum: $date_iso)"
