"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  ACCENT_HEX,
  PROJECTS,
  STUDIO_POSITIONING,
  type AccentColorKey,
  type Project,
  type ProjectSlug,
} from "@/data/projects";
import { ProjectCollectible } from "./ProjectCollectible";
import { ProjectPreview } from "./ProjectPreview";

export function ProjectCollection() {
  const [hoveredSlug, setHoveredSlug] = useState<ProjectSlug | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<ProjectSlug | null>("signal");
  const [activeFilter, setActiveFilter] = useState<"ALL" | AccentColorKey>("ALL");

  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);

  const selectedProject: Project | undefined = PROJECTS.find(
    (p) => p.slug === selectedSlug
  );

  // Entrance animation when entering the viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            const cards = el.querySelectorAll("[data-collection-card]");
            gsap.fromTo(
              cards,
              { y: 36, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                stagger: 0.08,
                ease: "power3.out",
                clearProps: "transform,opacity",
              }
            );
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close preview on Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedSlug(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleInspectProject = (slug: ProjectSlug) => {
    setSelectedSlug(slug);
    requestAnimationFrame(() => {
      previewContainerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  return (
    <section
      id="collection"
      ref={sectionRef}
      className="relative w-full bg-[#F3F0E8] text-[#181818] border-t-4 border-[#181818] z-20"
    >
      {/* Top Studio Capabilities Marquee / Architectural Strip */}
      <div className="bg-[#181818] text-[#F3F0E8] border-b-2 border-[#181818] py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#F3F0E8]/15">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#3155F4] text-[#F3F0E8] text-[10px] font-bold uppercase tracking-[0.18em] mb-3">
                <span className="w-2 h-2 rounded-full bg-[#D1EF47]" />
                <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                  CREATIVE AI PRODUCT &amp; ENGINEERING STUDIO
                </span>
              </div>
              <h2
                className="text-2xl sm:text-4xl font-extrabold uppercase tracking-[-0.03em] leading-none"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                WHAT WE ENGINEER &amp; SHIP.
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#F3F0E8]/75 max-w-md leading-relaxed">
              {STUDIO_POSITIONING.supportingCopy}
            </p>
          </div>

          {/* 6 Studio Practice Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-6">
            {STUDIO_POSITIONING.capabilities.map((cap, idx) => (
              <div
                key={cap.id}
                className="group rounded-xl border border-[#F3F0E8]/20 bg-[#222222] p-4 hover:border-[#D1EF47] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1EF47]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    CAPABILITY // 0{idx + 1}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full transition-colors"
                    style={{ backgroundColor: ACCENT_HEX[cap.accent] }}
                  />
                </div>
                <h3
                  className="text-base font-extrabold uppercase tracking-[-0.01em] text-[#F3F0E8]"
                  style={{ fontFamily: "var(--font-headline), sans-serif" }}
                >
                  {cap.title}
                </h3>
                <p className="mt-1.5 text-xs text-[#F3F0E8]/70 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Portfolio Shelf: THE COLLECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#D1EF47] border-2 border-[#181818] shadow-[3px_3px_0px_#181818] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#181818]" />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#181818]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                SERIES 01 // APPLIED AI COLLECTIBLES (001—006)
              </span>
            </div>

            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[-0.04em] leading-[0.92] text-[#181818]"
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              THE{" "}
              <span className="text-[#3155F4] underline decoration-[#FF5A36] decoration-4 underline-offset-8">
                COLLECTION
              </span>
            </h2>

            <p className="mt-4 text-base sm:text-xl font-semibold text-[#181818]/85 tracking-[-0.01em]">
              {STUDIO_POSITIONING.collectionSubtitle}
            </p>
          </div>

          {/* Interactive Filter & Quick Switcher */}
          <div className="flex flex-col sm:items-end gap-2">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#181818]/60"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              HOVER TO ANIMATE // CLICK SPECIMEN TO ENLARGE OR OPEN CASE STUDY
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { key: "ALL", label: "ALL SPECIMENS (6)" },
                  { key: "cobalt", label: "COBALT SERIES" },
                  { key: "vermilion", label: "VERMILION SERIES" },
                  { key: "chartreuse", label: "CHARTREUSE SERIES" },
                ] as const
              ).map((filter) => {
                const active = activeFilter === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.14em] border-2 border-[#181818] transition-all cursor-pointer ${
                      active
                        ? "bg-[#181818] text-[#D1EF47] shadow-[2px_2px_0px_#3155F4]"
                        : "bg-[#F3F0E8] text-[#181818] hover:bg-[#EAE5D7]"
                    }`}
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enlarged Interactive Specimen Spotlight (ProjectPreview) */}
        <div ref={previewContainerRef} className="mb-12">
          {selectedProject ? (
            <ProjectPreview
              project={selectedProject}
              allProjects={PROJECTS}
              onSelectProject={(slug) => setSelectedSlug(slug)}
              onClose={() => setSelectedSlug(null)}
            />
          ) : (
            <div className="rounded-xl border-2 border-dashed border-[#181818]/35 bg-[#EAE5D7]/50 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <span
                className="text-xs font-bold uppercase tracking-[0.14em] text-[#181818]/70"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                SPECIMEN INSPECTOR CLOSED — SELECT ANY COLLECTIBLE BELOW TO ENLARGE 3D MODEL
              </span>
              <button
                type="button"
                onClick={() => setSelectedSlug("signal")}
                className="px-3 py-1.5 rounded-lg bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                REOPEN INSPECTOR
              </button>
            </div>
          )}
        </div>

        {/* 6 Designer Art-Toy Collectibles Shelf Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {PROJECTS.filter((project) =>
            activeFilter === "ALL" ? true : project.accentColor === activeFilter
          ).map((project) => {
            const isHovered = hoveredSlug === project.slug;
            const isSelected = selectedSlug === project.slug;
            const accentHex = ACCENT_HEX[project.accentColor];
            const isChartreuse = project.accentColor === "chartreuse";

            return (
              <article
                key={project.slug}
                data-collection-card
                data-testid={`project-card-${project.slug}`}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onMouseLeave={() =>
                  setHoveredSlug((prev) => (prev === project.slug ? null : prev))
                }
                className={`group relative rounded-2xl border-2 border-[#181818] bg-[#F3F0E8] flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                  isSelected
                    ? "shadow-[10px_10px_0px_#3155F4] -translate-y-1.5 ring-2 ring-[#3155F4]"
                    : "shadow-[7px_7px_0px_#181818] hover:shadow-[10px_10px_0px_#181818] hover:-translate-y-1"
                }`}
              >
                {/* Top Distinctive Accent Header Strip */}
                <div
                  className="px-4 py-2.5 border-b-2 border-[#181818] flex items-center justify-between gap-2"
                  style={{
                    backgroundColor: accentHex,
                    color: isChartreuse ? "#181818" : "#F3F0E8",
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="px-2 py-0.5 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.16em] shrink-0"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      PROJECT {project.number}
                    </span>
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.12em] truncate"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {project.category}
                    </span>
                  </div>

                  {isSelected && (
                    <span
                      className="px-2 py-0.5 rounded bg-[#F3F0E8] text-[#181818] border border-[#181818] text-[9px] font-bold uppercase tracking-widest shrink-0"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      INSPECTING
                    </span>
                  )}
                </div>

                {/* Interactive 3D Collectible Display Box */}
                <div
                  onClick={() => handleInspectProject(project.slug)}
                  className="relative h-56 w-full bg-[#EAE5D7] border-b-2 border-[#181818] cursor-pointer overflow-hidden"
                  title={`Click to enlarge ${project.name} 3D collectible`}
                >
                  {/* Subtle graphic grid backdrop */}
                  <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                      backgroundImage:
                        "radial-gradient(#181818 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* Toy Name Badge */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span
                      className="px-2 py-0.5 rounded bg-[#F3F0E8]/90 border border-[#181818] text-[9px] font-bold uppercase tracking-[0.14em] text-[#181818]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      THE {project.name}
                    </span>
                  </div>

                  {/* Hover Prompt Pill */}
                  <div className="absolute bottom-2.5 right-3 z-10 pointer-events-none">
                    <span
                      className={`px-2 py-0.5 rounded border border-[#181818] text-[9px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        isHovered || isSelected
                          ? "bg-[#181818] text-[#D1EF47]"
                          : "bg-[#F3F0E8]/85 text-[#181818]"
                      }`}
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {isSelected ? "ACTIVE SPECIMEN" : "CLICK TO ENLARGE 3D"}
                    </span>
                  </div>

                  <ProjectCollectible
                    model={project.collectibleModel}
                    hovered={isHovered}
                    selected={isSelected}
                    className="w-full h-full"
                  />
                </div>

                {/* Card Copy & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.03em] text-[#181818]"
                        style={{ fontFamily: "var(--font-headline), sans-serif" }}
                      >
                        {project.name}
                      </h3>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#181818]/55 truncate"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {project.category}
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm font-bold text-[#181818] leading-snug">
                      &ldquo;{project.headline}&rdquo;
                    </p>

                    <p className="mt-2.5 text-xs text-[#181818]/75 leading-relaxed">
                      {project.shortDescription}
                    </p>

                    {/* Top Tech Stack Badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded bg-[#EAE5D7] border border-[#181818]/25 text-[10px] font-semibold text-[#181818]/80"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-[#181818]/15 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleInspectProject(project.slug)}
                      className={`px-3 py-2 rounded-xl border-2 border-[#181818] text-[10px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[#D1EF47] text-[#181818]"
                          : "bg-[#F3F0E8] text-[#181818] hover:bg-[#EAE5D7]"
                      }`}
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {isSelected ? "SPECIMEN SELECTED" : "INSPECT 3D"}
                    </button>

                    <Link
                      href={`/projects/${project.slug}`}
                      data-testid={`view-project-${project.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#181818] text-[#F3F0E8] border-2 border-[#181818] hover:bg-[#3155F4] transition-colors text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      <span>VIEW PROJECT</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Studio Inquiry / Commission Banner */}
        <div className="mt-20 rounded-2xl border-2 border-[#181818] bg-[#3155F4] text-[#F3F0E8] p-7 sm:p-10 shadow-[10px_10px_0px_#181818] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span
              className="inline-block px-2.5 py-1 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              START AN AI PRODUCT SPRINT // THE ABDUCTION CLUB
            </span>
            <h3
              className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.94]"
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              READY TO ABDUCT YOUR TEAM&apos;S MANUAL WORKFLOWS?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#F3F0E8]/90 leading-relaxed">
              We partner with engineering and operations teams to design, architect,
              and ship custom AI agents, RAG knowledge systems, document pipelines,
              and voice interfaces.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:hello@abduction.club?subject=AI%20Project%20Inquiry%20%E2%80%94%20The%20Abduction%20Club"
              className="px-6 py-3.5 rounded-xl bg-[#FF5A36] text-[#F3F0E8] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#D1EF47] hover:text-[#181818] transition-colors text-xs font-bold uppercase tracking-[0.16em]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              BOOK ARCHITECTURE REVIEW →
            </a>
            <a
              href="#hero-stage"
              className="px-4 py-3.5 rounded-xl bg-[#F3F0E8] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#181818] hover:text-[#F3F0E8] transition-colors text-xs font-bold uppercase tracking-[0.16em]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              ↑ BACK TO UFO STAGE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
