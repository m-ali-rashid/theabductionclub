/**
 * THE ABDUCTION CLUB — Creative AI Product & Engineering Studio
 * Single typed source of truth for studio positioning and the six featured AI projects.
 *
 * All copy, capabilities, architecture diagrams and workflow steps are editable
 * reference descriptions without fabricated metrics, fake client logos or dead demo links.
 */

export type ProjectSlug = "signal" | "patch" | "vault" | "orbit" | "relay" | "echo";

export type CollectibleModelType = ProjectSlug;

export type AccentColorKey = "cobalt" | "vermilion" | "chartreuse";

export type ArchitectureNode = {
  id: string;
  layer: "input" | "ingestion" | "intelligence" | "orchestration" | "integration" | "output";
  layerLabel: string;
  title: string;
  subtitle: string;
  details: string;
  tech: string[];
};

export type ArchitectureConnection = {
  from: string;
  to: string;
  label: string;
};

export type WorkflowStage = {
  step: string;
  title: string;
  actor: string;
  detail: string;
  artifact: string;
};

export type CapabilityItem = {
  title: string;
  description: string;
  tag: string;
};

export type EngineeringPillar = {
  title: string;
  body: string;
};

export type Project = {
  id: string;
  number: string;
  slug: ProjectSlug;
  name: string;
  category: string;
  headline: string;
  shortDescription: string;
  overview: string;
  problem: {
    summary: string;
    painPoints: string[];
  };
  solution: {
    summary: string;
    highlights: string[];
  };
  capabilities: CapabilityItem[];
  architecture: {
    summary: string;
    note: string;
    nodes: ArchitectureNode[];
    connections: ArchitectureConnection[];
  };
  engineeringApproach: {
    summary: string;
    pillars: EngineeringPillar[];
  };
  workflow: WorkflowStage[];
  techStack: string[];
  collectibleModel: CollectibleModelType;
  collectibleDescription: string;
  accentColor: AccentColorKey;
  /** Optional functioning demo URL. "Try Demo" button renders ONLY when defined and non-empty. */
  demoUrl?: string;
  relatedProjects: ProjectSlug[];
};

export const STUDIO_POSITIONING = {
  name: "THE ABDUCTION CLUB",
  tagline: "Creative AI Product & Engineering Studio",
  headline: "WE ABDUCT BORING WORKFLOWS.",
  supportingCopy:
    "We build intelligent agents, automate complex workflows, and turn ambitious AI ideas into useful digital products.",
  collectionTitle: "THE COLLECTION",
  collectionSubtitle: "Six experiments in applied intelligence.",
  capabilities: [
    {
      id: "01",
      title: "Custom AI Agents & Intelligent Assistants",
      description:
        "Purpose-built agents that reason over domain context, call tools safely, and collaborate with human teams.",
      accent: "cobalt" as AccentColorKey,
    },
    {
      id: "02",
      title: "Enterprise AI Knowledge Systems",
      description:
        "Permission-aware RAG pipelines that turn scattered documentation, wikis, and policies into cited answers.",
      accent: "chartreuse" as AccentColorKey,
    },
    {
      id: "03",
      title: "AI-Powered Document Processing",
      description:
        "Vision-language and OCR pipelines that turn messy PDFs, invoices, and contracts into validated schemas.",
      accent: "vermilion" as AccentColorKey,
    },
    {
      id: "04",
      title: "Agentic Workflow Automation",
      description:
        "Stateful multi-step orchestrations with human-in-the-loop approvals, retries, and full execution auditability.",
      accent: "cobalt" as AccentColorKey,
    },
    {
      id: "05",
      title: "AI Developer Tools",
      description:
        "Engineering copilots wired into Git, CI pipelines, and issue trackers via Model Context Protocol (MCP).",
      accent: "vermilion" as AccentColorKey,
    },
    {
      id: "06",
      title: "Conversational & Voice AI Products",
      description:
        "Low-latency voice and chat systems that resolve customer requests and execute real back-office actions.",
      accent: "chartreuse" as AccentColorKey,
    },
  ],
};

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  cobalt: "#3155F4",
  vermilion: "#FF5A36",
  chartreuse: "#D1EF47",
};

