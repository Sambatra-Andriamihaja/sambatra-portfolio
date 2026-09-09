import { ImageResponse } from "next/og";
import { LOGO_CLOSE, LOGO_LEAN, LOGO_OPEN } from "@/components/os/logo";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: iOS rounds the corners itself, so this is a full tile. */
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#E95420",
      }}
    >
      <svg viewBox="0 0 100 100" width="140" height="140">
        <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="3" transform={LOGO_LEAN}>
          <path d={LOGO_OPEN} />
          <path d={LOGO_CLOSE} />
        </g>
      </svg>
    </div>,
    size,
  );
}
