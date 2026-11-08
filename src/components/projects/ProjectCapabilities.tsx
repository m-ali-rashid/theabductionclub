"use client";

import React from "react";
import { ACCENT_HEX, type Project } from "@/data/projects";

interface ProjectCapabilitiesProps {
  project: Project;
}

export function ProjectCapabilities({ project }: ProjectCapabilitiesProps) {
  const accentHex = ACCENT_HEX[project.accentColor];
  const isChartreuse = project.accentColor === "chartreuse";

  return (
    <div className="bg-[#F3F0E8] text-[#181818]">
      {/* Section 1: Business Problem vs Solution Overview */}
      <section className="border-b-2 border-[#181818] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Business Problem */}
            <div className="lg:col-span-6 rounded-2xl border-2 border-[#181818] bg-[#EAE5D7] p-6 sm:p-8 shadow-[8px_8px_0px_#181818]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181818] text-[#FF5A36] text-[10px] font-bold uppercase tracking-[0.16em] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                  01 // THE BUSINESS PROBLEM
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.03em] leading-[0.98] text-[#181818]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                WHY LEGACY WORKFLOWS BREAK DOWN.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#181818]/85 leading-relaxed font-medium">
                {project.problem.summary}
              </p>

              <div className="mt-6 space-y-3">
                {project.problem.painPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F3F0E8] border border-[#181818]"
                  >
                    <span
                      className="px-2 py-0.5 rounded bg-[#FF5A36] text-[#F3F0E8] text-[10px] font-bold uppercase shrink-0 mt-0.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      PAIN 0{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#181818]/85 leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution Overview */}
            <div className="lg:col-span-6 rounded-2xl border-2 border-[#181818] bg-[#181818] text-[#F3F0E8] p-6 sm:p-8 shadow-[8px_8px_0px_#3155F4]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#3155F4] text-[#F3F0E8] text-[10px] font-bold uppercase tracking-[0.16em] mb-4">
                <span className="w-2 h-2 rounded-full bg-[#D1EF47]" />
                <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                  02 // THE SOLUTION OVERVIEW
                </span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[-0.03em] leading-[0.98] text-[#F3F0E8]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                HOW {project.name} SOLVES IT.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-[#F3F0E8]/85 leading-relaxed font-medium">
                {project.solution.summary}
              </p>

              <div className="mt-6 space-y-3">
                {project.solution.highlights.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#222222] border border-[#F3F0E8]/20"
                  >
                    <span
                      className="px-2 py-0.5 rounded bg-[#D1EF47] text-[#181818] text-[10px] font-bold uppercase shrink-0 mt-0.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      WIN 0{index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-[#F3F0E8]/90 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Key Capabilities Grid */}
      <section className="border-b-2 border-[#181818] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span
                className="inline-block px-2.5 py-1 rounded bg-[#D1EF47] border border-[#181818] text-[10px] font-bold uppercase tracking-[0.16em] text-[#181818] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                03 // KEY SYSTEM CAPABILITIES
              </span>
              <h2
                className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.95]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                BUILT FOR PRODUCTION REALITY.
              </h2>
            </div>
            <p
              className="text-xs font-bold uppercase tracking-[0.14em] text-[#181818]/60"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {project.capabilities.length} CORE MODULES // {project.name}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.capabilities.map((cap, idx) => (
              <div
                key={cap.title}
                className="rounded-2xl border-2 border-[#181818] bg-[#F3F0E8] p-6 shadow-[6px_6px_0px_#181818] flex flex-col justify-between hover:-translate-y-1 transition-transform"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 rounded border border-[#181818] text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{
                        fontFamily: "var(--font-mono), monospace",
                        backgroundColor: accentHex,
                        color: isChartreuse ? "#181818" : "#F3F0E8",
                      }}
                    >
                      CAPABILITY 0{idx + 1}
                    </span>
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#181818]/55"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {cap.tag}
                    </span>
                  </div>

                  <h3
                    className="text-xl font-extrabold uppercase tracking-[-0.02em] text-[#181818]"
                    style={{ fontFamily: "var(--font-headline), sans-serif" }}
                  >
                    {cap.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-[#181818]/80 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#181818]/15 flex items-center justify-between">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#181818]/50"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    MODULE STATUS
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#181818]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#3155F4]" />
                    SPECIFIED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Workflow Illustration (Step-by-step Pipeline) */}
      <section className="border-b-2 border-[#181818] bg-[#EAE5D7] py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-10">
            <span
              className="inline-block px-2.5 py-1 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              04 // END-TO-END WORKFLOW ILLUSTRATION
            </span>
            <h2
              className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.95]"
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              FROM INPUT TRIGGER TO VERIFIED OUTPUT.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {project.workflow.map((step, index) => (
              <div
                key={step.step}
                className="relative rounded-2xl border-2 border-[#181818] bg-[#F3F0E8] p-5 shadow-[6px_6px_0px_#181818] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className="px-2.5 py-1 rounded bg-[#181818] text-[#D1EF47] text-xs font-bold uppercase tracking-[0.14em]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      STEP {step.step}
                    </span>
                    {index < project.workflow.length - 1 && (
                      <span
                        className="hidden lg:inline-block text-xs font-bold text-[#3155F4]"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        NEXT →
                      </span>
                    )}
                  </div>

                  <div
                    className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#181818]/55 mb-1"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {step.actor}
                  </div>

                  <h3
                    className="text-xl font-extrabold uppercase tracking-[-0.02em] text-[#181818]"
                    style={{ fontFamily: "var(--font-headline), sans-serif" }}
                  >
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-[#181818]/80 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t-2 border-dashed border-[#181818]/20">
                  <div
                    className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#181818]/55"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    STAGE ARTIFACT
                  </div>
                  <div
                    className="mt-0.5 text-xs font-bold text-[#3155F4]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {step.artifact}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: AI Engineering Approach */}
      <section className="border-b-2 border-[#181818] py-14 sm:py-20 bg-[#F3F0E8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <span
                className="inline-block px-2.5 py-1 rounded bg-[#3155F4] text-[#F3F0E8] text-[10px] font-bold uppercase tracking-[0.16em] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                05 // AI ENGINEERING APPROACH
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold uppercase tracking-[-0.03em] leading-[0.95] text-[#181818]"
                style={{ fontFamily: "var(--font-headline), sans-serif" }}
              >
                DETERMINISTIC GUARDRAILS + APPLIED INTELLIGENCE.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-[#181818]/85 leading-relaxed">
                {project.engineeringApproach.summary}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 gap-4">
              {project.engineeringApproach.pillars.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border-2 border-[#181818] bg-[#EAE5D7] p-6 shadow-[6px_6px_0px_#181818]"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded bg-[#181818] text-[#D1EF47] text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      PILLAR 0{idx + 1}
                    </span>
                    <h3
                      className="text-lg sm:text-xl font-extrabold uppercase tracking-[-0.02em] text-[#181818]"
                      style={{ fontFamily: "var(--font-headline), sans-serif" }}
                    >
                      {pillar.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#181818]/85 leading-relaxed">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
