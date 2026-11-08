"use client";

import React, { useState } from "react";
import {
  ACCENT_HEX,
  type ArchitectureNode,
  type Project,
} from "@/data/projects";

interface ProjectArchitectureProps {
  project: Project;
}

export function ProjectArchitecture({ project }: ProjectArchitectureProps) {
  const { nodes, connections, summary, note } = project.architecture;
  const [activeNodeId, setActiveNodeId] = useState<string>(
    nodes[0]?.id ?? ""
  );

  const activeNode: ArchitectureNode | undefined =
    nodes.find((n) => n.id === activeNodeId) ?? nodes[0];
  const accentHex = ACCENT_HEX[project.accentColor];
  const isChartreuse = project.accentColor === "chartreuse";

  return (
    <section
      id="architecture"
      className="border-b-2 border-[#181818] bg-[#181818] text-[#F3F0E8] py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D1EF47] text-[#181818] text-[10px] font-bold uppercase tracking-[0.16em] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#181818]" />
              <span style={{ fontFamily: "var(--font-mono), monospace" }}>
                06 // INTERACTIVE TECHNICAL ARCHITECTURE BLUEPRINT
              </span>
            </div>

            <h2
              className="text-3xl sm:text-5xl font-extrabold uppercase tracking-[-0.03em] leading-[0.95]"
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              SYSTEM ARCHITECTURE &amp; DATA FLOW.
            </h2>

            <p className="mt-3 text-sm sm:text-base text-[#F3F0E8]/80 max-w-3xl leading-relaxed">
              {summary}
            </p>
          </div>

          <div className="shrink-0">
            <span
              className="inline-block px-3 py-1.5 rounded-lg border border-[#F3F0E8]/25 bg-[#222222] text-[10px] font-bold uppercase tracking-[0.14em] text-[#D1EF47]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {note}
            </span>
          </div>
        </div>

        {/* Interactive Node Pipeline + SVG Connector Diagram */}
        <div className="rounded-2xl border-2 border-[#F3F0E8]/25 bg-[#202020] p-6 sm:p-8 shadow-[8px_8px_0px_#3155F4]">
          {/* SVG Flow Schematic Strip (Desktop) */}
          <div className="hidden lg:block mb-6">
            <svg
              viewBox="0 0 1000 90"
              className="w-full h-20 overflow-visible"
              aria-label={`${project.name} architecture flow diagram`}
            >
              <defs>
                <marker
                  id="arch-arrow"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#D1EF47" />
                </marker>
              </defs>

              {/* Connecting lines between consecutive nodes */}
              {nodes.map((node, idx) => {
                if (idx >= nodes.length - 1) return null;
                const stepWidth = 840 / Math.max(1, nodes.length - 1);
                const x1 = 80 + idx * stepWidth;
                const x2 = 80 + (idx + 1) * stepWidth;
                const conn = connections.find(
                  (c) =>
                    c.from === node.id && c.to === nodes[idx + 1]?.id
                );
                const isHighlighted =
                  activeNodeId === node.id ||
                  activeNodeId === nodes[idx + 1]?.id;

                return (
                  <g key={`${node.id}-${idx}`}>
                    <line
                      x1={x1 + 34}
                      y1={45}
                      x2={x2 - 34}
                      y2={45}
                      stroke={isHighlighted ? "#D1EF47" : "#F3F0E8"}
                      strokeOpacity={isHighlighted ? 1 : 0.35}
                      strokeWidth={isHighlighted ? 3 : 2}
                      strokeDasharray={isHighlighted ? "none" : "5 5"}
                      markerEnd="url(#arch-arrow)"
                    />
                    {conn && (
                      <text
                        x={(x1 + x2) / 2}
                        y={22}
                        textAnchor="middle"
                        fill={isHighlighted ? "#D1EF47" : "#F3F0E8"}
                        fillOpacity={isHighlighted ? 1 : 0.65}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {conn.label.toUpperCase()}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Node Circles */}
              {nodes.map((node, idx) => {
                const stepWidth = 840 / Math.max(1, nodes.length - 1);
                const cx = 80 + idx * stepWidth;
                const isSelected = activeNodeId === node.id;
                return (
                  <g
                    key={node.id}
                    className="cursor-pointer"
                    onClick={() => setActiveNodeId(node.id)}
                  >
                    <circle
                      cx={cx}
                      cy={45}
                      r={isSelected ? 28 : 23}
                      fill={isSelected ? accentHex : "#181818"}
                      stroke={isSelected ? "#D1EF47" : "#F3F0E8"}
                      strokeWidth={3}
                    />
                    <text
                      x={cx}
                      y={49}
                      textAnchor="middle"
                      fill={isSelected && isChartreuse ? "#181818" : "#F3F0E8"}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      0{idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Architecture Layer Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node, idx) => {
              const isSelected = activeNodeId === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setActiveNodeId(node.id)}
                  onMouseEnter={() => setActiveNodeId(node.id)}
                  className={`text-left rounded-xl p-4 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-[#F3F0E8] text-[#181818] border-[#D1EF47] -translate-y-1 shadow-[5px_5px_0px_#D1EF47]"
                      : "bg-[#181818] text-[#F3F0E8] border-[#F3F0E8]/20 hover:border-[#F3F0E8]/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[0.14em] ${
                          isSelected
                            ? "bg-[#181818] text-[#D1EF47]"
                            : "bg-[#2A2A2A] text-[#D1EF47]"
                        }`}
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        0{idx + 1} // {node.layerLabel}
                      </span>
                    </div>

                    <h3
                      className="text-base font-extrabold uppercase tracking-[-0.02em] leading-snug"
                      style={{ fontFamily: "var(--font-headline), sans-serif" }}
                    >
                      {node.title}
                    </h3>

                    <div
                      className={`mt-1 text-[11px] font-semibold ${
                        isSelected ? "text-[#3155F4]" : "text-[#D1EF47]"
                      }`}
                    >
                      {node.subtitle}
                    </div>

                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        isSelected ? "text-[#181818]/80" : "text-[#F3F0E8]/65"
                      }`}
                    >
                      {node.details}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-current/15 flex flex-wrap gap-1">
                    {node.tech.map((t) => (
                      <span
                        key={t}
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                          isSelected
                            ? "bg-[#EAE5D7] text-[#181818] border border-[#181818]/30"
                            : "bg-[#262626] text-[#F3F0E8]/85"
                        }`}
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Node Inspector Bar */}
          {activeNode && (
            <div className="mt-6 pt-6 border-t border-[#F3F0E8]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className="px-2.5 py-0.5 rounded bg-[#3155F4] text-[#F3F0E8] text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    ACTIVE LAYER: {activeNode.layerLabel}
                  </span>
                  <span
                    className="text-sm font-extrabold uppercase tracking-tight text-[#D1EF47]"
                    style={{ fontFamily: "var(--font-headline), sans-serif" }}
                  >
                    {activeNode.title}
                  </span>
                </div>
                <p className="mt-1.5 text-xs sm:text-sm text-[#F3F0E8]/85">
                  {activeNode.details}
                </p>
              </div>

              {/* Connections for active node */}
              <div className="flex flex-wrap gap-2">
                {connections
                  .filter(
                    (c) =>
                      c.from === activeNode.id || c.to === activeNode.id
                  )
                  .map((conn, i) => {
                    const fromNode = nodes.find((n) => n.id === conn.from);
                    const toNode = nodes.find((n) => n.id === conn.to);
                    return (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-[#181818] border border-[#F3F0E8]/25 text-[10px]"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        <span className="text-[#F3F0E8]/70">
                          {fromNode?.title}
                        </span>{" "}
                        <span className="text-[#D1EF47] font-bold">
                          —[{conn.label}]→
                        </span>{" "}
                        <span className="text-[#F3F0E8]">
                          {toNode?.title}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
