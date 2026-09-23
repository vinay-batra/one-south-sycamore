"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/messages", label: "Messages" },
];

/**
 * The admin tabs had no current-page indication at all, visually or
 * programmatically, so there was nothing to tell Vince which section he was
 * looking at.
 */
export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Admin sections"
      className="mx-auto flex max-w-[1000px] gap-6 overflow-x-auto px-6"
    >
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 py-3 text-sm transition-colors ${
              active
                ? "border-forest text-ink"
                : "border-transparent text-ink-soft hover:border-moss hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
