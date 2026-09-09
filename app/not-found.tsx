import Link from "next/link";
import { DEFAULT_LOCALE } from "@/constants/lang";

/**
 * Reached only for paths outside the locale segment (the middleware
 * matcher never rewrote them). Self-contained because the root layout is
 * a pass-through and no fonts or providers are mounted here.
 */
export default function RootNotFound() {
  return (
    <html lang={DEFAULT_LOCALE}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#08090b",
          color: "#edebe5",
          fontFamily:
            "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "34rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.7rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#5c5e64",
            }}
          >
            error 404
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.035em",
              fontWeight: 500,
            }}
          >
            This route was never deployed.
          </h1>
          <p
            style={{
              margin: "1.5rem 0 2.5rem",
              lineHeight: 1.7,
              color: "#8e9095",
              fontSize: "0.9rem",
            }}
          >
            The page you asked for does not exist.
          </p>
          <Link
            href={`/${DEFAULT_LOCALE}`}
            style={{
              display: "inline-block",
              padding: "0.75rem 1.5rem",
              borderRadius: "999px",
              background: "#ff5a1f",
              color: "#0a0a0a",
              textDecoration: "none",
              fontSize: "0.75rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Back to index
          </Link>
        </div>
      </body>
    </html>
  );
}
