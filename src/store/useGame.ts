import { create } from "zustand";
import { COLLECTIBLES, type CollectibleId } from "@/data/collectibles";

/**
 * Explicit interaction phases for the abduction sequence.
 * Only `idle` accepts a new selection, so clicks can never start
 * overlapping timelines.
 */
export type Phase =
  | "intro"
  | "idle"
  | "approach"
  | "scan"
  | "beam"
  | "lift"
  | "discover"
  | "return"
  | "reset";

type GameState = {
  phase: Phase;
  activeId: CollectibleId | null;
  hoveredId: CollectibleId | null;
  captured: CollectibleId[];
  panelId: CollectibleId | null;
  soundOn: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
  /** Increments on every replay so scene components can re-run entrance anims. */
  resetToken: number;

  setPhase: (p: Phase) => void;
  setHovered: (id: CollectibleId | null) => void;
  select: (id: CollectibleId) => boolean;
  completeCapture: (id: CollectibleId) => void;
  closePanel: () => void;
  toggleSound: () => void;
  setEnv: (env: { isTouch: boolean; reducedMotion: boolean }) => void;
  replay: () => void;
};

export const TOTAL = COLLECTIBLES.length;

export const useGame = create<GameState>((set, get) => ({
  phase: "idle",
  activeId: null,
  hoveredId: null,
  captured: [],
  panelId: null,
  soundOn: false,
  isTouch: false,
  reducedMotion: false,
  resetToken: 0,

  setPhase: (phase) => set({ phase }),
  setHovered: (hoveredId) => {
    if (get().hoveredId !== hoveredId) set({ hoveredId });
  },
  select: (id) => {
    const { phase, captured } = get();
    if (phase !== "idle" || captured.includes(id)) return false;
    set({ activeId: id, phase: "approach", panelId: null, hoveredId: null });
    return true;
  },
  completeCapture: (id) => {
    const { captured } = get();
    if (captured.includes(id)) return;
    set({ captured: [...captured, id], panelId: id });
  },
  closePanel: () => set({ panelId: null }),
  toggleSound: () => set({ soundOn: !get().soundOn }),
  setEnv: (env) => set(env),
  replay: () => {
    const { phase } = get();
    if (phase !== "idle") return;
    set({
      captured: [],
      panelId: null,
      activeId: null,
      hoveredId: null,
      phase: "reset",
      resetToken: get().resetToken + 1,
    });
  },
}));
