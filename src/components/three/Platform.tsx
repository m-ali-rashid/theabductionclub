"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, resin, stage } from "@/lib/materials";
import { PLACEMENTS } from "@/lib/rig";

/**
 * Asymmetric modular display stage: three interlocking slabs of different
 * heights on cobalt skirts, a cobalt plinth for the Monolith, a black
 * octagonal riser for the Odd Tree, plus a few graphic accents.
 */
export function Platform() {
  const m = useMemo(
    () => ({
      cream: stage(PALETTE.cream, 0.55),
      warm: stage(PALETTE.warmGray, 0.6),
      cobalt: resin(PALETTE.cobalt, { roughness: 0.35, clearcoat: 0.5, highlight: false }),
      ink: stage(PALETTE.ink, 0.5),
      orange: resin(PALETTE.vermilion, { roughness: 0.35, clearcoat: 0.6, highlight: false }),
      acid: resin(PALETTE.chartreuse, { roughness: 0.3, clearcoat: 0.8, highlight: false }),
      decal: new THREE.MeshBasicMaterial({ color: PALETTE.ink }),
    }),
    [],
  );

  const mono = PLACEMENTS.monolith.position;
  const tree = PLACEMENTS.oddtree.position;

  return (
    <group>
      {/* shadow catcher floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position-y={0}>
        <planeGeometry args={[80, 80]} />
        <shadowMaterial transparent opacity={0.13} color="#3a2f1c" />
      </mesh>

      {/* ── Slab A: main cream deck ───────────────────────────── */}
      <RoundedBox args={[5.8, 0.18, 4.4]} radius={0.05} smoothness={3} position={[-1, 0.09, 0]} material={m.cobalt} castShadow receiveShadow />
      <RoundedBox args={[5.6, 0.42, 4.2]} radius={0.07} smoothness={3} position={[-1, 0.39, 0]} material={m.cream} castShadow receiveShadow />

      {/* ── Slab B: raised warm-gray block ────────────────────── */}
      <RoundedBox args={[3.2, 0.18, 2.8]} radius={0.05} smoothness={3} position={[2.2, 0.09, -1.5]} material={m.cobalt} castShadow receiveShadow />
      <RoundedBox args={[3.0, 0.6, 2.6]} radius={0.07} smoothness={3} position={[2.2, 0.48, -1.5]} material={m.warm} castShadow receiveShadow />

      {/* ── Slab C: low cream annex ───────────────────────────── */}
      <RoundedBox args={[3.6, 0.18, 3.0]} radius={0.05} smoothness={3} position={[3.35, 0.09, 1.45]} material={m.cobalt} castShadow receiveShadow />
      <RoundedBox args={[3.4, 0.18, 2.8]} radius={0.05} smoothness={3} position={[3.35, 0.27, 1.45]} material={m.cream} castShadow receiveShadow />

      {/* ── Monolith plinth (cobalt) ──────────────────────────── */}
      <RoundedBox args={[1.7, 0.4, 1.7]} radius={0.06} smoothness={3} position={[mono[0], 0.8, mono[2]]} material={m.cobalt} castShadow receiveShadow />
      <mesh position={[mono[0], 0.7, mono[2]]} material={m.ink}>
        <boxGeometry args={[1.72, 0.05, 1.72]} />
      </mesh>
      <mesh position={[mono[0] + 0.85, 0.82, mono[2] + 0.62]} material={m.orange}>
        <boxGeometry args={[0.03, 0.1, 0.22]} />
      </mesh>

      {/* ── Odd Tree riser (black octagon) ────────────────────── */}
      <mesh position={[tree[0], 0.865, tree[2]]} rotation-y={Math.PI / 8} material={m.ink} castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.78, 0.17, 8]} />
      </mesh>

      {/* ── graphic accents ───────────────────────────────────── */}
      {/* hazard bars on the front-left of the deck */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={`bar${i}`} position={[-3.35 + i * 0.19, 0.602, 1.35]} material={m.decal}>
          <boxGeometry args={[0.08, 0.004, 0.95]} />
        </mesh>
      ))}
      {/* landing zone decal */}
      <group position={[0.15, 0.603, 0.75]}>
        <mesh rotation-x={-Math.PI / 2} material={m.decal}>
          <ringGeometry args={[0.66, 0.71, 64]} />
        </mesh>
        <mesh material={m.decal}>
          <boxGeometry args={[0.04, 0.003, 0.5]} />
        </mesh>
        <mesh material={m.decal}>
          <boxGeometry args={[0.5, 0.003, 0.04]} />
        </mesh>
        <mesh position={[0.62, 0.002, -0.62]} material={m.orange}>
          <boxGeometry args={[0.12, 0.006, 0.12]} />
        </mesh>
      </group>
      {/* front rail */}
      <mesh position={[-0.2, 0.635, 2.02]} material={m.ink} castShadow>
        <boxGeometry args={[2.6, 0.07, 0.07]} />
      </mesh>
      {/* orange tag on deck front */}
      <mesh position={[-3.0, 0.39, 2.105]} material={m.orange}>
        <boxGeometry args={[0.9, 0.16, 0.02]} />
      </mesh>
      <mesh position={[-2.2, 0.39, 2.105]} material={m.ink}>
        <boxGeometry args={[0.5, 0.04, 0.02]} />
      </mesh>
      {/* orange step between annex & deck */}
      <RoundedBox args={[0.5, 0.12, 0.9]} radius={0.03} smoothness={2} position={[2.0, 0.42, 0.85]} material={m.orange} castShadow receiveShadow />
      {/* bolts on annex corners */}
      {[
        [1.85, 2.65],
        [4.85, 2.65],
        [4.85, 0.25],
      ].map(([x, z], i) => (
        <mesh key={`bolt${i}`} position={[x, 0.39, z]} material={m.orange} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
        </mesh>
      ))}
      {/* dot grid on annex */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`dot${i}`} position={[2.25 + (i % 4) * 0.2, 0.362, 2.15 + Math.floor(i / 4) * 0.2]} material={m.decal}>
          <cylinderGeometry args={[0.035, 0.035, 0.004, 12]} />
        </mesh>
      ))}
      {/* cobalt pillars, back-left */}
      <mesh position={[-3.4, 0.95, -1.75]} material={m.cobalt} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.7, 32]} />
      </mesh>
      <mesh position={[-3.4, 1.31, -1.75]} material={m.orange} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 32]} />
      </mesh>
      <mesh position={[-2.95, 0.8, -1.9]} material={m.ink} castShadow receiveShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.4, 24]} />
      </mesh>
      {/* acid sphere on peg */}
      <mesh position={[-0.35, 0.82, -1.6]} material={m.ink} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.45, 8]} />
      </mesh>
      <mesh position={[-0.35, 1.18, -1.6]} material={m.acid} castShadow>
        <sphereGeometry args={[0.22, 32, 20]} />
      </mesh>
      {/* chartreuse wedge on raised block */}
      <mesh position={[3.35, 0.86, -2.35]} rotation={[0, -0.4, 0]} material={m.acid} castShadow>
        <cylinderGeometry args={[0.0, 0.26, 0.16, 3]} />
      </mesh>
    </group>
  );
}
