import { describe, it, expect, beforeAll } from "vitest";
import { defineViberButton, ViberButtonElement } from "../src/index.js";

beforeAll(() => defineViberButton());

function mount(html: string): ViberButtonElement {
  document.body.innerHTML = html;
  return document.querySelector("viber-button") as ViberButtonElement;
}

function anchor(el: ViberButtonElement): HTMLAnchorElement {
  return el.shadowRoot!.querySelector("a")!;
}

describe("<viber-button>", () => {
  it("registers the custom element", () => {
    expect(customElements.get("viber-button")).toBe(ViberButtonElement);
  });

  it("builds a viber.me href from the phone attribute", () => {
    const el = mount(`<viber-button phone="+359 88 123 4567" utm-source="shoply"></viber-button>`);
    expect(anchor(el).href).toContain("https://viber.me/359881234567");
    expect(anchor(el).href).toContain("utm_source=shoply");
  });

  it("accepts `number` as an alias for `phone`", () => {
    const el = mount(`<viber-button number="359881234567"></viber-button>`);
    expect(anchor(el).href).toContain("viber.me/359881234567");
  });

  it("updates reactively when an attribute changes", () => {
    const el = mount(`<viber-button phone="359881234567"></viber-button>`);
    el.setAttribute("phone", "447123456789");
    expect(anchor(el).href).toContain("viber.me/447123456789");
  });

  it("emits a viber:click event with the number in detail", () => {
    const el = mount(`<viber-button phone="359881234567"></viber-button>`);
    let detail: { number?: string } = {};
    el.addEventListener("viber:click", (e) => {
      detail = (e as CustomEvent).detail;
    });
    anchor(el).dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(detail.number).toBe("359881234567");
  });

  it("marks the button disabled for an invalid number", () => {
    const el = mount(`<viber-button phone="123"></viber-button>`);
    expect(anchor(el).getAttribute("aria-disabled")).toBe("true");
  });
});
