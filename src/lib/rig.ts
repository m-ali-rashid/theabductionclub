import * as THREE from "three";
import type { CollectibleId } from "@/data/collectibles";

/**
 * World layout — all positions in world units (Y up).
 * The camera looks from +X +Y +Z, so screen-right ≈ (+x, −z) and
 * screen-down ≈ (+x, +z).
 */
export const UFO_SCALE = 0.4;
export const UFO_EMITTER_Y = -1.06; // model space, bottom of engine core
export const FLIGHT_ALTITUDE = 3.65;
export const UFO_HOME = new THREE.Vector3(0.4, FLIGHT_ALTITUDE, 0.6);

/** XZ bounds the UFO may fly in (also clamped against the viewport in screen space). */
export const FLIGHT_BOUNDS = { minX: -4.6, maxX: 5.6, minZ: -3.6, maxZ: 3.8 };

export type Placement = {
  id: CollectibleId;
  /** Base position of the collectible (top of its plinth). */
  position: [number, number, number];
  /** Approximate height of the toy, used for beam / scan / label placement. */
  height: number;
  /** Rest yaw. */
  yaw: number;
  /** Footprint radius for markers & scan ring. */
  radius: number;
};

export const PLACEMENTS: Record<CollectibleId, Placement> = {
  monolith: { id: "monolith", position: [-2.25, 1.0, -0.95], height: 1.85, yaw: 0.3, radius: 0.72 },
  oddtree: { id: "oddtree", position: [1.55, 0.95, -1.55], height: 1.65, yaw: -0.15, radius: 0.8 },
  signal: { id: "signal", position: [3.7, 0.36, 1.45], height: 1.3, yaw: 0.6, radius: 0.85 },
};

export type CollectibleAnim = {
  /** Vertical offset driven by the abduction timeline. */
  lift: number;
  /** Extra yaw spin from the timeline. */
  spin: number;
  /** Uniform scale (1 = normal, 0 = absorbed). */
  scale: number;
  /** Squash & stretch on Y (1 = neutral). */
  squash: number;
  /** 0..1 how "locked" by the tractor beam (suppresses hover behaviours). */
  locked: number;
  /** Wobble impulse, decays per frame. */
  wobble: number;
};

export type CollectibleRuntime = {
  base: THREE.Vector3;
  anim: CollectibleAnim;
  /** Smoothed 0..1 proximity / hover amount (written each frame). */
  hover: number;
};

const makeAnim = (): CollectibleAnim => ({ lift: 0, spin: 0, scale: 1, squash: 1, locked: 0, wobble: 0 });

/**
 * Mutable per-frame state shared between scene components.
 * Lives outside React so animation never triggers re-renders.
 */
export const rig = {
  pointer: { ndcX: 0, ndcY: 0, px: 0, py: 0, active: false, moved: 0 },
  mode: "free" as "free" | "scripted",
  ufo: {
    pos: UFO_HOME.clone(),
    vel: new THREE.Vector3(),
    target: UFO_HOME.clone(),
    /** GSAP writes here while mode === "scripted". */
    script: UFO_HOME.clone(),
    /** Optional yaw focus point (world) – the UFO turns gently toward it. */
    focus: null as THREE.Vector3 | null,
  },
  emitterWorld: new THREE.Vector3(),
  /** Screen-space rectangles (CSS px) the UFO avoids. */
  noFly: [] as { left: number; top: number; right: number; bottom: number }[],
  viewport: { width: 1, height: 1 },
  collectibles: {
    monolith: { base: new THREE.Vector3(...PLACEMENTS.monolith.position), anim: makeAnim(), hover: 0 },
    oddtree: { base: new THREE.Vector3(...PLACEMENTS.oddtree.position), anim: makeAnim(), hover: 0 },
    signal: { base: new THREE.Vector3(...PLACEMENTS.signal.position), anim: makeAnim(), hover: 0 },
  } as Record<CollectibleId, CollectibleRuntime>,
  /**
   * Cinematic intro state. GSAP (IntroDirector) tweens these values; Ufo, CameraRig
   * and the reveal group read them every frame. When `active` is false everything is neutral.
   */
  intro: {
    active: false,
    /** Camera zoom multiplier (>1 = close-up on the UFO). */
    zoom: 1,
    /** 0 = camera framed on the UFO, 1 = normal diorama framing. */
    look: 1,
    /** 0..1 reveal of the diorama (platform + collectibles). */
    reveal: 1,
    /** 0..1 opacity of the soft intro shadow beneath the UFO. */
    shadow: 0,
    /** Pilot head pose (radians). Yaw 0 + pitch ≈ -0.5 = looks straight into the camera. */
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    /** 0..1 how far the pilot's arm is raised. */
    arm: 0,
    /** 0..1 amplitude of the waving motion. */
    wave: 0,
    /** 0..1 happy squint on the eyes. */
    happy: 0,
    /** Hand-off helper so the Director can fast-forward the intro. */
    skip: (() => {}) as () => void,
  },
  fx: {
    /** 0..1 beam extension. */
    beam: 0,
    /** 0..1 beam opacity multiplier. */
    beamAlpha: 0,
    /** 0..1 scan ring reveal. */
    scan: 0,
    /** 0..1 cyan pulse beneath the UFO. */
    pulse: 0,
    /** Extra engine glow. */
    engine: 0,
    /** Pilot reaction 0..1 (look down + excited). */
    pilot: 0,
    /** Small vertical recoil applied to the UFO. */
    recoil: 0,
    target: new THREE.Vector3(),
    targetRadius: 0.8,
  },
};

export const resetCollectibleAnim = (id: CollectibleId) => {
  Object.assign(rig.collectibles[id].anim, makeAnim());
};
