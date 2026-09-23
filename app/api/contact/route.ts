import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient, supabaseConfigured } from "@/lib/supabase";
import { PHONE_DISPLAY } from "@/lib/site";

const Submission = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(7).max(40),
  occasion: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(1).max(4000),
  // Honeypot: real people leave it empty. Accepted by the schema so the
  // quiet-drop below is what handles it, rather than a 400 that tells a
  // bot exactly which field gave it away.
  company: z.string().max(200).optional().default(""),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = Submission.safeParse(body);
  if (!parsed.success) {
    // Say which way it failed — "fill this in" is wrong and confusing when
    // someone has written too much, not too little.
    const tooLong = parsed.error.issues.some((issue) => issue.code === "too_big");
    return NextResponse.json(
      {
        error: tooLong
          ? "That message is a little long — please shorten it, or just call the shop."
          : "Please fill in your name, phone, and what you're looking for.",
      },
      { status: 400 },
    );
  }

  const { company, ...submission } = parsed.data;
  // Honeypot tripped — accept quietly so the bot doesn't learn anything.
  if (company) return NextResponse.json({ ok: true });

  if (!supabaseConfigured) {
    // Before the Supabase project exists this route can't store anything.
    // In development that's fine for clicking through the draft; in
    // production it would silently drop a real customer, so it fails loudly.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: `The form isn't available right now — please call the shop at ${PHONE_DISPLAY}.` },
        { status: 503 },
      );
    }
    console.warn("[contact] Supabase not configured; submission not stored:", submission);
    return NextResponse.json({ ok: true, stored: false });
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: submission.name,
    phone: submission.phone,
    occasion: submission.occasion || null,
    message: submission.message,
  });

  if (error) {
    console.error("[contact] insert failed:", error.message);
    return NextResponse.json(
      { error: `Couldn't send that — please call the shop at ${PHONE_DISPLAY}.` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, stored: true });
}
