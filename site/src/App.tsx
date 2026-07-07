import { Builder } from "./Builder.js";
import { Gallery } from "./Gallery.js";

const REPO = "https://github.com/magnifito/viber-button";

function Feature({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="feature">
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

export function App() {
  return (
    <>
      <header className="nav">
        <a className="brand" href="#top">
          <span className="dot" /> Viber Button
        </a>
        <nav>
          <a href="#builder">Builder</a>
          <a href="#badges">Badges</a>
          <a href="#why">Why</a>
          <a href="#docs">Docs</a>
          <a href={REPO} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <h1>
            Turn a phone number into a <span className="grad">one-click Viber chat</span>.
          </h1>
          <p className="lead">
            Free, open-source toolkit for adding Viber Click-to-Chat buttons to any store,
            directory, or listing. No signup. Copy, paste, done.
          </p>
          <div className="cta">
            <a className="btn primary" href="#builder">
              Build your button
            </a>
            <a className="btn ghost" href="#docs">
              Read the docs
            </a>
          </div>
          <code className="install">npm i @viberbutton/react</code>
        </section>

        <section id="why" className="why">
          <h2>Why a native Viber button?</h2>
          <div className="features">
            <Feature title="Zero friction">
              One tap goes from a product page straight into a Viber chat — no "Add contact",
              no copy-pasting numbers.
            </Feature>
            <Feature title="Local trust">
              In markets where Viber dominates (e.g. ~94% reach in Bulgaria), a native button
              beats a generic chat widget on familiarity.
            </Feature>
            <Feature title="Contextual leads">
              A pre-filled message tells the seller exactly which product or listing the buyer
              was viewing — no guesswork.
            </Feature>
            <Feature title="Measurable ROI">
              Every click is a trackable event via UTM params, so you can prove how many
              inquiries the platform drives.
            </Feature>
          </div>
        </section>

        <section className="builder-section">
          <h2>Generate your button</h2>
          <p className="section-sub">
            Fill in the details, copy the snippet, paste it into your site.
          </p>
          <Builder />
        </section>

        <Gallery />

        <section id="docs" className="docs">
          <h2>Install &amp; use</h2>

          <h3>Plain HTML (no build step)</h3>
          <pre>
            <code>{`<script type="module"
  src="https://cdn.jsdelivr.net/npm/@viberbutton/web-component/dist/viber-button.global.js">
</script>

<viber-button phone="+359 88 123 4567" label="Chat on Viber"></viber-button>`}</code>
          </pre>

          <h3>React</h3>
          <pre>
            <code>{`import { ViberButton } from "@viberbutton/react";
import "@viberbutton/react/styles.css";

<ViberButton phone="+359 88 123 4567" text="Interested in {product}"
  vars={{ product: "Red Shoes" }} utm={{ source: "shoply" }} />`}</code>
          </pre>

          <h3>Just the link (any language)</h3>
          <pre>
            <code>{`import { buildViberLink } from "@viberbutton/core";

buildViberLink({ phone: "0888123456", text: "Hi!", utm: { source: "site" } });
// → https://viber.me/888123456?utm_source=site&text=Hi!`}</code>
          </pre>

          <div className="callout">
            <strong>Heads up:</strong> the number must belong to an active{" "}
            <em>Viber Business account</em>, otherwise the link shows "Page Not Found". Use{" "}
            <code>validateViberNumber()</code> with your own backend proxy to check before
            rendering.
          </div>
        </section>
      </main>

      <footer>
        <p>
          Open source · MIT · Not affiliated with Rakuten Viber ·{" "}
          <a href={REPO} target="_blank" rel="noreferrer">
            Contribute on GitHub
          </a>
        </p>
      </footer>
    </>
  );
}
