# QR Tree Code

An isometric 3D tree whose plot is a scannable QR code. Type a link, grow a tree, and let the canopy come apart leaf by leaf into the modules of the code below.

> Status: clean-room rewrite in progress. This repository currently holds documentation and licensing only; the implementation is being written from scratch.

## Inspiration and credits

This project is an independent take on the isometric QR-tree idea. It is inspired by:

- [Magic Tree](https://github.com/Slifronic/magic-tree) by [@Slifronic](https://github.com/Slifronic) — MIT licensed. The earlier fork is [budife/magic-tree-qr](https://github.com/budife/magic-tree-qr).
- [tree.icqr.com](https://tree.icqr.com) — the original interactive concept.

No source code, artwork, assets, or branding from those projects is copied into this repository. Everything here is written from scratch. The links above are kept as proper attribution for the ideas that came first.

## Design goals

- A QR code that genuinely scans, not a texture pasted on the ground.
- Deterministic tree growth: the same URL always grows the same tree.
- Several species and seasons, each with a distinct silhouette.
- No external 3D assets — geometry, foliage, and ambience generated at runtime.

## Licence

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Budi Indra Ilham.
