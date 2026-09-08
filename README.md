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

## Controllers

**This build ignores gamepads on purpose.** Mouse and stick are baked as separate
editions so the two control models never fight each other; the arcade-stick
edition is its own upload (`tools/build_editions.py` → `suck-up-stick`).

If you are running the **stick edition**, one setting matters more than anything
else in this document:

> ### Put the controller in X-INPUT mode — and on the 8BitDo, set the lever to D-PAD.
>
> In X-input/D-pad mode the pad reports as a *standard* gamepad and the game
> reads its d-pad as plain digital buttons: no deadzone, no analog drift, no
> POV-hat decoding. It is the only input path with no flaky edges. Left/right
> feeling fine while **up/down and diagonals are unreliable** is the signature of
> a pad in the wrong mode — the fix is the hardware switch, not the software.

Once it is in X-input, **no configuration is needed.** Standard pads use the
canonical layout automatically:

| button | does |
|---|---|
| A | BEAM (also coin / confirm / menu select) |
| B | WARBLE |
| START | back / exit — non-arcade modes only, a coin-op has no bail |

X, Y, the bumpers, the triggers and SELECT are **deliberately dead**, so a stray
thumb can't quit your run.

### If your pad only does D-input (e.g. Mayflash F300 in its D-input position)

It still moves — the movement layer identifies no brands and self-calibrates, so
it finds the stick, the d-pad or the POV hat on its own and filters dead axes.
**Buttons are the problem.** A non-standard pad falls back to a custom button map
saved in browser storage, and browser storage is per-site: a map made in the local
KILLBOX tool lives at `127.0.0.1`, so **a hosted copy of this game cannot see it**.
Without it the game uses raw indices 0/1/9, and on an F300 index 0 is the physical
*B*, so BEAM lands on the wrong button with no way to remap it from the page.

Flip the pad to X-input. That is the whole fix.

*Honest note: gamepad support has no automated test — headless browsers expose no
controllers, so the build's asset and soak gates say nothing about it. The X-input
path is confirmed by hand on an 8BitDo; the D-input map path is not.*

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
