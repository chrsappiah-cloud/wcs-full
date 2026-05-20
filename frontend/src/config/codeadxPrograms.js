/** CodeAdx digital marketing & advertising — World Class Scholars programs */

import { digitalCreativeWorks } from "./founderLinkPromotions.js";

export { digitalCreativeWorks };

export const CODEADX_DASHBOARD_URL = "https://app.codeadx.com/podcaster/stats";
export const CODEADX_APP_URL = "https://app.codeadx.com";
export const GUMROAD_URL = "https://chrspiah.gumroad.com/";
export const NIGHTCAFE_URL = "https://creator.nightcafe.studio/u/CKRIZ";

export const digitalMarketingProgram = {
  slug: "digital-marketing",
  title: "Digital Marketing",
  eyebrow: "CodeAdx · Creative campaigns",
  summary:
    "Podcasts, healing arts, and brand storytelling promoted through Christopher Appiah-Thompson’s link hub and CodeAdx campaign tools.",
  highlights: [
    "Podcast and creative previews from christopherappiahthompson.link",
    "Gumroad healing-arts products and NightCafe digital collections",
    "Social amplification via @chrsappiah and WCS channels",
    "CodeAdx app for campaign management and podcaster stats",
  ],
  modules: [
    {
      title: "Founder link promotions",
      summary:
        "Showcase podcasts, digital art, and partner brands with the same preview images as the public link profile.",
    },
    {
      title: "Referral & social amplification",
      summary:
        "Pair CodeAdx tracking with WCS marketing referral links on TikTok, LinkedIn, and YouTube.",
    },
    {
      title: "Performance & analytics",
      summary:
        "Monitor podcast and display performance on the CodeAdx podcaster dashboard.",
    },
  ],
};

export const digitalAdvertisingProgram = {
  slug: "digital-advertising",
  title: "Digital Advertising",
  eyebrow: "CodeAdx · Podcast & display",
  summary:
    "Podcast monetisation, ad placement analytics, and audience reach reporting through the CodeAdx podcaster platform.",
  highlights: [
    "Live podcaster stats dashboard for impressions, plays, and ad performance",
    "Programmatic and host-read placements across WCS podcast properties",
    "Promotional creatives aligned with christopherappiahthompson.link",
    "Unified reporting at app.codeadx.com",
  ],
  modules: [
    {
      title: "Podcaster stats hub",
      summary:
        "Monitor campaign delivery and listener engagement from the CodeAdx podcaster console.",
    },
    {
      title: "RSS & show integrations",
      summary:
        "Connect Heartbeats Beyond Memory and other WCS shows to measurable ad inventory.",
    },
    {
      title: "Brand partnerships",
      summary:
        "Package display, audio, and creative offers for sponsors aligned with humane care and education.",
    },
  ],
};

const programs = [digitalMarketingProgram, digitalAdvertisingProgram];

export function getProgramBySlug(slug) {
  return programs.find((p) => p.slug === slug) ?? null;
}
