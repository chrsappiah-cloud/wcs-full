import { describe, it, expect } from "vitest";
import {
  buildBetaManifest,
  buildPodcastReferralLink,
  buildReferralLink,
  findApp,
  iosApps,
  marketingTabs,
  resolveAttribution,
} from "./marketingPortal.js";

describe("marketingPortal", () => {
  it("exposes three marketing tabs", () => {
    expect(marketingTabs.map((t) => t.id)).toEqual(["apps", "testflight", "app-store"]);
  });

  it("lists four iOS apps", () => {
    expect(iosApps).toHaveLength(4);
    expect(findApp("wcs-commerce")?.bundleId).toBe("wcs.wcs-ios");
  });

  it("builds referral links with ref query", () => {
    const url = new URL(buildReferralLink("wcs-care", "tiktok"));
    expect(url.pathname).toContain("/marketing/wcs-care");
    expect(url.searchParams.get("ref")).toBe("tiktok");
  });

  it("resolves attribution from query", () => {
    const params = new URLSearchParams("ref=linkedin&utm_campaign=spring");
    const attr = resolveAttribution(params);
    expect(attr.ref).toBe("linkedin");
    expect(attr.campaign).toBe("spring");
  });

  it("resolves attribution from Vue Router query object", () => {
    const attr = resolveAttribution({ ref: "tiktok", utm_campaign: "beta" });
    expect(attr.ref).toBe("tiktok");
    expect(attr.campaign).toBe("beta");
  });

  it("builds podcast referral links with ref query", () => {
    const url = new URL(buildPodcastReferralLink("heartbeats-beyond-memory", "linkedin"));
    expect(url.pathname).toContain("/podcasts/heartbeats-beyond-memory");
    expect(url.searchParams.get("ref")).toBe("linkedin");
  });

  it("beta manifest includes podcasts with referral links", () => {
    const manifest = buildBetaManifest();
    expect(manifest.podcasts?.length).toBe(3);
    expect(manifest.podcasts[0].referralLinks.tiktok).toContain("ref=tiktok");
  });

  it("beta manifest includes all apps", () => {
    const manifest = buildBetaManifest();
    expect(manifest.schema).toBe("wcs-ios-beta-manifest/1.0");
    expect(manifest.apps).toHaveLength(4);
    expect(manifest.socialChannels.length).toBeGreaterThan(0);
    expect(manifest.founder.personalEmail).toBe("chrsappiah@gmail.com");
    expect(manifest.commerceApiEndpoints).toBeUndefined();
  });
});
