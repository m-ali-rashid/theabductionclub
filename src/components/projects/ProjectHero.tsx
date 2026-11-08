"use client";

import React from "react";
import Link from "next/link";
import { ACCENT_HEX, type Project } from "@/data/projects";
import { ProjectCollectible } from "./ProjectCollectible";

interface ProjectHeroProps {
  project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
  const accentHex = ACCENT_HEX[project.accentColor];
  const isChartreuse = project.accentColor === "chartreuse";

  return (
    <section className="relative border-b-2 border-[#181818] bg-[#F3F0E8] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Left Column: Expressive Typography & Project Positioning */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Breadcrumb + Project Badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-5">
                <span
                  className="px-3 py-1 rounded-md border-2 border-[#181818] text-xs font-bold uppercase tracking-[0.16em] shadow-[3px_3px_0px_#181818]"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    backgroundColor: accentHex,
                    color: isChartreuse ? "#181818" : "#F3F0E8",
                  }}
                >
                  PROJECT {project.number} // {project.name}
                </span>

                <span
                  className="px-3 py-1 rounded-md bg-[#181818] text-[#D1EF47] text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {project.category}
                </span>
              </div>

              {/* Giant Project Title & Headline */}
              <div className="mb-4">
                <div
                  className="text-xs font-bold uppercase tracking-[0.18em] text-[#181818]/55 mb-1"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  CASE STUDY &amp; SYSTEM ARCHITECTURE
                </div>
                <h1
                  className="text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-[-0.04em] leading-[0.93] text-[#181818]"
                  style={{ fontFamily: "var(--font-headline), sans-serif" }}
                >
                  {project.headline}
                </h1>
              </div>

              {/* Overview Copy */}
              <p className="mt-5 text-base sm:text-lg text-[#181818]/85 leading-relaxed font-medium max-w-2xl">
                {project.overview}
              </p>

              {/* Technology Stack Badges */}
              <div className="mt-7">
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#181818]/55 mb-2.5"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  CORE TECHNOLOGY STACK
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((item) => (
                    <div
                      key={item}
                      className="px-3 py-1.5 rounded-lg bg-[#EAE5D7] border-2 border-[#181818] shadow-[2px_2px_0px_#181818]"
                    >
                      <div
                        className="text-xs font-bold text-[#181818]"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero CTA Row */}
            <div className="mt-8 pt-6 border-t-2 border-[#181818]/15 flex flex-wrap items-center gap-3">
              <a
                href="#architecture"
                className="px-5 py-3 rounded-xl bg-[#3155F4] text-[#F3F0E8] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#FF5A36] transition-colors text-xs font-bold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                INSPECT SYSTEM ARCHITECTURE ↓
              </a>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-[#D1EF47] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  TRY DEMO ↗
                </a>
              )}

              <Link
                href="/#collection"
                className="px-4 py-3 rounded-xl bg-[#F3F0E8] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#EAE5D7] transition-colors text-xs font-bold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ← ALL 6 PROJECTS
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Collectible Display Case */}
          <div className="lg:col-span-5">
            <div className="h-full rounded-2xl border-2 border-[#181818] bg-[#EAE5D7] shadow-[10px_10px_0px_#181818] p-5 flex flex-col justify-between relative overflow-hidden">
              {/* Top Spec Labels */}
              <div className="flex items-center justify-between gap-2 z-10">
                <span
                  className="px-2.5 py-1 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  EDITION {project.number} // 006
                </span>
                <span
                  className="px-2.5 py-1 rounded bg-[#F3F0E8] border border-[#181818] text-[10px] font-bold uppercase tracking-[0.14em] text-[#181818]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  DRAG TO ORBIT 3D COLLECTIBLE
                </span>
              </div>

              {/* 3D Canvas Stage */}
              <div className="relative w-full h-[300px] sm:h-[340px] my-2">
                <ProjectCollectible
                  model={project.collectibleModel}
                  selected={true}
                  interactive={true}
                  className="w-full h-full"
                />
              </div>

              {/* Collectible Sculpt Plaque */}
              <div className="rounded-xl border-2 border-[#181818] bg-[#F3F0E8] p-4 shadow-[4px_4px_0px_#181818] z-10">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#181818]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    THE {project.name} // COLLECTIBLE SCULPT
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-[#181818] shrink-0"
                    style={{ backgroundColor: accentHex }}
                  />
                </div>
                <p className="text-xs text-[#181818]/75 leading-relaxed">
                  {project.collectibleDescription}
                </p>
                <div
                  className="mt-2 pt-2 border-t border-[#181818]/15 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#181818]/60"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  FINISH: POLISHED DESIGNER RESIN &amp; INDUSTRIAL COMPOSITE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
