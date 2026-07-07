import { buildViberLink, sanitizePhone, type ViberLinkTarget } from "@viberbutton/core";

const VIBER_PURPLE = "#7360f2";

const LOGO = `<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" fill="currentColor" aria-hidden="true"><path d="M12.06 1.5c-2.3.03-6.9.4-9.47 2.76C.68 6.16.02 8.9 0 12.3c-.01 2.65.03 5.3 1.3 7.9v3.8l3.63-1.8c1.9.53 3.4.44 5.13.6 2.3.03 6.9-.4 9.47-2.76 1.9-1.9 2.57-4.64 2.6-8.04.02-3.4-.66-6.13-2.56-8.04C16.9 1.6 12.3 1.5 12.06 1.5Zm.15 1.9c1.96.02 6.1.36 8.02 2.24 1.54 1.54 2.09 3.87 2.06 6.9-.02 3.02-.58 5.35-2.12 6.88-1.92 1.88-6.06 2.22-8.02 2.24-1.63-.13-3.02-.06-4.86-.62l-.4-.12-2.13 1.05v-2.4l-.24-.44c-1.16-2.28-1.2-4.68-1.19-7.1.02-3.02.58-5.35 2.12-6.88C9.36 3.76 10.25 3.42 12.2 3.4Z"/></svg>`;

/**
 * `<viber-button>` custom element.
 *
 * ```html
 * <viber-button
 *   phone="+359 88 123 4567"
 *   text="Interested in {product}"
 *   utm-source="Shoply"
 *   variant="full"
 *   label="Chat on Viber">
 * </viber-button>
 * ```
 */
export class ViberButtonElement extends HTMLElement {
  static get observedAttributes() {
    return [
      "phone",
      "number",
      "text",
      "target",
      "variant",
      "label",
      "color",
      "hide-icon",
      "utm-source",
      "utm-medium",
      "utm-campaign",
    ];
  }

  private anchor: HTMLAnchorElement | null = null;

  connectedCallback() {
    if (!this.anchor) this.render();
    else this.update();
  }

  attributeChangedCallback() {
    if (this.anchor) this.update();
  }

  private render() {
    const root = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = this.css();
    this.anchor = document.createElement("a");
    this.anchor.className = "viber-btn";
    this.anchor.rel = "noopener noreferrer";
    // Emit a bubbling, composed event so host pages can wire analytics.
    this.anchor.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("viber:click", {
          bubbles: true,
          composed: true,
          detail: {
            number: sanitizePhone(this.getAttribute("phone") ?? this.getAttribute("number") ?? ""),
            href: this.anchor?.href,
          },
        }),
      );
    });
    root.append(style, this.anchor);
    this.update();
  }

  private update() {
    if (!this.anchor) return;
    const phone = this.getAttribute("phone") ?? this.getAttribute("number") ?? "";
    const variant = this.getAttribute("variant") ?? "full";
    const label = this.getAttribute("label") ?? "Chat on Viber";
    const hideIcon = this.hasAttribute("hide-icon");
    const color = this.getAttribute("color");

    let href = "#";
    try {
      href = buildViberLink({
        phone,
        text: this.getAttribute("text") ?? undefined,
        target: (this.getAttribute("target") as ViberLinkTarget) ?? "web",
        utm: {
          source: this.getAttribute("utm-source") ?? undefined,
          medium: this.getAttribute("utm-medium") ?? undefined,
          campaign: this.getAttribute("utm-campaign") ?? undefined,
        },
      });
    } catch {
      // invalid phone → leave href="#" and mark disabled
      this.anchor.setAttribute("aria-disabled", "true");
    }

    this.anchor.href = href;
    this.anchor.className = `viber-btn viber-btn--${variant}`;
    if (color) this.anchor.style.setProperty("--viber-color", color);
    this.anchor.setAttribute("aria-label", "Chat on Viber");

    const icon = hideIcon ? "" : `<span class="icon">${LOGO}</span>`;
    const text = variant === "icon" || variant === "fab" ? "" : `<span class="label">${escapeHtml(label)}</span>`;
    this.anchor.innerHTML = `${icon}${text}`;
  }

  private css() {
    return `
      :host { display: inline-block; }
      .viber-btn {
        --viber-color: ${VIBER_PURPLE};
        --viber-color-hover: #5f4ddb;
        display: inline-flex; align-items: center; justify-content: center;
        gap: .55em; padding: .65em 1.15em; font: inherit; font-weight: 600;
        line-height: 1; text-decoration: none; color: #fff;
        background: var(--viber-color); border-radius: 10px; cursor: pointer;
        transition: background .15s ease;
      }
      .viber-btn:hover { background: var(--viber-color-hover); }
      .viber-btn:focus-visible { outline: 3px solid color-mix(in srgb, var(--viber-color) 45%, transparent); outline-offset: 2px; }
      .viber-btn--icon, .viber-btn--fab { padding: .6em; border-radius: 999px; }
      .viber-btn--fab { position: fixed; right: 20px; bottom: 20px; box-shadow: 0 6px 20px rgba(115,96,242,.4); }
      .viber-btn--link { background: none; color: var(--viber-color); padding: 0; }
      .viber-btn--link:hover { background: none; text-decoration: underline; }
      .viber-btn--outline { background: transparent; color: var(--viber-color); border: 2px solid var(--viber-color); padding: calc(.65em - 2px) calc(1.15em - 2px); }
      .viber-btn--outline:hover { background: var(--viber-color); color: #fff; }
      .viber-btn--badge { padding: .35em .7em; font-size: .82em; border-radius: 999px; gap: .4em; }
      .viber-btn--verified { background: color-mix(in srgb, var(--viber-color) 12%, #fff); color: var(--viber-color); border: 1px solid color-mix(in srgb, var(--viber-color) 35%, transparent); padding: .4em .8em; font-size: .85em; border-radius: 8px; font-weight: 600; }
      .viber-btn--verified:hover { background: color-mix(in srgb, var(--viber-color) 20%, #fff); }
      .viber-btn[aria-disabled="true"] { opacity: .5; pointer-events: none; }
      .icon { display: inline-flex; font-size: 1.2em; }
    `;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

/** Register the element (idempotent). Called automatically when this module loads in a browser. */
export function defineViberButton(tag = "viber-button"): void {
  if (typeof customElements === "undefined") return;
  if (!customElements.get(tag)) customElements.define(tag, ViberButtonElement);
}

defineViberButton();
