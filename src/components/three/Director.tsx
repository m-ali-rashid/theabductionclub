"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useGame, TOTAL } from "@/store/useGame";
import { COLLECTIBLES, type CollectibleId } from "@/data/collectibles";
import { PLACEMENTS, UFO_EMITTER_Y, UFO_HOME, UFO_SCALE, rig, resetCollectibleAnim } from "@/lib/rig";
import { hoverHeightFor } from "./Ufo";
import { sfx } from "@/lib/sound";

/**
 * Scripted choreography. GSAP tweens plain objects inside `rig`; scene
 * components read those values in useFrame. Only one timeline can run.
 */
export function Director() {
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    let tl: gsap.core.Timeline | null = null;
    const ids = COLLECTIBLES.map((c) => c.id);

    const kill = () => {
      tl?.kill();
      tl = null;
    };

    /* --------------------------- abduction -------------------------- */
    const abduct = (id: CollectibleId) => {
      kill();
      const g = useGame.getState();
      const reduced = g.reducedMotion;
      const p = PLACEMENTS[id];
      const rt = rig.collectibles[id];
      const a = rt.anim;
      const base = rt.base;
      const hoverY = hoverHeightFor(id);
      const emitterY = hoverY + UFO_EMITTER_Y * UFO_SCALE;
      // object centre ends at the emitter
      const liftTop = emitterY - base.y - p.height / 2 + 0.05;
      const dist = Math.hypot(base.x - rig.ufo.pos.x, base.z - rig.ufo.pos.z);
      const approach = reduced ? 0.5 : THREE_clamp(0.65 + dist * 0.09, 0.75, 1.15);

      rig.mode = "scripted";
      rig.ufo.script.copy(rig.ufo.pos);
      rig.ufo.focus = base;
      rig.fx.target.copy(base);
      rig.fx.targetRadius = p.radius;

      const setPhase = useGame.getState().setPhase;
      tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

      // State 1 — Approach
      tl.to(rig.ufo.script, { x: base.x, z: base.z, duration: approach, ease: "power3.inOut" }, 0);
      tl.to(rig.ufo.script, { y: hoverY, duration: approach, ease: "sine.inOut" }, 0);
      tl.to(a, { wobble: 1, duration: 0.01 }, approach * 0.55);

      // State 2 — Scanning
      const S = approach;
      tl.add(() => {
        setPhase("scan");
        sfx.scan();
      }, S);
      tl.to(rig.fx, { scan: 1, duration: 0.35, ease: "back.out(2)" }, S);
      tl.to(rig.fx, { pulse: 1, engine: 1, duration: 0.4, ease: "power1.out" }, S);
      tl.to(rig.fx, { pilot: 1, duration: 0.25, ease: "power2.out" }, S);
      tl.to(a, { locked: 1, duration: 0.3 }, S + 0.05);

      // State 3 — Abduction (beam extends)
      const B = S + 0.55;
      tl.add(() => {
        setPhase("beam");
        sfx.beamStart();
      }, B);
      tl.set(rig.fx, { beamAlpha: 1 }, B);
      tl.to(rig.fx, { beam: 1, duration: 0.38, ease: "power3.out" }, B);
      tl.to(rig.fx, { pulse: 0.5, duration: 0.35 }, B);

      // State 4 — Lifting
      const L = B + 0.38;
      tl.add(() => setPhase("lift"), L);
      if (reduced) {
        tl.to(a, { lift: liftTop * 0.9, duration: 0.9, ease: "power2.inOut" }, L);
      } else {
        tl.to(a, { squash: 0.82, lift: -0.03, duration: 0.14, ease: "power2.out" }, L); // anticipation
        tl.to(a, { squash: 1, duration: 0.95, ease: "elastic.out(1.1, 0.32)" }, L + 0.14);
        tl.to(a, { lift: liftTop * 0.62, duration: 0.85, ease: "back.out(1.5)" }, L + 0.14);
        tl.to(a, { spin: `+=${Math.PI * 2.25}`, duration: 1.65, ease: "power1.inOut" }, L + 0.08);
        tl.to(a, { lift: liftTop * 0.9, duration: 0.55, ease: "power2.in" }, L + 0.95);
      }

      // State 5 — Discovery (absorbed into the UFO)
      const D = reduced ? L + 0.95 : L + 1.5;
      tl.add(() => setPhase("discover"), D);
      tl.to(a, { scale: 0, lift: liftTop, duration: reduced ? 0.18 : 0.28, ease: "back.in(2.2)" }, D);
      tl.add(() => {
        useGame.getState().completeCapture(id);
        const done = useGame.getState().captured.length === TOTAL;
        if (done) sfx.complete();
        else sfx.capture();
      }, D + 0.26);
      tl.to(rig.fx, { recoil: 0.2, duration: 0.1, ease: "power2.out" }, D + 0.26);
      tl.to(rig.fx, { recoil: 0, duration: reduced ? 0.2 : 0.75, ease: reduced ? "power2.out" : "elastic.out(1, 0.35)" }, D + 0.36);

      // State 6 — Return
      const R = D + 0.32;
      tl.add(() => {
        setPhase("return");
        sfx.beamStop();
      }, R);
      tl.to(rig.fx, { beam: 0, beamAlpha: 0, duration: 0.3, ease: "power2.in" }, R);
      tl.to(rig.fx, { scan: 0, pulse: 0, engine: 0, duration: 0.35 }, R);
      tl.to(rig.fx, { pilot: 0, duration: 0.6 }, R + 0.15);
      tl.add(() => {
        rig.mode = "free";
        rig.ufo.focus = null;
      }, R + 0.3);
      tl.add(() => {
        a.locked = 0;
        useGame.getState().setPhase("idle");
      }, R + 0.45);
    };

    /* ---------------------------- replay ---------------------------- */
    const replay = () => {
      kill();
      const reduced = useGame.getState().reducedMotion;
      tl = gsap.timeline({ onComplete: () => useGame.getState().setPhase("idle") });
      ids.forEach((id, i) => {
        resetCollectibleAnim(id);
        const a = rig.collectibles[id].anim;
        a.scale = 0;
        a.lift = 1.4;
        a.spin = -Math.PI;
        tl!.to(a, { scale: 1, duration: 0.45, ease: "back.out(2)" }, i * 0.14);
        tl!.to(a, { lift: 0, spin: 0, duration: reduced ? 0.35 : 0.75, ease: reduced ? "power2.out" : "bounce.out" }, i * 0.14);
        tl!.add(() => sfx.hover(id), i * 0.14 + 0.4);
      });
      tl.to(rig.fx, { recoil: 0.22, duration: 0.14, yoyo: true, repeat: 1 }, 0);
    };

    const unsub = useGame.subscribe((s, prev) => {
      if (s.phase === "approach" && prev.phase !== "approach" && s.activeId) abduct(s.activeId);
      if (s.phase === "reset" && prev.phase !== "reset") replay();
    });

    return () => {
      unsub();
      kill();
      sfx.beamStop();
      // Leave the world in a sane state if unmounted mid-sequence (HMR / route change)
      rig.mode = "free";
      Object.assign(rig.fx, { beam: 0, beamAlpha: 0, scan: 0, pulse: 0, engine: 0, pilot: 0, recoil: 0 });
      const st = useGame.getState();
      if (st.phase !== "idle") {
        ids.forEach((id) => {
          if (!st.captured.includes(id)) resetCollectibleAnim(id);
        });
        useGame.setState({ phase: "idle", activeId: null });
      }
    };
  }, []);

  return null;
}

function THREE_clamp(v: number, a: number, b: number) {
  return Math.min(b, Math.max(a, v));
}
