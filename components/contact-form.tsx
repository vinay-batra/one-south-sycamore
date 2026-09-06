"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Vince doesn't use email, so this form doesn't pretend to be an inbox.
 * Submissions land in the shop's admin panel (and ping Vinay), and the
 * copy steers anyone in a hurry to the phone instead.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong.");
      }
      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-sm border hairline bg-paper-warm p-8">
        <h3 className="font-display text-2xl leading-tight">Got it.</h3>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Vince will get back to you. If it&rsquo;s time-sensitive — a funeral, a
          same-day delivery — please call the shop directly so it doesn&rsquo;t wait.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* Bots fill this in; people never see it. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>

      <div className="grid gap-2">
        <label htmlFor="occasion" className="eyebrow">
          Occasion
        </label>
        <select
          id="occasion"
          name="occasion"
          className="rounded-sm border hairline bg-paper px-4 py-3 text-sm outline-none focus:border-moss"
          defaultValue=""
        >
          <option value="" disabled>
            Choose one
          </option>
          {[
            "Everyday arrangement",
            "Custom arrangement",
            "Wedding",
            "Funeral / sympathy",
            "Plants or succulents",
            "Gift basket",
            "Corporate / standing order",
            "Something else",
          ].map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="message" className="eyebrow">
          What are you looking for?
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Who it's for, when you need it, and roughly what you'd like to spend."
          className="rounded-sm border hairline bg-paper px-4 py-3 text-sm leading-relaxed outline-none placeholder:text-muted focus:border-moss"
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-forest px-6 py-3 text-sm text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "sending" ? "Sending…" : "Send to the shop"}
        </button>
        <p className="text-xs text-muted">
          Need an answer today? Call or text — that&rsquo;s always faster.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={name} className="eyebrow">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="rounded-sm border hairline bg-paper px-4 py-3 text-sm outline-none focus:border-moss"
      />
    </div>
  );
}
