import { ImageResponse } from "next/og";
import { LOGO_CLOSE, LOGO_LEAN, LOGO_OPEN } from "@/components/os/logo";

export const runtime = "edge";

/**
 * Favicon, generated from the mark itself so it can never drift from the
 * logo: the white brace‑S on the Ubuntu accent disc (the site boots into
 * Ubuntu). Two sizes — 32 for tabs, 192 for home screens and pinned sites.
 */
export function generateImageMetadata() {
  return [
    { id: "32", size: { width: 32, height: 32 }, contentType: "image/png" },
    { id: "192", size: { width: 192, height: 192 }, contentType: "image/png" },
  ];
}

export default function Icon({ id }: { id: string }) {
  const s = Number(id);
  return new ImageResponse(
    <div
      style={{
        width: s,
        height: s,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: s / 2,
        background: "#E95420",
      }}
    >
      <svg viewBox="0 0 100 100" width={s * 0.84} height={s * 0.84}>
        <g fill="none" stroke="#fff" strokeWidth={s < 64 ? 8 : 7} strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="3" transform={LOGO_LEAN}>
          <path d={LOGO_OPEN} />
          <path d={LOGO_CLOSE} />
        </g>
      </svg>
    </div>,
    { width: s, height: s },
  );
}
