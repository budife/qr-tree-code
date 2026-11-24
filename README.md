# QR Tree Code

An isometric 3D tree whose plot is a scannable QR code. Type a link, grow a tree, and let the canopy come apart leaf by leaf into the modules of the code below.

> Status: active rewrite. The implementation is being reworked from the original codebase; expect changes.

## Based on

This project is based on the code of:

- [budife/magic-tree-qr](https://github.com/budife/magic-tree-qr) — the earlier fork whose code was reused, rewritten, and extended here.
- [Magic Tree](https://github.com/Slifronic/magic-tree) by [@Slifronic](https://github.com/Slifronic) — MIT licensed, the upstream of that fork.
- [tree.icqr.com](https://tree.icqr.com) — the original interactive concept that inspired the idea.

Portions of the original MIT-licensed code are retained. The upstream copyright notice and permission text are preserved in [LICENSE-UPSTREAM](LICENSE-UPSTREAM). Credit to the original authors is kept intentionally.

## Design goals

- A QR code that genuinely scans, not a texture pasted on the ground.
- Deterministic tree growth: the same URL always grows the same tree.
- Several species and seasons, each with a distinct silhouette.
- No external 3D assets — geometry, foliage, and ambience generated at runtime.

## Licence

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Budi Indra Ilham.

Original portions: Copyright (c) 2026 Magic Tree contributors, under the same MIT licence — see [LICENSE-UPSTREAM](LICENSE-UPSTREAM).
