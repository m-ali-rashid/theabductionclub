/**
 * THE ABDUCTION CLUB — collectible + portfolio content.
 *
 * Everything a visitor reads lives here. Edit freely: titles, copy, focus
 * areas and tool lists are plain data. No fictional metrics or external links
 * are included on purpose — add real project links to `links` when you have them.
 */

export type CollectibleId = "monolith" | "signal" | "oddtree";

export type ProjectLink = { label: string; href: string };

export type Collectible = {
  id: CollectibleId;
  /** Display order, also used as collectible number. */
  index: number;
  /** Object name shown on the toy. */
  name: string;
  /** Short collectible ID printed on the packaging (IBM Plex Mono). */
  serial: string;
  /** Portfolio category the toy represents. */
  category: string;
  /** One-liner on the discovery card. */
  summary: string;
  /** Brand color key used for the card band. */
  color: "cobalt" | "vermilion" | "chartreuse";
  /** Material / edition notes for the packaging. */
  edition: string[];
  detail: {
    intro: string;
    focus: { title: string; body: string }[];
    tools: string[];
    approach: string;
    links: ProjectLink[];
  };
};

export const COLLECTIBLES: Collectible[] = [
  {
    id: "monolith",
    index: 1,
    name: "The Monolith",
    serial: "TAC-001 / MNL",
    category: "Mobile Engineering & Banking",
    summary:
      "Native mobile products for finance, where reliability, security and clarity matter as much as the interface.",
    color: "cobalt",
    edition: ["Cobalt resin", "Load-bearing"],
    detail: {
      intro:
        "The Monolith stands for the solid, structural side of the work: mobile apps that move money and therefore have to be correct, fast and trustworthy every single time.",
      focus: [
        {
          title: "Native iOS & Android",
          body: "Building and maintaining production mobile apps with a focus on performance, accessibility and maintainable architecture.",
        },
        {
          title: "Banking-grade flows",
          body: "Onboarding, authentication, payments and account experiences designed around security requirements without sacrificing usability.",
        },
        {
          title: "Architecture & quality",
          body: "Modular codebases, testing strategy, release pipelines and the unglamorous engineering that keeps apps stable at scale.",
        },
      ],
      tools: ["Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "CI/CD"],
      approach:
        "Treat every screen like a load-bearing wall: simple on the surface, carefully engineered underneath.",
      links: [],
    },
  },
  {
    id: "signal",
    index: 2,
    name: "The Signal",
    serial: "TAC-002 / SGN",
    category: "AI, Agents & Automation",
    summary:
      "Language models, agents and automations wired into real workflows — less demo, more dependable signal.",
    color: "vermilion",
    edition: ["Vermilion vinyl", "Always listening"],
    detail: {
      intro:
        "The Signal is the transmitter: systems that listen, reason and act. It covers experiments and tools built around LLMs, agentic workflows and automation.",
      focus: [
        {
          title: "Agentic workflows",
          body: "Designing agents that use tools, plan multi-step tasks and hand control back to people at the right moments.",
        },
        {
          title: "LLM-powered product features",
          body: "Prompting, retrieval, evaluation and guardrails for features that need to behave predictably in front of users.",
        },
        {
          title: "Automation",
          body: "Connecting services and scripts so repetitive work disappears quietly into the background.",
        },
      ],
      tools: ["TypeScript", "Python", "LLM APIs", "Tool calling", "Evaluations"],
      approach:
        "Start from the workflow, not the model. The best automation is the one nobody has to think about.",
      links: [],
    },
  },
  {
    id: "oddtree",
    index: 3,
    name: "The Odd Tree",
    serial: "TAC-003 / ODT",
    category: "Creative Coding & Experiments",
    summary:
      "Interactive 3D, generative visuals and playful prototypes — the place where ideas grow sideways.",
    color: "chartreuse",
    edition: ["Acid resin", "Grows sideways"],
    detail: {
      intro:
        "The Odd Tree is the experimental branch: real-time graphics, interaction design and small weird prototypes — including this site.",
      focus: [
        {
          title: "Real-time 3D on the web",
          body: "Three.js and React Three Fiber scenes with art-directed lighting, motion and interaction, built to run smoothly in the browser.",
        },
        {
          title: "Motion & interaction",
          body: "Choreographed transitions and tactile micro-interactions that make interfaces feel physical.",
        },
        {
          title: "Prototypes & toys",
          body: "Fast experiments used to test an idea, a feeling or a technique before it becomes a product.",
        },
      ],
      tools: ["Three.js", "React Three Fiber", "GLSL", "GSAP", "Next.js"],
      approach:
        "Make it playable first. If it is fun to poke at, it is usually worth refining.",
      links: [],
    },
  },
];

export const COLLECTIBLE_MAP: Record<CollectibleId, Collectible> = Object.fromEntries(
  COLLECTIBLES.map((c) => [c.id, c]),
) as Record<CollectibleId, Collectible>;

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const COLOR_HEX: Record<Collectible["color"], string> = {
  cobalt: "#3155F4",
  vermilion: "#FF5A36",
  chartreuse: "#D1EF47",
};
