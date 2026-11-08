"use client";

import React from "react";
import Link from "next/link";
import {
  ACCENT_HEX,
  PROJECTS,
  PROJECT_MAP,
  type Project,
} from "@/data/projects";
import { ProjectCollectible } from "./ProjectCollectible";

interface ProjectHeaderNavProps {
  currentProject: Project;
}

export function ProjectHeaderNav({ currentProject }: ProjectHeaderNavProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-[#181818] bg-[#F3F0E8]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity + Back to UFO Playground */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#181818] text-[#F3F0E8] hover:bg-[#3155F4] transition-colors text-xs font-bold uppercase tracking-[0.14em]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span className="w-2 h-2 rounded-full bg-[#D1EF47]" />
            <span>THE ABDUCTION CLUB</span>
          </Link>

          <Link
            href="/#collection"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-[#181818] bg-[#F3F0E8] text-[#181818] hover:bg-[#EAE5D7] transition-colors text-[11px] font-bold uppercase tracking-[0.12em]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span>← THE COLLECTION</span>
          </Link>
        </div>

        {/* Center/Right: Direct 001–006 Specimen Switcher */}
        <nav
          aria-label="Project Switcher"
          className="flex items-center gap-1.5 overflow-x-auto py-1"
        >
          {PROJECTS.map((item) => {
            const isCurrent = item.slug === currentProject.slug;
            return (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className={`px-2.5 py-1 rounded-md border-2 border-[#181818] text-[10px] font-bold uppercase tracking-[0.12em] transition-all shrink-0 ${
                  isCurrent
                    ? "bg-[#3155F4] text-[#F3F0E8] shadow-[2px_2px_0px_#181818]"
                    : "bg-[#F3F0E8] text-[#181818] hover:bg-[#EAE5D7]"
                }`}
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="hidden md:inline">{item.number} · </span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

interface ProjectFooterNavProps {
  currentProject: Project;
}

export function ProjectNavigation({ currentProject }: ProjectFooterNavProps) {
  const relatedProjects = currentProject.relatedProjects
    .map((slug) => PROJECT_MAP[slug])
    .filter(Boolean);

  return (
    <footer className="bg-[#F3F0E8] text-[#181818]">
      {/* Related Projects Section */}
      <section className="border-b-2 border-[#181818] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span
                className="inline-block px-2.5 py-1 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                07 // RELATED AI EXPERIMENTS
              </span>
              <h2
                className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.95]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                EXPLORE MORE FROM THE COLLECTION.
              </h2>
            </div>

            <Link
              href="/#collection"
              className="px-4 py-2.5 rounded-xl border-2 border-[#181818] bg-[#EAE5D7] hover:bg-[#181818] hover:text-[#F3F0E8] transition-colors text-xs font-bold uppercase tracking-[0.14em] self-start sm:self-auto"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              VIEW ALL 6 SPECIMENS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((rel) => {
              const relAccentHex = ACCENT_HEX[rel.accentColor];
              const isChartreuse = rel.accentColor === "chartreuse";
              return (
                <Link
                  key={rel.slug}
                  href={`/projects/${rel.slug}`}
                  className="group rounded-2xl border-2 border-[#181818] bg-[#F3F0E8] shadow-[6px_6px_0px_#181818] hover:shadow-[10px_10px_0px_#3155F4] hover:-translate-y-1 transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="px-4 py-2 border-b-2 border-[#181818] flex items-center justify-between gap-2"
                      style={{
                        backgroundColor: relAccentHex,
                        color: isChartreuse ? "#181818" : "#F3F0E8",
                      }}
                    >
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.16em] shrink-0"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        PROJECT {rel.number}
                      </span>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.12em] truncate"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {rel.category}
                      </span>
                    </div>

                    <div className="h-44 bg-[#EAE5D7] border-b-2 border-[#181818]">
                      <ProjectCollectible
                        model={rel.collectibleModel}
                        className="w-full h-full"
                      />
                    </div>

                    <div className="p-5">
                      <h3
                        className="text-2xl font-extrabold uppercase tracking-[-0.03em] text-[#181818]"
                        style={{ fontFamily: "var(--font-headline), sans-serif" }}
                      >
                        {rel.name}
                      </h3>
                      <p className="mt-1 text-xs font-bold text-[#181818]/85">
                        &ldquo;{rel.headline}&rdquo;
                      </p>
                      <p className="mt-2 text-xs text-[#181818]/70 line-clamp-2">
                        {rel.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-4 pt-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#3155F4] group-hover:text-[#FF5A36]">
                    <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                      OPEN CASE STUDY
                    </span>
                    <span>→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact / Project Inquiry CTA */}
      <section className="bg-[#181818] text-[#F3F0E8] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="rounded-2xl border-2 border-[#F3F0E8]/25 bg-[#3155F4] p-7 sm:p-12 shadow-[10px_10px_0px_#D1EF47] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span
                className="inline-block px-3 py-1 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                PROJECT INQUIRY // COMMISSION SIMILAR SYSTEM
              </span>
              <h2
                className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.94] text-[#F3F0E8]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                WANT AN ARCHITECTURE LIKE {currentProject.name} FOR YOUR TEAM?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#F3F0E8]/90 leading-relaxed">
                Talk directly with the engineers at The Abduction Club to scope a
                custom AI agent, enterprise RAG pipeline, or automated workflow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`mailto:hello@abduction.club?subject=Project%20Inquiry%3A%20${encodeURIComponent(
                  currentProject.name
                )}%20Architecture`}
                className="px-6 py-3.5 rounded-xl bg-[#D1EF47] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#FF5A36] hover:text-[#F3F0E8] transition-colors text-xs font-bold uppercase tracking-[0.16em]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                START A PROJECT INQUIRY →
              </a>

              <Link
                href="/"
                className="px-5 py-3.5 rounded-xl bg-[#F3F0E8] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#181818] hover:text-[#F3F0E8] transition-colors text-xs font-bold uppercase tracking-[0.16em]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                PILOT THE UFO →
              </Link>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-[#F3F0E8]/15 flex flex-wrap items-center justify-between gap-4 text-xs text-[#F3F0E8]/60">
            <span style={{ fontFamily: "var(--font-mono), monospace" }}>
              THE ABDUCTION CLUB // CREATIVE AI PRODUCT &amp; ENGINEERING STUDIO
            </span>
            <span style={{ fontFamily: "var(--font-mono), monospace" }}>
              WE ABDUCT BORING WORKFLOWS.
            </span>
          </div>
        </div>
      </section>
    </footer>
  );
}
