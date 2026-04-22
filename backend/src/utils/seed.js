import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NS = process.env.MONGODB_NS || "wcs";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Copy .env.example to .env and configure.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);

// ── platform ────────────────────────────────────────────────────────────────

const platform = {
  slug: "world-class-scholars",
  name: "World Class Scholars",
  tagline: "Scholarship without borders.",
  mission:
    "Humane care, transformative learning, and culturally rich public scholarship.",
  nav: [
    { label: "Home", to: "/" },
    { label: "Library", to: "/library" },
    { label: "About", to: "/about" },
    { label: "Courses", to: "/courses" },
    { label: "Future Lab", to: "/future-lab" },
    { label: "Art Verse", to: "/art-verse" },
  ],
};

// ── pages ────────────────────────────────────────────────────────────────────

const aboutPage = {
  slug: "about",
  title: "About World Class Scholars",
  summary:
    "World Class Scholars is a social justice driven consultancy and educational platform committed to culturally responsive scholarship, community wellbeing, and public knowledge.",
  pillars: [
    {
      title: "Consultancy",
      description:
        "Policy, service design, advocacy, and systems-level change that centres lived experience.",
    },
    {
      title: "Education",
      description:
        "Courses, workshops, and credential pathways designed for rigour and accessibility.",
    },
    {
      title: "Creative culture",
      description:
        "Art, media, healing arts, and public scholarship that honours cultural diversity.",
    },
  ],
  founder: {
    name: "Dr Christopher Appiah-Thompson",
    location: "Australia",
    email: "christopher.appiahthompson@myworldclass.org",
    avatar: "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=400",
    bio: "I'm Dr Christopher Appiah-Thompson, founder of World Class Scholars — a global consultancy championing equity, dignity, and social justice in disability, mental health, and dementia care. My work bridges research, frontline practice, lived experience, and creative storytelling to help organisations design humane services, trauma-aware communication, and inclusive policies.",
    social: [
      {
        label: "LinkedIn",
        handle: "christopher-appiah-thompson",
        url: "https://www.linkedin.com/in/christopher-appiah-thompson-a2014045",
      },
      {
        label: "TikTok",
        handle: "@chrsappiah",
        url: "https://tiktok.com/@chrsappiah",
      },
      {
        label: "YouTube",
        handle: "World Class Scholars",
        url: "https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q",
      },
    ],
    works: [
      {
        label: "myworldclass.net",
        url: "https://myworldclass.net",
        category: "Website",
      },
      {
        label: "WCS Art Verse",
        url: "https://wcs-art-verse.com",
        category: "Gallery",
      },
      {
        label: "WCS Future Lab",
        url: "https://www.wcsflab.com/",
        category: "Lab",
      },
      {
        label: "NightCafe AI Art (CKRIZ)",
        url: "https://creator.nightcafe.studio/u/CKRIZ",
        category: "Digital Art",
      },
      {
        label: "African History and Its Discontents",
        url: "https://africanhistoryanditsdiscontentsafricanhistoryanditsdiscontents.codeadx.me",
        category: "Blog",
      },
      {
        label: "Digital Download (Gumroad)",
        url: "https://chrspiah.gumroad.com/l/qylmdn",
        category: "Product",
      },
      {
        label: "Support via PayPal",
        url: "https://paypal.me/christopherappiahthompson",
        category: "Support",
      },
    ],
    podcasts: [
      {
        label: "Heartbeats Beyond Memory — Creative Care in Dementia",
        url: "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
      },
      {
        label: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
        url: "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
      },
      {
        label: "Art, Culture and Philosophies of Tattoos",
        url: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
      },
    ],
  },
};

// ── courses ───────────────────────────────────────────────────────────────────

const courses = [
  {
    slug: "trauma-informed-practice",
    title: "Trauma-Informed Practice",
    summary:
      "Foundational frameworks for embedding trauma awareness into service design, communication, and policy.",
    level: "Foundation",
    order: 1,
  },
  {
    slug: "research-methods-intensive",
    title: "Research Methods Intensive",
    summary:
      "A practical sequence for designing studies, sourcing literature, and communicating findings accessibly.",
    level: "Intermediate",
    order: 2,
  },
  {
    slug: "digital-scholarship-studio",
    title: "Digital Scholarship Studio",
    summary:
      "Publishing workflows, metadata standards, and responsible reuse of open corpora.",
    level: "Advanced",
    order: 3,
  },
];

// ── labs ──────────────────────────────────────────────────────────────────────

const labs = [
  {
    slug: "signal-atlas",
    title: "Signal Atlas",
    summary:
      "Prototype initiative for mapping signals in noisy community datasets with human-in-the-loop review.",
    stage: "Prototype",
    order: 1,
  },
  {
    slug: "scholar-graph",
    title: "Scholar Graph",
    summary:
      "Experimental knowledge graph for cross-referencing internal resources, external catalogues, and contributor profiles.",
    stage: "Exploration",
    order: 2,
  },
  {
    slug: "care-metrics",
    title: "Care Metrics Lab",
    summary:
      "Research initiative developing humane measurement frameworks for community care and social impact.",
    stage: "Research",
    order: 3,
  },
];

// ── artCollections ─────────────────────────────────────────────────────────────

const artCollections = [
  {
    slug: "lumina-series",
    title: "Lumina Series",
    summary:
      "Digital studies in light, archival typography, and memory — exploring presence and absence in public histories.",
    type: "Digital gallery",
    order: 1,
  },
  {
    slug: "verse-prints",
    title: "Verse Prints",
    summary:
      "Creative scholarship pairing community poetry fragments with generative visual compositions.",
    type: "Mixed media",
    order: 2,
  },
  {
    slug: "healing-arts-commons",
    title: "Healing Arts Commons",
    summary:
      "A curated space for art practices rooted in cultural healing, somatic inquiry, and collective care.",
    type: "Curatorial",
    order: 3,
  },
];

