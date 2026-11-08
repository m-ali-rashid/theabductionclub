"use client";

import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/store/useGame";
import { COLLECTIBLE_MAP, pad2, type CollectibleId } from "@/data/collectibles";
import { PLACEMENTS, rig } from "@/lib/rig";
import { PALETTE, getBlobTexture } from "@/lib/materials";
import { sfx } from "@/lib/sound";

const damp = THREE.MathUtils.damp;
const smooth = THREE.MathUtils.smoothstep;

type Props = { id: CollectibleId; children: ReactNode };

/** Corner-bracket target marker drawn flat on the plinth. */
function TargetMarker({ radius, material }: { radius: number; material: THREE.Material }) {
  const r = radius * 1.18;
  const len = radius * 0.42;
  const w = 0.045;
  const corners: [number, number][] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
  ];
  return (
    <group>
      {corners.map(([sx, sz], i) => (
        <group key={i} position={[sx * r, 0, sz * r]}>
          <mesh position={[-sx * (len / 2 - w / 2), 0, 0]} material={material}>
            <boxGeometry args={[len, 0.012, w]} />
          </mesh>
          <mesh position={[0, 0, -sz * (len / 2 - w / 2)]} material={material}>
            <boxGeometry args={[w, 0.012, len]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Collectible({ id, children }: Props) {
  const p = PLACEMENTS[id];
  const data = COLLECTIBLE_MAP[id];
  const rt = rig.collectibles[id];

  const outer = useRef<THREE.Group>(null);
  const lean = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group>(null);
  const content = useRef<THREE.Group>(null);
  const marker = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLDivElement>(null);
  const mats = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const local = useRef({ pointer: false, near: 0, yaw: 0, yawV: 0, labelOp: -1, wasNear: false });

  const markerMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.ink, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const dotMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.vermilion, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const blobMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: getBlobTexture(),
        color: "#2a2418",
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    [],
  );

  useLayoutEffect(() => {
    const list: THREE.MeshPhysicalMaterial[] = [];
    content.current?.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      const mat = m.material as THREE.MeshPhysicalMaterial;
      if (mat?.userData?.highlight && !list.includes(mat)) list.push(mat);
    });
    mats.current = list;
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 20);
    const t = state.clock.elapsedTime;
    const g = useGame.getState();
    const a = rt.anim;
    const L = local.current;
    const captured = g.captured.includes(id);
    const isActive = g.activeId === id && g.phase !== "idle";

    // Proximity of the UFO (which follows the cursor) to this object.
    const ux = rig.ufo.pos.x - rt.base.x;
    const uz = rig.ufo.pos.z - rt.base.z;
    const d = Math.hypot(ux, uz);
    const near = 1 - smooth(d, 0.7, 2.6);

    let target = 0;
    if (!captured && g.phase === "idle") target = Math.max(near, L.pointer ? 1 : 0);
    if (isActive && (g.phase === "approach" || g.phase === "scan")) target = 1;
    rt.hover = damp(rt.hover, target, 6, dt);
    const h = rt.hover * (1 - a.locked);

    // Wobble when the UFO swoops in close.
    const isNear = near > 0.45 && !captured;
    if (isNear && !L.wasNear && g.phase === "idle") {
      a.wobble = Math.min(1, a.wobble + 0.8);
      sfx.hover(id);
    }
    L.wasNear = isNear;
    a.wobble *= Math.exp(-dt * 2.6);

    // --- lean toward the UFO ---
    const dirX = d > 1e-3 ? ux / d : 0;
    const dirZ = d > 1e-3 ? uz / d : 0;
    const tilt = h * 0.13;
    const wob = Math.sin(t * 17) * a.wobble * 0.09;
    if (lean.current) {
      let rx = dirZ * tilt + wob * dirX;
      let rz = -dirX * tilt + wob * dirZ;
      // unique reactions
      if (id === "oddtree") {
        rz += Math.sin(t * 2.3) * 0.07 * h;
        rx += Math.cos(t * 1.9) * 0.04 * h;
      }
      lean.current.rotation.x = damp(lean.current.rotation.x, rx, 10, dt);
      lean.current.rotation.z = damp(lean.current.rotation.z, rz, 10, dt);
      let y = h * 0.16 + a.lift;
      if (id === "signal") y += Math.abs(Math.sin(t * 7.5)) * 0.07 * h;
      lean.current.position.y = y;
    }

    // --- yaw: Monolith snaps to face the UFO in architectural 45° steps ---
    let yawTarget = 0;
    if (id === "monolith") {
      const face = Math.atan2(ux, uz) - p.yaw;
      const stepped = Math.round(face / (Math.PI / 4)) * (Math.PI / 4);
      yawTarget = h > 0.3 ? stepped : 0;
      const k = 120;
      const c = 2 * 0.55 * Math.sqrt(k);
      // shortest path
      let diff = yawTarget - L.yaw;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      L.yawV += (k * diff - c * L.yawV) * dt;
      L.yaw += L.yawV * dt;
    } else if (id === "signal") {
      L.yaw = damp(L.yaw, Math.sin(t * 3.5) * 0.12 * h, 8, dt);
    } else {
      L.yaw = damp(L.yaw, h * 0.35, 4, dt);
    }

    if (pivot.current) {
      pivot.current.rotation.y = p.yaw + L.yaw + a.spin;
      const sq = a.squash * (id === "monolith" ? 1 + h * 0.035 : 1);
      const xz = 1 / Math.sqrt(sq);
      pivot.current.scale.set(a.scale * xz, a.scale * sq, a.scale * xz);
    }

    if (outer.current) outer.current.visible = a.scale > 0.002;

    // --- material highlight ---
    const glow = h * 0.16 + a.locked * 0.22 + Math.sin(t * 6) * 0.04 * h;
    for (const m of mats.current) m.emissiveIntensity = glow;

    // --- target marker ---
    if (marker.current) {
      const mo = captured ? 0 : Math.max(h, isActive && g.phase === "approach" ? 1 : 0);
      markerMat.opacity = mo;
      dotMat.opacity = mo;
      marker.current.visible = mo > 0.01;
      marker.current.scale.setScalar(1.12 - 0.12 * mo + Math.sin(t * 5) * 0.015 * mo);
      marker.current.rotation.y += dt * 0.5 * mo;
    }

    // --- contact shadow: softer & fainter as it rises ---
    if (blob.current) {
      const lift = Math.max(0, a.lift);
      const spread = 1 + lift * 0.45 + h * 0.08;
      blob.current.scale.set(p.radius * 2.4 * spread, p.radius * 2.4 * spread, 1);
      blobMat.opacity = (0.42 / (1 + lift * 1.6)) * Math.min(1, a.scale * 1.5);
    }

    // --- label (DOM write only when it changes) ---
    const lo = captured ? 0 : g.phase === "idle" ? smooth(h, 0.35, 0.8) : 0;
    if (label.current && Math.abs(lo - L.labelOp) > 0.01) {
      L.labelOp = lo;
      label.current.style.opacity = String(lo);
      label.current.style.transform = `translate3d(-50%, ${(1 - lo) * 8}px, 0)`;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    local.current.pointer = true;
    const g = useGame.getState();
    if (!g.captured.includes(id)) {
      g.setHovered(id);
      if (g.phase === "idle") document.body.style.cursor = "pointer";
    }
  };
  const onOut = () => {
    local.current.pointer = false;
    const g = useGame.getState();
    if (g.hoveredId === id) g.setHovered(null);
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "";
    useGame.getState().select(id);
  };

  return (
    <group ref={outer} position={p.position}>
      {/* contact shadow */}
      <mesh ref={blob} rotation-x={-Math.PI / 2} position-y={0.006} material={blobMat} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      {/* target marker */}
      <group ref={marker} position-y={0.012} visible={false}>
        <TargetMarker radius={p.radius} material={markerMat} />
        <mesh position={[p.radius * 1.18 + 0.12, 0, -p.radius * 1.18 - 0.12]} material={dotMat}>
          <boxGeometry args={[0.1, 0.012, 0.1]} />
        </mesh>
      </group>

      <group ref={lean}>
        {/* pivot sits at the toy's centre so spin & scale feel natural */}
        <group position-y={p.height / 2}>
          <group ref={pivot}>
            <group ref={content} position-y={-p.height / 2}>
              {children}
            </group>
          </group>
        </group>

        {/* generous invisible hit volume — easier to target, touch friendly */}
        <mesh
          position-y={p.height / 2}
          onPointerOver={onOver}
          onPointerOut={onOut}
          onClick={onClick}
        >
          <cylinderGeometry args={[p.radius * 1.15, p.radius * 1.15, p.height + 0.5, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
        </mesh>

        <Html position={[0, p.height + 0.35, 0]} zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
          <div ref={label} className="toy-label" style={{ opacity: 0 }}>
            <span className="toy-label__num">{pad2(data.index)}</span>
            <span className="toy-label__name">{data.name}</span>
          </div>
        </Html>
      </group>
    </group>
  );
}
