import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** The V mark as the tab icon, on the shop's paper colour. */
export default function Icon() {
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
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <rect x="2.5" y="8.5" width="27" height="15" rx="2.5" stroke="#2e4636" strokeWidth="1.8" />
          <path d="M13.4 13.2h2.1v5.6" stroke="#2e4636" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.6 18.8h4.4" stroke="#2e4636" strokeWidth="1.9" strokeLinecap="round" />
          <path d="M21.6 21.6V12.6" stroke="#2e4636" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M21.6 15.6c2-.1 3.2-1.1 3.4-2.9-2 .1-3.2 1.1-3.4 2.9z" fill="#2e4636" />
        </svg>
      </div>
    ),
    size,
  );
}
