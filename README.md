```
  ___ _   _  ___ _  __  _   _ ___
 / __| | | |/ __| |/ / | | | | _ \
 \__ \ |_| | (__| ' <  | |_| |  _/
 |___/\___/ \___|_|\_\  \___/|_|

        .-.                   .-.
        <o>                   {o}
         :                     :
         :                     @
         @                     :
         :                     :
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    &      @      f      @       &      @
```

### ▶ **[PLAY IT](https://anderspartnersck.github.io/suck-up/)**

A Castle Killscreen arcade title by **Anders & Partners LLC**.

It is *not* co-op. Two alien pilots race to suck up more than the other off a
scrolling night farm near Towson, Maryland — cows, people, the occasional
power-up — while a single **shared** Military Response Meter climbs for both of
you. Your rival's greed is your problem. You're still playing for the higher
score. The aliens never appear and their motives never matter.

*(It's* near *Towson. Near. Not in it — Dave will correct you.)*

---

## Controls

This site ships the **mouse edition** — fly to the cursor, hold left-click to
run the beam, right-click to WARBLE (phase through incoming fire). The keyboard
works too, and two players can share one:

| | fly | beam | warble |
|:--|:--|:--|:--|
| **P1** | `WASD` | `Z` | `X` |
| **P2** | `IJKL` | `M` | `,` |

`SPACE` starts / inserts a coin · `M` mutes

## Modes

Append to the URL:

| | |
|:--|:--|
| *(nothing)* | **BLACKSITE** story — saves your progress, resumes from your furthest zone |
| `?arcade` | the **HYSCORE** coin-op — attract → INSERT COIN → full run → CONTINUE |
| `?og` | **COLEMAN'S ORIGINAL** — everything unlocked, never touches your save |

Clearing DEFCON-1 unlocks the CHEATS vault: level select, Champion Lap, and
Hadrian's secret codes. High scores live in your own browser.

## Controllers

**This edition ignores gamepads on purpose.** Mouse and stick are baked as
separate builds so the two control models never fight each other — the
arcade-stick edition is its own upload.

If you are running that stick edition, one setting matters more than everything
else on this page:

> ### ⚙ Put the pad in X-INPUT mode — on the 8BitDo, set the lever to D-PAD.
>
> In X-input/D-pad mode the controller reports as a *standard* gamepad and the
> game reads its d-pad as plain digital buttons: no deadzone, no analog drift,
> no POV-hat decoding. It is the only input path with no flaky edges.
>
> **Left/right fine, but up/down and diagonals unreliable?** That is the
> signature of a pad in the wrong mode. The fix is the hardware switch, not the
> software.

Once it is in X-input, **nothing needs configuring**:

| button | does |
|:--|:--|
| **A** | BEAM — also coin, confirm, menu select |
| **B** | WARBLE |
| **START** | back / exit — non-arcade modes only; a coin-op has no bail |

X, Y, the bumpers, the triggers and SELECT are **deliberately dead**, so a stray
thumb can't quit your run.

<details>
<summary><b>If your pad only does D-input</b> (e.g. a Mayflash F300 left in its D-input position)</summary>

<br>

It still **moves**. The movement layer identifies no brands and self-calibrates:
it learns each axis's resting value, steers only from axes that rest near
centre, and finds the stick, the d-pad or the POV hat on its own.

**Buttons are the problem.** A non-standard pad falls back to a custom button map
kept in browser storage — and browser storage is per-site. A map made in the
local KILLBOX tool lives at `127.0.0.1`, so **a hosted copy of this game cannot
see it**. Without it the game falls back to raw button indices `0`/`1`/`9`, and
on an F300 index 0 is the physical *B* — so BEAM lands on the wrong button, with
no way to remap it from the page.

Flip the pad to X-input. That is the whole fix.

*Honest note: gamepad support has no automated test — headless browsers expose
no controllers, so this build's asset and soak gates say nothing about it. The
X-input path is confirmed by hand on an 8BitDo; the D-input map path is not.*

</details>

## About this repo

A self-contained static site — HTML5 canvas, no build step, no server, no
dependencies. Everything it needs is `index.html`, `assets/` and `lib/`.

It is **generated, not hand-edited.** The source of truth is the master in the
private Castle Killscreen tree; this bundle is produced by:

```sh
make web                                            # the gate: asset wiring + soak
python3 tools/build_pages.py --prune --edition mouse
```

`build_pages.py` takes its file list from the asset checker, so the bundle can
never ship less art than the game references. Edit the master, re-run those two
commands, commit. Don't patch files here — the next build overwrites them.

<sub>The logo and the saucers above are the cabinet's own ASCII, lifted verbatim
from the terminal original (`src/suck_up.py`) — `ATTRACT_LOGO`, the `<o>` and
`{o}` hulls, the `:` tractor beam, `@` cow, `&` person, `f` farmer.</sub>

---

<sub>RESPEK LOGIC ART UREA · 25¢ per play</sub>
