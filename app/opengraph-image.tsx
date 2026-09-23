import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ADDRESS_STREET, PHONE_DISPLAY, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "One South Sycamore, florist in Newtown, Pennsylvania";

/** Shared-link card: the masthead, essentially, at poster size. */
export default async function OpengraphImage() {
  // Satori ships no serif, so the shop's actual display face is bundled.
  const display = await readFile(
    join(process.cwd(), "assets", "InstrumentSerif-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fcfbf9",
          padding: "64px 72px",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="78" height="78" viewBox="0 0 40 40" fill="none">
          <rect x="1" y="10" width="38" height="20" rx="2.5" fill="#2e4636" />
          <rect x="3.4" y="12.4" width="33.2" height="15.2" rx="1.4" stroke="#fcfbf9" strokeWidth="1.1" opacity="0.55" />
          <path d="M14.6 16.1h2.9v9" stroke="#fcfbf9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.1 25.1h6.6" stroke="#fcfbf9" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M26.4 25.4V15.1" stroke="#fcfbf9" strokeWidth="2" strokeLinecap="round" />
          <path d="M26.4 19c2.6-.1 4.2-1.5 4.5-4-2.6.1-4.2 1.5-4.5 4z" fill="#fcfbf9" />
          </svg>
          <div style={{ fontSize: 50, color: "#1b211c", letterSpacing: "-0.02em" }}>
            One South Sycamore
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 80,
            lineHeight: 1.02,
            color: "#1b211c",
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          {SITE_TAGLINE}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid #1b211c",
            paddingTop: 24,
            fontSize: 26,
            color: "#4b5449",
            fontFamily: "system-ui",
          }}
        >
          <div style={{ display: "flex" }}>{ADDRESS_STREET}, Newtown, PA</div>
          <div style={{ display: "flex", color: "#2e4636" }}>{PHONE_DISPLAY}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: display,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
