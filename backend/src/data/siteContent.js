/** Built-in public content when MongoDB is unavailable (e.g. Vercel before Atlas is configured). */
export const platform = {
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
    { label: "Podcasts", to: "/podcasts" },
    { label: "Digital Marketing", to: "/digital-marketing" },
    { label: "Digital Advertising", to: "/digital-advertising" },
    { label: "Apps & Store", to: "/marketing" },
    { label: "Contact", to: "/contact" },
  ],
};

// ── pages ────────────────────────────────────────────────────────────────────

export const aboutPage = {
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
    personalEmail: "chrsappiah@gmail.com",
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
      {
        label: "Facebook",
        handle: "Verified profile",
        url: "https://christopherappiahthompson.link/facebook",
      },
      {
        label: "Link in bio",
        handle: "christopherappiahthompson.link",
        url: "https://christopherappiahthompson.link",
      },
    ],
    works: [
      {
        label: "myworldclass.net",
        url: "https://www.myworldclass.net/",
        category: "Website",
      },
      {
        label: "CodeAdx — Digital Marketing",
        url: "https://worldclassscholars.vercel.app/digital-marketing",
        category: "Marketing",
      },
      {
        label: "CodeAdx — Podcaster Stats",
        url: "https://app.codeadx.com/podcaster/stats",
        category: "Advertising",
      },
      {
        label: "NightCafe — CKRIZ (nightlife digital art)",
        url: "https://creator.nightcafe.studio/u/CKRIZ",
        category: "Nightlife digital art",
      },
      {
        label: "African History and Its Discontents",
        url: "https://africanhistoryanditsdiscontentsafricanhistoryanditsdiscontents.codeadx.me",
        category: "Blog",
      },
      {
        label: "Gumroad — healing arts & digital products",
        url: "https://chrspiah.gumroad.com/",
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
        slug: "heartbeats-beyond-memory",
        label: "Heartbeats Beyond Memory — Creative Care in Dementia",
        url: "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
        referralPath: "/podcasts/heartbeats-beyond-memory",
      },
      {
        slug: "freemasonry-21st-century",
        label: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
        url: "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
        referralPath: "/podcasts/freemasonry-21st-century",
      },
      {
        slug: "art-culture-tattoos",
        label: "Art, Culture and Philosophies of Tattoos",
        url: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
        referralPath: "/podcasts/art-culture-tattoos",
      },
    ],
  },
};

// ── courses ───────────────────────────────────────────────────────────────────

export const courses = [
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

// ── labs (legacy collection — digital marketing modules) ─────────────────────

export const labs = [
  {
    slug: "affiliate-storefronts",
    title: "Affiliate storefront campaigns",
    summary: "Promo codes and commission tracking across partner stores via CodeAdx.",
    stage: "Live",
    order: 1,
  },
  {
    slug: "social-referral-sync",
    title: "Social referral sync",
    summary: "WCS marketing links paired with CodeAdx affiliate reporting.",
    stage: "Live",
    order: 2,
  },
  {
    slug: "sales-snapshots",
    title: "Sales performance snapshots",
    summary: "Store net sales, codes used, and earnings rollups for campaign review.",
    stage: "Reporting",
    order: 3,
  },
];

// ── artCollections (legacy collection — digital advertising modules) ───────────

export const artCollections = [
  {
    slug: "podcaster-stats",
    title: "Podcaster stats hub",
    summary: "Live analytics at app.codeadx.com/podcaster/stats for WCS shows.",
    type: "Dashboard",
    order: 1,
  },
  {
    slug: "rss-ad-inventory",
    title: "RSS & ad inventory",
    summary: "Monetise podcast feeds with measurable host-read and programmatic placements.",
    type: "Podcast",
    order: 2,
  },
  {
    slug: "brand-partnerships",
    title: "Brand partnership packages",
    summary: "Combined display, audio, and affiliate offers for aligned sponsors.",
    type: "Campaign",
    order: 3,
  },
];

// ── resources ─────────────────────────────────────────────────────────────────

export const resources = [
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

export function listFeaturedResources() {
  return resources.filter((r) => r.featured).sort((a, b) => a.order - b.order);
}

export function findResourceBySlug(slug) {
  return resources.find((r) => r.slug === slug) ?? null;
}

export function searchResourcesLocal(q, limit = 20) {
  const query = String(q ?? "").trim().toLowerCase();
  if (!query) return [];
  return resources
    .filter(
      (r) =>
        r.title.toLowerCase().includes(query) ||
        r.summary.toLowerCase().includes(query) ||
        (r.body && r.body.toLowerCase().includes(query))
    )
    .slice(0, limit);
}
