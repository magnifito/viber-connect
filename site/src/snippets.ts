import type { ViberButtonVariant } from "@puralex/viber-connect-react";

export interface BuilderState {
  phone: string;
  label: string;
  text: string;
  variant: ViberButtonVariant;
  color: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  hideIcon: boolean;
}

function attr(name: string, value: string | boolean): string {
  if (value === "" || value === false) return "";
  if (value === true) return ` ${name}`;
  return ` ${name}="${String(value).replace(/"/g, "&quot;")}"`;
}

/** Plain-HTML embed via the CDN web component — no build step. */
export function htmlSnippet(s: BuilderState): string {
  const el =
    `<viber-button` +
    attr("phone", s.phone) +
    attr("label", s.label) +
    attr("text", s.text) +
    attr("variant", s.variant) +
    attr("color", s.color) +
    attr("utm-source", s.utmSource) +
    attr("utm-medium", s.utmMedium) +
    attr("utm-campaign", s.utmCampaign) +
    (s.hideIcon ? attr("hide-icon", true) : "") +
    `></viber-button>`;
  return `<!-- Load once, anywhere before </body> -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@puralex/viber-connect-web-component/dist/viber-button.global.js"></script>

${el}`;
}

/** React usage. */
export function reactSnippet(s: BuilderState): string {
  const props = [
    `phone="${s.phone}"`,
    s.label && `label="${s.label}"`,
    s.text && `text=${JSON.stringify(s.text)}`,
    s.variant !== "full" && `variant="${s.variant}"`,
    s.color && `color="${s.color}"`,
    s.hideIcon && `hideIcon`,
    (s.utmSource || s.utmMedium || s.utmCampaign) &&
      `utm={{ ${[
        s.utmSource && `source: "${s.utmSource}"`,
        s.utmMedium && `medium: "${s.utmMedium}"`,
        s.utmCampaign && `campaign: "${s.utmCampaign}"`,
      ]
        .filter(Boolean)
        .join(", ")} }}`,
  ].filter(Boolean);

  return `import { ViberButton } from "@puralex/viber-connect-react";
import "@puralex/viber-connect-react/styles.css";

<ViberButton
  ${props.join("\n  ")}
/>`;
}
