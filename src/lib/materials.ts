import * as THREE from "three";

export const PALETTE = {
  bg: "#F3F0E8",
  ink: "#181818",
  cobalt: "#3155F4",
  vermilion: "#FF5A36",
  chartreuse: "#D1EF47",
  cream: "#EDE6D6",
  warmGray: "#D9D2C3",
  cyan: "#5CF6EA",
} as const;

type ResinOpts = {
  roughness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  metalness?: number;
  /** Mark material as hover-highlightable (emissive pulse). */
  highlight?: boolean;
  transparent?: boolean;
  opacity?: number;
};

/** Polished vinyl / resin look: low roughness base + clearcoat. */
export function resin(color: string, o: ResinOpts = {}) {
  const m = new THREE.MeshPhysicalMaterial({
    color,
    roughness: o.roughness ?? 0.38,
    metalness: o.metalness ?? 0,
    clearcoat: o.clearcoat ?? 0.85,
    clearcoatRoughness: o.clearcoatRoughness ?? 0.18,
    transparent: o.transparent ?? false,
    opacity: o.opacity ?? 1,
  });
  m.emissive = new THREE.Color(color);
  m.emissiveIntensity = 0;
  m.userData.highlight = o.highlight ?? true;
  return m;
}

/** Matte stage material (non-highlightable). */
export function stage(color: string, roughness = 0.62) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
}

/** Soft radial blob texture used for contact shadows and glows. */
let blobTex: THREE.Texture | null = null;
export function getBlobTexture() {
  if (blobTex) return blobTex;
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grd.addColorStop(0, "rgba(0,0,0,1)");
  grd.addColorStop(0.45, "rgba(0,0,0,0.55)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  blobTex = new THREE.CanvasTexture(c);
  return blobTex;
}
