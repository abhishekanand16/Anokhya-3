import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

// Always live — never serve a cached slot count.
export const dynamic = "force-dynamic";

type SlotRow = {
  slug: string;
  capacity: number | null;
  registered: number;
  registration_open: boolean;
};

/**
 * GET /api/events/slots
 * Public, read-only availability per event. Handy for "5 slots left" badges.
 * Exposes counts only — no participant data.
 */
export async function GET() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  }

  const { data, error } = await supabase.rpc("event_slots");
  if (error || !data) {
    console.error("event_slots failed:", error);
    return NextResponse.json({ error: "Could not load availability" }, { status: 500 });
  }

  const events = (data as SlotRow[]).map((row) => {
    const slotsLeft = row.capacity === null ? null : Math.max(row.capacity - row.registered, 0);
    return {
      slug: row.slug,
      capacity: row.capacity,
      registered: row.registered,
      slotsLeft,
      open: row.registration_open && (slotsLeft === null || slotsLeft > 0),
    };
  });

  return NextResponse.json({ events }, { headers: { "Cache-Control": "no-store" } });
}
