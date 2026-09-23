"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/admin/actions";
import { LogoMark } from "@/components/logo";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="inline-flex items-center gap-2">
          <LogoMark className="h-6 w-6 text-forest" />
          <span className="font-display text-xl">One South Sycamore</span>
        </Link>

        <h1 className="mt-8 font-display text-3xl leading-tight">Shop login</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          For updating the board and adding photos.
        </p>

        <form action={formAction} className="mt-8 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="password" className="text-[0.7rem] uppercase tracking-[0.16em] text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="border border-ink/15 bg-paper px-4 py-3 text-sm outline-none focus:border-moss"
            />
          </div>

          {state?.error && (
            <p role="alert" className="text-sm text-red-700">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="bg-forest px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.16em] text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Checking…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}