export const PROJECTS: Project[] = [
  /* ------------------------------------------------------------------------ */
  /*  PROJECT 001 — SIGNAL                                                    */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-001",
    number: "001",
    slug: "signal",
    name: "SIGNAL",
    category: "Enterprise AI / RAG",
    headline: "Your company's knowledge. Finally connected.",
    shortDescription:
      "An enterprise knowledge assistant designed to connect documents, policies, technical knowledge and internal information.",
    overview:
      "SIGNAL is an enterprise retrieval-augmented generation (RAG) platform that unifies internal documentation, SOPs, engineering runbooks, and policy archives into a single conversational interface. Every answer is grounded in retrieved passages with explicit source citations and enforced access controls.",
    problem: {
      summary:
        "Critical institutional knowledge is fragmented across handbook PDFs, wikis, ticket threads, and shared drives. Teams waste hours hunting for canonical answers or act on outdated documents.",
      painPoints: [
        "Keyword search fails when employees ask natural-language questions or don't know exact internal terminology.",
        "Standard LLM chat interfaces hallucinate policy details when detached from verified source documents.",
        "Flat document indexes risk exposing sensitive HR, legal, or project files across permission boundaries.",
      ],
    },
    solution: {
      summary:
        "SIGNAL ingests heterogeneous document stores through a layout-aware chunking pipeline, indexes hybrid dense + lexical vectors with document-level ACL tags, and synthesizes strictly cited responses.",
      highlights: [
        "Hybrid semantic + BM25 retrieval with cross-encoder reranking for high precision on technical terminology.",
        "Inline paragraph-level citations that open the exact source section side-by-side.",
        "Role- and group-scoped retrieval filters evaluated before context ever reaches the language model.",
      ],
    },
    capabilities: [
      {
        title: "Document Ingestion & Preprocessing",
        description:
          "Parses PDFs, Markdown, Office files, and wiki pages while preserving tables, section hierarchy, and metadata.",
        tag: "INGESTION",
      },
      {
        title: "Semantic Search & Vector Retrieval",
        description:
          "Combines dense embeddings with sparse lexical matching so both conceptual queries and exact part/policy codes resolve accurately.",
        tag: "RETRIEVAL",
      },
      {
        title: "Retrieval-Augmented Generation",
        description:
          "Synthesizes concise answers constrained to retrieved context windows, abstaining cleanly when evidence is absent.",
        tag: "GENERATION",
      },
      {
        title: "Context-Aware Responses with Source Citations",
        description:
          "Attaches clickable footnote markers linking every claim to its source document, page number, and last-modified timestamp.",
        tag: "PROVENANCE",
      },
      {
        title: "Permission-Aware Enterprise Search",
        description:
          "Enforces identity-provider group memberships at query time so users only retrieve knowledge they are authorized to read.",
        tag: "SECURITY",
      },
    ],
    architecture: {
      summary:
        "Two-plane architecture separating asynchronous document ingestion/indexing from the low-latency permission-filtered query and synthesis pipeline.",
      note: "Illustrative reference architecture — adaptable to self-hosted or cloud vector stores and enterprise identity providers.",
      nodes: [
        {
          id: "sources",
          layer: "input",
          layerLabel: "01 · SOURCES",
          title: "Document Connectors",
          subtitle: "PDFs, Wikis, Policies, Runbooks",
          details:
            "Watches source repositories for document updates, extracting raw text, tables, structural headings, and ACL principals.",
          tech: ["Python", "Unstructured / Parsers", "Webhooks"],
        },
        {
          id: "ingestion",
          layer: "ingestion",
          layerLabel: "02 · INDEXING",
          title: "Chunking & Embedding Worker",
          subtitle: "Hierarchical chunks + ACL metadata",
          details:
            "Splits documents along semantic section boundaries, generates dense & sparse embeddings, and writes ACL-tagged vectors.",
          tech: ["LangChain", "Embedding API", "Vector DB"],
        },
        {
          id: "retriever",
          layer: "intelligence",
          layerLabel: "03 · RETRIEVAL",
          title: "ACL-Filtered Hybrid Retriever",
          subtitle: "Dense + Lexical + Reranker",
          details:
            "Applies user permission filters pre-search, runs hybrid retrieval, and re-scores top candidates for relevance.",
          tech: ["Vector Database", "Cross-Encoder", "FastAPI"],
        },
        {
          id: "synthesizer",
          layer: "orchestration",
          layerLabel: "04 · SYNTHESIS",
          title: "Grounded Answer Engine",
          subtitle: "Citation-enforced LLM generation",
          details:
            "Prompts the LLM with numbered evidence blocks, streaming structured answers with verified inline citation tokens.",
          tech: ["LLM APIs", "LangChain", "SSE Streaming"],
        },
        {
          id: "client",
          layer: "output",
          layerLabel: "05 · INTERFACE",
          title: "Knowledge Workspace UI",
          subtitle: "Chat, Search & Source Inspector",
          details:
            "Presents streamed answers alongside an interactive source drawer highlighting the exact passage used.",
          tech: ["Next.js", "TypeScript", "REST / SSE"],
        },
      ],
      connections: [
        { from: "sources", to: "ingestion", label: "Parsed blocks + ACLs" },
        { from: "ingestion", to: "retriever", label: "Indexed vectors" },
        { from: "retriever", to: "synthesizer", label: "Top-K cited passages" },
        { from: "synthesizer", to: "client", label: "Streamed answer + citations" },
      ],
    },
    engineeringApproach: {
      summary:
        "Retrieval quality determines generation quality. We engineer the ingestion and ranking layers with the same rigor as application code.",
      pillars: [
        {
          title: "Structure-Preserving Chunking",
          body: "Instead of naive fixed-character slicing, documents are segmented by heading hierarchy and table boundaries so policies and tables stay intact.",
        },
        {
          title: "Pre-Filter Access Control",
          body: "Security principals are attached to every chunk record and enforced as mandatory metadata predicates inside the vector query.",
        },
        {
          title: "Grounded Abstention",
          body: "System prompts and structured output checks require explicit passage references, instructing the assistant to state when knowledge is missing rather than guess.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Ingest & Normalize",
        actor: "Ingestion Pipeline",
        detail: "Extracts sections, tables, and access permissions from handbooks and technical docs.",
        artifact: "Normalized Document AST",
      },
      {
        step: "02",
        title: "Embed & Tag",
        actor: "Vector Indexer",
        detail: "Computes embeddings and stores chunks alongside role/group ACL attributes.",
        artifact: "ACL-Scoped Vector Index",
      },
      {
        step: "03",
        title: "Query & Rerank",
        actor: "Hybrid Retriever",
        detail: "Rewrites conversational queries, filters by user identity, and reranks candidate passages.",
        artifact: "Top-K Evidence Set",
      },
      {
        step: "04",
        title: "Synthesize & Cite",
        actor: "Answer Engine",
        detail: "Generates a grounded response with inline citation badges linked to original pages.",
        artifact: "Verified Cited Response",
      },
    ],
    techStack: ["Python", "FastAPI", "LangChain", "Vector Database", "LLM APIs"],
    collectibleModel: "signal",
    collectibleDescription: "A cobalt-blue satellite dish with rotating antennas.",
    accentColor: "cobalt",
    relatedProjects: ["vault", "orbit", "patch"],
  },

  /* ------------------------------------------------------------------------ */
  /*  PROJECT 002 — PATCH                                                     */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-002",
    number: "002",
    slug: "patch",
    name: "PATCH",
    category: "AI Engineering / Developer Productivity",
    headline: "An AI teammate for your engineering team.",
    shortDescription:
      "An engineering intelligence system connecting Git repositories and Azure DevOps to help analyze pull requests, review code changes and understand development workflows.",
    overview:
      "PATCH connects directly to Git repositories and Azure DevOps work items via the Model Context Protocol (MCP) to give engineering teams context-aware pull-request reviews, change-impact analysis, and linked work-item verification without leaving their workflow.",
    problem: {
      summary:
        "Code reviews often suffer from missing context: reviewers have to cross-reference diffs against Azure DevOps tickets, architectural conventions, and related modules manually.",
      painPoints: [
        "Large pull requests stall in review queues because understanding the intent and blast radius takes too long.",
        "Requirements in Azure DevOps work items drift from what is actually implemented in a branch.",
        "Generic AI code review bots comment on trivial syntax while missing repo-specific patterns and ticket acceptance criteria.",
      ],
    },
    solution: {
      summary:
        "PATCH uses MCP tools to inspect the full repository tree, git history, and linked Azure DevOps work items before producing structured PR summaries and targeted review findings.",
      highlights: [
        "Correlates code diffs with Azure DevOps user stories, acceptance criteria, and linked bug reports.",
        "Traverses call sites and module imports via MCP tools rather than looking only at isolated diff hunks.",
        "Produces concise PR briefings, risk flags, and actionable review comments directly in the team's workflow.",
      ],
    },
    capabilities: [
      {
        title: "Pull-Request Analysis",
        description:
          "Summarizes structural changes, affected modules, and potential regression areas across multi-file diffs.",
        tag: "PR REVIEW",
      },
      {
        title: "Git Repository Inspection",
        description:
          "Navigates file trees, blame history, and symbol references to understand surrounding code context.",
        tag: "GIT CONTEXT",
      },
      {
        title: "Azure DevOps Work-Item Integration",
        description:
          "Fetches linked epics, stories, and tasks to verify that code changes align with stated acceptance criteria.",
        tag: "AZURE DEVOPS",
      },
      {
        title: "AI-Generated Code Review Summaries",
        description:
          "Generates human-readable walkthroughs, sequence notes, and targeted inline review observations.",
        tag: "SUMMARIES",
      },
      {
        title: "MCP Tool Integration",
        description:
          "Exposes standardized Model Context Protocol servers for Git, Azure DevOps, and internal linters.",
        tag: "MCP",
      },
      {
        title: "Development Workflow Insights",
        description:
          "Surfaces bottlenecks, recurring review themes, and unlinked changes across active sprints.",
        tag: "INSIGHTS",
      },
    ],
    architecture: {
      summary:
        "An MCP-centered agent host that orchestrates read-only tool calls across Git and Azure DevOps REST APIs to assemble rich context before running review reasoning.",
      note: "Illustrative reference architecture — supports webhook-triggered PR events or interactive CLI/IDE invocations.",
      nodes: [
        {
          id: "events",
          layer: "input",
          layerLabel: "01 · TRIGGERS",
          title: "PR Webhook & CLI Trigger",
          subtitle: "Pull Request opened / updated",
          details:
            "Receives pull-request lifecycle events or developer on-demand review requests with branch and ticket identifiers.",
          tech: ["Node.js", "TypeScript", "Webhooks"],
        },
        {
          id: "mcp",
          layer: "integration",
          layerLabel: "02 · MCP SERVERS",
          title: "Git & Azure DevOps MCP Tools",
          subtitle: "Diffs, file tree, work items, commits",
          details:
            "Provides typed MCP tools to read repository files, inspect commit graphs, and query Azure DevOps work items and PR threads.",
          tech: ["MCP", "Git APIs", "Azure DevOps REST API"],
        },
        {
          id: "agent",
          layer: "orchestration",
          layerLabel: "03 · AGENT LOOP",
          title: "Context-Gathering Review Agent",
          subtitle: "Multi-step inspection & verification",
          details:
            "Plans which files and work items to inspect, gathers symbol definitions, and checks diff changes against ticket specs.",
          tech: ["TypeScript", "LLM APIs", "Tool Calling"],
        },
        {
          id: "analyzer",
          layer: "intelligence",
          layerLabel: "04 · SYNTHESIS",
          title: "Structured Review Formatter",
          subtitle: "Walkthrough, risks & spec check",
          details:
            "Distills findings into a clean PR summary, requirement checklist, and high-signal inline code suggestions.",
          tech: ["Structured Outputs", "LLM APIs"],
        },
        {
          id: "output",
          layer: "output",
          layerLabel: "05 · DELIVERY",
          title: "PR Thread & Team Dashboard",
          subtitle: "Comments & workflow telemetry",
          details:
            "Posts structured markdown review cards back to the pull request and logs workflow insights for the engineering team.",
          tech: ["Azure DevOps PR API", "Dashboard UI"],
        },
      ],
      connections: [
        { from: "events", to: "agent", label: "PR metadata + SHA" },
        { from: "agent", to: "mcp", label: "MCP tool calls" },
        { from: "mcp", to: "agent", label: "Diffs + Work items" },
        { from: "agent", to: "analyzer", label: "Assembled context" },
        { from: "analyzer", to: "output", label: "Review summary & comments" },
      ],
    },
    engineeringApproach: {
      summary:
        "High-signal reviews require repository context and product intent. We avoid noisy line-by-line nitpicking in favor of architectural and requirement-aware analysis.",
      pillars: [
        {
          title: "Model Context Protocol (MCP) First",
          body: "All repository and Azure DevOps capabilities are encapsulated as modular MCP tools so the agent can pull surrounding files on demand.",
        },
        {
          title: "Ticket-to-Diff Alignment",
          body: "By reading the linked Azure DevOps work item alongside the diff, PATCH highlights missing acceptance criteria before QA.",
        },
        {
          title: "Noise Suppression",
          body: "Deterministic formatters and linters handle style; the LLM focuses on logic, edge cases, security, and cross-module impact.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Receive PR Event",
        actor: "Webhook Listener",
        detail: "Captures branch refs, changed file list, and linked Azure DevOps work-item IDs.",
        artifact: "Review Job Payload",
      },
      {
        step: "02",
        title: "Fetch Repo & Ticket Context",
        actor: "MCP Tool Layer",
        detail: "Reads work-item acceptance criteria, diff hunks, and referenced source files.",
        artifact: "Contextual Workspace Snapshot",
      },
      {
        step: "03",
        title: "Analyze Impact & Specs",
        actor: "Review Agent",
        detail: "Evaluates logic changes, edge cases, and alignment with the work item.",
        artifact: "Structured Findings",
      },
      {
        step: "04",
        title: "Publish PR Briefing",
        actor: "DevOps Publisher",
        detail: "Posts a clear change walkthrough, spec checklist, and targeted review notes.",
        artifact: "PR Summary & Annotations",
      },
    ],
    techStack: ["TypeScript", "Node.js", "MCP", "Git APIs", "Azure DevOps REST APIs", "LLM APIs"],
    collectibleModel: "patch",
    collectibleDescription: "An orange mechanical robot repairing a circuit board.",
    accentColor: "vermilion",
    relatedProjects: ["relay", "signal", "vault"],
  },

  /* ------------------------------------------------------------------------ */
  /*  PROJECT 003 — VAULT                                                     */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-003",
    number: "003",
    slug: "vault",
    name: "VAULT",
    category: "Document Intelligence / Vision AI",
    headline: "From paperwork to structured intelligence.",
    shortDescription:
      "An intelligent document-processing platform that extracts and validates information from invoices, contracts, forms and business documents.",
    overview:
      "VAULT transforms incoming PDFs, scanned forms, invoices, and multi-page contracts into validated, schema-conformant JSON ready for downstream ERPs and databases. It combines OCR and vision-language models with deterministic business validation rules and a fast human-in-the-loop exception queue.",
    problem: {
      summary:
        "Operations and finance teams still spend hours keying data from inconsistent vendor invoices, signed contracts, and scanned forms into core systems.",
      painPoints: [
        "Rigid template-based OCR breaks whenever a vendor changes an invoice layout or table structure.",
        "Handwritten annotations, stamps, and multi-column tables confuse plain text extraction pipelines.",
        "Blindly trusting raw model outputs without validation rules risks pushing bad totals or mismatched line items into accounting systems.",
      ],
    },
    solution: {
      summary:
        "VAULT pairs visual page understanding with strict schema extraction, automated cross-field math/policy validation, and a focused review station for flagged exceptions.",
      highlights: [
        "Layout-agnostic extraction using vision-language models guided by strict JSON schemas.",
        "Deterministic validation engine that verifies line-item sums, tax rates, dates, and required clauses.",
        "Bounding-box visual grounding so human reviewers can verify or correct any uncertain field in seconds.",
      ],
    },
    capabilities: [
      {
        title: "OCR & Vision-Language Processing",
        description:
          "Reads scanned pages, complex tables, skew-angled photos, and multi-column layouts using multimodal models.",
        tag: "VISION AI",
      },
      {
        title: "Structured Information Extraction",
        description:
          "Maps arbitrary document layouts into strongly typed Pydantic / JSON schemas with field-level confidence scores.",
        tag: "EXTRACTION",
      },
      {
        title: "Document Classification",
        description:
          "Automatically routes mixed document packets into invoices, purchase orders, contracts, or KYC forms.",
        tag: "ROUTING",
      },
      {
        title: "Validation & Exception Detection",
        description:
          "Runs mathematical, referential, and policy checks across extracted fields to catch discrepancies automatically.",
        tag: "VALIDATION",
      },
      {
        title: "Human Review Workflows",
        description:
          "Routes low-confidence or rule-failing fields to an interactive split-screen review queue.",
        tag: "HUMAN LOOP",
      },
      {
        title: "Export to Business Applications",
        description:
          "Delivers verified structured records via webhooks, REST APIs, or batch exports to downstream systems.",
        tag: "EXPORT",
      },
    ],
    architecture: {
      summary:
        "Staged document pipeline combining multimodal vision extraction with deterministic validation gates and an exception review state machine.",
      note: "Illustrative reference architecture — configurable per document schema and downstream ERP/webhook target.",
      nodes: [
        {
          id: "intake",
          layer: "input",
          layerLabel: "01 · INTAKE",
          title: "Document Gateway",
          subtitle: "PDFs, Scans, Email Attachments",
          details:
            "Accepts multi-page packets via API upload or watched inbox, splitting pages and normalizing image resolution.",
          tech: ["FastAPI", "Python", "PDF/Image Utils"],
        },
        {
          id: "classifier",
          layer: "ingestion",
          layerLabel: "02 · TRIAGE",
          title: "Page Classifier & OCR",
          subtitle: "Document type + spatial text tokens",
          details:
            "Identifies document type per page group and extracts high-resolution page images alongside spatial OCR tokens.",
          tech: ["OCR Engine", "Vision Models"],
        },
        {
          id: "extractor",
          layer: "intelligence",
          layerLabel: "03 · EXTRACTION",
          title: "Schema-Constrained Vision LLM",
          subtitle: "Typed fields + line items",
          details:
            "Extracts headers, tables, and clauses directly into strict Pydantic schemas with per-field confidence metadata.",
          tech: ["Vision LLM APIs", "Structured Outputs", "Pydantic"],
        },
        {
          id: "validator",
          layer: "orchestration",
          layerLabel: "04 · VALIDATION",
          title: "Rule & Math Verification Gate",
          subtitle: "Totals check, PO match, policy rules",
          details:
            "Verifies that line items sum to totals, dates are valid, and mandatory fields pass business constraints.",
          tech: ["Python Rules Engine", "Exception Queue"],
        },
        {
          id: "export",
          layer: "output",
          layerLabel: "05 · REVIEW & EXPORT",
          title: "Review UI & ERP Webhook",
          subtitle: "Human sign-off & JSON delivery",
          details:
            "Auto-approves clean documents and presents flagged exceptions in a side-by-side verifier before exporting.",
          tech: ["REST Webhooks", "Review Workbench"],
        },
      ],
      connections: [
        { from: "intake", to: "classifier", label: "Normalized pages" },
        { from: "classifier", to: "extractor", label: "Typed page packet" },
        { from: "extractor", to: "validator", label: "Candidate JSON + confidence" },
        { from: "validator", to: "export", label: "Verified or flagged record" },
      ],
    },
    engineeringApproach: {
      summary:
        "AI extraction without deterministic validation is a liability in finance and operations. We pair multimodal flexibility with strict programmatic invariants.",
      pillars: [
        {
          title: "Schema-First Prompting",
          body: "Every document type is defined as a versioned data contract; models are constrained to emit valid typed structures rather than freeform prose.",
        },
        {
          title: "Deterministic Checksums",
          body: "Code — not the LLM — checks that `subtotal + tax == total` and cross-checks vendor identifiers against master records.",
        },
        {
          title: "Exception-Only Human Review",
          body: "Reviewers only touch fields that fail validation or fall below confidence thresholds, keeping human effort focused where it matters.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Upload & Split",
        actor: "Document Gateway",
        detail: "Splits multi-page packets and classifies invoices, contracts, and forms.",
        artifact: "Classified Page Set",
      },
      {
        step: "02",
        title: "Visual Extraction",
        actor: "Vision-Language Model",
        detail: "Reads tables, headers, and clauses into a strict target JSON schema.",
        artifact: "Typed Extraction Payload",
      },
      {
        step: "03",
        title: "Validate Invariants",
        actor: "Validation Engine",
        detail: "Checks arithmetic totals, required fields, and business rules.",
        artifact: "Validation Report",
      },
      {
        step: "04",
        title: "Review & Export",
        actor: "Reviewer / Webhook",
        detail: "Resolves any flagged exceptions and dispatches clean JSON to business systems.",
        artifact: "Verified Business Record",
      },
    ],
    techStack: ["Python", "FastAPI", "OCR", "Vision Models", "Structured LLM Outputs"],
    collectibleModel: "vault",
    collectibleDescription: "A sculptural futuristic scanner vault with moving doors.",
    accentColor: "cobalt",
    relatedProjects: ["signal", "relay", "orbit"],
  },

  /* ------------------------------------------------------------------------ */
  /*  PROJECT 004 — ORBIT                                                     */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-004",
    number: "004",
    slug: "orbit",
    name: "ORBIT",
    category: "Conversational AI / Customer Experience",
    headline: "Customer conversations. Intelligent resolutions.",
    shortDescription:
      "An AI customer service platform that combines conversational intelligence, knowledge retrieval and business system integrations.",
    overview:
      "ORBIT is a customer resolution engine that moves beyond static FAQ bots. It combines grounded policy retrieval with authenticated tool execution against order, account, and ticketing systems — resolving routine requests end-to-end and handing off complex cases to human agents with a complete structured brief.",
    problem: {
      summary:
        "Traditional support chatbots frustrate customers with rigid decision trees, while ungrounded LLM bots can quote policies but cannot look up an order or execute an account action.",
      painPoints: [
        "Customers repeat their issue multiple times when escalated from a bot to a human support specialist.",
        "Support agents spend most of their time tab-switching between chat windows, policy docs, and order databases.",
        "Automating actions like refunds or address changes requires strict guardrails and policy verification.",
      ],
    },
    solution: {
      summary:
        "ORBIT unifies conversational state, RAG knowledge lookup, and scoped business API tools behind policy guardrails, with seamless human escalation and auto-generated case summaries.",
      highlights: [
        "Authenticated tool calling to inspect live order status, subscription tiers, and account records.",
        "Policy-checked action execution that verifies eligibility before modifying an order or booking.",
        "Warm handoff packages that give human agents a structured summary, sentiment note, and pre-fetched customer context.",
      ],
    },
    capabilities: [
      {
        title: "Context-Aware Conversations",
        description:
          "Maintains multi-turn dialogue state, customer intent, and verified entity slots across the session.",
        tag: "DIALOGUE",
      },
      {
        title: "Knowledge-Base Retrieval",
        description:
          "Grounds policy, warranty, and troubleshooting explanations in current support documentation.",
        tag: "RAG",
      },
      {
        title: "Customer & Order Information Lookup",
        description:
          "Queries CRM and order management APIs in real time to give personalized status updates.",
        tag: "INTEGRATION",
      },
      {
        title: "Business Tool Execution",
        description:
          "Performs scoped actions such as rescheduling deliveries, updating details, or issuing eligible credits.",
        tag: "ACTIONS",
      },
      {
        title: "Human Support Escalation",
        description:
          "Detects complex, sensitive, or out-of-policy cases and routes them to the right specialist queue.",
        tag: "ESCALATION",
      },
      {
        title: "Conversation Summaries",
        description:
          "Generates structured post-chat and handoff summaries with intent tags and resolution codes.",
        tag: "SUMMARIES",
      },
    ],
    architecture: {
      summary:
        "Stateful conversation coordinator that blends RAG policy retrieval with guarded REST tool execution and CRM/helpdesk escalation.",
      note: "Illustrative reference architecture — integrates with web chat widgets, messaging channels, and helpdesk platforms.",
      nodes: [
        {
          id: "channel",
          layer: "input",
          layerLabel: "01 · CHANNELS",
          title: "Chat & Messaging Gateway",
          subtitle: "Web widget, in-app & messaging",
          details:
            "Manages real-time customer sessions, authentication tokens, and streaming message delivery.",
          tech: ["TypeScript", "WebSockets / REST", "Next.js"],
        },
        {
          id: "router",
          layer: "orchestration",
          layerLabel: "02 · COORDINATOR",
          title: "Intent & Guardrail Router",
          subtitle: "Dialogue state + policy checks",
          details:
            "Classifies customer intent, checks safety/escalation rules, and selects knowledge or tool pathways.",
          tech: ["Python", "LLM APIs", "State Machine"],
        },
        {
          id: "knowledge",
          layer: "intelligence",
          layerLabel: "03 · KNOWLEDGE",
          title: "Help-Center RAG Service",
          subtitle: "Policies, FAQs, troubleshooting",
          details:
            "Retrieves verified policy clauses and product guides tailored to the customer's plan and region.",
          tech: ["RAG", "Vector Search"],
        },
        {
          id: "tools",
          layer: "integration",
          layerLabel: "04 · BUSINESS TOOLS",
          title: "Order & CRM Action Adapters",
          subtitle: "Lookup, modify, refund, ticket",
          details:
            "Executes typed, schema-validated REST calls against order management and customer service APIs.",
          tech: ["REST APIs", "CRM Integrations"],
        },
        {
          id: "handoff",
          layer: "output",
          layerLabel: "05 · RESOLUTION",
          title: "Agent Desk & Summary Logger",
          subtitle: "Warm handoff + CRM case note",
          details:
            "Delivers instant resolutions to the customer or transfers a structured briefing to a human support rep.",
          tech: ["Helpdesk API", "Structured Summaries"],
        },
      ],
      connections: [
        { from: "channel", to: "router", label: "Authenticated turn" },
        { from: "router", to: "knowledge", label: "Policy query" },
        { from: "router", to: "tools", label: "Scoped tool call" },
        { from: "knowledge", to: "router", label: "Grounded passages" },
        { from: "tools", to: "router", label: "Order / CRM state" },
        { from: "router", to: "handoff", label: "Reply or escalation brief" },
      ],
    },
    engineeringApproach: {
      summary:
        "Customer-facing agents must know what they can do, what policy allows, and when to bring in a human.",
      pillars: [
        {
          title: "Scoped Tool Permissions",
          body: "Read tools (order lookup) and write tools (modifications) are separated by explicit precondition checks tied to the authenticated session.",
        },
        {
          title: "Zero-Repeat Escalation",
          body: "When a human steps in, they receive a structured digest of verified customer facts, attempted steps, and open questions.",
        },
        {
          title: "Consistent Brand & Policy Voice",
          body: "Responses are grounded in retrieved support articles so policy answers remain accurate as product rules evolve.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Understand Intent",
        actor: "Dialogue Coordinator",
        detail: "Identifies the customer's goal and verifies session authentication.",
        artifact: "Typed Intent & Slots",
      },
      {
        step: "02",
        title: "Fetch Context & Policy",
        actor: "RAG + CRM Tools",
        detail: "Looks up the customer's live order record alongside applicable policy rules.",
        artifact: "Customer & Policy Context",
      },
      {
        step: "03",
        title: "Execute or Escalate",
        actor: "Action / Handoff Engine",
        detail: "Completes eligible self-service actions or packages a warm handoff for a specialist.",
        artifact: "Action Receipt / Handoff Brief",
      },
      {
        step: "04",
        title: "Summarize Case",
        actor: "Summary Service",
        detail: "Writes a structured resolution summary and tags back to the CRM.",
        artifact: "CRM Case Record",
      },
    ],
    techStack: ["TypeScript", "Python", "LLM APIs", "RAG", "REST APIs", "Customer-Service Integrations"],
    collectibleModel: "orbit",
    collectibleDescription: "A characterful cobalt-and-orange telephone robot with an animated face.",
    accentColor: "vermilion",
    relatedProjects: ["echo", "signal", "relay"],
  },

  /* ------------------------------------------------------------------------ */
  /*  PROJECT 005 — RELAY                                                     */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-005",
    number: "005",
    slug: "relay",
    name: "RELAY",
    category: "Agentic Automation / AI Orchestration",
    headline: "Workflows that think before they act.",
    shortDescription:
      "An AI workflow orchestration system that coordinates external APIs, AI agents and business approval processes.",
    overview:
      "RELAY is a stateful agentic orchestration platform built for multi-step business operations that require reasoning, external tool execution, and human-in-the-loop sign-off. Using graph-based state machines, RELAY checkpoints every step, recovers gracefully from API failures, and pauses cleanly when human approval is required.",
    problem: {
      summary:
        "Fragile zap-style linear automations break when inputs are unstructured, while unconstrained autonomous agents are too unpredictable for high-stakes business workflows.",
      painPoints: [
        "Traditional rules engines cannot interpret unstructured emails, attachments, or ambiguous requests.",
        "Single-shot agent loops lose state on API timeouts and lack clear audit trails of why a decision was made.",
        "High-impact actions (provisioning, payouts, external notifications) require human approval checkpoints before execution.",
      ],
    },
    solution: {
      summary:
        "RELAY models workflows as explicit LangGraph state machines where LLM reasoning nodes operate inside bounded transitions, backed by persistent checkpointing, MCP tools, and approval gates.",
      highlights: [
        "Graph-defined control flow combining deterministic steps with specialized AI reasoning nodes.",
        "Persistent state checkpoints allowing workflows to pause for hours or days awaiting human approval and resume cleanly.",
        "Full execution telemetry with step-by-step inputs, tool payloads, retries, and audit logs.",
      ],
    },
    capabilities: [
      {
        title: "Multi-Step Agent Workflows",
        description:
          "Coordinates specialized planner, researcher, and executor nodes across complex multi-stage processes.",
        tag: "ORCHESTRATION",
      },
      {
        title: "Dynamic Tool Calling",
        description:
          "Selects and invokes external APIs and internal services with strict input/output schema validation.",
        tag: "TOOL USE",
      },
      {
        title: "MCP Integrations",
        description:
          "Connects to standardized Model Context Protocol tool servers across internal and third-party systems.",
        tag: "MCP",
      },
      {
        title: "Stateful Execution",
        description:
          "Persists graph state at every node transition so long-running workflows survive restarts and pauses.",
        tag: "STATEFUL",
      },
      {
        title: "Human-in-the-Loop Approvals",
        description:
          "Suspends execution before sensitive side effects, presenting a clear diff/action card for human sign-off.",
        tag: "APPROVALS",
      },
      {
        title: "Retry, Failure Recovery & Execution Logs",
        description:
          "Handles transient API errors with exponential backoff, dead-letter inspection, and replayable step logs.",
        tag: "RELIABILITY",
      },
    ],
    architecture: {
      summary:
        "Graph-based workflow runtime with persistent state checkpointing, MCP tool adapters, and an interactive human approval & trace console.",
      note: "Illustrative reference architecture — designed around LangGraph state machines and FastAPI workers.",
      nodes: [
        {
          id: "trigger",
          layer: "input",
          layerLabel: "01 · INGRESS",
          title: "Event & Schedule Triggers",
          subtitle: "Webhooks, queues & manual runs",
          details:
            "Initiates typed workflow runs from business events, inbound webhooks, or scheduled triggers.",
          tech: ["FastAPI", "Python", "Task Queue"],
        },
        {
          id: "graph",
          layer: "orchestration",
          layerLabel: "02 · STATE GRAPH",
          title: "LangGraph Runtime & Checkpointer",
          subtitle: "Nodes, edges & persistent state",
          details:
            "Executes graph transitions, persisting state snapshots to the database after every node completion.",
          tech: ["LangGraph", "Python", "PostgreSQL"],
        },
        {
          id: "approval",
          layer: "intelligence",
          layerLabel: "03 · HUMAN GATE",
          title: "Interrupt & Approval Station",
          subtitle: "Pause, inspect, approve or edit",
          details:
            "Pauses the graph prior to high-impact actions and resumes execution once an authorized operator approves.",
          tech: ["Interrupt Hooks", "Approval UI"],
        },
        {
          id: "tools",
          layer: "integration",
          layerLabel: "04 · TOOL BUS",
          title: "MCP & External API Connectors",
          subtitle: "Idempotent external actions",
          details:
            "Executes external API calls and MCP tools with idempotency keys, rate-limit handling, and structured retries.",
          tech: ["MCP", "External APIs", "Retry Policies"],
        },
        {
          id: "audit",
          layer: "output",
          layerLabel: "05 · OBSERVABILITY",
          title: "Execution Trace & Audit Log",
          subtitle: "Step timeline & state replay",
          details:
            "Records every prompt, tool call, latency metric, and approval decision for compliance and debugging.",
          tech: ["Execution Logs", "Trace Inspector"],
        },
      ],
      connections: [
        { from: "trigger", to: "graph", label: "Start workflow run" },
        { from: "graph", to: "tools", label: "Validated tool call" },
        { from: "tools", to: "graph", label: "Tool result / retry" },
        { from: "graph", to: "approval", label: "Suspend on sensitive step" },
        { from: "approval", to: "graph", label: "Approved / modified state" },
        { from: "graph", to: "audit", label: "Step checkpoint & trace" },
      ],
    },
    engineeringApproach: {
      summary:
        "We bound agency inside explicit state machines: the LLM decides within a step, while the graph governs what transitions are legal.",
      pillars: [
        {
          title: "Graph-Constrained Agency",
          body: "Instead of an open-ended loop, workflows are directed graphs with explicit guard conditions and terminal states.",
        },
        {
          title: "First-Class Interrupts",
          body: "Human approval is built into the state machine checkpoint layer, not bolted on as a fragile webhook callback.",
        },
        {
          title: "Idempotent Side Effects",
          body: "External mutations carry deterministic idempotency tokens so node retries never duplicate downstream records.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Ingest Event & Plan",
        actor: "Planner Node",
        detail: "Parses the incoming business event and initializes the typed workflow state.",
        artifact: "Checkpointed Graph State",
      },
      {
        step: "02",
        title: "Gather Context via Tools",
        actor: "Research Node + MCP",
        detail: "Queries connected databases and external APIs to enrich the decision context.",
        artifact: "Enriched Context State",
      },
      {
        step: "03",
        title: "Human Approval Gate",
        actor: "Operator / Approval UI",
        detail: "Pauses execution for sensitive actions until an operator approves or adjusts parameters.",
        artifact: "Signed Approval Token",
      },
      {
        step: "04",
        title: "Execute & Log",
        actor: "Executor Node",
        detail: "Commits the approved action across external APIs and writes the immutable execution trace.",
        artifact: "Completed Audit Trace",
      },
    ],
    techStack: ["Python", "LangGraph", "FastAPI", "MCP", "Databases", "External APIs"],
    collectibleModel: "relay",
    collectibleDescription: "An orange mechanical switchboard with animated levers and connected cables.",
    accentColor: "vermilion",
    relatedProjects: ["patch", "vault", "orbit"],
  },

  /* ------------------------------------------------------------------------ */
  /*  PROJECT 006 — ECHO                                                      */
  /* ------------------------------------------------------------------------ */
  {
    id: "TAC-006",
    number: "006",
    slug: "echo",
    name: "ECHO",
    category: "Voice AI / Conversational Systems",
    headline: "Conversations that turn into action.",
    shortDescription:
      "A voice-enabled AI assistant for customer requests, appointment scheduling and other service workflows.",
    overview:
      "ECHO is a low-latency voice AI system engineered for natural spoken interactions over phone and web audio streams. It combines streaming speech-to-text, fast conversational reasoning, live calendar/service tool execution, and expressive text-to-speech — followed by structured call transcripts and action summaries.",
    problem: {
      summary:
        "Phone trees ('Press 1 for...') cause high caller drop-off, while naive voice wrappers around chat LLMs suffer from awkward multi-second silences and interruption collisions.",
      painPoints: [
        "High round-trip latency breaks conversational cadence and makes callers talk over the assistant.",
        "Spoken numbers, dates, names, and addresses require confirmation before booking or modifying appointments.",
        "Service teams need structured post-call records and booked calendar entries, not raw audio recordings.",
      ],
    },
    solution: {
      summary:
        "ECHO streams audio over bidirectional WebSockets with voice-activity detection (VAD), barge-in handling, incremental LLM-to-TTS streaming, and real-time scheduling tool calls.",
      highlights: [
        "Full-duplex WebSocket audio pipeline supporting natural caller interruptions (barge-in).",
        "Sentence-chunked streaming from LLM tokens directly into low-latency TTS synthesis.",
        "Automatic post-call transcript, extracted action items, and booked appointment confirmation.",
      ],
    },
    capabilities: [
      {
        title: "Speech-to-Text",
        description:
          "Streams live caller audio through low-latency transcription with endpointing and voice-activity detection.",
        tag: "STT",
      },
      {
        title: "Natural Language Understanding",
        description:
          "Extracts caller intent, preferred times, service types, and spoken entities across natural dialogue turns.",
        tag: "NLU",
      },
      {
        title: "Real-Time Conversational Responses",
        description:
          "Generates concise, speech-friendly responses tuned for natural pacing and immediate barge-in cancellation.",
        tag: "REAL-TIME",
      },
      {
        title: "Tool-Based Task Execution",
        description:
          "Checks calendar availability, books appointments, and updates service records mid-conversation.",
        tag: "SCHEDULING",
      },
      {
        title: "Text-to-Speech",
        description:
          "Synthesizes natural spoken audio chunks in streaming fashion as soon as the first phrase is ready.",
        tag: "TTS",
      },
      {
        title: "Call Transcripts & Summaries",
        description:
          "Produces clean speaker-diarized transcripts, structured booking receipts, and follow-up summaries.",
        tag: "TRANSCRIPTS",
      },
    ],
    architecture: {
      summary:
        "Full-duplex streaming voice pipeline over WebSockets coordinating VAD, streaming STT, tool-enabled LLM turns, and chunked TTS synthesis.",
      note: "Illustrative reference architecture — compatible with WebRTC/WebSocket browser audio and telephony SIP/media streams.",
      nodes: [
        {
          id: "stream",
          layer: "input",
          layerLabel: "01 · AUDIO STREAM",
          title: "WebSocket Audio Gateway & VAD",
          subtitle: "Bidirectional PCM / Opus stream",
          details:
            "Manages full-duplex audio transport, voice-activity detection, and instant playback cancellation on caller barge-in.",
          tech: ["Python", "WebSockets", "VAD"],
        },
        {
          id: "stt",
          layer: "ingestion",
          layerLabel: "02 · TRANSCRIPTION",
          title: "Streaming Speech-to-Text",
          subtitle: "Partial & final utterance events",
          details:
            "Converts incoming audio frames into low-latency partial transcripts and endpointed utterance turns.",
          tech: ["Speech APIs", "Streaming ASR"],
        },
        {
          id: "voiceAgent",
          layer: "intelligence",
          layerLabel: "03 · CONVERSATION",
          title: "Spoken Dialogue & Slot Agent",
          subtitle: "Voice-tuned LLM + confirmation logic",
          details:
            "Maintains turn state, confirms critical spoken details (dates, times, names), and triggers service tools.",
          tech: ["LLM APIs", "Prompt Engineering"],
        },
        {
          id: "booking",
          layer: "integration",
          layerLabel: "04 · SERVICE TOOLS",
          title: "Calendar & Workflow Adapters",
          subtitle: "Availability lookup & booking",
          details:
            "Queries real-time slot availability, books appointments, and dispatches confirmation notifications.",
          tech: ["Calendar APIs", "REST Webhooks"],
        },
        {
          id: "tts",
          layer: "output",
          layerLabel: "05 · VOICE & LOGS",
          title: "Streaming TTS & Call Summarizer",
          subtitle: "Audio synthesis + post-call record",
          details:
            "Streams synthesized voice audio back to the caller and writes a structured call summary on hangup.",
          tech: ["Text-to-Speech", "Call Summary Pipeline"],
        },
      ],
      connections: [
        { from: "stream", to: "stt", label: "Inbound audio frames" },
        { from: "stt", to: "voiceAgent", label: "Endpointed utterance" },
        { from: "voiceAgent", to: "booking", label: "Check / book slot" },
        { from: "booking", to: "voiceAgent", label: "Confirmed slot state" },
        { from: "voiceAgent", to: "tts", label: "Phrase-streamed tokens" },
        { from: "tts", to: "stream", label: "Outbound audio + summary" },
      ],
    },
    engineeringApproach: {
      summary:
        "Voice interfaces live or die by latency, turn-taking, and explicit read-backs of critical details.",
      pillars: [
        {
          title: "Streaming Phrase Pipeline",
          body: "Instead of waiting for a full paragraph to finish generating, tokens are segmented at clause boundaries and piped immediately to TTS.",
        },
        {
          title: "Interruptible Turn State",
          body: "When VAD detects the caller speaking mid-response, outbound audio buffers flush immediately and the transcript state reconciles what was actually heard.",
        },
        {
          title: "Spoken Read-Back Verification",
          body: "Before committing a booking or schedule change, the agent explicitly reads back the date, time, and service for verbal confirmation.",
        },
      ],
    },
    workflow: [
      {
        step: "01",
        title: "Capture Utterance",
        actor: "WebSocket + Streaming STT",
        detail: "Streams live caller speech and detects natural turn boundaries.",
        artifact: "Live Utterance Transcript",
      },
      {
        step: "02",
        title: "Reason & Check Slots",
        actor: "Voice Agent + Booking Tool",
        detail: "Interprets the request, queries live calendar slots, and confirms options.",
        artifact: "Candidate Booking Slot",
      },
      {
        step: "03",
        title: "Stream Spoken Reply",
        actor: "Streaming TTS Engine",
        detail: "Synthesizes low-latency voice audio with instant barge-in support.",
        artifact: "Bidirectional Audio Turn",
      },
      {
        step: "04",
        title: "Commit & Summarize",
        actor: "Post-Call Processor",
        detail: "Finalizes the appointment and logs a structured call transcript and summary.",
        artifact: "Booked Event & Call Record",
      },
    ],
    techStack: ["Python", "WebSockets", "Speech APIs", "LLM APIs", "Text-to-Speech Services"],
    collectibleModel: "echo",
    collectibleDescription: "A chartreuse-and-cobalt microphone robot with animated sound-wave elements.",
    accentColor: "chartreuse",
    relatedProjects: ["orbit", "relay", "signal"],
  },
];

export const PROJECT_MAP: Record<ProjectSlug, Project> = Object.fromEntries(
  PROJECTS.map((p) => [p.slug, p]),
) as Record<ProjectSlug, Project>;

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECT_MAP[slug as ProjectSlug];
}
