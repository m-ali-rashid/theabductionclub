"use client";

import { useGame } from "@/store/useGame";

/**
 * Tiny procedural sound kit (Web Audio, no assets). Silent unless SOUND is on.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let hum: { osc: OscillatorNode; lfo: OscillatorNode; gain: GainNode } | null = null;

function audio() {
  if (!useGame.getState().soundOn) return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.35;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur = 0.12, type: OscillatorType = "sine", vol = 0.25, slide = 0) {
  const a = audio();
  if (!a || !master) return;
  const t = a.currentTime;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const HOVER_NOTES: Record<string, number> = { monolith: 392, signal: 523.25, oddtree: 659.25 };

export const sfx = {
  hover(id: string) {
    blip(HOVER_NOTES[id] ?? 440, 0.09, "triangle", 0.12);
  },
  scan() {
    blip(880, 0.08, "square", 0.05);
    setTimeout(() => blip(1320, 0.08, "square", 0.05), 90);
  },
  beamStart() {
    const a = audio();
    if (!a || !master || hum) return;
    const osc = a.createOscillator();
    const lfo = a.createOscillator();
    const lfoGain = a.createGain();
    const gain = a.createGain();
    const filter = a.createBiquadFilter();
    osc.type = "sawtooth";
    osc.frequency.value = 98;
    filter.type = "lowpass";
    filter.frequency.value = 600;
    lfo.frequency.value = 7;
    lfoGain.gain.value = 18;
    lfo.connect(lfoGain).connect(osc.frequency);
    gain.gain.setValueAtTime(0.0001, a.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, a.currentTime + 0.3);
    osc.connect(filter).connect(gain).connect(master);
    osc.frequency.linearRampToValueAtTime(196, a.currentTime + 2.2);
    osc.start();
    lfo.start();
    hum = { osc, lfo, gain };
  },
  beamStop() {
    if (!hum || !ctx) {
      hum = null;
      return;
    }
    const { osc, lfo, gain } = hum;
    const t = ctx.currentTime;
    gain.gain.cancelScheduledValues(t);
    gain.gain.setValueAtTime(gain.gain.value, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    osc.stop(t + 0.4);
    lfo.stop(t + 0.4);
    hum = null;
  },
  capture() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => blip(f, 0.16, "triangle", 0.18), i * 70));
  },
  complete() {
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) =>
      setTimeout(() => blip(f, 0.25, "triangle", 0.16), i * 95),
    );
  },
  toggle(on: boolean) {
    if (on) blip(660, 0.1, "triangle", 0.15, 220);
  },
};
