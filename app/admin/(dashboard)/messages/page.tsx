import { PHONE_DISPLAY } from "@/lib/site";
import { createServiceClient, supabaseConfigured } from "@/lib/supabase";

type Message = {
  id: string;
  name: string;
  phone: string;
  occasion: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

export const dynamic = "force-dynamic";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  let messages: Message[] = [];
  let loadError: string | null = null;

  if (supabaseConfigured) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) loadError = error.message;
    else messages = (data ?? []) as Message[];
  }

  return (
    <>
      <h1 className="font-display text-3xl leading-tight">Messages</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        Notes sent through the website&rsquo;s form. Anything urgent still comes to
        your phone at {PHONE_DISPLAY}. This is for the longer ones.
      </p>

      {!supabaseConfigured ? (
        <div className="mt-8 border border-blush bg-blush/40 p-5 text-sm leading-relaxed text-ink-soft">
          Messages start showing up here once the database is connected.
        </div>
      ) : loadError ? (
        <div className="mt-8 border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Couldn&rsquo;t load messages: {loadError}
        </div>
      ) : messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No messages yet.</p>
      ) : (
        <ul className="mt-10 grid gap-4">
          {messages.map((item) => (
            <li key={item.id} className="border border-ink/15 bg-paper p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-medium">{item.name}</p>
                <time className="text-xs text-muted" dateTime={item.created_at}>
                  {new Date(item.created_at).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </time>
              </div>
              <p className="mt-1 text-sm text-ink-soft">
                <a href={`tel:${item.phone}`} className="text-forest underline underline-offset-2">
                  {item.phone}
                </a>
                {item.occasion ? ` · ${item.occasion}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">
                {item.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
