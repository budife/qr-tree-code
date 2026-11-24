#!/usr/bin/env bash
# Sync a fresh build into the live qr container's bind mount.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SRC="$ROOT/dist"
DEST="/srv/projects/qr/dist"
BACKUP_ROOT="/srv/backups"

if [[ ! -f "$SRC/index.html" ]]; then
  echo "dist belum ada. Jalankan: npm run build" >&2
  exit 1
fi
if [[ ! -d "$DEST/assets" ]]; then
  echo "$DEST tidak ditemukan — container qr tidak terpasang?" >&2
  exit 1
fi
if ! docker ps --format '{{.Names}}' | grep -qx qr; then
  echo "Container qr tidak sedang berjalan" >&2
  exit 1
fi

TS="$(date +%Y%m%d-%H%M%S)"
BACKUP="$BACKUP_ROOT/qr-dist-$TS"
cp -a "$DEST" "$BACKUP"
echo "Backup: $BACKUP"

# Keep the directory itself so the container's bind-mount inode stays valid.
find "$DEST/assets" -mindepth 1 -type f -delete
cp -a "$SRC/." "$DEST/"
chmod -R a+rX "$DEST"

TITLE="$(docker exec qr cat /usr/share/nginx/html/index.html | grep -o '<title>[^<]*' | head -1)"
echo "Container sekarang menyajikan: $TITLE"
echo "Selesai. Cek: curl -s https://budd.my.id/qr/ | grep -i '<title>'"
