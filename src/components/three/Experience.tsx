"use client";

import { Suspense, useEffect, useLayoutEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useGame } from "@/store/useGame";
import { rig } from "@/lib/rig";
import { PALETTE } from "@/lib/materials";
import { Ufo } from "./Ufo";
import { Collectible } from "./Collectible";
import { Monolith, OddTree, Signal } from "./Toys";
import { Platform } from "./Platform";
import { ScanRing, TractorBeam } from "./Effects";
import { Director } from "./Director";

/**
 * Responsive isometric orthographic camera.
 * Keeps the modular stage + flying UFO safely framed on wide desktop,
 * narrow desktop, and portrait mobile screens without clipping.
 */
function CameraRig() {
  const { camera, size } = useThree();
  const isTouch = useGame((s) => s.isTouch);

  useLayoutEffect(() => {
    const cam = camera as THREE.OrthographicCamera;
    if (!cam.isOrthographicCamera) return;
    const w = size.width;
    const h = size.height;
    const portrait = w < h * 0.9;

    // Fit both horizontal world width (~11.8 units) and vertical height (~8.6 units)
    const zoomX = w / (portrait ? 11.4 : 13.0);
    const zoomY = h / (portrait ? 12.2 : 8.8);
    cam.zoom = Math.max(28, Math.min(zoomX, zoomY));

    // Three-quarter isometric angle; frame stage + high flight airspace with generous top margin
    cam.position.set(14, 13.5, 14);
    if (portrait || w < 768) {
      cam.lookAt(0.35, 1.85, 0.25);
    } else {
      cam.lookAt(-0.15, 2.05, 0.2);
    }
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, isTouch]);

  return (
    <OrthographicCamera
      makeDefault
      position={[14, 13.5, 14]}
      zoom={75}
      near={-40}
      far={80}
    />
  );
}

/** Studio illumination: crisp gallery key light, cobalt & vermilion rim bounces, procedural softbox env. */
function StudioLights() {
  const isTouch = useGame((s) => s.isTouch);
  const shadowSize = isTouch ? 1024 : 2048;

  return (
    <>
      <ambientLight color="#F5F0E4" intensity={1.15} />
      <hemisphereLight args={["#FFFDF8", "#CFC6B2", 0.55]} />
      <directionalLight
        position={[11, 20, 9]}
        intensity={1.75}
        color="#FFFBF0"
        castShadow
        shadow-mapSize={[shadowSize, shadowSize]}
        shadow-camera-near={2}
        shadow-camera-far={45}
        shadow-camera-left={-7.5}
        shadow-camera-right={7.5}
        shadow-camera-top={7.5}
        shadow-camera-bottom={-6.5}
        shadow-bias={-0.00035}
      />
      {/* Vibrant art-toy rim lights */}
      <directionalLight position={[-12, 8, -10]} intensity={0.85} color={PALETTE.cobalt} />
      <directionalLight position={[4, -6, 12]} intensity={0.55} color={PALETTE.vermilion} />

      {/* Subtle studio reflections for clearcoat resin & metallic UFO */}
      <Environment resolution={128} environmentIntensity={0.38}>
        <group rotation={[-Math.PI / 4, 0, 0]}>
          <Lightformer intensity={2.0} rotation-x={Math.PI / 2} position={[0, 6, -4]} scale={[12, 6, 1]} color="#FFFFFF" />
          <Lightformer intensity={1.1} rotation-y={Math.PI / 2} position={[-7, 2, 0]} scale={[10, 4, 1]} color="#DCE5FF" />
          <Lightformer intensity={0.9} rotation-y={-Math.PI / 2} position={[7, 2, 2]} scale={[10, 4, 1]} color="#FFE7DC" />
        </group>
      </Environment>
    </>
  );
}

export function Experience() {
  const isTouch = useGame((s) => s.isTouch);

  useEffect(() => {
    const detectEnv = () => {
      const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      useGame.getState().setEnv({ isTouch: touch, reducedMotion: reduced });
    };
    detectEnv();
    window.addEventListener("resize", detectEnv);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      rig.pointer.px = e.clientX;
      rig.pointer.py = e.clientY;
      rig.pointer.ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      rig.pointer.ndcY = -(e.clientY / window.innerHeight) * 2 + 1;
      rig.pointer.active = true;
      rig.pointer.moved = performance.now() / 1000;
    };

    const onLeave = () => {
      rig.pointer.active = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("resize", detectEnv);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 select-none"
      onPointerDown={(e) => {
        // On touch devices, tapping empty space nudges the UFO toward that region
        if (e.pointerType === "touch" || useGame.getState().isTouch) {
          rig.pointer.px = e.clientX;
          rig.pointer.py = e.clientY;
          rig.pointer.active = true;
          rig.pointer.moved = performance.now() / 1000;
        }
      }}
    >
      <Canvas
        shadows
        dpr={isTouch ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.96,
        }}
      >
        <CameraRig />
        <StudioLights />
        <Suspense fallback={null}>
          <Platform />
          <Collectible id="monolith">
            <Monolith />
          </Collectible>
          <Collectible id="signal">
            <Signal />
          </Collectible>
          <Collectible id="oddtree">
            <OddTree />
          </Collectible>
          <Ufo />
          <TractorBeam />
          <ScanRing />
          <Director />
        </Suspense>
      </Canvas>
    </div>
  );
}
