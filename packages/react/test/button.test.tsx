import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ViberButton } from "../src/ViberButton.js";

function render(el: React.ReactElement): string {
  return renderToStaticMarkup(el);
}

describe("<ViberButton />", () => {
  it("renders an anchor with the generated viber.me href", () => {
    const html = render(
      <ViberButton phone="+359 88 123 4567" utm={{ source: "shoply" }} />,
    );
    expect(html).toContain('href="https://viber.me/359881234567?utm_source=shoply"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("Chat on Viber");
  });

  it("interpolates {vars} into the draft text", () => {
    const html = render(
      <ViberButton phone="359881234567" text="Re {product}" vars={{ product: "Shoes" }} />,
    );
    expect(html).toContain("text=Re+Shoes");
  });

  it("applies the variant class and custom color", () => {
    const html = render(<ViberButton phone="359881234567" variant="icon" color="#ff0000" />);
    expect(html).toContain("viber-btn--icon");
    expect(html).toContain("--viber-color:#ff0000");
  });

  it("targets the native app link when target=app", () => {
    const html = render(<ViberButton phone="359881234567" target="app" />);
    expect(html).toContain("viber://chat?");
  });
});
