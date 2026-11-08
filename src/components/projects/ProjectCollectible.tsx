"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { CollectibleModelType } from "@/data/projects";
import { PALETTE } from "@/lib/materials";

type Props = {
  model: CollectibleModelType;
  hovered?: boolean;
  selected?: boolean;
  /** Enables pointer drag-to-orbit on large hero/preview stages. */
  interactive?: boolean;
  className?: string;
};

/* -------------------------------------------------------------------------- */
/*  Shared Material Palette (Designer Vinyl / Resin)                          */
/* -------------------------------------------------------------------------- */

function makePalette() {
  const mat = (color: string, roughness = 0.28, metalness = 0.08) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness });
  const emissive = (color: string, intensity = 0.5) =>
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: intensity,
      roughness: 0.2,
    });

  return {
    cobalt: mat(PALETTE.cobalt, 0.25, 0.1),
    cobaltDeep: mat("#203EC4", 0.3, 0.12),
    vermilion: mat(PALETTE.vermilion, 0.26, 0.08),
    chartreuse: mat(PALETTE.chartreuse, 0.25, 0.05),
    ink: mat(PALETTE.ink, 0.4, 0.15),
    dark: mat("#2A2A2A", 0.5, 0.2),
    cream: mat(PALETTE.cream, 0.38, 0.05),
    bone: mat("#F7F4EC", 0.32, 0.04),
    cyanGlow: emissive(PALETTE.cyan, 0.75),
    acidGlow: emissive(PALETTE.chartreuse, 0.65),
    orangeGlow: emissive(PALETTE.vermilion, 0.55),
  };
}

type ToyRig = {
  root: THREE.Group;
  update: (t: number, dt: number, energy: number) => void;
};

/* -------------------------------------------------------------------------- */
/*  001 · SIGNAL — Cobalt Satellite Dish with Rotating Antennas               */
/* -------------------------------------------------------------------------- */

function buildSignalToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Plinth base
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.18, 1.5, 3, 0.04), m.ink);
  base.position.y = -0.82;
  root.add(base);

  const deck = new THREE.Mesh(new RoundedBoxGeometry(1.26, 0.14, 1.26, 3, 0.03), m.cream);
  deck.position.y = -0.68;
  root.add(deck);

  // Turret ring
  const turret = new THREE.Group();
  turret.position.y = -0.6;
  root.add(turret);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.22, 28), m.cobaltDeep);
  collar.position.y = 0.1;
  turret.add(collar);

  const mast = new THREE.Mesh(new RoundedBoxGeometry(0.32, 0.52, 0.32, 3, 0.04), m.cobalt);
  mast.position.y = 0.38;
  turret.add(mast);

  // Secondary rotating radar bar on side
  const sideScanner = new THREE.Group();
  sideScanner.position.set(-0.42, 0.28, 0.22);
  turret.add(sideScanner);
  const sideStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.36, 12), m.ink);
  sideScanner.add(sideStem);
  const sideBar = new THREE.Mesh(new RoundedBoxGeometry(0.38, 0.07, 0.1, 2, 0.02), m.vermilion);
  sideBar.position.y = 0.2;
  sideScanner.add(sideBar);

  // Dish pivot head
  const dishPivot = new THREE.Group();
  dishPivot.position.set(0, 0.68, 0.05);
  dishPivot.rotation.x = -0.45;
  turret.add(dishPivot);

  // Parabolic dish shell (lathe)
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i <= 14; i++) {
    const r = (i / 14) * 0.72;
    const y = (r * r) * 0.58;
    pts.push(new THREE.Vector2(r, y));
  }
  const dishGeo = new THREE.LatheGeometry(pts, 36);
  const dishMat = m.cobalt.clone();
  dishMat.side = THREE.DoubleSide;
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.rotation.x = Math.PI / 2;
  dishPivot.add(dish);

  // Rim torus around dish
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.045, 14, 40), m.cobaltDeep);
  rim.position.z = 0.3;
  dishPivot.add(rim);

  // Receiver feed horn + Rotating sub-antenna
  const hornSpin = new THREE.Group();
  hornSpin.position.z = 0.3;
  dishPivot.add(hornSpin);

  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.56, 8), m.ink);
    strut.position.set(Math.cos(a) * 0.24, Math.sin(a) * 0.24, 0.12);
    strut.rotation.x = Math.PI / 2;
    strut.lookAt(0, 0, 0.45);
    hornSpin.add(strut);
  }

  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.16, 20), m.vermilion);
  feed.rotation.x = Math.PI / 2;
  feed.position.z = 0.36;
  hornSpin.add(feed);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.065, 16, 14), m.acidGlow);
  tip.position.z = 0.47;
  hornSpin.add(tip);

  // Expanding signal wave rings
  const waves: THREE.Mesh[] = [];
  for (let i = 0; i < 2; i++) {
    const w = new THREE.Mesh(
      new THREE.TorusGeometry(0.22 + i * 0.16, 0.016, 10, 32),
      m.acidGlow,
    );
    w.position.z = 0.52 + i * 0.14;
    dishPivot.add(w);
    waves.push(w);
  }

  return {
    root,
    update(t, dt, energy) {
      turret.rotation.y = Math.sin(t * (0.9 + energy * 1.4)) * (0.35 + energy * 0.3);
      dishPivot.rotation.x = -0.42 + Math.sin(t * 1.6) * (0.1 + energy * 0.12);
      hornSpin.rotation.z += dt * (1.5 + energy * 5.0);
      sideBar.rotation.y += dt * (2.2 + energy * 6.0);
      waves.forEach((w, i) => {
        const phase = ((t * (1.2 + energy * 1.2) + i * 0.5) % 1);
        w.position.z = 0.46 + phase * (0.45 + energy * 0.25);
        const s = 0.6 + phase * (1.1 + energy * 0.4);
        w.scale.setScalar(s);
      });
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  002 · PATCH — Orange Mechanical Robot Repairing a Circuit Board           */
/* -------------------------------------------------------------------------- */

function buildPatchToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Circuit board base
  const pcb = new THREE.Mesh(new RoundedBoxGeometry(1.62, 0.16, 1.38, 3, 0.04), m.ink);
  pcb.position.y = -0.78;
  root.add(pcb);

  const boardTop = new THREE.Mesh(new RoundedBoxGeometry(1.48, 0.06, 1.24, 2, 0.02), m.chartreuse);
  boardTop.position.y = -0.68;
  root.add(boardTop);

  // IC chips & traces on board
  const chip1 = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.08, 0.28, 2, 0.02), m.ink);
  chip1.position.set(0.28, -0.62, 0.24);
  root.add(chip1);

  const sparkNode = new THREE.Mesh(new THREE.SphereGeometry(0.06, 14, 12), m.cyanGlow);
  sparkNode.position.set(0.18, -0.56, 0.24);
  root.add(sparkNode);

  for (let i = -2; i <= 2; i++) {
    const trace = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.015, 0.028), m.cobalt);
    trace.position.set(-0.1, -0.645, i * 0.18);
    root.add(trace);
  }

  // Robot chassis
  const bot = new THREE.Group();
  bot.position.set(-0.16, -0.25, -0.1);
  root.add(bot);

  const torso = new THREE.Mesh(new RoundedBoxGeometry(0.76, 0.68, 0.58, 4, 0.08), m.vermilion);
  bot.add(torso);

  const chestPlate = new THREE.Mesh(new RoundedBoxGeometry(0.52, 0.28, 0.06, 2, 0.02), m.cream);
  chestPlate.position.set(0, -0.05, 0.28);
  bot.add(chestPlate);

  // Head with visor
  const head = new THREE.Group();
  head.position.set(0, 0.56, 0.02);
  bot.add(head);

  const skull = new THREE.Mesh(new RoundedBoxGeometry(0.68, 0.44, 0.5, 4, 0.08), m.vermilion);
  head.add(skull);

  const visor = new THREE.Mesh(new RoundedBoxGeometry(0.54, 0.24, 0.06, 2, 0.03), m.ink);
  visor.position.set(0, 0.02, 0.24);
  head.add(visor);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 12), m.acidGlow);
  eyeL.position.set(-0.13, 0.02, 0.27);
  head.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.13;
  head.add(eyeR);

  // Antenna
  const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 10), m.ink);
  ant.position.set(0.2, 0.3, 0);
  head.add(ant);
  const antTip = new THREE.Mesh(new THREE.SphereGeometry(0.05, 14, 12), m.cobalt);
  antTip.position.set(0.2, 0.42, 0);
  head.add(antTip);

  // Right articulated soldering arm
  const armR = new THREE.Group();
  armR.position.set(0.44, 0.12, 0.1);
  bot.add(armR);
  const upperR = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.42, 0.16, 2, 0.03), m.ink);
  upperR.position.y = -0.15;
  armR.add(upperR);
  const toolTip = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 14), m.cobalt);
  toolTip.rotation.x = Math.PI;
  toolTip.position.set(0, -0.42, 0.12);
  armR.add(toolTip);

  // Left inspection magnifier arm
  const armL = new THREE.Group();
  armL.position.set(-0.44, 0.12, 0.1);
  bot.add(armL);
  const upperL = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.38, 0.16, 2, 0.03), m.ink);
  upperL.position.y = -0.14;
  armL.add(upperL);
  const loopRing = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 10, 24), m.cobalt);
  loopRing.position.set(0.08, -0.36, 0.18);
  armL.add(loopRing);

  return {
    root,
    update(t, _dt, energy) {
      const speed = 2.4 + energy * 4.5;
      head.rotation.z = Math.sin(t * 2.1) * (0.06 + energy * 0.08);
      head.rotation.x = 0.18 + Math.sin(t * 3.0) * 0.05;
      armR.rotation.x = -0.55 + Math.sin(t * speed) * (0.18 + energy * 0.22);
      armR.rotation.z = -0.15 + Math.cos(t * speed * 0.7) * 0.12;
      armL.rotation.x = -0.35 + Math.cos(t * speed * 0.8) * 0.14;
      const pulse = 0.7 + Math.abs(Math.sin(t * speed * 2)) * (0.6 + energy * 0.8);
      sparkNode.scale.setScalar(pulse);
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  003 · VAULT — Sculptural Futuristic Scanner Vault with Moving Doors       */
/* -------------------------------------------------------------------------- */

function buildVaultToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Heavy plinth
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.56, 0.2, 1.36, 3, 0.04), m.ink);
  base.position.y = -0.8;
  root.add(base);

  // Outer armored vault frame
  const frameTop = new THREE.Mesh(new RoundedBoxGeometry(1.38, 0.2, 0.82, 3, 0.04), m.cobalt);
  frameTop.position.y = 0.62;
  root.add(frameTop);

  const frameBottom = new THREE.Mesh(new RoundedBoxGeometry(1.38, 0.2, 0.82, 3, 0.04), m.cobalt);
  frameBottom.position.y = -0.6;
  root.add(frameBottom);

  const pillarL = new THREE.Mesh(new RoundedBoxGeometry(0.22, 1.24, 0.82, 3, 0.04), m.cobaltDeep);
  pillarL.position.set(-0.58, 0.01, 0);
  root.add(pillarL);

  const pillarR = pillarL.clone();
  pillarR.position.x = 0.58;
  root.add(pillarR);

  const backWall = new THREE.Mesh(new RoundedBoxGeometry(1.16, 1.16, 0.16, 2, 0.02), m.ink);
  backWall.position.set(0, 0.01, -0.3);
  root.add(backWall);

  // Internal document slab being scanned
  const doc = new THREE.Mesh(new RoundedBoxGeometry(0.56, 0.74, 0.06, 2, 0.02), m.bone);
  doc.position.set(0, 0.02, -0.14);
  root.add(doc);

  for (let i = 0; i < 4; i++) {
    const line = new THREE.Mesh(
      new THREE.BoxGeometry(i === 0 ? 0.34 : 0.42, 0.035, 0.015),
      i === 0 ? m.vermilion : m.cobalt,
    );
    line.position.set(0, 0.22 - i * 0.13, -0.1);
    root.add(line);
  }

  // Sweeping laser scan bar
  const scanBar = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.045, 0.12), m.acidGlow);
  scanBar.position.set(0, 0, -0.02);
  root.add(scanBar);

  // Sliding blast doors (left & right)
  const doorL = new THREE.Group();
  doorL.position.set(-0.23, 0.01, 0.18);
  root.add(doorL);
  const doorMeshL = new THREE.Mesh(new RoundedBoxGeometry(0.45, 1.0, 0.16, 3, 0.03), m.ink);
  doorL.add(doorMeshL);
  const lockWheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.06, 18), m.vermilion);
  lockWheelL.rotation.x = Math.PI / 2;
  lockWheelL.position.set(0.08, 0, 0.09);
  doorL.add(lockWheelL);

  const doorR = new THREE.Group();
  doorR.position.set(0.23, 0.01, 0.18);
  root.add(doorR);
  const doorMeshR = new THREE.Mesh(new RoundedBoxGeometry(0.45, 1.0, 0.16, 3, 0.03), m.ink);
  doorR.add(doorMeshR);
  const accentStripR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.68, 0.04), m.chartreuse);
  accentStripR.position.set(0.06, 0, 0.08);
  doorR.add(accentStripR);

  // Top beacon
  const beacon = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.1, 0.24, 2, 0.02), m.vermilion);
  beacon.position.set(0, 0.76, 0);
  root.add(beacon);

  return {
    root,
    update(t, _dt, energy) {
      // Doors slide open wider on hover / selection
      const openAmt = 0.12 + (Math.sin(t * 1.8) * 0.5 + 0.5) * 0.14 + energy * 0.22;
      doorL.position.x = -0.23 - openAmt;
      doorR.position.x = 0.23 + openAmt;
      lockWheelL.rotation.z = t * (0.8 + energy * 2.5);
      scanBar.position.y = Math.sin(t * (2.4 + energy * 3.0)) * 0.36;
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  004 · ORBIT — Cobalt-and-Orange Telephone Robot with Animated Face        */
/* -------------------------------------------------------------------------- */

function buildOrbitToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Base feet
  const footL = new THREE.Mesh(new RoundedBoxGeometry(0.36, 0.14, 0.48, 3, 0.04), m.ink);
  footL.position.set(-0.32, -0.78, 0);
  root.add(footL);
  const footR = footL.clone();
  footR.position.x = 0.32;
  root.add(footR);

  // Body shell (cobalt)
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.18, 1.02, 0.86, 5, 0.12), m.cobalt);
  body.position.y = -0.18;
  root.add(body);

  // Animated face visor
  const visor = new THREE.Mesh(new RoundedBoxGeometry(0.86, 0.42, 0.08, 3, 0.04), m.ink);
  visor.position.set(0, 0.04, 0.42);
  root.add(visor);

  const eyes = new THREE.Group();
  eyes.position.set(0, 0.06, 0.47);
  root.add(eyes);

  const eyeL = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.14, 0.03, 2, 0.02), m.acidGlow);
  eyeL.position.x = -0.18;
  eyes.add(eyeL);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.18;
  eyes.add(eyeR);

  const smile = new THREE.Mesh(new RoundedBoxGeometry(0.24, 0.045, 0.03, 2, 0.015), m.orangeGlow);
  smile.position.set(0, -0.1, 0.47);
  root.add(smile);

  // Rotary dial badge on lower torso
  const dial = new THREE.Group();
  dial.position.set(0, -0.4, 0.44);
  root.add(dial);
  const dialPlate = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.05, 28), m.cream);
  dialPlate.rotation.x = Math.PI / 2;
  dial.add(dialPlate);
  const dialCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.07, 20), m.vermilion);
  dialCenter.rotation.x = Math.PI / 2;
  dial.add(dialCenter);

  // Cradle prongs
  for (const sx of [-0.32, 0.32]) {
    const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.18, 14), m.ink);
    prong.position.set(sx, 0.4, 0);
    root.add(prong);
  }

  // Sculptural Orange Telephone Handset on top
  const handset = new THREE.Group();
  handset.position.set(0, 0.56, 0);
  root.add(handset);

  const handleBar = new THREE.Mesh(new RoundedBoxGeometry(0.96, 0.14, 0.22, 3, 0.05), m.vermilion);
  handset.add(handleBar);

  for (const sx of [-0.46, 0.46]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.22, 24), m.vermilion);
    cup.position.set(sx, -0.08, 0);
    handset.add(cup);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.04, 24), m.ink);
    cap.position.set(sx, -0.19, 0);
    handset.add(cap);
  }

  return {
    root,
    update(t, _dt, energy) {
      // Handset rings/bounces when active
      const ring = Math.abs(Math.sin(t * (5 + energy * 8))) * (0.04 + energy * 0.12);
      handset.position.y = 0.56 + ring;
      handset.rotation.z = Math.sin(t * (10 + energy * 12)) * (0.04 + energy * 0.12);
      dial.rotation.z = Math.sin(t * 1.8) * (0.3 + energy * 0.8);
      // Blinking / expressive eyes
      const blink = Math.sin(t * 2.7) > 0.94 ? 0.15 : 1;
      eyes.scale.y = blink;
      smile.scale.x = 1 + Math.sin(t * 4) * (0.1 + energy * 0.25);
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  005 · RELAY — Orange Switchboard with Animated Levers & Cables            */
/* -------------------------------------------------------------------------- */

function buildRelayToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Plinth
  const base = new THREE.Mesh(new RoundedBoxGeometry(1.58, 0.18, 1.22, 3, 0.04), m.ink);
  base.position.y = -0.8;
  root.add(base);

  // Switchboard cabinet (vermilion)
  const consoleBox = new THREE.Mesh(new RoundedBoxGeometry(1.38, 1.18, 0.72, 4, 0.07), m.vermilion);
  consoleBox.position.y = -0.14;
  root.add(consoleBox);

  // Inset dark patch panel
  const faceplate = new THREE.Mesh(new RoundedBoxGeometry(1.16, 0.92, 0.08, 2, 0.03), m.ink);
  faceplate.position.set(0, -0.12, 0.34);
  root.add(faceplate);

  // 3 animated mechanical toggle levers
  const levers: THREE.Group[] = [];
  [-0.36, 0, 0.36].forEach((x) => {
    const slot = new THREE.Mesh(new RoundedBoxGeometry(0.14, 0.36, 0.06, 2, 0.02), m.cream);
    slot.position.set(x, 0.12, 0.39);
    root.add(slot);

    const pivot = new THREE.Group();
    pivot.position.set(x, 0.12, 0.41);
    root.add(pivot);

    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.26, 12), m.cream);
    rod.position.set(0, 0.08, 0.08);
    rod.rotation.x = Math.PI / 4;
    pivot.add(rod);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.068, 16, 14), m.cobalt);
    knob.position.set(0, 0.17, 0.17);
    pivot.add(knob);
    levers.push(pivot);
  });

  // Status LEDs above levers
  const leds: THREE.Mesh[] = [];
  [-0.36, 0, 0.36].forEach((x) => {
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 12), m.acidGlow);
    led.position.set(x, 0.4, 0.39);
    root.add(led);
    leds.push(led);
  });

  // Patch cables (curved tubes connecting sockets)
  const cablePaths: [number, number, number][][] = [
    [
      [-0.4, -0.28, 0.39],
      [-0.2, -0.52, 0.62],
      [0.12, -0.34, 0.39],
    ],
    [
      [-0.1, -0.38, 0.39],
      [0.18, -0.62, 0.58],
      [0.42, -0.26, 0.39],
    ],
  ];
  cablePaths.forEach((pts, idx) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(curve, 24, 0.032, 10, false);
    const mesh = new THREE.Mesh(geo, idx === 0 ? m.chartreuse : m.cobalt);
    root.add(mesh);
  });

  return {
    root,
    update(t, _dt, energy) {
      const speed = 2.0 + energy * 3.5;
      levers.forEach((lv, i) => {
        const angle = Math.sin(t * speed + i * 1.4) * (0.45 + energy * 0.25);
        lv.rotation.x = angle;
        const s = 0.85 + Math.max(0, Math.sin(t * speed + i * 1.4)) * 0.45;
        leds[i].scale.setScalar(s);
      });
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  006 · ECHO — Chartreuse-and-Cobalt Microphone Robot with Sound Waves      */
/* -------------------------------------------------------------------------- */

function buildEchoToy(m: ReturnType<typeof makePalette>): ToyRig {
  const root = new THREE.Group();

  // Weighted studio pedestal
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.64, 0.18, 32), m.ink);
  base.position.y = -0.8;
  root.add(base);

  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.035, 12, 32), m.cobalt);
  baseRing.rotation.x = Math.PI / 2;
  baseRing.position.y = -0.7;
  root.add(baseRing);

  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.48, 20), m.cobaltDeep);
  stem.position.y = -0.48;
  root.add(stem);

  // U-shaped yoke mount
  const headGroup = new THREE.Group();
  headGroup.position.y = 0.1;
  root.add(headGroup);

  const yokeArmL = new THREE.Mesh(new RoundedBoxGeometry(0.1, 0.56, 0.12, 2, 0.03), m.cobalt);
  yokeArmL.position.set(-0.48, -0.08, 0);
  headGroup.add(yokeArmL);
  const yokeArmR = yokeArmL.clone();
  yokeArmR.position.x = 0.48;
  headGroup.add(yokeArmR);
  const yokeBottom = new THREE.Mesh(new RoundedBoxGeometry(1.06, 0.1, 0.12, 2, 0.03), m.cobalt);
  yokeBottom.position.set(0, -0.34, 0);
  headGroup.add(yokeBottom);

  // Pill-shaped chartreuse microphone capsule head
  const capsule = new THREE.Mesh(new RoundedBoxGeometry(0.76, 1.04, 0.68, 6, 0.28), m.chartreuse);
  capsule.position.y = 0.06;
  headGroup.add(capsule);

  // Grille ribs on upper capsule
  for (let i = 0; i < 3; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.36 - i * 0.03, 0.022, 10, 28), m.ink);
    rib.rotation.x = Math.PI / 2;
    rib.position.y = 0.26 + i * 0.1;
    headGroup.add(rib);
  }

  // Robot face visor on microphone front
  const visor = new THREE.Mesh(new RoundedBoxGeometry(0.54, 0.24, 0.08, 2, 0.03), m.ink);
  visor.position.set(0, -0.06, 0.32);
  headGroup.add(visor);

  for (const sx of [-0.13, 0.13]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.042, 14, 12), m.cyanGlow);
    eye.position.set(sx, -0.06, 0.36);
    headGroup.add(eye);
  }

  // Animated concentric sound-wave rings around capsule
  const waves: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const w = new THREE.Mesh(
      new THREE.TorusGeometry(0.58 + i * 0.15, 0.022, 12, 40),
      i % 2 === 0 ? m.cobalt : m.vermilion,
    );
    w.rotation.y = Math.PI / 6;
    headGroup.add(w);
    waves.push(w);
  }

  return {
    root,
    update(t, _dt, energy) {
      headGroup.rotation.z = Math.sin(t * 2.2) * (0.05 + energy * 0.08);
      headGroup.position.y = 0.1 + Math.sin(t * 3.4) * (0.03 + energy * 0.04);
      waves.forEach((w, i) => {
        const pulse = 1 + Math.sin(t * (3.5 + energy * 4) - i * 0.9) * (0.08 + energy * 0.14);
        w.scale.setScalar(pulse);
        w.rotation.x = Math.sin(t * 1.4 + i) * 0.25;
      });
    },
  };
}