// ── resources ─────────────────────────────────────────────────────────────────

const resources = [
  {
    slug: "trauma-aware-communication-toolkit",
    title: "Trauma-Aware Communication Toolkit",
    summary:
      "A practical guide to safer, more respectful interaction design and service delivery for practitioners working with affected communities.",
    body: "This toolkit covers language frameworks, de-escalation principles, and practical checklists for written communications, meeting facilitation, and digital service touchpoints. It draws on trauma-informed care literature and community practitioner feedback.",
    category: "Toolkit",
    featured: true,
    order: 1,
  },
  {
    slug: "open-access-primer",
    title: "Open Access Primer",
    summary:
      "Definitions, licensing basics, and where to find reputable open-access repositories for researchers and practitioners.",
    body: "Open access accelerates discovery and reduces knowledge inequality. This primer highlights Crossref, institutional repositories, the Directory of Open Access Journals, and evaluation heuristics for assessing repository quality and licence compatibility.",
    category: "Primer",
    featured: true,
    order: 2,
  },
  {
    slug: "reading-list-template",
    title: "Reading List Template",
    summary:
      "A reusable structure for course reading lists with provenance notes, open-access mirrors, and discussion prompts.",
    body: "Use this template to track editions, open-access mirrors, digital rights status, and discussion prompts for each reading. Includes guidance for annotating positionality and situating texts within broader scholarly conversations.",
    category: "Template",
    featured: true,
    order: 3,
  },
  {
    slug: "citation-hygiene-checklist",
    title: "Citation Hygiene Checklist",
    summary:
      "A lightweight checklist for researchers and writers before publishing essays, policy memos, or public reports.",
    body: "Verify DOIs, archive unstable URLs with Wayback Machine or Perma.cc, disclose AI assistance where required by publisher guidelines, reconcile author name variants across sources, and confirm licence compatibility for any reproduced figures.",
    category: "Checklist",
    featured: false,
    order: 4,
  },
  {
    slug: "community-needs-assessment-guide",
    title: "Community Needs Assessment Guide",
    summary:
      "Step-by-step guidance for designing and conducting participatory needs assessments in community settings.",
    body: "This guide covers scoping, stakeholder mapping, qualitative and quantitative data collection methods, ethical review considerations, and participatory analysis approaches that keep community members central to interpretation and reporting.",
    category: "Guide",
    featured: false,
    order: 5,
  },
];

// ── seed runner ───────────────────────────────────────────────────────────────

async function run() {
  await client.connect();
  const db = client.db(MONGODB_NS);

  await db.collection("platform").deleteMany({});
  await db.collection("pages").deleteMany({});
  await db.collection("courses").deleteMany({});
  await db.collection("labs").deleteMany({});
  await db.collection("artCollections").deleteMany({});
  await db.collection("resources").deleteMany({});
  await db.collection("resources").dropIndexes();
  await db.collection("users").deleteMany({ role: "admin" });
  await db.collection("enrollments").deleteMany({});
  await db.collection("analytics").deleteMany({});

  await db.collection("platform").insertOne(platform);
  await db.collection("pages").insertOne(aboutPage);
  await db.collection("courses").insertMany(courses);
  await db.collection("labs").insertMany(labs);
  await db.collection("artCollections").insertMany(artCollections);
  await db.collection("resources").insertMany(resources);

  await db.collection("resources").createIndex(
    { title: "text", summary: "text", body: "text" },
    { name: "resources_text" }
  );

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  await db.collection("users").insertOne({
    name: "Dr Christopher Appiah-Thompson",
    email: "admin@myworldclass.org",
    passwordHash,
    role: "admin",
    createdAt: new Date(),
  });

  // Seed analytics events for dashboard
  const analyticsEvents = [
    { event: "page_view", path: "/", meta: {}, ts: new Date(Date.now() - 86400000 * 6) },
    { event: "page_view", path: "/library", meta: {}, ts: new Date(Date.now() - 86400000 * 5) },
    { event: "search", path: "/library", meta: { q: "trauma care" }, ts: new Date(Date.now() - 86400000 * 5) },
    { event: "page_view", path: "/courses", meta: {}, ts: new Date(Date.now() - 86400000 * 4) },
    { event: "page_view", path: "/about", meta: {}, ts: new Date(Date.now() - 86400000 * 3) },
    { event: "search", path: "/library", meta: { q: "open access" }, ts: new Date(Date.now() - 86400000 * 3) },
    { event: "page_view", path: "/future-lab", meta: {}, ts: new Date(Date.now() - 86400000 * 2) },
    { event: "search", path: "/library", meta: { q: "dementia" }, ts: new Date(Date.now() - 86400000 * 2) },
    { event: "page_view", path: "/art-verse", meta: {}, ts: new Date(Date.now() - 86400000) },
    { event: "page_view", path: "/library", meta: {}, ts: new Date() },
    { event: "search", path: "/library", meta: { q: "trauma care" }, ts: new Date() },
    { event: "page_view", path: "/", meta: {}, ts: new Date() },
  ];
  await db.collection("analytics").insertMany(analyticsEvents);

  console.log(`Seeded "${MONGODB_NS}": ${resources.length} resources, ${courses.length} courses, ${labs.length} labs, ${artCollections.length} art collections, 1 admin user, text index.`);
  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
