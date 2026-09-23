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
          <path
            d="M7 6.5L16 25.5L25 6.5"
            stroke="#2e4636"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.2 14.5c2.6.5 4.6-.6 5.6-3.2-2.7-.7-4.7.3-5.6 3.2z"
            fill="#2e4636"
          />
        </svg>
      </div>
    ),
    size,
  );
}
