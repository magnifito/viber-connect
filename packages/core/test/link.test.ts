import { describe, it, expect } from "vitest";
import {
  buildViberLink,
  buildViberLinks,
  interpolate,
} from "../src/link.js";

describe("interpolate", () => {
  it("replaces {vars}", () => {
    expect(interpolate("Hi {name}, re {product}", { name: "Ann", product: "Shoes" })).toBe(
      "Hi Ann, re Shoes",
    );
  });
  it("leaves unknown placeholders untouched", () => {
    expect(interpolate("Hi {name}", {})).toBe("Hi {name}");
  });
  it("coerces numbers", () => {
    expect(interpolate("Order #{id}", { id: 42 })).toBe("Order #42");
  });
});

describe("buildViberLinks", () => {
  const links = buildViberLinks({
    phone: "+359 (88) 123-4567",
    text: "Interested in {product} — {url}",
    vars: { product: "Red Shoes", url: "https://shop.example/p/42" },
    utm: { source: "Shoply", medium: "directory" },
  });

  it("sanitizes the number", () => {
    expect(links.number).toBe("359881234567");
  });

  it("builds a viber.me web link with encoded text + utm", () => {
    expect(links.web).toContain("https://viber.me/359881234567?");
    expect(links.web).toContain("utm_source=Shoply");
    expect(links.web).toContain("utm_medium=directory");
    // space encoded as "+", message interpolated
    expect(links.web).toContain("text=Interested+in+Red+Shoes");
  });

  it("builds a native viber://chat link with draft + number", () => {
    expect(links.app).toContain("viber://chat?");
    expect(links.app).toContain("number=%2B359881234567");
    expect(links.app).toContain("draft=");
  });

  it("resolves the message", () => {
    expect(links.message).toBe("Interested in Red Shoes — https://shop.example/p/42");
  });
});

describe("buildViberLink", () => {
  it("returns the web link by default", () => {
    expect(buildViberLink({ phone: "359881234567" })).toBe("https://viber.me/359881234567");
  });
  it("returns the app link when target=app", () => {
    expect(buildViberLink({ phone: "359881234567", target: "app" })).toContain("viber://chat?");
  });
  it("omits query when no text/utm", () => {
    expect(buildViberLink({ phone: "359881234567" })).not.toContain("?");
  });
});
