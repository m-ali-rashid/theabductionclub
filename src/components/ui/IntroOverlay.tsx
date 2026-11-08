"use client";

import { useEffect, type ReactNode } from "react";
import { useGame } from "@/store/useGame";
import { rig } from "@/lib/rig";

/** Speech bubble, loading hint and discreet "Skip intro" control for the cinematic intro. */
export function IntroOverlay() {
  const introPhase = useGame((s) => s.introPhase);
  const bubble = useGame((s) => s.introBubble);

  // Lock page scroll while the intro plays so the camera move is never interrupted.
  useEffect(() => {
    const locked = introPhase !== "done";
    document.documentElement.style.overflow = locked ? "hidden" : "";
    document.body.style.overflow = locked ? "hidden" : "";
    if (locked) window.scrollTo(0, 0);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [introPhase]);

  if (introPhase === "done") return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" data-testid="intro-overlay">
      {/* Loading hint — the 7s clock has not started yet */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          introPhase === "loading" ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="inline-flex items-center gap-2 border-2 border-ink bg-canvas-bg px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-ink hard-shadow-sm">
          <span className="live-pulse h-2 w-2 rounded-full border border-ink bg-acid-chartreuse" />
          Loading specimen…
        </span>
      </div>

      {/* Speech bubble — visible 2.0s → 4.0s */}
      <div
        aria-live="polite"
        data-testid="intro-bubble"
        className="absolute left-1/2 top-1/2 w-[min(86vw,420px)] origin-bottom-left transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          transform: `translate(calc(-50% + 16vmin), calc(-50% - 33vmin)) scale(${bubble ? 1 : 0.6})`,
          opacity: bubble ? 1 : 0,
        }}
      >
        <div className="relative border-2 border-ink bg-canvas-bg px-5 py-4 hard-shadow-lg sm:px-6 sm:py-5">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-electric-cobalt">
            Incoming transmission
          </div>
          <div className="mt-1 font-headline text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-ink sm:text-[2.6rem]">
            Greetings,
            <br />
            <span className="relative inline-block text-electric-cobalt">
              Earthling!
              <span className="absolute -bottom-1 left-0 h-1.5 w-full bg-vermilion" />
            </span>
          </div>
          <p className="mt-3 font-sans text-sm font-semibold text-ink/80 sm:text-[15px]">
            Welcome to The Abduction Club.
          </p>
          {/* Tail pointing down-left toward the pilot */}
          <span className="absolute -bottom-[13px] left-10 h-5 w-5 rotate-45 border-b-2 border-r-2 border-ink bg-canvas-bg" />
        </div>
      </div>

      {/* Discreet skip control — never auto-skips, only on explicit click */}
      <button
        type="button"
        onClick={() => rig.intro.skip()}
        className="pointer-events-auto absolute bottom-4 right-4 cursor-pointer border-[1.5px] border-ink bg-canvas-bg/90 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink/70 transition-colors hover:bg-ink hover:text-canvas-bg sm:bottom-6 sm:right-7"
      >
        Skip intro →
      </button>
    </div>
  );
}

/** Keeps the website chrome hidden until the camera has pulled back, then fades it in. */
export function HudGate({ children }: { children: ReactNode }) {
  const visible = useGame((s) => s.hudVisible);
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-10 ${
        visible ? "visible opacity-100 transition-opacity duration-1000" : "invisible opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
