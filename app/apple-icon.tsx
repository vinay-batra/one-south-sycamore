import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the street blade, on the shop's paper colour. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fcfbf9",
        }}
      >
        <svg width="140" height="140" viewBox="0 0 40 40" fill="none">
          <rect x="1" y="10" width="38" height="20" rx="2.5" fill="#2e4636" />
          <rect x="3.4" y="12.4" width="33.2" height="15.2" rx="1.4" stroke="#fcfbf9" strokeWidth="1.1" opacity="0.55" />
          <path d="M14.6 16.1h2.9v9" stroke="#fcfbf9" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.1 25.1h6.6" stroke="#fcfbf9" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M26.4 25.4V15.1" stroke="#fcfbf9" strokeWidth="2" strokeLinecap="round" />
          <path d="M26.4 19c2.6-.1 4.2-1.5 4.5-4-2.6.1-4.2 1.5-4.5 4z" fill="#fcfbf9" />
        </svg>
      </div>
    ),
    size,
  );
}
