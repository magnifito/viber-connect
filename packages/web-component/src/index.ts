import { buildViberLink, sanitizePhone, type ViberLinkTarget } from "@puralex/viber-connect";

const VIBER_PURPLE = "#7360f2";

const LOGO = `<svg viewBox="0 0 512 512" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true"><path d="M444 49.9C431.3 38.2 379.9.9 265.3.4c0 0-135.1-8.1-200.9 52.3C27.8 89.3 14.9 143 13.5 209.5c-1.4 66.5-3.1 191.1 117 224.9h.1l-.1 51.6s-.8 20.9 13 25.1c16.6 5.2 26.4-10.7 42.3-27.8 8.7-9.4 20.7-23.2 29.8-33.7 82.2 6.9 145.3-8.9 152.5-11.2 16.6-5.4 110.5-17.4 125.7-142 15.8-128.6-7.6-209.8-49.8-246.5zM457.9 287c-12.9 104-89 110.6-103 115.1-6 1.9-61.5 15.7-131.2 11.2 0 0-52 62.7-68.2 79-5.3 5.3-11.1 4.8-11-5.7 0-6.9.4-85.7.4-85.7-.1 0-.1 0 0 0-101.8-28.2-95.8-134.3-94.7-189.8 1.1-55.5 11.6-101 42.6-131.6 55.7-50.5 170.4-43 170.4-43 96.9.4 143.3 29.6 154.1 39.4 35.7 30.6 53.9 103.8 40.6 211.1zm-139-80.8c.4 8.6-12.5 9.2-12.9.6-1.1-22-11.4-32.7-32.6-33.9-8.6-.5-7.8-13.4.7-12.9 27.9 1.5 43.4 17.5 44.8 46.2zm20.3 11.3c1-42.4-25.5-75.6-75.8-79.3-8.5-.6-7.6-13.5.9-12.9 58 4.2 88.9 44.1 87.8 92.5-.1 8.6-13.1 8.2-12.9-.3zm47 13.4c.1 8.6-12.9 8.7-12.9.1-.6-81.5-54.9-125.9-120.8-126.4-8.5-.1-8.5-12.9 0-12.9 73.7.5 133 51.4 133.7 139.2zM374.9 329v.2c-10.8 19-31 40-51.8 33.3l-.2-.3c-21.1-5.9-70.8-31.5-102.2-56.5-16.2-12.8-31-27.9-42.4-42.4-10.3-12.9-20.7-28.2-30.8-46.6-21.3-38.5-26-55.7-26-55.7-6.7-20.8 14.2-41 33.3-51.8h.2c9.2-4.8 18-3.2 23.9 3.9 0 0 12.4 14.8 17.7 22.1 5 6.8 11.7 17.7 15.2 23.8 6.1 10.9 2.3 22-3.7 26.6l-12 9.6c-6.1 4.9-5.3 14-5.3 14s17.8 67.3 84.3 84.3c0 0 9.1.8 14-5.3l9.6-12c4.6-6 15.7-9.8 26.6-3.7 14.7 8.3 33.4 21.2 45.8 32.9 7 5.7 8.6 14.4 3.8 23.6z"/></svg>`;

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