function createToyModel(model: CollectibleModelType, palette: ReturnType<typeof makePalette>): ToyRig {
  switch (model) {
    case "signal":
      return buildSignalToy(palette);
    case "patch":
      return buildPatchToy(palette);
    case "vault":
      return buildVaultToy(palette);
    case "orbit":
      return buildOrbitToy(palette);
    case "relay":
      return buildRelayToy(palette);
    case "echo":
      return buildEchoToy(palette);
  }
}

/* -------------------------------------------------------------------------- */
/*  Single Shared Offscreen WebGLRenderer Multiplexer                         */
/* -------------------------------------------------------------------------- */

type Slot = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  rig: ToyRig;
  visible: boolean;
  hovered: boolean;
  selected: boolean;
  energy: number;
  yaw: number;
  userYaw: number;
  zoom: number;
};

let sharedRenderer: THREE.WebGLRenderer | null = null;
const activeSlots = new Set<Slot>();
let rafId = 0;
let lastTime = 0;

function getSharedRenderer() {
  if (sharedRenderer) return sharedRenderer;
  const offscreen = document.createElement("canvas");
  sharedRenderer = new THREE.WebGLRenderer({
    canvas: offscreen,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  sharedRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  sharedRenderer.toneMappingExposure = 1.05;
  return sharedRenderer;
}

function tickAll(now: number) {
  const t = now * 0.001;
  const dt = Math.min(0.05, lastTime ? (now - lastTime) * 0.001 : 0.016);
  lastTime = now;

  if (activeSlots.size === 0) {
    rafId = 0;
    return;
  }

  const renderer = getSharedRenderer();

  for (const s of activeSlots) {
    if (!s.visible) continue;
    const rect = s.canvas.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) continue;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (s.canvas.width !== w || s.canvas.height !== h) {
      s.canvas.width = w;
      s.canvas.height = h;
    }

    const rw = renderer.domElement.width;
    const rh = renderer.domElement.height;
    if (rw < w || rh < h) {
      renderer.setSize(Math.max(rw, w), Math.max(rh, h), false);
    }

    // Smooth energy & zoom interpolation
    const targetEnergy = s.selected ? 1.0 : s.hovered ? 0.75 : 0.0;
    s.energy += (targetEnergy - s.energy) * Math.min(1, dt * 8);

    const targetZoom = s.selected ? 1.16 : s.hovered ? 1.08 : 1.0;
    s.zoom += (targetZoom - s.zoom) * Math.min(1, dt * 8);

    // Update camera frustum
    const aspect = w / h;
    const frustum = 1.48 / s.zoom;
    s.camera.left = -frustum * aspect;
    s.camera.right = frustum * aspect;
    s.camera.top = frustum;
    s.camera.bottom = -frustum;
    s.camera.updateProjectionMatrix();

    // Rotate & tilt collectible
    s.yaw += dt * (0.45 + s.energy * 0.9);
    s.rig.root.rotation.y = 0.55 + Math.sin(s.yaw) * 0.38 + s.userYaw + (s.hovered ? 0.22 : 0);
    s.rig.root.rotation.x = s.hovered ? 0.08 : 0;
    s.rig.root.position.y = Math.sin(t * 2.1) * 0.04 + s.energy * 0.05;

    s.rig.update(t, dt, s.energy);

    renderer.setViewport(0, 0, w, h);
    renderer.setScissor(0, 0, w, h);
    renderer.setScissorTest(true);
    renderer.clear();
    renderer.render(s.scene, s.camera);

    s.ctx.clearRect(0, 0, w, h);
    // WebGL Y-origin is bottom-left while drawImage source is top-left of renderer canvas
    const srcY = renderer.domElement.height - h;
    s.ctx.drawImage(renderer.domElement, 0, srcY, w, h, 0, 0, w, h);
  }

  rafId = requestAnimationFrame(tickAll);
}

function registerSlot(slot: Slot) {
  activeSlots.add(slot);
  if (!rafId) {
    lastTime = performance.now();
    rafId = requestAnimationFrame(tickAll);
  }
}

function unregisterSlot(slot: Slot) {
  activeSlots.delete(slot);
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function ProjectCollectible({
  model,
  hovered = false,
  selected = false,
  interactive = false,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slotRef = useRef<Slot | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 40);
    camera.position.set(4.5, 3.6, 5.2);
    camera.lookAt(0, -0.08, 0);

    // Studio lighting matching the main diorama
    scene.add(new THREE.AmbientLight("#FAF6EC", 1.5));
    const key = new THREE.DirectionalLight("#FFFDF6", 2.2);
    key.position.set(5, 9, 6);
    scene.add(key);

    const rimCobalt = new THREE.DirectionalLight(PALETTE.cobalt, 1.1);
    rimCobalt.position.set(-6, 4, -5);
    scene.add(rimCobalt);

    const rimWarm = new THREE.DirectionalLight(PALETTE.vermilion, 0.7);
    rimWarm.position.set(4, -4, 5);
    scene.add(rimWarm);

    const palette = makePalette();
    const rig = createToyModel(model, palette);
    scene.add(rig.root);

    const slot: Slot = {
      canvas,
      ctx,
      scene,
      camera,
      rig,
      visible: true,
      hovered,
      selected,
      energy: 0,
      yaw: Math.random() * 6,
      userYaw: 0,
      zoom: 1,
    };
    slotRef.current = slot;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          slot.visible = e.isIntersecting;
        }
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);
    registerSlot(slot);

    return () => {
      io.disconnect();
      unregisterSlot(slot);
      slotRef.current = null;
    };
  }, [model]);

  useEffect(() => {
    if (slotRef.current) {
      slotRef.current.hovered = hovered;
      slotRef.current.selected = selected;
    }
  }, [hovered, selected]);

  // Drag-to-rotate support when `interactive` is enabled
  useEffect(() => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let dragging = false;
    let lastX = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || !slotRef.current) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      slotRef.current.userYaw += dx * 0.012;
    };
    const onUp = () => {
      dragging = false;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`Interactive 3D collectible for ${model.toUpperCase()}`}
      className={`block h-full w-full ${interactive ? "cursor-grab active:cursor-grabbing" : ""} ${className}`}
    />
  );
}
