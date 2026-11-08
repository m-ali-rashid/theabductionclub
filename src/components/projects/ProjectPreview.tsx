"use client";

import React from "react";
import Link from "next/link";
import { ACCENT_HEX, type Project } from "@/data/projects";
import { ProjectCollectible } from "./ProjectCollectible";

interface ProjectPreviewProps {
  project: Project;
  onClose?: () => void;
  onSelectProject?: (slug: Project["slug"]) => void;
  allProjects?: Project[];
}

export function ProjectPreview({
  project,
  onClose,
  onSelectProject,
  allProjects = [],
}: ProjectPreviewProps) {
  const accentHex = ACCENT_HEX[project.accentColor];
  const isChartreuse = project.accentColor === "chartreuse";

  return (
    <div
      className="relative rounded-2xl border-2 border-[#181818] bg-[#F3F0E8] shadow-[10px_10px_0px_#181818] overflow-hidden transition-all duration-300"
      data-testid="project-preview-panel"
    >
      {/* Top Studio Header Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b-2 border-[#181818]"
        style={{
          backgroundColor: accentHex,
          color: isChartreuse ? "#181818" : "#F3F0E8",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-[0.14em] uppercase border border-[#181818]"
            style={{
              fontFamily: "var(--font-mono), monospace",
              backgroundColor: "#181818",
              color: "#D1EF47",
            }}
          >
            PROJECT {project.number} // SPECIMEN INSPECTOR
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {project.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {allProjects.length > 0 && onSelectProject && (
            <div className="hidden sm:flex items-center gap-1 mr-2">
              {allProjects.map((item) => {
                const isActive = item.slug === project.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => onSelectProject(item.slug)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-[#181818] transition-transform cursor-pointer ${
                      isActive
                        ? "bg-[#181818] text-[#D1EF47] -translate-y-0.5"
                        : "bg-[#F3F0E8] text-[#181818] hover:bg-[#181818]/10"
                    }`}
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {item.number}
                  </button>
                );
              })}
            </div>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-md border border-[#181818] bg-[#F3F0E8] text-[#181818] text-[10px] font-bold uppercase tracking-widest hover:bg-[#181818] hover:text-[#F3F0E8] transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              CLOSE [ESC]
            </button>
          )}
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Enlarged Interactive 3D Collectible Stage */}
        <div className="lg:col-span-5 relative bg-[#EAE5D7] border-b-2 lg:border-b-0 lg:border-r-2 border-[#181818] p-5 flex flex-col justify-between min-h-[340px] sm:min-h-[380px]">
          <div className="flex items-center justify-between z-10 pointer-events-none">
            <span
              className="px-2.5 py-1 rounded-md bg-[#F3F0E8] border border-[#181818] text-[10px] font-bold uppercase tracking-[0.14em] text-[#181818]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              EDITION // {project.number} OF 006
            </span>
            <span
              className="px-2.5 py-1 rounded-md bg-[#181818] text-[#F3F0E8] text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              DRAG TO ROTATE 360°
            </span>
          </div>

          <div className="relative w-full h-[250px] sm:h-[280px] my-1">
            <ProjectCollectible
              model={project.collectibleModel}
              selected={true}
              interactive={true}
              className="w-full h-full"
            />
          </div>

          <div className="z-10 bg-[#F3F0E8] border border-[#181818] rounded-xl p-3 shadow-[3px_3px_0px_#181818]">
            <div className="flex items-center justify-between mb-1">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#181818]/60"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                COLLECTIBLE SCULPT // THE {project.name}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-[#181818]"
                style={{ backgroundColor: accentHex }}
              />
            </div>
            <p className="text-xs text-[#181818]/80 leading-relaxed">
              {project.collectibleDescription}
            </p>
          </div>
        </div>

        {/* Right Column: Project Intelligence & Actions */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#F3F0E8]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className="text-xs font-bold uppercase tracking-[0.16em] px-2.5 py-0.5 rounded border border-[#181818]"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  backgroundColor: accentHex,
                  color: isChartreuse ? "#181818" : "#F3F0E8",
                }}
              >
                {project.number} — {project.name}
              </span>
              <span
                className="text-xs uppercase tracking-[0.12em] text-[#181818]/65 font-semibold"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {project.category}
              </span>
            </div>

            <h3
              className="text-2xl sm:text-4xl font-extrabold uppercase tracking-[-0.03em] leading-[0.96] text-[#181818]"
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              {project.headline}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-[#181818]/85 leading-relaxed font-medium">
              {project.overview}
            </p>

            {/* Core Capabilities Matrix */}
            <div className="mt-6">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#181818]/55 mb-2.5"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                KEY SYSTEM CAPABILITIES
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.capabilities.map((cap) => (
                  <div
                    key={cap.title}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#EAE5D7]/75 border border-[#181818]/20"
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-1.5 shrink-0 border border-[#181818]"
                      style={{ backgroundColor: accentHex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-[#181818] leading-snug">
                        {cap.title}
                      </div>
                      <div
                        className="text-[10px] text-[#181818]/60 uppercase tracking-wider mt-0.5"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {cap.tag}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technology Stack Pills */}
            <div className="mt-5">
              <p
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#181818]/55 mb-2"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ENGINEERING STACK
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md bg-[#181818] text-[#F3F0E8] text-[11px] font-medium tracking-wider"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-7 pt-5 border-t-2 border-[#181818]/15 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/projects/${project.slug}`}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#3155F4] text-[#F3F0E8] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:bg-[#FF5A36] hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-[0.14em]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>OPEN FULL CASE STUDY</span>
                <span>→</span>
              </Link>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#D1EF47] text-[#181818] border-2 border-[#181818] shadow-[4px_4px_0px_#181818] hover:-translate-y-0.5 transition-all text-xs font-bold uppercase tracking-[0.14em]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <span>TRY LIVE DEMO</span>
                  <span>↗</span>
                </a>
              )}
            </div>

            <span
              className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#181818]/60"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              ROUTE: /projects/{project.slug}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
