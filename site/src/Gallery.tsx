import { useState } from "react";
import { ViberButton, type ViberButtonVariant } from "@puralex/viber-connect-react";

const DEMO_PHONE = "+30 231 231 1388";

interface Item {
  variant: ViberButtonVariant;
  label?: string;
  title: string;
  desc: string;
}

const ITEMS: Item[] = [
  { variant: "full", title: "Primary CTA", desc: "Solid button — the main action." },
  { variant: "outline", title: "Outline", desc: "Secondary, sits beside other buttons." },
  { variant: "badge", label: "Viber", title: "Pill badge", desc: "Compact, for dense rows." },
  {
    variant: "verified",
    label: "Viber Business",
    title: "Trust badge",
    desc: "Signals an active account.",
  },
  { variant: "icon", title: "Icon only", desc: "Round, minimal footprint." },
  { variant: "link", title: "Text link", desc: "Inline, inside copy." },
];

function snippetFor(v: ViberButtonVariant, label?: string): string {
  const attrs = [
    `phone="${DEMO_PHONE}"`,
    v !== "full" && `variant="${v}"`,
    label && `label="${label}"`,
    `utm-source="website"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `<viber-button ${attrs}></viber-button>`;
}

function GalleryCard({ item }: { item: Item }) {
  const [copied, setCopied] = useState(false);
  const snippet = snippetFor(item.variant, item.label);
  return (
    <div className="gcard">
      <div className="gcard__stage">
        <ViberButton phone={DEMO_PHONE} variant={item.variant} label={item.label} />
      </div>
      <div className="gcard__meta">
        <strong>{item.title}</strong>
        <span>{item.desc}</span>
      </div>
      <button
        className="gcard__copy"
        onClick={async () => {
          await navigator.clipboard.writeText(snippet);
          setCopied(true);
          setTimeout(() => setCopied(false), 1300);
        }}
      >
        {copied ? "Copied ✓" : "Copy HTML"}
      </button>
    </div>
  );
}

export function Gallery() {
  return (
    <section id="badges" className="gallery">
      <h2>Badges &amp; CTA kit</h2>
      <p className="section-sub">
        Drop-in buttons and badges to promote a Viber Business account. Copy the HTML — works on any
        site.
      </p>
      <div className="grid">
        {ITEMS.map((it) => (
          <GalleryCard key={it.variant + (it.label ?? "")} item={it} />
        ))}
      </div>
      <p className="section-sub" style={{ marginTop: 28 }}>
        Prefer a static image for a README or email signature? See{" "}
        <a href="https://github.com/magnifito/viber-button/blob/main/BADGES.md">BADGES.md</a>.
      </p>
    </section>
  );
}
