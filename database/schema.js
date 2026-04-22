/**
 * Logical MongoDB schema for World Class Scholars (wcs-full).
 * Collections are created and populated by backend/src/utils/seed.js.
 */

export const collections = {
  platform: {
    description: "Site-wide identity and mission metadata.",
    fields: ["slug", "name", "tagline", "mission", "nav"],
    example: {
      slug: "world-class-scholars",
      name: "World Class Scholars",
      tagline: "Scholarship without borders.",
      mission:
        "Humane care, transformative learning, and culturally rich public scholarship.",
      nav: [{ label: "string", to: "string" }],
    },
  },
  pages: {
    description: "Top-level editorial page content such as About.",
    fields: ["slug", "title", "summary", "pillars"],
    example: {
      slug: "about",
      title: "About World Class Scholars",
      summary:
        "World Class Scholars is a social justice driven consultancy and educational platform.",
      pillars: [
        {
          title: "Consultancy",
          description:
            "Policy, service design, advocacy, and systems-level change.",
        },
        {
          title: "Education",
          description: "Courses, workshops, and credential pathways.",
        },
        {
          title: "Creative culture",
          description: "Art, media, healing arts, and public scholarship.",
        },
      ],
    },
  },
  courses: {
    description: "Structured learning catalogue items.",
    fields: ["slug", "title", "summary", "level", "order"],
    example: {
      slug: "string",
      title: "string",
      summary: "string",
      level: "string",
      order: 0,
    },
  },
  labs: {
    description: "Prototype and R&D initiative entries.",
    fields: ["slug", "title", "summary", "stage", "order"],
    example: {
      slug: "string",
      title: "string",
      summary: "string",
      stage: "string",
      order: 0,
    },
  },
  artCollections: {
    description: "Creative scholarship and gallery groups.",
    fields: ["slug", "title", "summary", "type", "order"],
    example: {
      slug: "string",
      title: "string",
      summary: "string",
      type: "string",
      order: 0,
    },
  },
  resources: {
    description: "Searchable internal knowledge objects and resource pages.",
    fields: [
      "slug",
      "title",
      "summary",
      "body",
      "category",
      "featured",
      "order",
    ],
    indexes: [
      {
        name: "resources_text",
        keys: { title: "text", summary: "text", body: "text" },
      },
    ],
    example: {
      slug: "trauma-aware-communication-toolkit",
      title: "Trauma-Aware Communication Toolkit",
      summary:
        "A practical guide to safer, more respectful interaction design and service delivery.",
      body: "Detailed implementation body goes here.",
      category: "Toolkit",
      featured: true,
      order: 1,
    },
  },
};
