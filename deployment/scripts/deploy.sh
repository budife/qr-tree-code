#!/usr/bin/env bash
# Rebuild in place. Container qr mounts this repo's dist directly, so no copy is needed.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DIST="$ROOT/dist"
BACKUP_ROOT="/srv/backups"

if [[ ! -d "$DIST/assets" ]]; then
  echo "$DIST belum ada. Jalankan: npm run build" >&2
  exit 1
fi
if ! docker ps --format '{{.Names}}' | grep -qx qr; then
  echo "Container qr tidak sedang berjalan" >&2
  exit 1
fi

TS="$(date +%Y%m%d-%H%M%S)"
BACKUP="$BACKUP_ROOT/qr-dist-$TS"
cp -a "$DIST" "$BACKUP"
echo "Backup: $BACKUP"

npm --prefix "$ROOT" run build

TITLE="$(docker exec qr cat /usr/share/nginx/html/index.html | grep -o '<title>[^<]*' | head -1)"
echo "Container sekarang menyajikan: $TITLE"
echo "Selesai. Cek: curl -s https://budd.my.id/qr/ | grep -i '<title>'"
