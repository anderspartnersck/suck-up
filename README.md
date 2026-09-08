# SUCK UP — playable web build

A Castle Killscreen arcade title by Anders & Partners LLC. A 1–2 player
competitive UFO-abduction game set on a scrolling night farm near Towson, MD.

**Play it:** https://anderspartnersck.github.io/suck-up/

## Controls

This site ships the **mouse edition** — fly to the cursor, hold left-click to
run the beam, right-click to WARBLE. Keyboard works too:

| | move | beam | warble |
|---|---|---|---|
| P1 | WASD | Z | X |
| P2 | IJKL | M | , |

A gamepad is **ignored here** by design — the mouse and stick builds are baked
separately so neither input fights the other. The arcade-stick edition is its
own upload (`tools/build_editions.py` → `suck-up-stick`).

## Modes

Append these to the URL:

| | |
|---|---|
| *(nothing)* | BLACKSITE story — saves progress, resume from your furthest zone |
| `?arcade` | the HYSCORE coin-op: attract → INSERT COIN → full run → CONTINUE |
| `?og` | Coleman's Original — everything unlocked, never touches your save |

Clearing DEFCON-1 unlocks the CHEATS vault (level select, Champion Lap,
Hadrian's secret codes). High scores are local to your browser.

## About this repo

A self-contained static site — HTML5 canvas, no build step, no server. It is
**generated**, not hand-edited: the source of truth is the master in the private
Castle Killscreen tree, and this bundle is produced by

    make web                                        # the gate: asset wiring + soak
    python3 tools/build_pages.py --prune --edition mouse

`build_pages.py` takes its file list from the asset checker, so the bundle can
never ship less art than the game references. Edit the master, re-run those two
commands, commit. Don't patch files here — the next build overwrites them.

RESPEK LOGIC ART UREA · 25¢ per play
