/**
 * THE ABDUCTION CLUB — Hero Diorama Specimens (the 3 stage collectibles in the playable UFO scene)
 * Each specimen on the hero stage represents a pillar of our AI engineering studio
 * and links directly into our six featured AI projects.
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
  /** AI studio pillar the toy represents. */
  category: string;
  /** One-liner on the discovery card. */
  summary: string;
  /** Brand color key used for the card band. */
  color: "cobalt" | "vermilion" | "chartreuse";
  /** Material / edition notes for the packaging. */
  edition: string[];
  /** Featured AI project slug to jump directly to from the discovery card. */
  featuredProjectSlug: string;
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
    serial: "TAC-001 / ENT",
    category: "Enterprise Knowledge & Document AI",
    summary:
      "Permission-aware RAG knowledge systems and multimodal document intelligence that turn scattered files into structured truth.",
    color: "cobalt",
    edition: ["Cobalt resin", "SIGNAL + VAULT"],
    featuredProjectSlug: "signal",
    detail: {
      intro:
        "The Monolith represents the foundational data and knowledge layer of our studio: connecting internal documents, policies, invoices, and contracts into cited, schema-validated intelligence.",
      focus: [
        {
          title: "SIGNAL — Enterprise AI / RAG",
          body: "Hybrid semantic + lexical retrieval with document-level ACL enforcement and inline source citations.",
        },
        {
          title: "VAULT — Document Intelligence",
          body: "OCR and vision-language extraction paired with deterministic validation gates and human review workflows.",
        },
        {
          title: "Grounded Reliability",
          body: "Engineered to abstain when evidence is missing and validate every extracted number before export.",
        },
      ],
      tools: ["Python", "FastAPI", "LangChain", "Vision Models", "Vector DB"],
      approach:
        "Treat retrieval and extraction like load-bearing architecture: verifiable inputs, strict schemas, and explicit provenance.",
      links: [
        { label: "CASE STUDY: 001 SIGNAL →", href: "/projects/signal" },
        { label: "CASE STUDY: 003 VAULT →", href: "/projects/vault" },
      ],
    },
  },
  {
    id: "signal",
    index: 2,
    name: "The Signal",
    serial: "TAC-002 / AGT",
    category: "Conversational & Voice AI Systems",
    summary:
      "Full-duplex voice assistants and customer resolution agents wired directly into live calendars, CRMs, and support tools.",
    color: "vermilion",
    edition: ["Vermilion vinyl", "ORBIT + ECHO"],
    featuredProjectSlug: "orbit",
    detail: {
      intro:
        "The Signal stands for conversational systems that don't just chat — they look up live records, book appointments over voice, execute policy-checked actions, and hand off cleanly to humans.",
      focus: [
        {
          title: "ORBIT — Customer Resolution AI",
          body: "Context-aware support conversations combining RAG policy lookup with authenticated CRM & order tool execution.",
        },
        {
          title: "ECHO — Real-Time Voice AI",
          body: "Low-latency WebSocket speech-to-text, barge-in handling, live scheduling tools, and streaming TTS.",
        },
        {
          title: "Human-Ready Handoffs",
          body: "Every conversation produces structured summaries, transcripts, and action receipts.",
        },
      ],
      tools: ["TypeScript", "Python", "WebSockets", "Speech APIs", "LLM APIs"],
      approach:
        "Latency and tool guardrails define great conversational AI. Listen accurately, verify critical details, and act safely.",
      links: [
        { label: "CASE STUDY: 004 ORBIT →", href: "/projects/orbit" },
        { label: "CASE STUDY: 006 ECHO →", href: "/projects/echo" },
      ],
    },
  },
  {
    id: "oddtree",
    index: 3,
    name: "The Odd Tree",
    serial: "TAC-003 / AUT",
    category: "Agentic Automation & Developer Tools",
    summary:
      "Stateful LangGraph orchestrations and MCP-powered engineering teammates that think before they act.",
    color: "chartreuse",
    edition: ["Acid resin", "PATCH + RELAY"],
    featuredProjectSlug: "relay",
    detail: {
      intro:
        "The Odd Tree represents branching, multi-step agency: developer intelligence systems that inspect repositories and pull requests, and stateful workflow engines with human approval gates.",
      focus: [
        {
          title: "PATCH — Engineering Intelligence",
          body: "Connects Git repositories and Azure DevOps via MCP to analyze pull requests and align diffs with work items.",
        },
        {
          title: "RELAY — Agentic Orchestration",
          body: "LangGraph state machines with persistent checkpointing, dynamic tool calling, and human-in-the-loop approvals.",
        },
        {
          title: "Bounded Autonomy",
          body: "Agents reason inside explicit graph transitions with retry recovery and full execution logs.",
        },
      ],
      tools: ["TypeScript", "Python", "LangGraph", "MCP", "Azure DevOps API"],
      approach:
        "Start from the workflow, not the prompt. Bound agent reasoning inside state machines that operators can inspect and approve.",
      links: [
        { label: "CASE STUDY: 002 PATCH →", href: "/projects/patch" },
        { label: "CASE STUDY: 005 RELAY →", href: "/projects/relay" },
      ],
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
