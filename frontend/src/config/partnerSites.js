/** Sister properties — cross-link for SEO and discovery (see docs/SEARCH_CONSOLE_SETUP.md). */
export const partnerSites = [
  {
    id: "wcs",
    label: "World Class Scholars",
    url: "https://worldclassscholars.vercel.app/",
    description: "Courses, library, podcasts, iOS apps, and contact.",
    primary: true,
  },
  {
    id: "myworldclass",
    label: "myworldclass.net",
    url: "https://www.myworldclass.net/",
    description: "World Class Scholars school and organisation hub.",
  },
  {
    id: "onboarding-schools",
    label: "School onboarding",
    url: "https://www.myworldclass.net/onboarding-for-schools",
    description: "Onboarding pathway for schools partnering with World Class Scholars.",
  },
  {
    id: "founder-link",
    label: "christopherappiahthompson.link",
    url: "https://christopherappiahthompson.link/",
    description: "Founder link-in-bio, apps, and campaigns.",
  },
];

/** External partners only (for footer “Also on” section). */
export function externalPartnerSites() {
  return partnerSites.filter((s) => !s.primary);
}
