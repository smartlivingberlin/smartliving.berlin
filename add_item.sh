#!/usr/bin/env bash
set -euo pipefail

t="${1:-}"; img="${2:-}"; topic="${3:-}"; excerpt="${4:-}"
if [[ -z "${t}" || -z "${img}" || -z "${topic}" || -z "${excerpt}" ]]; then
  echo 'Nutzung: ./add_item.sh "Titel" "img/pfad.jpg" wissen "Kurzbeschreibung"'
  exit 1
fi

case "$topic" in wissen|markt|recht|förderung|zvg|miete|kauf|provision) ;; 
  *) echo "❌ Ungültiges Topic: $topic"; exit 1 ;;
esac

[[ -f "$img" ]] || { echo "❌ Bild nicht gefunden: $img"; exit 1; }

slug="$(printf '%s' "$t" \
 | tr '[:upper:]' '[:lower:]' \
 | sed -e 's/[äÄ]/ae/g;s/[öÖ]/oe/g;s/[üÜ]/ue/g;s/ß/ss/g' \
       -e 's/[^a-z0-9]/-/g;s/--*/-/g;s/^-//;s/-$//')"

tmp="$(mktemp)"
jq --arg t "$t" --arg i "$img" --arg tp "$topic" --arg e "$excerpt" --arg s "$slug" \
  '(.//[]) as $a | ($a + [{title:$t, img:$i, topic:$tp, excerpt:$e, slug:$s}])' \
  content.json > "$tmp"
mv "$tmp" content.json
echo "✅ Karte angelegt: $t"
echo "   slug=$slug"
