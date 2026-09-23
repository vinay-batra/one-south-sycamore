import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ADDRESS_STREET, PHONE_DISPLAY, SITE_TAGLINE } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "V Flowers, florist in Newtown, Pennsylvania";

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
          <svg width="56" height="56" viewBox="0 0 32 32" fill="none">
            <path
              d="M7 6.5L16 25.5L25 6.5"
              stroke="#2e4636"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21.2 14.5c2.6.5 4.6-.6 5.6-3.2-2.7-.7-4.7.3-5.6 3.2z"
              fill="#2e4636"
            />
          </svg>
          <div style={{ fontSize: 58, color: "#1b211c", letterSpacing: "-0.02em" }}>
            V Flowers
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 86,
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
