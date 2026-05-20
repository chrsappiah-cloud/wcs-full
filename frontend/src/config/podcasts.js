/**
 * RSS.com podcast shows — World Class Scholars
 * @see https://rss.com
 */

export const rssPodcasts = [
  {
    slug: "heartbeats-beyond-memory",
    label: "Heartbeats Beyond Memory — Creative Care in Dementia",
    shortTitle: "Heartbeats Beyond Memory",
    description:
      "Creative care in dementia — humane practice, storytelling, and community-centred approaches for families and professionals.",
    rssUrl:
      "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
    category: "Dementia & aged care",
    keywords: ["dementia care", "creative care", "aged care", "Australia"],
  },
  {
    slug: "freemasonry-21st-century",
    label: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
    shortTitle: "Freemasonry in the 21st Century",
    description:
      "History, symbolism, and contemporary readings of Freemasonry for scholars and curious listeners.",
    rssUrl:
      "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
    category: "History & culture",
    keywords: ["Freemasonry", "symbols", "history", "philosophy"],
  },
  {
    slug: "art-culture-tattoos",
    label: "Art, Culture and Philosophies of Tattoos",
    shortTitle: "Art, Culture & Tattoos",
    description:
      "Tattoo culture, identity, art history, and lived experience across communities worldwide.",
    rssUrl: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
    category: "Art & culture",
    keywords: ["tattoos", "body art", "culture", "philosophy"],
  },
];

export function findPodcast(slug) {
  return rssPodcasts.find((p) => p.slug === slug) ?? null;
}

/** Legacy shape for HomeView / marketing footer lists */
export const podcasts = rssPodcasts.map((p) => ({
  slug: p.slug,
  label: p.label,
  url: p.rssUrl,
}));
