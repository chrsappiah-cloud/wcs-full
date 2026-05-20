import { describe, it, expect } from "vitest";
import { absoluteUrl, publicRoutes, siteName } from "./seo.js";

describe("seo", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/marketing")).toMatch(/\/marketing$/);
  });

  it("includes marketing in public routes", () => {
    const paths = publicRoutes.map((r) => r.path);
    expect(paths).toContain("/");
    expect(paths).toContain("/marketing");
    expect(paths).toContain("/about");
  });

  it("has site name", () => {
    expect(siteName).toBe("World Class Scholars");
  });
});
