import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { LogoMark } from "@/components/logo";
import { ADMIN_COOKIE, sessionTokenValid } from "@/lib/admin-auth";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/board", label: "The Board" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/messages", label: "Messages" },
];

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The gate for the whole admin area. Checked here rather than in a proxy
  // so the HMAC verification runs on the Node runtime.
  const store = await cookies();
  if (!sessionTokenValid(store.get(ADMIN_COOKIE)?.value)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-paper-warm">
      <header className="border-t-[3px] border-ink border-b border-ink/15 bg-paper">
        <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <LogoMark className="h-5 w-5 text-forest" />
            <span className="font-display text-lg">Shop admin</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/" className="text-sm text-ink-soft hover:text-ink">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="text-sm text-ink-soft hover:text-ink">
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1000px] gap-6 overflow-x-auto px-6">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className="-mb-px whitespace-nowrap border-b-2 border-transparent py-3 text-sm text-ink-soft hover:border-moss hover:text-ink"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1000px] px-6 py-10">{children}</main>
    </div>
  );
}
