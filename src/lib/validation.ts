import { z } from "zod";
import type { EventDetail } from "@/data/events";

const phoneRegex = /^[0-9+\-\s()]{7,16}$/;

// Values are normalised here so duplicate checks in the database are reliable:
// emails are lower-cased, USNs are upper-cased.
const participantSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  usn: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Enter your USN")
    .max(20)
    .regex(/^[A-Z0-9]+$/, "USN can only contain letters and numbers"),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid phone number"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email ID")),
  department: z.string().trim().min(2, "Enter your department").max(80),
  yearSem: z.string().trim().min(1, "Enter your year and semester").max(40),
});

export type Participant = z.infer<typeof participantSchema>;

/**
 * Builds the registration schema for one event, sized to its team rules.
 * `teamSize.min`..`teamSize.max` is the allowed team size including the leader.
 */
export function buildRegistrationSchema(event: EventDetail) {
  const minMembers = event.teamSize.min - 1;
  const maxMembers = event.teamSize.max - 1;

  return z
    .object({
      eventSlug: z.literal(event.slug),
      teamName: maxMembers > 0 ? z.string().trim().min(2, "Enter a team name").max(80) : z.string().optional(),
      leader: participantSchema,
      members: z.array(participantSchema).min(minMembers).max(maxMembers),
    })
    .superRefine((data, ctx) => {
      // The same person can't appear twice in one team.
      const people = [data.leader, ...data.members];
      const seenEmails = new Set<string>();
      const seenUsns = new Set<string>();

      people.forEach((person, index) => {
        const prefix = index === 0 ? "leader" : `members.${index - 1}`;
        const path = prefix.split(".").map((part) => (/^\d+$/.test(part) ? Number(part) : part));

        if (seenEmails.has(person.email)) {
          ctx.addIssue({
            code: "custom",
            message: "This email is used twice in your team",
            path: [...path, "email"],
          });
        }
        if (seenUsns.has(person.usn)) {
          ctx.addIssue({
            code: "custom",
            message: "This USN is used twice in your team",
            path: [...path, "usn"],
          });
        }
        seenEmails.add(person.email);
        seenUsns.add(person.usn);
      });
    });
}

export type RegistrationInput = z.infer<ReturnType<typeof buildRegistrationSchema>>;
