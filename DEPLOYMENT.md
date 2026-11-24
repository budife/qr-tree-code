# Deployment

Live: https://budd.my.id/qr/ (`/qr` redirects to `/qr/`).

## Topology

- NPM proxy host `4.conf` (`/data/nginx/proxy_host/4.conf` inside the `npm` container) owns `budd.my.id` and its certificate. It has three QR locations:
  - `location = /qr` → 301 to `/qr/`
  - `location /qr/assets/` → proxy to `172.19.0.17:80`, gzip for JS/CSS/SVG, `Cache-Control: public, max-age=31536000, immutable`
  - `location /qr/` → proxy to `172.19.0.17:80`, gzip, `Cache-Control: no-cache` for the HTML
- Container `qr` (`nginx:alpine`, network `proxy`) bind-mounts `/srv/projects/qr/dist` to `/usr/share/nginx/html`.
- `nginx.conf` and `nginx/default.conf` in this repo describe the container config; the live container currently runs nginx's default config, which is compatible.
- SSL and DNS are already configured. Do not issue a new certificate for this path.

## Build

```bash
npm ci
npm test
npm run lint
npm run build
```

The build writes `dist/`. Asset filenames are content-hashed; `index.html` is intentionally `no-cache` so a new build is picked up immediately.

## Deploy

```bash
bash deployment/scripts/deploy.sh
```

The script backs up the served `dist`, replaces only the files inside it (same directory inode, so the bind mount stays valid), and verifies the container sees the new `index.html`. An NPM reload is **not** needed for asset changes. If `4.conf` changes, validate and reload explicitly:

```bash
docker exec npm nginx -t && docker exec npm nginx -s reload
```

## Rollback

Copy the newest `/srv/backups/qr-dist-<timestamp>` back over `/srv/projects/qr/dist`, then verify:

```bash
curl -s https://budd.my.id/qr/ | grep -i '<title>'
```

## Verification checklist

- `https://budd.my.id/qr/` → 200 with title `QR Tree Code — 3D QR Tree Generator`
- `/qr` → 301 to `/qr/`
- JS/CSS chunk URLs from the served HTML → 200, `content-encoding: gzip`
- `https://budd.my.id/` still returns the main site
