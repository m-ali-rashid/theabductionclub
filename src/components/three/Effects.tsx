"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { rig } from "@/lib/rig";
import { PALETTE } from "@/lib/materials";

const beamVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFrag = /* glsl */ `
  uniform float uTime;
  uniform float uAlpha;
  uniform float uExtend;
  uniform vec3 uColor;
  uniform vec3 uCore;
  uniform float uSpeed;
  varying vec2 vUv;
  varying vec3 vN;
  void main() {
    // uv.y = 1 at the emitter, 0 at the target
    float along = 1.0 - vUv.y;
    if (along > uExtend) discard;
    float fres = pow(1.0 - abs(vN.z), 1.6);
    float bands = smoothstep(0.35, 0.5, fract(vUv.y * 9.0 - uTime * uSpeed)) * smoothstep(0.65, 0.5, fract(vUv.y * 9.0 - uTime * uSpeed));
    float streak = smoothstep(0.92, 1.0, sin(vUv.x * 6.2831 * 7.0 + uTime * 2.0) * 0.5 + 0.5);
    float tip = smoothstep(uExtend, uExtend - 0.04, along);
    float a = 0.34 + fres * 0.48 + bands * 0.28 + streak * 0.16;
    vec3 col = mix(uColor, uCore, bands * 0.55 + (1.0 - fres) * 0.2);
    gl_FragColor = vec4(col, clamp(a * uAlpha * tip, 0.0, 0.92));
  }
`;

/** Translucent animated cone from the UFO emitter down to the selected object. */
export function TractorBeam() {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  const outerGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.16, 1, 1, 48, 32, true);
    g.translate(0, -0.5, 0);
    return g;
  }, []);
  const innerGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.09, 0.42, 1, 32, 16, true);
    g.translate(0, -0.5, 0);
    return g;
  }, []);

  const makeMat = (color: string, core: string, speed: number) =>
    new THREE.ShaderMaterial({
      vertexShader: beamVert,
      fragmentShader: beamFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uAlpha: { value: 0 },
        uExtend: { value: 0 },
        uColor: { value: new THREE.Color(color) },
        uCore: { value: new THREE.Color(core) },
        uSpeed: { value: speed },
      },
    });
  const outerMat = useMemo(() => makeMat("#19C6D9", "#B9FFF8", 1.4), []);
  const innerMat = useMemo(() => makeMat("#4FF3E6", "#FFFFFF", 2.6), []);
  const ringMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0, depthWrite: false, toneMapped: false }),
    [],
  );

  const down = useMemo(() => new THREE.Vector3(0, -1, 0), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);

  useFrame((state) => {
    const fx = rig.fx;
    const g = group.current;
    if (!g) return;
    const vis = fx.beam > 0.001 && fx.beamAlpha > 0.001;
    g.visible = vis;
    if (!vis) return;
    const t = state.clock.elapsedTime;
    const top = rig.emitterWorld;
    const bottom = fx.target;
    dir.copy(bottom).sub(top);
    const len = Math.max(0.01, dir.length());
    dir.divideScalar(len);
    q.setFromUnitVectors(down, dir);
    g.position.copy(top);
    g.quaternion.copy(q);
    const r = fx.targetRadius * 1.05;
    g.scale.set(r, len, r);

    for (const m of [outerMat, innerMat]) {
      m.uniforms.uTime.value = t;
      m.uniforms.uAlpha.value = fx.beamAlpha;
      m.uniforms.uExtend.value = fx.beam;
    }
    // rising rings travel from the target up into the UFO
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const p = (t * 0.55 + i / 3) % 1; // 0 bottom → 1 top
      const along = 1 - p;
      ring.visible = along < fx.beam;
      ring.position.y = -along;
      const rad = 0.16 + (1 - 0.16) * along;
      ring.scale.set(rad, rad, 1);
      ringMat.opacity = 0.75 * fx.beamAlpha;
    });
  });

  return (
    <group ref={group} visible={false}>
      <mesh geometry={outerGeo} material={outerMat} renderOrder={5} />
      <mesh geometry={innerGeo} material={innerMat} renderOrder={6} />
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(o) => void (rings.current[i] = o)} rotation-x={-Math.PI / 2} material={ringMat} renderOrder={7}>
          {/* thin ring in unit space; scaled with the beam (x,z) */}
          <ringGeometry args={[0.94, 1, 48]} />
        </mesh>
      ))}
    </group>
  );
}

/** Circular scanning ring around the selected object. */
export function ScanRing() {
  const group = useRef<THREE.Group>(null);
  const dashes = useRef<THREE.Group>(null);
  const solidMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#13C2D6", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    [],
  );
  const dashMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.ink, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    [],
  );
  const sweepMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: PALETTE.cyan, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }),
    [],
  );
  const sweep = useRef<THREE.Mesh>(null);

  useFrame((state, dt) => {
    const fx = rig.fx;
    const g = group.current;
    if (!g) return;
    g.visible = fx.scan > 0.001;
    if (!g.visible) return;
    const t = state.clock.elapsedTime;
    g.position.set(fx.target.x, fx.target.y + 0.02, fx.target.z);
    const r = fx.targetRadius * (0.7 + 0.5 * fx.scan);
    g.scale.setScalar(r);
    solidMat.opacity = fx.scan * 0.95;
    dashMat.opacity = fx.scan * 0.9;
    sweepMat.opacity = fx.scan * 0.35;
    if (dashes.current) dashes.current.rotation.z += dt * 1.2;
    if (sweep.current) sweep.current.rotation.z = -t * 3;
  });

  return (
    <group ref={group} visible={false}>
      <group rotation-x={-Math.PI / 2}>
        <mesh material={solidMat} renderOrder={3}>
          <ringGeometry args={[1.18, 1.27, 72]} />
        </mesh>
        <group ref={dashes}>
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} material={dashMat} rotation-z={(i / 12) * Math.PI * 2} renderOrder={3}>
              <ringGeometry args={[1.36, 1.41, 6, 1, 0, Math.PI / 14]} />
            </mesh>
          ))}
        </group>
        <mesh ref={sweep} material={sweepMat} renderOrder={3}>
          <ringGeometry args={[0.2, 1.18, 40, 1, 0, Math.PI / 3]} />
        </mesh>
      </group>
    </group>
  );
}
