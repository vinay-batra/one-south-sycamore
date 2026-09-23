import { DEFAULT_BOARD } from "@/lib/content";
import { supabaseConfigured } from "@/lib/supabase";

/**
 * Draft state: renders the board defaults read-only. The editing controls
 * are laid out here so the shape is settled; they get wired to
 * `board_items` once the Supabase project exists.
 */
import type { Metadata } from "next";

export const metadata: Metadata = { title: "The Board" };

export default function AdminBoardPage() {
  return (
    <>
      <h1 className="font-display text-3xl leading-tight">The Board</h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
        These are the numbered options on the site. Keep them loose. The
        description can say what it usually is, not what it always is.
      </p>

      {!supabaseConfigured && (
        <div id="board-locked" className="mt-8 border border-blush bg-blush/40 p-5 text-sm leading-relaxed text-ink-soft">
          Editing turns on once the database is connected. Everything below is
          the current live board.
        </div>
      )}

      <ol className="mt-10 border-t hairline">
        {DEFAULT_BOARD.map((item) => (
          <li
            key={item.number}
            className="flex flex-wrap items-start gap-4 border-b border-ink/15 bg-paper px-5 py-5"
          >
            <span className="font-display text-2xl leading-none text-moss">
              #{item.number}
            </span>
            <div className="min-w-[16rem] flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {item.description}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="board-locked"
                className="border border-ink/15 px-4 py-2 text-xs text-muted aria-disabled:cursor-not-allowed"
              >
                Edit
              </button>
              <button
                type="button"
                aria-disabled="true"
                aria-describedby="board-locked"
                className="border border-ink/15 px-4 py-2 text-xs text-muted aria-disabled:cursor-not-allowed"
              >
                Hide
              </button>
            </div>
          </li>
        ))}
      </ol>

      <button
        type="button"
        aria-disabled="true"
        aria-describedby="board-locked"
        className="mt-8 bg-forest px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.16em] text-paper opacity-50"
      >
        Add an option
      </button>
    </>
  );
}
