import { ImageResponse } from "next/og";
import { PROFILE } from "@/constants/profile";
import { LOGO_CLOSE, LOGO_LEAN, LOGO_OPEN } from "@/components/os/logo";

export const runtime = "edge";
export const alt = `${PROFILE.name} — ${PROFILE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card: a GNOME-style terminal window on the aubergine canvas, the
 * prompt already typed — the same first impression the site gives.
 */
export default function OpenGraphImage() {
  const win = {
    display: "flex",
    flexDirection: "column" as const,
    width: 1000,
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 0 0 1px rgba(243,238,233,0.16), 0 40px 90px -30px rgba(0,0,0,0.9)",
  };

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0E0A0D",
        color: "#F3EEE9",
        fontFamily: "Helvetica, Arial, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -260,
          left: -160,
          width: 820,
          height: 640,
          background:
            "radial-gradient(circle, rgba(233,84,32,0.42) 0%, rgba(14,10,13,0) 68%)",
          display: "flex",
        }}
      />

      <div style={win}>
        {/* GNOME Terminal headerbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: 60,
            padding: "0 16px",
            background: "#2C0B1F",
            borderBottom: "1px solid rgba(0,0,0,0.45)",
          }}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 7.5v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-8l-1.6-2H5.5a2 2 0 0 0-2 2v1z" />
            <path d="M12 10.5v6M9 13.5h6" />
          </svg>
          <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 19, fontWeight: 700, lineHeight: 1 }}>{PROFILE.handle}@ubuntu: ~</div>
            <div style={{ display: "flex", fontSize: 13, lineHeight: 1, marginTop: 5, color: "rgba(255,255,255,0.6)" }}>~</div>
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="6.5" height="6.5" rx="1" />
            <rect x="13.5" y="4" width="6.5" height="6.5" rx="1" />
            <rect x="4" y="13.5" width="6.5" height="6.5" rx="1" />
            <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1" />
          </svg>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.6" strokeLinecap="round" style={{ marginLeft: 18 }}>
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <div style={{ display: "flex", gap: 9, marginLeft: 22 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  background: i === 2 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
                  {i === 0 && <path d="M7 12.5h10" />}
                  {i === 1 && <rect x="7.25" y="7.25" width="9.5" height="9.5" rx="1" />}
                  {i === 2 && <path d="m8 8 8 8M16 8l-8 8" />}
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* buffer */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px 34px 34px",
            background: "#300A24",
            fontFamily: "Courier New, monospace",
            fontSize: 26,
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: "flex", color: "rgba(255,255,255,0.55)", fontSize: 20 }}>
            Welcome to Ubuntu 24.04 LTS — {PROFILE.located}
          </div>
          <div style={{ display: "flex", marginTop: 22 }}>
            <span style={{ color: "#8AE234", fontWeight: 700 }}>{PROFILE.handle}@ubuntu</span>
            <span>:</span>
            <span style={{ color: "#729FCF", fontWeight: 700 }}>~</span>
            <span>$&nbsp;whois</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 18 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 104,
                height: 104,
                borderRadius: 52,
                background: "#E95420",
              }}
            >
              <svg viewBox="0 0 100 100" width="84" height="84">
                <g fill="none" stroke="#fff" strokeWidth="7" strokeLinecap="round" strokeLinejoin="miter" strokeMiterlimit="3" transform={LOGO_LEAN}>
                  <path d={LOGO_OPEN} />
                  <path d={LOGO_CLOSE} />
                </g>
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontSize: 88,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 1,
              }}
            >
              {PROFILE.name}
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 22, color: "#FCE94F", fontSize: 30 }}>
            {PROFILE.role}
          </div>
          <div style={{ display: "flex", marginTop: 26 }}>
            <span style={{ color: "#8AE234", fontWeight: 700 }}>{PROFILE.handle}@ubuntu</span>
            <span>:</span>
            <span style={{ color: "#729FCF", fontWeight: 700 }}>~</span>
            <span>$&nbsp;</span>
            <span style={{ display: "flex", width: 16, height: 30, background: "#F3EEE9" }} />
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
