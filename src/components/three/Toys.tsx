"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { PALETTE, resin } from "@/lib/materials";
import { rig } from "@/lib/rig";

/* -------------------------------------------------------------------------- */
/*  01 · THE MONOLITH — cobalt architectural tower                             */
/* -------------------------------------------------------------------------- */

export function Monolith() {
  const m = useMemo(
    () => ({
      cobalt: resin(PALETTE.cobalt, { roughness: 0.28, clearcoat: 1 }),
      cobaltDeep: resin("#2440C8", { roughness: 0.32 }),
      ink: resin(PALETTE.ink, { roughness: 0.4, highlight: false }),
      orange: resin(PALETTE.vermilion, { roughness: 0.3 }),
      acid: resin(PALETTE.chartreuse, { roughness: 0.25 }),
      cream: resin(PALETTE.cream, { roughness: 0.35, highlight: false }),
    }),
    [],
  );
  const beacon = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const h = rig.collectibles.monolith.hover;
    if (beacon.current) {
      const s = 1 + Math.max(0, Math.sin(clock.elapsedTime * 6)) * 0.35 * (0.3 + h);
      beacon.current.scale.setScalar(s);
    }
  });

  return (
    <group scale={0.78}>
      {/* foot */}
      <RoundedBox args={[0.98, 0.14, 0.98]} radius={0.04} smoothness={3} position={[0, 0.07, 0]} material={m.ink} />
      <RoundedBox args={[0.82, 0.12, 0.82]} radius={0.035} smoothness={3} position={[0, 0.2, 0]} material={m.cobaltDeep} />
      {/* main shaft */}
      <RoundedBox args={[0.58, 1.28, 0.58]} radius={0.05} smoothness={4} position={[0, 0.9, 0]} material={m.cobalt} />
      {/* vertical grooves on the front + side */}
      {[-0.15, 0, 0.15].map((x) => (
        <mesh key={`g${x}`} position={[x, 0.86, 0.292]} material={m.cobaltDeep}>
          <boxGeometry args={[0.035, 1.02, 0.02]} />
        </mesh>
      ))}
      {[-0.12, 0.12].map((z) => (
        <mesh key={`s${z}`} position={[0.292, 0.86, z]} material={m.cobaltDeep}>
          <boxGeometry args={[0.02, 1.02, 0.035]} />
        </mesh>
      ))}
      {/* black band */}
      <RoundedBox args={[0.62, 0.07, 0.62]} radius={0.02} smoothness={2} position={[0, 1.42, 0]} material={m.ink} />
      {/* cantilever — vermilion slab breaking the silhouette */}
      <RoundedBox args={[0.98, 0.1, 0.32]} radius={0.03} smoothness={3} position={[0.36, 1.08, 0.08]} material={m.orange} />
      <mesh ref={beacon} position={[0.8, 1.17, 0.08]} material={m.acid}>
        <sphereGeometry args={[0.055, 20, 14]} />
      </mesh>
      {/* twisted upper volume */}
      <group position={[0.06, 1.72, -0.05]} rotation-y={Math.PI / 4}>
        <RoundedBox args={[0.46, 0.52, 0.46]} radius={0.04} smoothness={3} material={m.cobalt} />
        {/* acid window slits */}
        {[0.12, 0, -0.12].map((y) => (
          <mesh key={y} position={[0, y, 0.235]} material={m.acid}>
            <boxGeometry args={[0.22, 0.045, 0.02]} />
          </mesh>
        ))}
        {/* crown */}
        <mesh position={[0, 0.42, 0]} rotation-y={Math.PI / 4} material={m.cobaltDeep}>
          <coneGeometry args={[0.31, 0.34, 4, 1]} />
        </mesh>
        <mesh position={[0, 0.66, 0]} material={m.ink}>
          <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
        </mesh>
        <mesh position={[0, 0.79, 0]} material={m.orange}>
          <sphereGeometry args={[0.04, 16, 12]} />
        </mesh>
      </group>
      {/* cream plaque */}
      <RoundedBox args={[0.3, 0.12, 0.02]} radius={0.01} smoothness={2} position={[-0.1, 0.42, 0.3]} material={m.cream} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  02 · THE SIGNAL — vermilion cassette boombox                               */
/* -------------------------------------------------------------------------- */

function Speaker({ x, m, refCb }: { x: number; m: Record<string, THREE.Material>; refCb: (o: THREE.Group | null) => void }) {
  return (
    <group position={[x, 0.5, 0.215]} rotation-x={Math.PI / 2}>
      <mesh material={m.ink}>
        <cylinderGeometry args={[0.215, 0.215, 0.05, 40]} />
      </mesh>
      <mesh position-y={0.028} rotation-x={Math.PI / 2} material={m.cream}>
        <torusGeometry args={[0.2, 0.024, 12, 40]} />
      </mesh>
      <group ref={refCb}>
        <mesh position-y={0.03} material={m.dark}>
          <cylinderGeometry args={[0.13, 0.16, 0.03, 32]} />
        </mesh>
        <mesh position-y={0.05} material={m.cream}>
          <sphereGeometry args={[0.05, 20, 12]} />
        </mesh>
      </group>
    </group>
  );
}

export function Signal() {
  const m = useMemo(
    () => ({
      body: resin(PALETTE.vermilion, { roughness: 0.3, clearcoat: 1 }),
      ink: resin(PALETTE.ink, { roughness: 0.45, highlight: false }),
      dark: resin("#2B2B2B", { roughness: 0.6, highlight: false }),
      cream: resin(PALETTE.cream, { roughness: 0.35, highlight: false }),
      acid: resin(PALETTE.chartreuse, { roughness: 0.25 }),
      cobalt: resin(PALETTE.cobalt, { roughness: 0.3 }),
      glass: resin("#1d1d1d", { roughness: 0.08, clearcoat: 1, highlight: false }),
    }),
    [],
  );
  const speakers = useRef<(THREE.Group | null)[]>([]);
  const reels = useRef<(THREE.Group | null)[]>([]);
  const antenna = useRef<THREE.Group>(null);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    const h = rig.collectibles.signal.hover;
    const beat = Math.pow(Math.abs(Math.sin(t * 7.5)), 6);
    speakers.current.forEach((s) => s && s.position.set(0, beat * 0.035 * (0.15 + h), 0));
    reels.current.forEach((r) => r && (r.rotation.z -= dt * (0.6 + h * 6)));
    if (antenna.current) antenna.current.rotation.z = -0.5 + Math.sin(t * 9) * 0.05 * h;
  });

  return (
    <group>
      {/* feet */}
      {[
        [-0.5, -0.13],
        [0.5, -0.13],
        [-0.5, 0.13],
        [0.5, 0.13],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.06, z]} material={m.ink}>
          <cylinderGeometry args={[0.055, 0.065, 0.12, 16]} />
        </mesh>
      ))}
      {/* body */}
      <RoundedBox args={[1.3, 0.74, 0.42]} radius={0.09} smoothness={4} position={[0, 0.49, 0]} material={m.body} />
      {/* back panel detail */}
      <RoundedBox args={[1.12, 0.5, 0.04]} radius={0.02} smoothness={2} position={[0, 0.5, -0.215]} material={m.ink} />
      {/* top deck */}
      <RoundedBox args={[1.16, 0.05, 0.34]} radius={0.02} smoothness={2} position={[0, 0.87, 0]} material={m.ink} />
      {/* buttons */}
      {[-0.42, -0.3, -0.18, -0.06].map((x, i) => (
        <RoundedBox
          key={x}
          args={[0.09, 0.05, 0.12]}
          radius={0.015}
          smoothness={2}
          position={[x, 0.915 - (i === 1 ? 0.02 : 0), 0.04]}
          material={i === 2 ? m.acid : m.cream}
        />
      ))}
      {/* tuning dial */}
      <mesh position={[0.32, 0.91, 0.04]} material={m.cobalt}>
        <cylinderGeometry args={[0.07, 0.07, 0.05, 24]} />
      </mesh>
      {/* speakers */}
      <Speaker x={-0.39} m={m} refCb={(o) => (speakers.current[0] = o)} />
      <Speaker x={0.39} m={m} refCb={(o) => (speakers.current[1] = o)} />
      {/* cassette window */}
      <group position={[0, 0.52, 0.215]}>
        <RoundedBox args={[0.38, 0.26, 0.04]} radius={0.015} smoothness={2} material={m.glass} />
        {[-0.085, 0.085].map((x, i) => (
          <group key={x} position={[x, 0.01, 0.025]} rotation-x={Math.PI / 2} ref={(o) => void (reels.current[i] = o)}>
            <mesh material={m.cream}>
              <cylinderGeometry args={[0.055, 0.055, 0.015, 6]} />
            </mesh>
            <mesh position-y={0.01} material={m.ink}>
              <cylinderGeometry args={[0.018, 0.018, 0.012, 10]} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.09, 0.022]} material={m.acid}>
          <boxGeometry args={[0.28, 0.025, 0.01]} />
        </mesh>
      </group>
      {/* handle */}
      <group position={[0, 0.9, -0.04]}>
        <mesh material={m.ink}>
          <torusGeometry args={[0.42, 0.034, 12, 40, Math.PI]} />
        </mesh>
        {[-0.42, 0.42].map((x) => (
          <RoundedBox key={x} args={[0.1, 0.08, 0.1]} radius={0.02} smoothness={2} position={[x, 0, 0]} material={m.ink} />
        ))}
      </group>
      {/* antenna */}
      <group ref={antenna} position={[0.56, 0.9, -0.12]} rotation-z={-0.5}>
        <mesh position-y={0.32} material={m.cream}>
          <cylinderGeometry args={[0.012, 0.016, 0.64, 8]} />
        </mesh>
        <mesh position-y={0.66} material={m.acid}>
          <sphereGeometry args={[0.045, 16, 12]} />
        </mesh>
      </group>
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*  03 · THE ODD TREE — acid chartreuse sculptural bonsai                      */
/* -------------------------------------------------------------------------- */

function tube(points: [number, number, number][], radius: number) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  return new THREE.TubeGeometry(curve, 32, radius, 10, false);
}

