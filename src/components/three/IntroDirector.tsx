"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { useGame } from "@/store/useGame";
import { FLIGHT_ALTITUDE, UFO_HOME, rig } from "@/lib/rig";

/**
 * Intro timeline (seconds) — matches the brief exactly:
 *   0.0–1.0  UFO hovers, already clearly visible
 *   1.0–2.0  alien turns to the camera and raises its hand
 *   2.0–4.0  alien greets the visitor, speech bubble visible
 *   4.0–5.0  alien finishes waving, faces forward, UFO prepares to move
 *   5.0–7.0  camera pulls back, revealing the complete diorama + website
 */
export const INTRO_DURATION = 7;
const INTRO_ZOOM = 2.5;

/** Put every intro-controlled value at its starting pose. Safe to call repeatedly. */
export function resetIntroState() {
  Object.assign(rig.intro, {
    active: true,
    zoom: INTRO_ZOOM,
    look: 0,
    reveal: 0,
    shadow: 1,
    // Head turned away from the viewer; it will turn to make eye contact at 1.0s.
    headYaw: 0.85,
    headPitch: 0.04,
    headRoll: 0,
    arm: 0,
    wave: 0,
    happy: 0,
  });
  rig.mode = "scripted";
  rig.ufo.pos.copy(UFO_HOME);
  rig.ufo.script.copy(UFO_HOME);
  rig.ufo.vel.set(0, 0, 0);
  rig.ufo.focus = null;
  useGame.setState({ phase: "intro", introPhase: "loading", introBubble: false, hudVisible: false });
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Mounted inside the main <Suspense> boundary, so it only mounts once the UFO GLB,
 * the diorama and the environment are resolved. The 7s clock starts after a few
 * rendered frames so shader compilation never eats into the choreography.
 */
export function IntroDirector() {
  useEffect(() => {
    resetIntroState();

    let cancelled = false;
    let finished = false;
    let skipRequested = false;
    let tl: gsap.core.Timeline | null = null;
    let skipTween: gsap.core.Tween | null = null;

    const finish = () => {
      if (finished) return;
      finished = true;
      skipTween?.kill();
      Object.assign(rig.intro, {
        active: false,
        zoom: 1,
        look: 1,
        reveal: 1,
        shadow: 0,
        headYaw: 0,
        headPitch: 0,
        headRoll: 0,
        arm: 0,
        wave: 0,
        happy: 0,
      });
      rig.fx.engine = 0;
      // Hand the UFO back to the cursor exactly where the script left it.
      rig.ufo.target.set(rig.ufo.pos.x, FLIGHT_ALTITUDE, rig.ufo.pos.z);
      rig.ufo.script.copy(rig.ufo.pos);
      rig.mode = "free";
      useGame.setState({ phase: "idle", introPhase: "done", introBubble: false, hudVisible: true });
    };

    const fastForward = () => {
      if (finished || !tl || skipTween) return;
      tl.pause();
      const remaining = INTRO_DURATION - tl.time();
      useGame.setState({ introBubble: false });
      skipTween = gsap.to(tl, {
        time: INTRO_DURATION,
        duration: Math.min(1.1, Math.max(0.45, remaining * 0.2)),
        ease: "power2.inOut",
        onComplete: finish,
      });
    };

    rig.intro.skip = () => {
      if (tl) fastForward();
      else skipRequested = true;
    };

    const build = () => {
      const I = rig.intro;
      const S = rig.ufo.script;
      const setBubble = (introBubble: boolean) => useGame.setState({ introBubble });

      tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
      useGame.setState({ introPhase: "playing" });

      // 0.0–1.0 — hover, a curious glance to the side (head still turned away).
      tl.to(I, { headYaw: 0.62, duration: 1, ease: "sine.inOut" }, 0);

      // 1.0–2.0 — turn toward the camera, lock eyes, raise the hand.
      tl.to(I, { headYaw: 0, headPitch: -0.5, duration: 0.9, ease: "power3.inOut" }, 1.0);
      tl.to(I, { arm: 1, duration: 0.95, ease: "back.out(1.5)" }, 1.05);
      tl.to(I, { happy: 0.7, duration: 0.5, ease: "power2.out" }, 1.45);
      tl.to(I, { wave: 1, duration: 0.3, ease: "power1.out" }, 1.75);

      // 2.0–4.0 — greeting. Speech bubble pops in; head tilts with curiosity.
      tl.call(() => setBubble(true), [], 2.0);
      tl.to(I, { headRoll: 0.24, headPitch: -0.42, duration: 0.55, ease: "power2.inOut" }, 2.3);
      tl.to(I, { headRoll: -0.1, headPitch: -0.5, duration: 0.7, ease: "sine.inOut" }, 3.0);
      tl.to(I, { headRoll: 0.0, duration: 0.3, ease: "sine.out" }, 3.7);

      // 4.0–5.0 — finish waving, turn forward, the UFO powers up to fly.
      tl.call(() => setBubble(false), [], 4.0);
      tl.to(I, { wave: 0, duration: 0.35, ease: "power1.in" }, 4.0);
      tl.to(I, { arm: 0, duration: 0.7, ease: "power2.inOut" }, 4.15);
      tl.to(I, { headYaw: 0, headPitch: 0, headRoll: 0, happy: 0, duration: 0.8, ease: "power2.inOut" }, 4.0);
      tl.to(S, { y: FLIGHT_ALTITUDE + 0.32, duration: 1.0, ease: "power2.out" }, 4.0);
      tl.to(rig.fx, { engine: 1, duration: 1.0, ease: "power1.in" }, 4.0);

      // 5.0–7.0 — smooth camera pull-back; the diorama rises into place; UI fades in.
      tl.to(I, { zoom: 1, look: 1, duration: 2.0, ease: "power3.inOut" }, 5.0);
      tl.to(I, { reveal: 1, duration: 1.7, ease: "power2.out" }, 5.15);
      tl.to(I, { shadow: 0, duration: 1.3, ease: "power1.inOut" }, 5.0);
      tl.to(S, { y: FLIGHT_ALTITUDE, duration: 2.0, ease: "power2.inOut" }, 5.0);
      tl.to(rig.fx, { engine: 0, duration: 1.2, ease: "power2.out" }, 5.8);
      tl.call(() => useGame.setState({ hudVisible: true }), [], 6.2);

      // Pin the total duration to exactly 7 seconds and hand control back.
      tl.call(finish, [], INTRO_DURATION);

      if (skipRequested) fastForward();
    };

    (async () => {
      // Do not start the clock until fonts, the GLB, the scene and the first frames are ready.
      try {
        await document.fonts?.ready;
      } catch {
        /* ignore */
      }
      for (let i = 0; i < 4; i++) await nextFrame();
      await wait(250);
      if (cancelled) return;
      build();
    })();

    return () => {
      cancelled = true;
      skipTween?.kill();
      tl?.kill();
      rig.intro.skip = () => {};
    };
  }, []);

  return null;
}
