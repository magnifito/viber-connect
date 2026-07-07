import { useEffect, useMemo, useState } from "react";
import {
  buildViberLinks,
  isValidPhone,
  sanitizePhone,
} from "@puralex/viber-connect";
import { ViberButton, type ViberButtonVariant } from "@puralex/viber-connect-react";
import QRCode from "qrcode";
import { htmlSnippet, reactSnippet, type BuilderState } from "./snippets.js";
import { buildSvgBadge, svgToDataUri, svgToPngBlob } from "./svgBadge.js";

function download(filename: string, blobOrUrl: Blob | string) {
  const url = typeof blobOrUrl === "string" ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  if (typeof blobOrUrl !== "string") setTimeout(() => URL.revokeObjectURL(url), 1000);
}

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
  const [tab, setTab] = useState<"html" | "react" | "url" | "image">("html");
  const [format, setFormat] = useState<"svg" | "png">("svg");
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

  const svgBadge = useMemo(
    () =>
      buildSvgBadge({
        label: s.label,
        color: s.color,
        style: s.variant === "outline" ? "outline" : "solid",
      }),
    [s.label, s.color, s.variant],
  );

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
          <div className="tokens">
            <span>Insert placeholder:</span>
            {(["{product}", "{url}"] as const).map((tok) => (
              <button
                type="button"
                key={tok}
                onClick={() => set("text", `${s.text}${s.text && !s.text.endsWith(" ") ? " " : ""}${tok}`)}
              >
                {tok}
              </button>
            ))}
          </div>
          <small className="hint">
            <code>{"{product}"}</code> and <code>{"{url}"}</code> are <strong>placeholders</strong> —
            your site swaps them for the real product name &amp; page link right before the chat
            opens (React: <code>vars=&#123;&#123; product, url &#125;&#125;</code>). No code? Just
            type a fixed message instead.
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
            {(["html", "react", "url", "image"] as const).map((t) => (
              <button
                key={t}
                className={tab === t ? "active" : ""}
                onClick={() => setTab(t)}
              >
                {t === "html" ? "HTML" : t === "react" ? "React" : t === "url" ? "Raw URL" : "Image"}
              </button>
            ))}
            {tab !== "image" && <CopyBtn value={snippet} />}
          </div>

          {tab === "image" ? (
            <div className="image-out">
              <div className="format-toggle" role="group" aria-label="Image format">
                {(["svg", "png"] as const).map((f) => (
                  <button
                    key={f}
                    className={format === f ? "active" : ""}
                    onClick={() => setFormat(f)}
                  >
                    {f === "svg" ? "Vector (SVG)" : "Raster (PNG)"}
                  </button>
                ))}
              </div>

              <div className="image-preview">
                <img src={svgToDataUri(svgBadge)} alt="Viber badge preview" height={28} />
              </div>

              <p className="hint">
                {format === "svg"
                  ? "Crisp at any size, tiny file — best for websites & READMEs. Some email clients don't render SVG."
                  : "Universal — best for email signatures, docs, and anywhere SVG isn't supported. Exports at 3× for retina."}
              </p>

              <div className="image-actions">
                {format === "svg" ? (
                  <>
                    <button onClick={() => download("chat-on-viber.svg", new Blob([svgBadge], { type: "image/svg+xml" }))}>
                      Download .svg
                    </button>
                    <CopyBtn value={svgBadge} />
                  </>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        download("chat-on-viber.png", await svgToPngBlob(svgBadge, 3));
                      } catch {
                        /* ignore */
                      }
                    }}
                  >
                    Download .png
                  </button>
                )}
              </div>

              {format === "svg" && (
                <pre>
                  <code>{svgBadge}</code>
                </pre>
              )}
            </div>
          ) : (
            <pre>
              <code>{snippet || "// enter a valid number"}</code>
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