const PADS: { p: [number, number, number]; r: number; s: [number, number, number] }[] = [
  { p: [-0.64, 1.08, 0.04], r: 0.3, s: [1.15, 0.5, 0.95] },
  { p: [0.66, 1.4, -0.02], r: 0.36, s: [1.2, 0.48, 1] },
  { p: [0.14, 1.5, -0.08], r: 0.28, s: [1, 0.55, 0.9] },
  { p: [0.36, 1.18, 0.16], r: 0.2, s: [1.1, 0.55, 1] },
  { p: [-0.28, 0.9, 0.18], r: 0.15, s: [1.1, 0.55, 1] },
];

export function OddTree() {
  const m = useMemo(
    () => ({
      leaf: resin(PALETTE.chartreuse, { roughness: 0.3, clearcoat: 1 }),
      trunk: resin(PALETTE.ink, { roughness: 0.35, highlight: false }),
      pot: resin(PALETTE.ink, { roughness: 0.42, highlight: false }),
      rim: resin(PALETTE.cobalt, { roughness: 0.28 }),
      soil: resin("#CFC6B2", { roughness: 0.8, clearcoat: 0, highlight: false }),
      fruit: resin(PALETTE.vermilion, { roughness: 0.22 }),
      stone: resin(PALETTE.cobalt, { roughness: 0.3 }),
    }),
    [],
  );
  const geo = useMemo(
    () => ({
      trunk: tube(
        [
          [0, 0.34, 0],
          [0.06, 0.55, 0.02],
          [-0.1, 0.78, 0.06],
          [-0.02, 0.98, 0.02],
          [0.18, 1.14, -0.02],
          [0.14, 1.42, -0.06],
        ],
        0.065,
      ),
      branchL: tube(
        [
          [-0.08, 0.8, 0.05],
          [-0.35, 0.86, 0.08],
          [-0.55, 0.98, 0.05],
        ],
        0.04,
      ),
      branchR: tube(
        [
          [0.12, 1.08, 0],
          [0.4, 1.2, -0.04],
          [0.62, 1.32, -0.02],
        ],
        0.04,
      ),
      branchS: tube(
        [
          [0.1, 1.06, 0.02],
          [0.26, 1.1, 0.12],
          [0.34, 1.13, 0.16],
        ],
        0.028,
      ),
      pad: new THREE.IcosahedronGeometry(1, 4),
    }),
    [],
  );
  const pads = useRef<(THREE.Mesh | null)[]>([]);
  const fruit = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const h = rig.collectibles.oddtree.hover;
    pads.current.forEach((pad, i) => {
      if (!pad) return;
      const base = PADS[i];
      pad.position.y = base.p[1] + Math.sin(t * 3 + i * 1.7) * 0.025 * h;
      const pulse = 1 + Math.sin(t * 4 + i) * 0.04 * h;
      pad.scale.set(base.r * base.s[0] * pulse, base.r * base.s[1] * (2 - pulse), base.r * base.s[2] * pulse);
    });
    if (fruit.current) fruit.current.rotation.z = Math.sin(t * 2.6) * (0.08 + 0.3 * h);
  });

  return (
    <group>
      {/* pot */}
      <RoundedBox args={[0.88, 0.3, 0.6]} radius={0.06} smoothness={3} position={[0, 0.15, 0]} material={m.pot} />
      <RoundedBox args={[0.94, 0.06, 0.66]} radius={0.025} smoothness={2} position={[0, 0.31, 0]} material={m.rim} />
      <mesh position={[0, 0.335, 0]} material={m.soil}>
        <boxGeometry args={[0.8, 0.02, 0.52]} />
      </mesh>
      <mesh position={[0.25, 0.37, 0.1]} scale={[0.11, 0.07, 0.09]} material={m.stone} geometry={geo.pad} />
      {/* feet */}
      {[-0.32, 0.32].map((x) => (
        <mesh key={x} position={[x, -0.0, 0.2]} material={m.rim}>
          <boxGeometry args={[0.12, 0.04, 0.08]} />
        </mesh>
      ))}
      {/* trunk & branches */}
      <mesh geometry={geo.trunk} material={m.trunk} />
      <mesh geometry={geo.branchL} material={m.trunk} />
      <mesh geometry={geo.branchR} material={m.trunk} />
      <mesh geometry={geo.branchS} material={m.trunk} />
      {/* sculpted foliage pads */}
      {PADS.map((pad, i) => (
        <mesh
          key={i}
          ref={(o) => void (pads.current[i] = o)}
          geometry={geo.pad}
          material={m.leaf}
          position={pad.p}
          scale={[pad.r * pad.s[0], pad.r * pad.s[1], pad.r * pad.s[2]]}
        />
      ))}
      {/* hanging vermilion fruit */}
      <group ref={fruit} position={[0.86, 1.3, 0.08]}>
        <mesh position-y={-0.08} material={m.trunk}>
          <cylinderGeometry args={[0.006, 0.006, 0.16, 5]} />
        </mesh>
        <mesh position-y={-0.2} material={m.fruit}>
          <sphereGeometry args={[0.075, 20, 14]} />
        </mesh>
      </group>
    </group>
  );
}
