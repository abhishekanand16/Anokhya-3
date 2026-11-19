import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type StoredParticipant = {
  name?: string;
  usn?: string;
  phone?: string;
  email?: string;
  department?: string;
  yearSem?: string;
};

type RegistrationRow = {
  id: string;
  event_slug: string;
  team_name: string | null;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_usn: string;
  leader_department: string;
  leader_year_sem: string;
  members: StoredParticipant[] | null;
  created_at: string;
};

function isAuthorised(request: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** CSV-escape a value, and neutralise spreadsheet formula injection (=, +, -, @). */
function csvCell(value: unknown, { allowLeadingPlus = false } = {}): string {
  let text = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text) && !(allowLeadingPlus && /^\+?[0-9\-\s()]+$/.test(text))) {
    text = `'${text}`;
  }
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * GET /api/admin/registrations?event=<slug>&format=csv|json
 *
 * Organizer export. Requires `Authorization: Bearer <ADMIN_TOKEN>`.
 * CSV is one row per participant (leader + each member), JSON is one object per team.
 * Disabled entirely (404) until ADMIN_TOKEN is set.
 */
export async function GET(request: Request) {
  if (!process.env.ADMIN_TOKEN) {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!isAuthorised(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const eventSlug = searchParams.get("event");
  const format = searchParams.get("format") === "json" ? "json" : "csv";

  let query = supabase.from("registrations").select("*").order("created_at", { ascending: true });
  if (eventSlug) query = query.eq("event_slug", eventSlug);

  const { data, error } = await query;
  if (error) {
    console.error("admin export failed:", error);
    return NextResponse.json({ error: "Could not load registrations" }, { status: 500 });
  }

  const rows = (data ?? []) as RegistrationRow[];

  if (format === "json") {
    return NextResponse.json({ count: rows.length, registrations: rows }, { headers: { "Cache-Control": "no-store" } });
  }

  const header = [
    "registration_id",
    "event",
    "team_name",
    "role",
    "name",
    "usn",
    "phone",
    "email",
    "department",
    "year_sem",
    "registered_at",
  ];
  const lines = [header.join(",")];

  for (const row of rows) {
    const people: { role: string; p: StoredParticipant }[] = [
      {
        role: "Leader",
        p: {
          name: row.leader_name,
          usn: row.leader_usn,
          phone: row.leader_phone,
          email: row.leader_email,
          department: row.leader_department,
          yearSem: row.leader_year_sem,
        },
      },
      ...(row.members ?? []).map((p, i) => ({ role: `Member ${i + 2}`, p })),
    ];

    for (const { role, p } of people) {
      lines.push(
        [
          csvCell(row.id),
          csvCell(row.event_slug),
          csvCell(row.team_name),
          csvCell(role),
          csvCell(p.name),
          csvCell(p.usn),
          csvCell(p.phone, { allowLeadingPlus: true }),
          csvCell(p.email),
          csvCell(p.department),
          csvCell(p.yearSem),
          csvCell(row.created_at),
        ].join(","),
      );
    }
  }

  const filename = `anokhya-registrations${eventSlug ? `-${eventSlug}` : ""}.csv`;
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
