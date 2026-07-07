import { useEffect, useMemo, useState } from "react";
import {
  buildViberLinks,
  isValidPhone,
  sanitizePhone,
} from "@puralex/viber-connect";
import { ViberButton, type ViberButtonVariant } from "@puralex/viber-connect-react";
import QRCode from "qrcode";
import { htmlSnippet, reactSnippet, type BuilderState } from "./snippets.js";

const VARIANTS: ViberButtonVariant[] = ["full", "icon", "link", "fab"];

const initial: BuilderState = {
  phone: "+359 88 123 4567",
  label: "Chat on Viber",
  text: "Hi! I'm interested in {product} — {url}",
  variant: "full",
  color: "#7360f2",
  utmSource: "mywebsite",
  utmMedium: "",
  utmCampaign: "",
  hideIcon: false,
};

function CopyBtn({ value }: { value: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      className="copy"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "Copied ✓" : "Copy"}
    </button>
  );
}

export function Builder() {
  const [s, setS] = useState<BuilderState>(initial);
  const [tab, setTab] = useState<"html" | "react" | "url">("html");
  const [qr, setQr] = useState<string>("");

  const set = <K extends keyof BuilderState>(k: K, v: BuilderState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }));

  const valid = isValidPhone(s.phone);
  const sanitized = sanitizePhone(s.phone);

  const links = useMemo(() => {
    if (!valid) return null;
    return buildViberLinks({
      phone: s.phone,
      text: s.text || undefined,
      utm: {
        source: s.utmSource || undefined,
        medium: s.utmMedium || undefined,
        campaign: s.utmCampaign || undefined,
      },
    });
  }, [s, valid]);

  useEffect(() => {
    if (!links) return setQr("");
    QRCode.toDataURL(links.web, { width: 180, margin: 1 }).then(setQr, () => setQr(""));
  }, [links]);

  const snippet =
    tab === "html" ? htmlSnippet(s) : tab === "react" ? reactSnippet(s) : links?.web ?? "";

  return (
    <div className="builder" id="builder">
      <div className="builder__form">
        <h3>1 · Your details</h3>

        <label>
          Business phone (international)
          <input
            value={s.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+359 88 123 4567"
            className={valid ? "" : "invalid"}
          />
          <small className={valid ? "hint ok" : "hint bad"}>
            {valid
              ? `→ viber.me/${sanitized}`
              : "Enter a full international number (7–15 digits)."}
          </small>
        </label>

        <label>
          Button label
          <input value={s.label} onChange={(e) => set("label", e.target.value)} />
        </label>

        <label>
          Pre-filled message
          <textarea
            value={s.text}
            rows={2}
            onChange={(e) => set("text", e.target.value)}
          />
          <small className="hint">
            Use <code>{"{product}"}</code>, <code>{"{url}"}</code> — replace them per page.
          </small>
        </label>

        <h3>2 · Style</h3>
        <div className="row">
          <label>
            Variant
            <select
              value={s.variant}
              onChange={(e) => set("variant", e.target.value as ViberButtonVariant)}
            >
              {VARIANTS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
          <label>
            Color
            <input
              type="color"
              value={s.color}
              onChange={(e) => set("color", e.target.value)}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              checked={s.hideIcon}
              onChange={(e) => set("hideIcon", e.target.checked)}
            />
            Hide icon
          </label>
        </div>

        <h3>3 · Tracking (UTM)</h3>
        <div className="row">
          <label>
            Source
            <input value={s.utmSource} onChange={(e) => set("utmSource", e.target.value)} />
          </label>
          <label>
            Medium
            <input value={s.utmMedium} onChange={(e) => set("utmMedium", e.target.value)} />
          </label>
          <label>
            Campaign
            <input
              value={s.utmCampaign}
              onChange={(e) => set("utmCampaign", e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="builder__preview">
        <h3>Live preview</h3>
        <div className="preview-stage">
          {valid ? (
            <ViberButton
              phone={s.phone}
              label={s.label}
              text={s.text}
              variant={s.variant === "fab" ? "full" : s.variant}
              color={s.color}
              hideIcon={s.hideIcon}
              utm={{
                source: s.utmSource,
                medium: s.utmMedium,
                campaign: s.utmCampaign,
              }}
            />
          ) : (
            <span className="muted">Enter a valid number to preview…</span>
          )}
        </div>

        {qr && (
          <div className="qr">
            <img src={qr} alt="QR code linking to the Viber chat" width={130} height={130} />
            <small>Scan to open the chat on a phone</small>
          </div>
        )}

        <div className="snippet">
          <div className="tabs">
            {(["html", "react", "url"] as const).map((t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t === "html" ? "HTML" : t === "react" ? "React" : "Raw URL"}
              </button>
            ))}
            <CopyBtn value={snippet} />
          </div>
          <pre>
            <code>{snippet || "// enter a valid number"}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
