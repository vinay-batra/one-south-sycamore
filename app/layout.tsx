import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { SHARE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { StructuredData } from "@/components/structured-data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Florist in Newtown, PA`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SHARE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} · Florist in Newtown, PA`,
    // Shared links are how a neighbourhood shop actually spreads, so the
    // card says where it is and what it does, not just the tagline.
    description: SHARE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Florist in Newtown, PA`,
    description: SHARE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables go on <html> so the @theme tokens, which resolve
    // against :root, can see them.
    <html lang="en" className={`no-js ${inter.variable} ${display.variable}`}>
      <head>
        {/* Dropped the moment script runs, so reveals only stay hidden for
            browsers that can actually un-hide them. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
