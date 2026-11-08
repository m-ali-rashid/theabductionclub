"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/store/useGame";
import {
  FLIGHT_ALTITUDE,
  FLIGHT_BOUNDS,
  PLACEMENTS,
  UFO_EMITTER_Y,
  UFO_HOME,
  UFO_SCALE,
  rig,
} from "@/lib/rig";
import { PALETTE } from "@/lib/materials";

export const UFO_URL = "/models/ufo.glb";

const HEAD_PARTS = [
  "Robot_Head",
  "Robot_Black_Face_Visor",
  "Robot_Smiling_Eye_1",
  "Robot_Smiling_Eye_2",
  "Robot_Cheek_LED_1",
  "Robot_Cheek_LED_2",
  "Robot_Ear_Housing_1",
  "Robot_Ear_Light_1",
  "Robot_Ear_Housing_2",
  "Robot_Ear_Light_2",
  "Robot_Antenna_Stem_1",
  "Robot_Antenna_Ball_1",
  "Robot_Antenna_Stem_2",
  "Robot_Antenna_Ball_2",
];
const BODY_PARTS = ["Robot_Body", "Robot_Neck", "Robot_Arm_1", "Robot_Hand_1", "Robot_Arm_2", "Robot_Hand_2"];
const HEAD_PIVOT = new THREE.Vector3(0, 1.3, 0.04);
const BODY_PIVOT = new THREE.Vector3(0, 0.7, 0);

const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector2();
const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -FLIGHT_ALTITUDE);
const raycaster = new THREE.Raycaster();

const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;

