"use server";

import { getEventBySlug } from "@/data/events";
import { buildRegistrationSchema, type Participant } from "@/lib/validation";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import type { RegisterActionState } from "@/lib/register-state";

/** Shape returned by the `register_team` Postgres function (see supabase/schema.sql). */
type RegisterResult =
  | { status: "ok"; id: string; slots_left: number | null }
  | { status: "full" | "closed" | "unknown_event" | "invalid_team_size" }
  | { status: "duplicate"; field: "email" | "usn"; value: string };

function readParticipant(formData: FormData, prefix: string): Participant {
  return {
    name: String(formData.get(`${prefix}.name`) ?? ""),
    usn: String(formData.get(`${prefix}.usn`) ?? ""),
    phone: String(formData.get(`${prefix}.phone`) ?? ""),
    email: String(formData.get(`${prefix}.email`) ?? ""),
    department: String(formData.get(`${prefix}.department`) ?? ""),
    yearSem: String(formData.get(`${prefix}.yearSem`) ?? ""),
  };
}

function isBlank(participant: Participant): boolean {
  return (Object.values(participant) as string[]).every((value) => value.trim() === "");
}

export async function registerForEvent(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const slug = String(formData.get("eventSlug") ?? "");
  const event = getEventBySlug(slug);

  if (!event) {
    return { status: "error", message: "Unknown event." };
  }

  // The form renders `teamSize.max - 1` member blocks. Members beyond the
  // minimum team size are optional (e.g. Treasure Hunt is 4–5 players), so a
  // completely empty optional block is dropped instead of failing validation.
  const maxMembers = event.teamSize.max - 1;
  const requiredMembers = event.teamSize.min - 1;
  const members: Participant[] = [];
  for (let i = 0; i < maxMembers; i++) {
    const member = readParticipant(formData, `members.${i}`);
    if (i >= requiredMembers && isBlank(member)) continue;
    members.push(member);
  }

  const schema = buildRegistrationSchema(event);
  const parsed = schema.safeParse({
    eventSlug: event.slug,
    teamName: String(formData.get("teamName") ?? ""),
    leader: readParticipant(formData, "leader"),
    members,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = issue.message;
    }
    return { status: "error", message: "Check the highlighted fields.", fieldErrors };
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Registrations aren't open yet — the backend isn't connected. Please check back soon.",
    };
  }

  const { eventSlug, teamName, leader, members: parsedMembers } = parsed.data;

  const { data, error } = await supabase.rpc("register_team", {
    p_event_slug: eventSlug,
    p_team_name: teamName ?? null,
    p_leader: leader,
    p_members: parsedMembers,
  });

  if (error || !data) {
    console.error("register_team failed:", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  const result = data as RegisterResult;

  switch (result.status) {
    case "ok":
      return { status: "success", message: "You're registered! See you at Anokhya 3.0." };

    case "full":
      return {
        status: "error",
        message: `Registrations for ${event.name} are full. Follow our Instagram for updates.`,
      };

    case "closed":
      return { status: "error", message: `Registrations for ${event.name} are closed.` };

    case "duplicate": {
      // Point the error at whichever person in the form owns the clashing value.
      const people = [leader, ...parsedMembers];
      const index = people.findIndex((person) =>
        result.field === "email" ? person.email === result.value : person.usn === result.value,
      );
      const prefix = index <= 0 ? "leader" : `members.${index - 1}`;
      const label = result.field === "email" ? "email" : "USN";
      return {
        status: "error",
        message: `Someone in your team is already registered for this event (${label}).`,
        fieldErrors: { [`${prefix}.${result.field}`]: `This ${label} is already registered for this event` },
      };
    }

    default:
      console.error("register_team returned an unexpected status:", result);
      return { status: "error", message: "Something went wrong. Please try again." };
  }
}
