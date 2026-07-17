# SUCK UP — palette

The six `Renderer` color ids, given real RGB **sampled from the title art**
(`assets/title/title-screen-1.png`) so terminal-color and pixel-color speak the
same language. These live in code as `Renderer.RGB` (in `src/suck_up.py`),
unused by the curses backend (curses picks the 8 ANSI colors) and ready as the
seed for a future `PixelRenderer`.

| id | name | role | hex | provenance |
|----|------|------|-----|------------|
| 1 | GREEN | P1 saucer + tractor beam | `#76D03C` | alien-green family (logo/beam), saturated for a clear "green player" |
| 2 | CYAN | P2 saucer | `#27AEBD` | **near-exact** sample — the teal saucer glow |
| 3 | YELLOW | alerts / UI positive | `#ECE21D` | the logo + beam glow highlight (the brand's brightest note) |
| 4 | MAGENTA | curses' "orange" approximation | `#DAA226` | **sampled** — the warm barn-window amber |
| 5 | RED | danger / RED meter | `#D24A2A` | warm barn red (`#CE602E` sample), nudged redder for danger legibility |
| 6 | WHITE | neutral / moon / stars | `#F4F6FA` | **sampled** — moonlight, faint cool tint |

Plus two non-id anchors, also in `Renderer`:

| name | role | hex | provenance |
|------|------|-----|------------|
| NIGHT | background fill | `#0D1F3C` | **sampled** — the night sky band |
| BEAM | marquee / beam-core glow | `#ECE21D` | the SUCK UP logo + beam highlight |

## How these were pulled

A stdlib-only sampler (zlib + a Paeth PNG un-filter — no Pillow/pygame, matching
the project's zero-dependency ethos) decoded a `sips`-downscaled copy of the
art. Four slots (CYAN, MAGENTA/amber, WHITE, NIGHT) are near-exact top-N
averages of the relevant pixels; YELLOW/BEAM is the logo/beam glow highlight;
GREEN and RED are art-family colors tuned for six distinct, readable UI colors
(the night painting is warm-lit, so its greens muddy toward grass and its reds
toward orange — the tuned values keep the identity while staying legible).

Re-sample any time from the canonical full-res `assets/title/title-screen-1.png`.
