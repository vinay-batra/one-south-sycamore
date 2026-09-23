import { SiteFooter } from "@/components/site-footer";
import { CallStrip, Masthead } from "@/components/masthead";

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Masthead />
      <main id="main">{children}</main>
      <SiteFooter />
      <CallStrip />
    </>
  );
}
