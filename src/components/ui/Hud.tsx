"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGame, TOTAL } from "@/store/useGame";
import {
  COLLECTIBLES,
  COLLECTIBLE_MAP,
  COLOR_HEX,
  pad2,
  type CollectibleId,
} from "@/data/collectibles";
import { ACCENT_HEX, PROJECTS, STUDIO_POSITIONING } from "@/data/projects";
import { sfx } from "@/lib/sound";

type ModalMode = null | "about" | "work" | { type: "detail"; id: CollectibleId };

export function Hud() {
  const phase = useGame((s) => s.phase);
  const activeId = useGame((s) => s.activeId);
  const captured = useGame((s) => s.captured);
  const panelId = useGame((s) => s.panelId);
  const soundOn = useGame((s) => s.soundOn);
  const isTouch = useGame((s) => s.isTouch);
  const select = useGame((s) => s.select);
  const closePanel = useGame((s) => s.closePanel);
  const toggleSound = useGame((s) => s.toggleSound);
  const replay = useGame((s) => s.replay);

  const [modal, setModal] = useState<ModalMode>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const bottomCounterRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const allCaptured = captured.length === TOTAL;
  const panelItem = panelId ? COLLECTIBLE_MAP[panelId] : null;

  // Brief scale-up pop on collection counter when an object is captured
  useEffect(() => {
    if (captured.length === 0) return;
    const targets = [counterRef.current, bottomCounterRef.current].filter(Boolean);
    gsap.fromTo(
      targets,
      { scale: 1.32 },
      { scale: 1, duration: 0.55, ease: "elastic.out(1.2, 0.4)" },
    );
  }, [captured.length]);

  // Animate discovery panel entrance
  useEffect(() => {
    if (!panelId || !cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { y: 18, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.38, ease: "back.out(1.6)" },
    );
  }, [panelId]);

  // Close modals on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modal) setModal(null);
        else if (panelId) closePanel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, panelId, closePanel]);

  const busy = phase !== "idle";

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between">
      {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
      <header
        data-nofly
        className="pointer-events-auto flex items-center justify-between gap-2 border-b-2 border-ink bg-canvas-bg/95 px-3 py-2.5 sm:px-7 sm:py-3.5"
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          {/* Geometric club emblem */}
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center border-2 border-ink bg-electric-cobalt hard-shadow-sm sm:h-8 sm:w-8">
            <span className="h-2.5 w-2.5 rotate-45 border-[1.5px] border-ink bg-acid-chartreuse sm:h-3 sm:w-3" />
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 border border-ink bg-vermilion sm:h-2 sm:w-2" />
          </div>
          <div className="min-w-0">
            <div className="truncate font-headline text-xs font-extrabold tracking-tight whitespace-nowrap text-ink sm:text-base">
              THE ABDUCTION CLUB
            </div>
            <div className="hidden font-mono text-[10px] tracking-widest text-ink/70 sm:block">
              CREATIVE AI PRODUCT &amp; ENGINEERING STUDIO
            </div>
          </div>
        </div>

        {/* Top-right navigation: THE COLLECTION / WORK / ABOUT / SOUND + Collection Counter */}
        <nav aria-label="Primary" className="flex shrink-0 items-center gap-1 sm:gap-2">
          <a
            href="#collection"
            className="hidden md:inline-flex items-center gap-1.5 border-2 border-ink bg-electric-cobalt px-2.5 py-1 text-xs font-semibold tracking-wider whitespace-nowrap uppercase text-white hard-shadow-sm hard-shadow-hover cursor-pointer"
          >
            <span>THE COLLECTION (06) ↓</span>
          </a>
          <button
            type="button"
            onClick={() => setModal(modal === "work" ? null : "work")}
            className={`border-2 border-ink px-1.5 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase hard-shadow-sm hard-shadow-hover cursor-pointer sm:px-2.5 sm:py-1 sm:text-xs ${
              modal === "work" ? "bg-electric-cobalt text-white" : "bg-canvas-bg text-ink"
            }`}
          >
            PROJECTS
          </button>
          <button
            type="button"
            onClick={() => setModal(modal === "about" ? null : "about")}
            className={`border-2 border-ink px-1.5 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase hard-shadow-sm hard-shadow-hover cursor-pointer sm:px-2.5 sm:py-1 sm:text-xs ${
              modal === "about" ? "bg-electric-cobalt text-white" : "bg-canvas-bg text-ink"
            }`}
          >
            STUDIO
          </button>
          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              toggleSound();
              setTimeout(() => sfx.toggle(next), 20);
            }}
            aria-pressed={soundOn}
            className={`flex items-center gap-1 border-2 border-ink px-1.5 py-0.5 text-[10px] font-semibold tracking-wider whitespace-nowrap uppercase hard-shadow-sm hard-shadow-hover cursor-pointer sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-xs ${
              soundOn ? "bg-acid-chartreuse text-ink" : "bg-canvas-bg text-ink"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full border border-ink sm:h-2 sm:w-2 ${
                soundOn ? "bg-ink live-pulse" : "bg-transparent"
              }`}
            />
            <span>SOUND</span>
          </button>

          <div
            ref={counterRef}
            aria-label={`Collected ${captured.length} of ${TOTAL}`}
            className="border-2 border-ink bg-ink px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider whitespace-nowrap text-acid-chartreuse hard-shadow-sm sm:ml-1 sm:px-2.5 sm:py-1 sm:text-xs"
          >
            {pad2(captured.length)} / {pad2(TOTAL)}
          </div>
        </nav>
      </header>

      {/* ── MIDDLE REGION: STATUS PILL + DISCOVERY PACKAGING PANEL ──────── */}
      <div className="relative flex-1">
        {/* Compact sequence indicator while tractor beam is active */}
        {busy && phase !== "intro" && phase !== "reset" && activeId && (
          <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2">
            <div className="flex items-center gap-2 border-2 border-electric-cobalt bg-canvas-bg px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink hard-shadow-sm">
              <span className="h-2 w-2 rounded-full border border-ink bg-acid-chartreuse live-pulse" />
              <span>
                {phase === "approach" && `APPROACHING ${COLLECTIBLE_MAP[activeId].name.toUpperCase()}`}
                {phase === "scan" && `SCANNING ${COLLECTIBLE_MAP[activeId].serial}`}
                {(phase === "beam" || phase === "lift") && "TRACTOR BEAM ACTIVE · LIFTING"}
                {(phase === "discover" || phase === "return") && "SPECIMEN SECURED"}
              </span>
            </div>
          </div>
        )}

        {/* Portfolio Discovery Panel (Collectible Packaging Card) */}
        {panelItem && (
          <aside
            ref={cardRef}
            data-nofly
            aria-label={`Collected ${panelItem.name}`}
            className="pointer-events-auto absolute right-3 top-3 w-[min(92vw,350px)] border-2 border-ink bg-canvas-bg p-4 hard-shadow-lg sm:right-7 sm:top-5 sm:p-5"
          >
            <div className="flex items-center justify-between border-b-[1.5px] border-ink/20 pb-3">
              <span className="inline-flex items-center gap-1.5 border-[1.5px] border-ink bg-acid-chartreuse px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                SPECIMEN {pad2(panelItem.index)} · CAPTURED
              </span>
              <button
                type="button"
                onClick={closePanel}
                aria-label="Close discovery panel"
                className="flex h-6 w-6 items-center justify-center border-[1.5px] border-ink bg-canvas-bg font-mono text-xs font-bold text-ink hover:bg-ink hover:text-canvas-bg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="mt-3">
              <div className="font-mono text-[11px] font-medium uppercase tracking-widest text-ink/65">
                {panelItem.serial} — {panelItem.name}
              </div>
              <h2 className="mt-1 font-headline text-xl font-extrabold leading-tight tracking-tight text-ink uppercase">
                {panelItem.category}
              </h2>
              <div
                className="mt-2 h-1 w-10"
                style={{ backgroundColor: COLOR_HEX[panelItem.color] }}
              />
              <p className="mt-3 text-xs leading-relaxed font-medium text-ink/85 sm:text-[13px]">
                {panelItem.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {panelItem.edition.map((tag) => (
                  <span
                    key={tag}
                    className="border border-ink bg-canvas-bg px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t-[1.5px] border-ink/20 pt-3.5">
              <Link
                href={`/projects/${panelItem.featuredProjectSlug}`}
                className="border-2 border-ink bg-electric-cobalt px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hard-shadow-sm hard-shadow-hover cursor-pointer"
              >
                CASE STUDY →
              </Link>

              <button
                type="button"
                onClick={() => setModal({ type: "detail", id: panelItem.id })}
                className="border-2 border-ink bg-canvas-bg px-2.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-ink hard-shadow-sm hard-shadow-hover cursor-pointer"
              >
                DOSSIER
              </button>

              {/* Quick jump to next uncollected collectible if available */}
              {(() => {
                const next = COLLECTIBLES.find((c) => !captured.includes(c.id));
                if (!next) return null;
                return (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => select(next.id)}
                    className="font-mono text-[11px] font-semibold uppercase tracking-wider text-ink underline decoration-ink/60 underline-offset-4 hover:text-electric-cobalt disabled:opacity-40 cursor-pointer"
                  >
                    ABDUCT [{pad2(next.index)}]
                  </button>
                );
              })()}
            </div>
          </aside>
        )}

        {/* Completion Banner when all 3 collectibles are captured */}
        {allCaptured && phase === "idle" && (
          <div
            data-nofly
            className="pointer-events-auto absolute left-3 top-3 max-w-xs border-2 border-ink bg-acid-chartreuse p-3.5 hard-shadow sm:left-7 sm:top-5 sm:max-w-sm sm:p-4"
          >
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/80">
              03 / 03 STAGE SPECIMENS IN ORBIT
            </div>
            <div className="mt-1 font-headline text-lg font-extrabold leading-none tracking-tight text-ink sm:text-xl">
              STAGE CLEARED. EXPLORE ALL 6 AI SYSTEMS BELOW.
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="#collection"
                className="border-2 border-ink bg-electric-cobalt px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hard-shadow-sm hard-shadow-hover cursor-pointer"
              >
                THE COLLECTION ↓
              </a>
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  replay();
                }}
                className="border-2 border-ink bg-ink px-3 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-acid-chartreuse hard-shadow-sm hard-shadow-hover cursor-pointer"
              >
                REPLAY ↺
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM LEFT HEADLINE + FOOTER BAR ──────────────────────────── */}
      <div className="flex flex-col">
        {/* Main asymmetrical editorial headline block */}
        <div
          data-nofly
          className="pointer-events-none max-w-lg px-4 pb-3 sm:max-w-2xl sm:px-7 sm:pb-5"
        >
          <div className="inline-flex items-center gap-2 border-2 border-ink bg-canvas-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink hard-shadow-sm sm:text-[11px]">
            <span className="h-2 w-2 border border-ink bg-vermilion" />
            <span>AI AGENTS · ENTERPRISE RAG · WORKFLOW AUTOMATION</span>
          </div>

          <h1 className="mt-2.5 font-headline text-[2.2rem] font-extrabold leading-[0.92] tracking-[-0.04em] text-ink uppercase sm:text-[3.75rem]">
            WE ABDUCT{" "}
            <span className="relative inline-block text-electric-cobalt">
              BORING WORKFLOWS.
              <span className="absolute -bottom-1 left-0 h-1.5 w-full bg-vermilion" />
            </span>
          </h1>

          <p className="mt-2.5 max-w-xl border-l-4 border-ink bg-canvas-bg/90 pl-3 py-1 text-xs font-medium leading-snug text-ink/90 sm:text-sm">
            {STUDIO_POSITIONING.supportingCopy}
          </p>
        </div>

        {/* Bottom control strip */}
        <footer
          data-nofly
          className="pointer-events-auto flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink bg-canvas-bg/95 px-4 py-2.5 sm:px-7 sm:py-3"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 border-[1.5px] border-ink bg-canvas-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink sm:text-[11px]">
              <span className="h-2 w-2 bg-electric-cobalt" />
              {isTouch ? "TAP TO FLY · TAP TO ABDUCT" : "MOVE TO FLY · CLICK TO ABDUCT"}
            </span>

            <span
              ref={bottomCounterRef}
              className="inline-flex items-center gap-1.5 border-[1.5px] border-ink bg-acid-chartreuse px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink sm:text-[11px]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink" />
              {pad2(captured.length)} / {pad2(TOTAL)}
            </span>

            <a
              href="#collection"
              className="inline-flex items-center gap-1.5 border-[1.5px] border-ink bg-vermilion px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-white hard-shadow-sm hard-shadow-hover sm:text-[11px]"
            >
              <span>BROWSE 6 AI PROJECTS ↓</span>
            </a>
          </div>

          {/* Accessible HTML Collectible Selector + Replay */}
          <div className="flex items-center gap-1.5">
            {COLLECTIBLES.map((c) => {
              const isDone = captured.includes(c.id);
              const isCurrent = activeId === c.id && busy;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={busy && !isDone}
                  onClick={() => {
                    if (isDone) {
                      useGame.setState({ panelId: c.id });
                    } else {
                      select(c.id);
                    }
                  }}
                  title={isDone ? `Inspect ${c.name}` : `Abduct ${c.name}`}
                  className={`flex items-center gap-1.5 border-[1.5px] border-ink px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider transition-transform cursor-pointer disabled:opacity-45 sm:px-2.5 sm:text-[11px] ${
                    isCurrent
                      ? "bg-electric-cobalt text-white"
                      : isDone
                        ? "bg-ink text-acid-chartreuse"
                        : "bg-canvas-bg text-ink hover:-translate-y-0.5"
                  }`}
                >
                  <span
                    className="h-2 w-2 border border-ink"
                    style={{ backgroundColor: COLOR_HEX[c.color] }}
                  />
                  <span>{pad2(c.index)}</span>
                  <span className="hidden md:inline">{c.name.replace("The ", "")}</span>
                </button>
              );
            })}

            {captured.length > 0 && (
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  setModal(null);
                  replay();
                }}
                className="ml-1 border-[1.5px] border-ink bg-canvas-bg px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink hard-shadow-sm hard-shadow-hover disabled:opacity-40 cursor-pointer sm:text-[11px]"
              >
                REPLAY ↺
              </button>
            )}
          </div>
        </footer>
      </div>

      {/* ── DETAILED PROJECT / WORK / ABOUT OVERLAYS ────────────────────── */}
      {modal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setModal(null)}
          className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] w-full max-w-2xl overflow-y-auto border-2 border-ink bg-canvas-bg p-5 hard-shadow-lg sm:p-7"
          >
            {modal === "about" && <AboutSheet onClose={() => setModal(null)} />}
            {modal === "work" && (
              <WorkIndex
                captured={captured}
                busy={busy}
                onSelectDetail={(id) => setModal({ type: "detail", id })}
                onAbduct={(id) => {
                  setModal(null);
                  select(id);
                }}
                onClose={() => setModal(null)}
              />
            )}
            {typeof modal === "object" && modal.type === "detail" && (
              <DetailSheet
                item={COLLECTIBLE_MAP[modal.id]}
                onSwitch={(id) => setModal({ type: "detail", id })}
                onClose={() => setModal(null)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Local Detailed Project Dossier                                            */
/* -------------------------------------------------------------------------- */

function DetailSheet({
  item,
  onSwitch,
  onClose,
}: {
  item: (typeof COLLECTIBLES)[number];
  onSwitch: (id: CollectibleId) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3.5 w-3.5 border border-ink"
            style={{ backgroundColor: COLOR_HEX[item.color] }}
          />
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
            SPECIMEN {pad2(item.index)} // {item.serial}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-ink bg-canvas-bg px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-ink hover:bg-ink hover:text-canvas-bg cursor-pointer"
        >
          CLOSE [ESC]
        </button>
      </div>

      <div className="mt-4">
        <div className="font-mono text-xs font-semibold uppercase tracking-widest text-ink/60">
          {item.name}
        </div>
        <h2 className="mt-1 font-headline text-2xl font-extrabold tracking-tight text-ink uppercase sm:text-3xl">
          {item.category}
        </h2>
        <p className="mt-3 text-sm leading-relaxed font-medium text-ink/90">
          {item.detail.intro}
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {item.detail.focus.map((f, i) => (
          <div
            key={f.title}
            className="border-2 border-ink bg-canvas-bg p-3.5 hard-shadow-sm"
          >
            <div className="font-mono text-[10px] font-bold text-electric-cobalt">
              0{i + 1}
            </div>
            <h3 className="mt-1 font-headline text-sm font-extrabold uppercase text-ink">
              {f.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/80">{f.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-2 border-ink bg-ink p-4 text-canvas-bg">
        <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-acid-chartreuse">
          PRINCIPLE
        </div>
        <p className="mt-1 text-sm font-medium leading-snug">{item.detail.approach}</p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink pt-4">
        <Link
          href={`/projects/${item.featuredProjectSlug}`}
          onClick={onClose}
          className="border-2 border-ink bg-electric-cobalt px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-white hard-shadow-sm hard-shadow-hover"
        >
          OPEN FULL CASE STUDY →
        </Link>

        <div className="flex items-center gap-1.5">
          {COLLECTIBLES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSwitch(c.id)}
              className={`border-[1.5px] border-ink px-2 py-1 font-mono text-[11px] font-semibold cursor-pointer ${
                c.id === item.id
                  ? "bg-electric-cobalt text-white"
                  : "bg-canvas-bg text-ink hover:bg-acid-chartreuse"
              }`}
            >
              {pad2(c.index)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Work Index Sheet (Stage Spec + All 6 AI Projects)                         */
/* -------------------------------------------------------------------------- */

function WorkIndex({
  captured,
  busy,
  onSelectDetail,
  onAbduct,
  onClose,
}: {
  captured: CollectibleId[];
  busy: boolean;
  onSelectDetail: (id: CollectibleId) => void;
  onAbduct: (id: CollectibleId) => void;
  onClose: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
          THE COLLECTION · 001 — 006 AI SYSTEMS
        </span>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-ink bg-canvas-bg px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-ink hover:bg-ink hover:text-canvas-bg cursor-pointer"
        >
          CLOSE [ESC]
        </button>
      </div>

      {/* All 6 Featured AI Projects Direct Directory */}
      <div className="mt-4 space-y-2.5">
        {PROJECTS.map((project) => (
          <div
            key={project.slug}
            className="flex flex-col justify-between gap-3 border-2 border-ink p-3.5 hard-shadow-sm sm:flex-row sm:items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 border border-ink"
                  style={{ backgroundColor: ACCENT_HEX[project.accentColor] }}
                />
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-ink">
                  PROJECT {project.number} · {project.name}
                </span>
                <span className="font-mono text-[10px] uppercase text-ink/60">
                  {project.category}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold text-ink/85">
                &ldquo;{project.headline}&rdquo;
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/projects/${project.slug}`}
                onClick={onClose}
                className="border-2 border-ink bg-electric-cobalt px-3 py-1.5 font-mono text-xs font-semibold uppercase text-white hard-shadow-sm hard-shadow-hover"
              >
                VIEW PROJECT →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Hero Stage Interactive Specimens */}
      <div className="mt-6 border-t-2 border-ink pt-4">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/65 mb-2.5">
          UFO STAGE SPECIMENS (TRACTOR BEAM TARGETS)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {COLLECTIBLES.map((c) => {
            const isCollected = captured.includes(c.id);
            return (
              <div key={c.id} className="border border-ink p-2.5 bg-canvas-bg">
                <div className="font-mono text-[10px] font-bold uppercase text-ink">
                  {pad2(c.index)} · {c.name}
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  {!isCollected && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => onAbduct(c.id)}
                      className="border border-ink bg-vermilion px-2 py-1 font-mono text-[10px] font-bold uppercase text-white cursor-pointer disabled:opacity-40"
                    >
                      ABDUCT
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSelectDetail(c.id)}
                    className="border border-ink bg-ink px-2 py-1 font-mono text-[10px] font-bold uppercase text-acid-chartreuse cursor-pointer"
                  >
                    DOSSIER
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  About Sheet                                                               */
/* -------------------------------------------------------------------------- */

function AboutSheet({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b-2 border-ink pb-3">
        <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ink">
          STUDIO POSITIONING // THE ABDUCTION CLUB
        </span>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-ink bg-canvas-bg px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-ink hover:bg-ink hover:text-canvas-bg cursor-pointer"
        >
          CLOSE [ESC]
        </button>
      </div>

      <h2 className="mt-4 font-headline text-2xl font-extrabold uppercase tracking-tight text-ink sm:text-3xl">
        WE ABDUCT BORING WORKFLOWS.
      </h2>
      <p className="mt-3 text-sm leading-relaxed font-medium text-ink/85">
        {STUDIO_POSITIONING.supportingCopy}
      </p>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {STUDIO_POSITIONING.capabilities.map((cap) => (
          <div key={cap.id} className="border-2 border-ink p-3 bg-canvas-bg hard-shadow-sm">
            <div className="font-headline text-xs font-extrabold uppercase text-ink">
              {cap.title}
            </div>
            <p className="mt-1 text-[11px] text-ink/75 leading-snug">{cap.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t-2 border-ink pt-4">
        <a
          href="#collection"
          onClick={onClose}
          className="border-2 border-ink bg-electric-cobalt px-3.5 py-1.5 font-mono text-xs font-semibold uppercase text-white hard-shadow-sm"
        >
          EXPLORE THE COLLECTION (001—006) ↓
        </a>
        <div className="flex flex-wrap gap-1.5 font-mono text-[10px] font-semibold uppercase text-ink/75">
          <span className="border border-ink px-2 py-0.5">AGENTS &amp; RAG</span>
          <span className="border border-ink px-2 py-0.5">MCP &amp; LANGGRAPH</span>
          <span className="border border-ink px-2 py-0.5">VISION &amp; VOICE AI</span>
        </div>
      </div>
    </div>
  );
}
