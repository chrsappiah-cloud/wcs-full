/**
 * Promotional items & preview images from https://christopherappiahthompson.link
 * (Gravatar profile cards and gallery — not affiliate sales tables).
 */

export const FOUNDER_PROFILE_URL = "https://christopherappiahthompson.link";

const gravatarPreview = (hash, size = 512) =>
  `https://2.gravatar.com/userimage/182602884/${hash}?size=${size}`;

const mshot = (url) =>
  `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=640`;

export const founderLinkPromotions = [
  {
    id: "truth-and-light",
    title: "Introducing Truth and Light: Championing Social Justice and Mental Health",
    category: "Podcast",
    url: "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
    imageUrl: gravatarPreview("7f3122af549e1c555f99c4a0a2f0ac06"),
  },
  {
    id: "african-history",
    title: "African history and its discontents",
    category: "Podcast & research",
    url: "https://africanhistoryanditsdiscontentsafricanhistoryanditsdiscontents.codeadx.me",
    imageUrl: gravatarPreview("79278b5d255995bba31beafae52ec5e0"),
  },
  {
    id: "freemasonry",
    title: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
    category: "Podcast",
    url: "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
    imageUrl: gravatarPreview("aeccddbc02af973070c15a8a4cacaf65"),
  },
  {
    id: "tattoos",
    title: "Art, Culture and Philosophies of Tattoos",
    category: "Podcast",
    url: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
    imageUrl: gravatarPreview("28317531cdea4b0caecce07354068b30"),
  },
  {
    id: "nightcafe",
    title: "NightCafe — CKRIZ",
    category: "Nightlife digital art",
    url: "https://creator.nightcafe.studio/u/CKRIZ",
    imageUrl: mshot("https://creator.nightcafe.studio/u/CKRIZ"),
  },
  {
    id: "gumroad-art",
    title: "Gumroad Art Works",
    category: "Healing arts & downloads",
    url: "https://chrspiah.gumroad.com/l/qylmdn",
    imageUrl: gravatarPreview("027a243aeda4787af0f3f335ed90b52c"),
  },
  {
    id: "myworldclass",
    title: "myworldclass.net",
    category: "Brand hub",
    url: "https://www.myworldclass.net/",
    imageUrl: mshot("https://www.myworldclass.net"),
  },
  {
    id: "wcs-art-verse",
    title: "WCS Art Verse",
    category: "Digital art",
    url: "https://wcs-art-verse.com",
    imageUrl: gravatarPreview("17e3e7d7de51912791b32dce02ded964"),
  },
  {
    id: "wcs-flab",
    title: "WCS Future Lab",
    category: "Innovation",
    url: "https://www.wcsflab.com/",
    imageUrl: gravatarPreview("1d87757906e8730c78900be8f730ca08"),
  },
];

/** Subset for Gumroad + NightCafe cards on program pages */
export const digitalCreativeWorks = founderLinkPromotions.filter((p) =>
  ["nightcafe", "gumroad-art"].includes(p.id)
);
