"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { registerForEvent } from "@/app/events/[slug]/actions";
import { initialRegisterState } from "@/lib/register-state";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function ParticipantFields({
  prefix,
  heading,
  fieldErrors,
}: {
  prefix: string;
  heading: string;
  fieldErrors?: Record<string, string>;
}) {
  const error = (field: string) => fieldErrors?.[`${prefix}.${field}`];

  return (
    <fieldset className="glass-panel space-y-4 p-5">
      <legend className="mb-1 text-sm font-semibold text-[var(--color-foreground)]">{heading}</legend>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor={`${prefix}.name`}>
            Name
          </label>
          <input id={`${prefix}.name`} name={`${prefix}.name`} required className="field-input" autoComplete="name" />
          {error("name") && <p className="field-error">{error("name")}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor={`${prefix}.usn`}>
            USN
          </label>
          <input id={`${prefix}.usn`} name={`${prefix}.usn`} required className="field-input" />
          {error("usn") && <p className="field-error">{error("usn")}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor={`${prefix}.phone`}>
            Phone number
          </label>
          <input
            id={`${prefix}.phone`}
            name={`${prefix}.phone`}
            type="tel"
            required
            className="field-input"
            autoComplete="tel"
          />
          {error("phone") && <p className="field-error">{error("phone")}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor={`${prefix}.email`}>
            Email ID
          </label>
          <input
            id={`${prefix}.email`}
            name={`${prefix}.email`}
            type="email"
            required
            className="field-input"
            autoComplete="email"
          />
          {error("email") && <p className="field-error">{error("email")}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor={`${prefix}.department`}>
            Department
          </label>
          <input id={`${prefix}.department`} name={`${prefix}.department`} required className="field-input" />
          {error("department") && <p className="field-error">{error("department")}</p>}
        </div>

        <div>
          <label className="field-label" htmlFor={`${prefix}.yearSem`}>
            Year
          </label>
          <input id={`${prefix}.yearSem`} name={`${prefix}.yearSem`} required className="field-input" />
          {error("yearSem") && <p className="field-error">{error("yearSem")}</p>}
        </div>
      </div>
    </fieldset>
  );
}

export function RegisterForm({ event }: { event: EventDetail }) {
  const [state, formAction, isPending] = useActionState(registerForEvent, initialRegisterState);
  const extraMembers = event.teamSize.max - 1;
  const isTeamEvent = extraMembers > 0;

  if (state.status === "success") {
    return (
      <div className="glass-panel-raised flex flex-col items-center gap-3 p-10 text-center">
        <CheckCircle2 size={40} className="text-[var(--color-brand)]" aria-hidden />
        <h3 className="text-xl font-semibold">{state.message}</h3>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Follow {site.instagramHandle} on Instagram for updates on {event.name}.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="eventSlug" value={event.slug} />

      {isTeamEvent && (
        <div>
          <label className="field-label" htmlFor="teamName">
            Team name
          </label>
          <input id="teamName" name="teamName" required className="field-input max-w-sm" />
          {state.fieldErrors?.teamName && <p className="field-error">{state.fieldErrors.teamName}</p>}
        </div>
      )}

      <ParticipantFields
        prefix="leader"
        heading={isTeamEvent ? "Team leader" : "Participant details"}
        fieldErrors={state.fieldErrors}
      />

      {Array.from({ length: extraMembers }, (_, i) => (
        <ParticipantFields
          key={i}
          prefix={`members.${i}`}
          heading={`Team member ${i + 2}`}
          fieldErrors={state.fieldErrors}
        />
      ))}

      {state.status === "error" && !state.fieldErrors && (
        <p className="rounded-xl border border-[#f28b82]/30 bg-[#f28b82]/10 px-4 py-3 text-sm text-[#f28b82]">
          {state.message}
        </p>
      )}
      {state.status === "error" && state.fieldErrors && (
        <p className="text-sm text-[#f28b82]">{state.message}</p>
      )}

      <button type="submit" disabled={isPending} className={cn("btn-primary w-full sm:w-auto")}>
        {isPending ? "Submitting…" : "Submit registration"}
      </button>
    </form>
  );
}
