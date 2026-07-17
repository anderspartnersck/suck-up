// lib/ghost.js — THE GHOST CONTROLLER (the code version of wiring a cab).
// ---------------------------------------------------------------------------
// In a real cabinet you mount ONE stick + buttons and wire them to a harness;
// the game board only ever sees the harness, never the brand of the parts.
// This is that harness in code: feed it WHATEVER gamepad is connected and it
// returns one fixed virtual panel — {ax, ay, x, y, btn()} — so every game can
// read movement the same way and never special-case F300 vs 8BitDo vs DInput.
//
// THE TRICK that kills the per-device whack-a-mole:
//   A real directional axis RESTS near 0 (centered stick). A DEAD axis or a
//   trigger rests near +/-1. The Mayflash F300 has no right stick, so in DInput
//   its axes 2/3 sit pinned at +/-1 forever — and those were overwriting a real
//   DOWN. So we just learn each pad's resting values (ratcheting toward the
//   closest-to-zero value ever seen) and ONLY steer from axes that rest near
//   center. No brand strings, no XInput/DInput branches. It self-calibrates.
//
//   Output convention (raw stick): up = -1, left = -1 (W3C gamepad standard).
//   The game applies its own invert / up=screen-up mapping after reading.
(function (global) {
  var DZ = 0.30;            // push threshold (how far past rest counts as "pushed")
  var REST_MAX = 0.55;      // an axis whose learned rest |value| exceeds this is dead/trigger -> never steer
  var cal = {};             // gamepad.index -> { id, rest:[per-axis resting value] }

  // Learn the resting value of each axis. rest ratchets toward the smallest-magnitude
  // value ever seen: a real stick visits ~0 when released (rest -> ~0); a dead axis
  // stuck at +/-1 never gets closer to 0 (rest stays ~+/-1 -> ignored). This also
  // self-heals the rare "stick held at power-on" case once the stick is released.
  function calib(gp) {
    var c = cal[gp.index];
    if (!c || c.id !== gp.id) c = cal[gp.index] = { id: gp.id, rest: (gp.axes || []).slice() };
    for (var i = 0; i < gp.axes.length; i++) {
      var v = gp.axes[i] || 0;
      if (c.rest[i] == null || Math.abs(v) < Math.abs(c.rest[i])) c.rest[i] = v;
    }
    return c;
  }

  // displacement of axis i from its learned rest, or 0 if that axis is dead/trigger
  function axVal(gp, c, i) {
    if (i >= gp.axes.length) return 0;
    var r = (c.rest[i] == null ? 0 : c.rest[i]);
    if (Math.abs(r) > REST_MAX) return 0;          // dead/trigger axis -> contributes nothing
    var v = (gp.axes[i] || 0) - r;
    return Math.abs(v) > DZ ? v : 0;
  }

  // POV hat on axes[9] (non-standard pads, e.g. F300 in DInput). 8 stepped values.
  var HX = [0, 1, 1, 1, 0, -1, -1, -1], HY = [-1, -1, 0, 1, 1, 1, 0, -1];
  var HAT_ZERO = 0.06;   // near-zero guard (see hat())
  function hat(gp) {
    if (gp.mapping === 'standard') return null;    // d-pad is on buttons 12-15 there
    if (!gp.axes || gp.axes.length < 10) return null;
    var h = gp.axes[9];
    // A POV hat at REST reports OUT of the [-1,1] step range (commonly ~1.29 / ~3.29),
    // so out-of-range = neutral. The near-zero guard only catches a non-hat axis that
    // happens to sit flat at 0; keep it SMALL so the real DOWN steps at ~±0.142
    // (down-right -0.142, down +0.142) are NOT swallowed. The old 0.12 clipped DOWN —
    // that was the "left/right fine, down dead" bug on DInput/hat-mode sticks.
    if (h < -1.1 || h > 1.1 || Math.abs(h) <= HAT_ZERO) return null;
    var k = Math.round((h + 1) / 0.2857) & 7;
    return [HX[k], HY[k]];
  }

  function bd(gp, i) { return !!(gp && gp.buttons && gp.buttons[i] && gp.buttons[i].pressed); }

  // The harness read. Returns the unified virtual panel for ONE pad.
  //   ax, ay : analog-or-digital deflection (-1..1) with dead axes filtered out,
  //            d-pad / hat folded in as full deflection — use these for thresholds.
  //   x, y   : digital 8-way intent in {-1,0,1}.
  function read(gp) {
    if (!gp) return { ax: 0, ay: 0, x: 0, y: 0, present: false };
    var c = calib(gp);
    var ax = axVal(gp, c, 0) || axVal(gp, c, 2);   // X: left stick, else a centered right stick
    var ay = axVal(gp, c, 1) || axVal(gp, c, 3);   // Y
    if (bd(gp, 14)) ax = -1; else if (bd(gp, 15)) ax = 1;   // d-pad L/R
    if (bd(gp, 12)) ay = -1; else if (bd(gp, 13)) ay = 1;   // d-pad U/D
    var hd = hat(gp);
    if (hd) { if (hd[0]) ax = hd[0]; if (hd[1]) ay = hd[1]; }
    var x = Math.abs(ax) > DZ ? (ax > 0 ? 1 : -1) : 0;
    var y = Math.abs(ay) > DZ ? (ay > 0 ? 1 : -1) : 0;
    return { ax: ax, ay: ay, x: x, y: y, present: true };
  }

  // Faithful introspection for the probe page: runs the SAME calibration + the
  // SAME axis/hat logic as read(), but reports every intermediate so we can SEE
  // which path is feeding (or starving) a direction. Non-behavioral — read() is
  // unchanged; this just exposes the internals the probe needs to diagnose up/down.
  function debug(gp) {
    if (!gp) return { present: false };
    var c = calib(gp);
    var axes = [];
    for (var i = 0; i < gp.axes.length; i++) {
      var r = (c.rest[i] == null ? 0 : c.rest[i]);
      var dead = Math.abs(r) > REST_MAX;
      axes.push({
        i: i,
        raw: +(gp.axes[i] || 0).toFixed(3),
        rest: +r.toFixed(3),
        dead: dead,                       // true => filtered, never steers
        disp: +(axVal(gp, c, i)).toFixed(3) // displacement after deadzone+filter
      });
    }
    var h = (gp.axes && gp.axes.length >= 10) ? gp.axes[9] : null;
    var hk = null;
    if (h != null && !(h < -1.1 || h > 1.1 || Math.abs(h) <= HAT_ZERO)) hk = Math.round((h + 1) / 0.2857) & 7;
    var hd = hat(gp);
    return {
      present: true, id: gp.id, mapping: gp.mapping || '(non-standard)', index: gp.index,
      axes: axes,
      hatRaw: h == null ? null : +h.toFixed(3),
      hatNeutral: (h == null) || (h < -1.1 || h > 1.1 || Math.abs(h) <= HAT_ZERO),
      hatK: hk, hatDir: hd,                // [x,y] or null
      dpad: { up: bd(gp, 12), down: bd(gp, 13), left: bd(gp, 14), right: bd(gp, 15) },
      out: read(gp),                        // the real value the game consumes
      consts: { DZ: DZ, REST_MAX: REST_MAX }
    };
  }

  global.Ghost = { read: read, btn: bd, DZ: DZ, debug: debug };
})(typeof window !== 'undefined' ? window : this);
