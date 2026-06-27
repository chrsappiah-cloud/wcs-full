import { describe, it, expect } from "vitest";
import { appleApps } from "../config/appleApps.js";
import { absoluteUrl, appleAppsItemListJsonLd, publicRoutes, siteName, softwareApplicationJsonLd } from "./seo.js";

describe("seo", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/marketing")).toMatch(/\/marketing$/);
  });

  it("includes key public routes for indexing", () => {
    const paths = publicRoutes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/marketing");
    expect(paths).toContain("/apple-apps");
    expect(paths).toContain(`/apple-apps/${appleApps[0].slug}`);
    expect(paths).toContain("/about");
    expect(paths).toContain("/contact");
  });

  it("builds structured data for App Store apps", () => {
    const schema = softwareApplicationJsonLd(appleApps[0]);
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.sameAs).toMatch(/^https:\/\/apps\.apple\.com\//);
    expect(schema.url).toContain(`/apple-apps/${appleApps[0].slug}`);
  });

  it("builds an Apple apps item list", () => {
    const schema = appleAppsItemListJsonLd();
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(appleApps.length);
  });

  it("has site name", () => {
    expect(siteName).toBe("World Class Scholars");
  });
});
