import { buildViberLink, sanitizePhone, type ViberLinkTarget } from "@puralex/viber-connect";

const VIBER_PURPLE = "#7360f2";

const LOGO = `<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" aria-hidden="true"><path d="M11.398.002C9.473.028 5.331.344 3.014 2.467 1.294 4.187.693 6.7.623 9.82c-.06 3.11-.13 8.95 5.5 10.541v2.42s-.038.97.602 1.17c.79.25 1.24-.5 1.99-1.3l1.4-1.58c3.85.32 6.8-.42 7.14-.53.78-.25 5.192-.816 5.91-6.68.74-6.04-.36-9.86-2.34-11.58l-.01-.01c-.6-.55-3-2.3-8.36-2.32 0 0-.395-.025-1.055-.017-.283.004-.68.014-1.11.031zm.11 1.7c.36-.01.72-.006 1.02.004 4.54.02 6.7 1.49 7.21 1.95 1.68 1.44 2.54 4.88 1.92 9.93v.01c-.6 4.9-4.19 5.2-4.85 5.41-.28.09-2.88.73-6.16.52 0 0-2.44 2.95-3.2 3.72-.12.12-.26.16-.35.14-.13-.03-.17-.19-.16-.42l.02-4.02c-4.76-1.33-4.48-6.3-4.43-8.9.05-2.6.54-4.73 2-6.13 1.96-1.79 5.44-2.06 6.61-2.07.27 0 .53-.06.77-.06zm.5 2.5c-.13 0-.24.11-.24.24 0 .13.11.23.24.23 1.53.03 2.79.53 3.75 1.53.96 1.01 1.44 2.32 1.44 3.9 0 .13.11.24.24.24s.24-.11.24-.24c0-1.69-.53-3.13-1.56-4.21-1.03-1.09-2.46-1.62-4.11-1.66h-.04zm-3.75.94c-.2-.02-.4.02-.57.12l-.01.01c-.39.23-.74.52-1.12.98-.35.44-.54.87-.58 1.3-.02.26.02.51.1.75l.03.01c.24.71.76 1.47 1.61 2.5.69.86 1.42 1.6 2.29 2.28 1.04.82 1.79 1.31 2.5 1.55l.03.02c.24.08.49.12.75.1.43-.04.86-.23 1.3-.58.46-.38.75-.73.98-1.12l.01-.01c.19-.36.13-.7-.15-.9-.02-.02-1.75-1.19-1.83-1.24-.28-.16-.57-.14-.78.12l-.55.62c-.15.16-.43.13-.43.13l-.01.01c-1.99-.51-2.52-2.53-2.52-2.53s-.03-.29.14-.44l.62-.55c.26-.21.28-.5.12-.78-.05-.08-1.22-1.81-1.24-1.83-.1-.13-.24-.21-.39-.24-.03 0-.05-.01-.08-.01zm3.11.62c-.11-.01-.22.07-.23.19-.01.13.08.24.21.25.53.05.9.22 1.16.5.26.28.4.68.42 1.26.01.13.11.23.24.22h.01c.13-.01.23-.12.22-.25-.02-.66-.21-1.19-.56-1.57-.35-.38-.85-.58-1.5-.65-.06 0-.11-.01-.17-.02z"/></svg>`;

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
