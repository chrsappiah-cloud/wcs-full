import { describe, it, expect } from "vitest";
import {
  founderLinkPromotions,
  FOUNDER_PROFILE_URL,
} from "./founderLinkPromotions.js";
import {
  digitalCreativeWorks,
  getProgramBySlug,
  CODEADX_DASHBOARD_URL,
} from "./codeadxPrograms.js";

describe("founderLinkPromotions", () => {
  it("lists promotional items with images from founder link", () => {
    expect(founderLinkPromotions.length).toBeGreaterThanOrEqual(6);
    for (const item of founderLinkPromotions) {
      expect(item.imageUrl).toMatch(/^https:\/\//);
      expect(item.url).toMatch(/^https:\/\//);
    }
  });

  it("includes Gumroad and NightCafe creatives", () => {
    const ids = digitalCreativeWorks.map((w) => w.id);
    expect(ids).toContain("gumroad-art");
    expect(ids).toContain("nightcafe");
  });
});

describe("codeadxPrograms", () => {
  it("resolves both program slugs", () => {
    expect(getProgramBySlug("digital-marketing")?.title).toBe("Digital Marketing");
    expect(getProgramBySlug("digital-advertising")?.title).toBe("Digital Advertising");
  });

  it("does not expose affiliate net sales snapshot", () => {
    expect(FOUNDER_PROFILE_URL).toBe("https://christopherappiahthompson.link");
    expect(CODEADX_DASHBOARD_URL).toBe("https://app.codeadx.com/podcaster/stats");
  });
});