function lerpAngle(a: number, b: number, t: number) {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

/** Re-parent a list of flat GLB nodes into a pivot group so they can animate as one. */
function groupParts(root: THREE.Object3D, name: string, parts: string[], pivot: THREE.Vector3) {
  const existing = root.getObjectByName(name);
  if (existing) return existing as THREE.Group;
  const g = new THREE.Group();
  g.name = name;
  g.position.copy(pivot);
  const world = root.getObjectByName("world") ?? root;
  world.add(g);
  for (const n of parts) {
    const o = root.getObjectByName(n);
    if (!o) continue;
    o.parent?.remove(o);
    o.position.sub(pivot);
    g.add(o);
  }
  return g;
}

/** 2nd-order spring for a scalar – gives natural overshoot & settle. */
type Spring = { x: number; v: number };
function stepSpring(s: Spring, target: number, k: number, zeta: number, dt: number) {
  const c = 2 * zeta * Math.sqrt(k);
  let remaining = dt;
  while (remaining > 1e-6) {
    const h = Math.min(remaining, 1 / 240);
    const a = k * (target - s.x) - c * s.v;
    s.v += a * h;
    s.x += s.v * h;
    remaining -= h;
  }
}

export function Ufo() {
  const { scene } = useGLTF(UFO_URL);
  const { camera, size } = useThree();

  const root = useRef<THREE.Group>(null);
  const bank = useRef<THREE.Group>(null);
  const yaw = useRef<THREE.Group>(null);
  const emitter = useRef<THREE.Object3D>(null);
  const pulseRing = useRef<THREE.Mesh>(null);
  const pulseGlow = useRef<THREE.Mesh>(null);

  const parts = useMemo(() => {
    const head = groupParts(scene, "PilotHead", HEAD_PARTS, HEAD_PIVOT);
    const body = groupParts(scene, "PilotBody", BODY_PARTS, BODY_PIVOT);
    const emissive: THREE.MeshStandardMaterial[] = [];
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat.name === "Transparent cyan cockpit dome") {
        mat.depthWrite = false;
        mat.envMapIntensity = 1.4;
        m.renderOrder = 2;
        m.castShadow = false;
        return;
      }
      m.castShadow = true;
      m.receiveShadow = true;
      if (mat.name === "Cyan emissive lights" && !emissive.includes(mat)) emissive.push(mat);
    });
    const eyes = ["Robot_Smiling_Eye_1", "Robot_Smiling_Eye_2"]
      .map((n) => scene.getObjectByName(n))
      .filter(Boolean) as THREE.Object3D[];
    return { head, body, emissive, eyes };
  }, [scene]);

  const sim = useRef({
    bankX: { x: 0, v: 0 } as Spring,
    bankZ: { x: 0, v: 0 } as Spring,
    yaw: Math.PI / 4,
    headYaw: 0,
    headPitch: 0,
    lastScript: new THREE.Vector3().copy(UFO_HOME),
    frame: 0,
    blink: 0,
    nextBlink: 2,
    wanderSeed: Math.random() * 10,
  });

  // Fresh start when the component mounts.
  useEffect(() => {
    rig.ufo.vel.set(0, 0, 0);
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const t = state.clock.elapsedTime;
    const s = sim.current;
    const g = useGame.getState();
    const ufo = rig.ufo;
    const reduced = g.reducedMotion;

    // --- refresh no-fly zones a few times per second (cheap DOM reads) ---
    if (s.frame++ % 20 === 0) {
      rig.viewport.width = size.width;
      rig.viewport.height = size.height;
      rig.noFly = Array.from(document.querySelectorAll<HTMLElement>("[data-nofly]"))
        .filter((el) => el.offsetParent !== null)
        .map((el) => el.getBoundingClientRect());
    }

    // --- 1. Choose a target ------------------------------------------------
    if (rig.mode === "free") {
      const p = rig.pointer;
      const useWander = !p.active || (g.isTouch && performance.now() / 1000 - p.moved > 6);
      if (useWander) {
        const w = s.wanderSeed;
        ufo.target.set(
          UFO_HOME.x + Math.sin(t * 0.31 + w) * 1.6,
          FLIGHT_ALTITUDE,
          UFO_HOME.z + Math.sin(t * 0.23 + w * 2) * 1.1,
        );
      } else {
        // Screen-space constraints: stay in the viewport and out of HTML UI.
        const zoom = (camera as THREE.OrthographicCamera).zoom;
        const r = UFO_SCALE * 3.2 * zoom * 0.62; // approx on-screen radius
        let px = clamp(p.px, r, size.width - r);
        let py = clamp(p.py, r * 0.8 + 70, size.height - r * 0.6);
        for (const rect of rig.noFly) {
          const L = rect.left - r * 0.75;
          const R = rect.right + r * 0.75;
          const T = rect.top - r * 0.55;
          const B = rect.bottom + r * 0.55;
          if (px > L && px < R && py > T && py < B) {
            const cands: [number, number, number][] = [
              [px - L, L, py],
              [R - px, R, py],
              [py - T, px, T],
              [B - py, px, B],
            ].filter(([, x, y]) => x > 0 && x < size.width && y > 60 && y < size.height) as [number, number, number][];
            cands.sort((a, b) => a[0] - b[0]);
            if (cands[0]) {
              px = cands[0][1];
              py = cands[0][2];
            }
          }
        }
        tmpV2.set((px / size.width) * 2 - 1, -(py / size.height) * 2 + 1);
        raycaster.setFromCamera(tmpV2, camera);
        if (raycaster.ray.intersectPlane(plane, tmpV)) {
          ufo.target.set(
            clamp(tmpV.x, FLIGHT_BOUNDS.minX, FLIGHT_BOUNDS.maxX),
            FLIGHT_ALTITUDE,
            clamp(tmpV.z, FLIGHT_BOUNDS.minZ, FLIGHT_BOUNDS.maxZ),
          );
        }
      }

      // --- 2. Integrate a slightly under-damped spring (frame-rate independent) ---
      const k = reduced ? 40 : 24;
      const zeta = reduced ? 1 : 0.74;
      const c = 2 * zeta * Math.sqrt(k);
      let remaining = dt;
      while (remaining > 1e-6) {
        const h = Math.min(remaining, 1 / 240);
        const ax = k * (ufo.target.x - ufo.pos.x) - c * ufo.vel.x;
        const ay = k * (ufo.target.y - ufo.pos.y) - c * ufo.vel.y;
        const az = k * (ufo.target.z - ufo.pos.z) - c * ufo.vel.z;
        ufo.vel.x += ax * h;
        ufo.vel.y += ay * h;
        ufo.vel.z += az * h;
        // soft speed cap keeps it lightweight, never twitchy
        const sp = Math.hypot(ufo.vel.x, ufo.vel.z);
        const max = 9;
        if (sp > max) {
          ufo.vel.x *= max / sp;
          ufo.vel.z *= max / sp;
        }
        ufo.pos.addScaledVector(ufo.vel, h);
        remaining -= h;
      }
      s.lastScript.copy(ufo.pos);
      ufo.script.copy(ufo.pos);
    } else {
      // Scripted (GSAP owns the position) – derive velocity for banking.
      const inv = 1 / Math.max(dt, 1e-4);
      tmpV.copy(ufo.script).sub(s.lastScript).multiplyScalar(inv);
      ufo.vel.x = damp(ufo.vel.x, tmpV.x, 12, dt);
      ufo.vel.y = damp(ufo.vel.y, tmpV.y, 12, dt);
      ufo.vel.z = damp(ufo.vel.z, tmpV.z, 12, dt);
      ufo.pos.copy(ufo.script);
      s.lastScript.copy(ufo.script);
    }

    if (!root.current || !bank.current || !yaw.current) return;

    // --- 3. Visual transform: hover, bank, yaw ------------------------------
    const speed = Math.hypot(ufo.vel.x, ufo.vel.z);
    const bobAmp = reduced ? 0.25 : 1;
    const bob = (Math.sin(t * 1.7) * 0.08 + Math.sin(t * 0.63 + 1.3) * 0.045) * bobAmp;
    const dip = -Math.min(speed * 0.035, 0.22);
    root.current.position.set(ufo.pos.x, ufo.pos.y + bob + dip + rig.fx.recoil, ufo.pos.z);

    const bankK = 0.075;
    const maxBank = 0.38;
    const tBX = clamp(ufo.vel.z * bankK + ufo.vel.y * 0.04, -maxBank, maxBank);
    const tBZ = clamp(-ufo.vel.x * bankK, -maxBank, maxBank);
    stepSpring(s.bankX, tBX, 70, reduced ? 1 : 0.42, dt);
    stepSpring(s.bankZ, tBZ, 70, reduced ? 1 : 0.42, dt);
    const idleRock = reduced ? 0 : 0.025;
    bank.current.rotation.set(
      s.bankX.x + Math.sin(t * 1.1) * idleRock,
      0,
      s.bankZ.x + Math.cos(t * 0.9) * idleRock,
    );

    // Yaw: face the camera (π/4), sway gently, turn toward focus / hovered object.
    let yawTarget = Math.PI / 4 + Math.sin(t * 0.35) * 0.22;
    let focus = ufo.focus;
    if (!focus && g.hoveredId && g.phase === "idle") focus = rig.collectibles[g.hoveredId].base;
    if (focus) {
      const fy = Math.atan2(focus.x - ufo.pos.x, focus.z - ufo.pos.z);
      const d = Math.hypot(focus.x - ufo.pos.x, focus.z - ufo.pos.z);
      // only turn meaningfully if the object is not directly underneath
      yawTarget = lerpAngle(yawTarget, fy, clamp(d / 2, 0, 1) * 0.45);
    }
    // lean the nose into lateral motion a touch
    yawTarget += clamp(-ufo.vel.x * 0.03 + ufo.vel.z * 0.03, -0.3, 0.3);
    s.yaw = lerpAngle(s.yaw, yawTarget, 1 - Math.exp(-3 * dt));
    yaw.current.rotation.y = s.yaw;

    // --- 4. Pilot reacts -----------------------------------------------------
    const pilot = rig.fx.pilot;
    const localVX = ufo.vel.x * Math.cos(s.yaw) - ufo.vel.z * Math.sin(s.yaw);
    s.headYaw = damp(s.headYaw, clamp(localVX * 0.12, -0.5, 0.5) * (1 - pilot), 5, dt);
    s.headPitch = damp(s.headPitch, pilot * 0.42 + (g.hoveredId ? 0.15 : 0), 6, dt);
    parts.head.rotation.set(s.headPitch, s.headYaw, Math.sin(t * 20) * 0.07 * pilot);
    parts.body.position.y = BODY_PIVOT.y + Math.abs(Math.sin(t * 14)) * 0.05 * pilot;
    parts.body.rotation.z = Math.sin(t * 7) * 0.05 * pilot;
    // blink — or happy squint while abducting
    s.nextBlink -= dt;
    if (s.nextBlink < 0) {
      s.blink = 1;
      s.nextBlink = 2.5 + Math.random() * 3;
    }
    s.blink = damp(s.blink, 0, 14, dt);
    const eyeY = Math.max(0.12, 1 - s.blink * 0.9 - pilot * 0.45);
    for (const e of parts.eyes) e.scale.y = eyeY;

    // Engine glow
    const glow = 1 + rig.fx.engine * 2.2 + Math.sin(t * 3) * 0.15;
    for (const m of parts.emissive) m.emissiveIntensity = glow;

    // Cyan pulse beneath the UFO
    const pulse = rig.fx.pulse;
    if (pulseRing.current && pulseGlow.current) {
      const cyc = (t * 1.6) % 1;
      pulseRing.current.visible = pulse > 0.01;
      pulseGlow.current.visible = pulse > 0.01;
      pulseRing.current.scale.setScalar(0.6 + cyc * 2.4);
      (pulseRing.current.material as THREE.MeshBasicMaterial).opacity = pulse * (1 - cyc) * 0.9;
      pulseGlow.current.scale.setScalar(1 + Math.sin(t * 9) * 0.08);
      (pulseGlow.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.85;
    }

    // Publish emitter world position for the tractor beam.
    emitter.current?.getWorldPosition(rig.emitterWorld);
  });

  return (
    <group ref={root} position={UFO_HOME.toArray()}>
      <group ref={bank}>
        <group ref={yaw}>
          <group scale={UFO_SCALE}>
            <primitive object={scene} />
            <object3D ref={emitter} position={[0, UFO_EMITTER_Y, 0]} />
            <mesh ref={pulseGlow} position={[0, UFO_EMITTER_Y - 0.05, 0]} rotation-x={-Math.PI / 2} visible={false}>
              <circleGeometry args={[0.62, 40]} />
              <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
            <mesh ref={pulseRing} position={[0, UFO_EMITTER_Y - 0.08, 0]} rotation-x={-Math.PI / 2} visible={false}>
              <ringGeometry args={[0.7, 0.82, 48]} />
              <meshBasicMaterial color={PALETTE.cyan} transparent opacity={0} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(UFO_URL);

/** Utility for other modules: hover altitude above a given collectible. */
export function hoverHeightFor(id: keyof typeof PLACEMENTS) {
  const p = PLACEMENTS[id];
  return Math.max(FLIGHT_ALTITUDE, p.position[1] + p.height + 1.25);
}
