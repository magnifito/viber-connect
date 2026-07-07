import {
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
  useMemo,
} from "react";
import {
  buildViberLink,
  type UtmParams,
  type ViberLinkTarget,
} from "@puralex/viber-connect";
import { ViberLogo } from "./ViberLogo.js";

export type ViberButtonVariant =
  | "full"
  | "outline"
  | "badge"
  | "verified"
  | "icon"
  | "link"
  | "fab";

export interface ViberButtonProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Business phone number in any format. */
  phone: string;
  /** Pre-filled draft message. Supports `{var}` placeholders from `vars`. */
  text?: string;
  vars?: Record<string, string | number>;
  utm?: UtmParams;
  /** Link flavor. Defaults to `"web"` (safe href). */
  target?: ViberLinkTarget;
  /** Visual style. Defaults to `"full"`. */
  variant?: ViberButtonVariant;
  /** Button label. Defaults to "Chat on Viber". */
  label?: ReactNode;
  /** Hide the Viber glyph. */
  hideIcon?: boolean;
  /** Override the brand color (sets the `--viber-color` CSS var). */
  color?: string;
  /** Fired after the link is followed — wire this to your analytics. */
  onChatClick?: () => void;
}

/**
 * A branded Viber Click-to-Chat button. Renders an `<a>` so it works without JS
 * and is keyboard/screen-reader friendly.
 *
 * Remember to import the stylesheet once in your app:
 * `import "@puralex/viber-connect-react/styles.css";`
 */
export function ViberButton({
  phone,
  text,
  vars,
  utm,
  target = "web",
  variant = "full",
  label = "Chat on Viber",
  hideIcon = false,
  color,
  onChatClick,
  className,
  style,
  onClick,
  ...rest
}: ViberButtonProps) {
  const href = useMemo(
    () => buildViberLink({ phone, text, vars, utm, target }),
    [phone, text, vars, utm, target],
  );

  const mergedStyle: CSSProperties | undefined = color
    ? ({ ["--viber-color" as string]: color, ...style } as CSSProperties)
    : style;

  const classes = ["viber-btn", `viber-btn--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      {...rest}
      href={href}
      className={classes}
      style={mergedStyle}
      rel="noopener noreferrer"
      aria-label={
        typeof label === "string" && variant !== "icon" && variant !== "fab"
          ? undefined
          : "Chat on Viber"
      }
      onClick={(e) => {
        onClick?.(e);
        onChatClick?.();
      }}
    >
      {!hideIcon && (
        <span className="viber-btn__icon">
          <ViberLogo />
        </span>
      )}
      <span className="viber-btn__label">{label}</span>
    </a>
  );
}
