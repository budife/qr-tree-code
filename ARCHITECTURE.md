# Architecture

Static React app, no backend. React 19 + TypeScript + Vite 8; three.js for the scene; Vitest and oxlint for checks.

## Layers

- `src/lib/` — pure, tested helpers: link normalisation, season selection, scene error messages.
- `src/scene/` — QR encoding (`qr.ts`), module → leaf mapping (`moduleLayout.ts`), instanced plot (`plot.ts`), tree growth (`tree.ts`, `species.ts`), canopy morph (`canopy.ts`), weather (`weather.ts`, `motes.ts`), palettes and seeded RNG.
- `src/ui/` — presentational components (`Dock`, `InfoPanel`, `WeatherControls`, `AboutModal`). `App.tsx` owns state, effects and handlers only.
- `src/audio/ambience.ts` — synthesised wind and chimes; no audio assets.
- `src/share/qrImage.ts` — flat QR raster used by the share button.

## Data flow

1. The draft link is trimmed and given a protocol by `normalizeLink`, then committed after a 500 ms debounce.
2. `buildQr` encodes the committed link at error-correction level H with a four-module quiet zone.
3. Dark modules become raised instanced tiles; each also receives a run of six leaf targets.
4. A single `morph` value drives leaves from canopy positions to QR modules, along with camera and lighting.
5. The share button rasterises the same matrix into a high-contrast PNG.

`App.tsx` imports only the `ViewMode` type from `src/scene`; the scene itself is a dynamic import, so three.js ships in a separate chunk and the UI paints first. A ref carries the latest palette/link/mode/species/weather into the asynchronously created scene. Once the code view settles, `shouldRenderFrame` in `src/lib/frame.ts` lets the loop skip camera and render work until something changes. The share PNG encoder is loaded on demand.

## Runtime

Nginx Proxy Manager terminates SSL on `budd.my.id` and proxies `budd.my.id/qr/` to the `qr` container on the internal `proxy` network. The container serves `dist/` as static files. See [DEPLOYMENT.md](DEPLOYMENT.md).
