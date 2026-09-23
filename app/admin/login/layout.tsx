import type { Metadata } from "next";

/**
 * The login page is a client component, so it cannot export metadata of its
 * own. robots.txt disallows /admin, but a disallowed URL with inbound links
 * can still be indexed as a bare result, and the footer links here from
 * every public page.
 */
export const metadata: Metadata = {
  title: "Shop login",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
