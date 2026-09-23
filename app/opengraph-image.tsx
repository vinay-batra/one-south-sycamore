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
          <svg width="64" height="64" viewBox="0 0 32 32" fill="none">
            <rect x="2.5" y="8.5" width="27" height="15" rx="2.5" stroke="#2e4636" strokeWidth="1.6" />
            <rect x="5" y="11" width="22" height="10" rx="1.2" stroke="#2e4636" strokeWidth="0.9" opacity="0.45" />
            <path d="M13.4 13.2h2.1v5.6" stroke="#2e4636" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.6 18.8h4.4" stroke="#2e4636" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M21.6 21.6V12.6" stroke="#2e4636" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M21.6 15.6c2-.1 3.2-1.1 3.4-2.9-2 .1-3.2 1.1-3.4 2.9z" fill="#2e4636" />
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
