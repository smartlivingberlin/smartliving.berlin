#!/usr/bin/env bash
set -e
title="$1"; img="$2"; topic="$3"; excerpt="$4"; url="$5"
[ -n "$title" ] && [ -n "$img" ] && [ -n "$topic" ] || { echo "Usage: add_item <title> <img> <topic> <excerpt> <url>"; exit 1; }
case "$topic" in wissen|markt|recht|förderung|zvg|miete|kauf|provision) ;; *) topic="wissen";; esac
slug="$(printf '%s' "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[ä]/ae/g;s/[ö]/oe/g;s/[ü]/ue/g;s/[ß]/ss/g;s/[^a-z0-9]+/-/g;s/^-+|-+$//g')"
[ -f content.json ] || echo "[]" > content.json
d="$(date -Iseconds)"
tmp="$(mktemp)"
jq --arg t "$title" --arg i "$img" --arg q "$topic" --arg e "$excerpt" --arg u "$url" --arg s "$slug" --arg d "$d" '
  [ .[] | select(.slug != $s) ] + [ {title:$t, img:$i, topic:$q, excerpt:$e, url:$u, slug:$s, date:$d} ]
' content.json > "$tmp" && mv "$tmp" content.json
echo "$slug"
