"use client";

import { useActionState, useRef, useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { ArrowRight, CheckCircle2, Crown, Users } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { registerForEvent } from "@/app/events/[slug]/actions";
import { initialRegisterState } from "@/lib/register-state";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

function Field({
  id,
  label,
  error,
  ...props
}: { id: string; label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      <input id={id} name={id} required className="field-input" {...props} />
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function ParticipantFields({
  prefix,
  heading,
  badge,
  fieldErrors,
}: {
  prefix: string;
  heading: string;
  badge: ReactNode;
  fieldErrors?: Record<string, string>;
}) {
  const error = (field: string) => fieldErrors?.[`${prefix}.${field}`];

  return (
    <fieldset className="reg-section">
      <legend className="reg-legend">
        <span className="reg-legend-inner">
          <span className="reg-badge">{badge}</span>
          {heading}
        </span>
      </legend>

      <div className="reg-grid grid gap-4 sm:grid-cols-2">
        <Field id={`${prefix}.name`} label="Name" error={error("name")} autoComplete="name" placeholder="Full name" />
        <Field id={`${prefix}.usn`} label="USN" error={error("usn")} />
        <Field
          id={`${prefix}.phone`}
          label="Phone number"
          error={error("phone")}
          type="tel"
          autoComplete="tel"
          placeholder="10-digit mobile number"
        />
        <Field
          id={`${prefix}.email`}
          label="Email ID"
          error={error("email")}
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
        />
        <Field id={`${prefix}.department`} label="Department" error={error("department")} />
        <Field id={`${prefix}.yearSem`} label="Year" error={error("yearSem")} />
      </div>
    </fieldset>
  );
}

export function RegisterForm({ event }: { event: EventDetail }) {
  const [state, formAction, isPending] = useActionState(registerForEvent, initialRegisterState);
  const formRef = useRef<HTMLFormElement>(null);
  const [progress, setProgress] = useState(0);
  const extraMembers = event.teamSize.max - 1;
  const isTeamEvent = extraMembers > 0;

  const updateProgress = () => {
    const form = formRef.current;
    if (!form) return;
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input[required]"));
    const filled = inputs.filter((input) => input.value.trim() !== "").length;
    setProgress(inputs.length ? Math.round((filled / inputs.length) * 100) : 0);
  };

  if (state.status === "success") {
    return (
      <div className="reg-shell flex flex-col items-center gap-3 py-14 text-center">
        <div className="reg-hero-icon">
          <CheckCircle2 size={28} strokeWidth={1.6} aria-hidden />
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{state.message}</h3>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          Follow {site.instagramHandle} on Instagram for updates on {event.name}.
        </p>
      </div>
    );
  }

  return (
    <div className="reg-shell">
      <div className="reg-head">
        <div>
          <p className="reg-kicker">Registration</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight">Register for {event.name}</h2>
        </div>
        <span className="reg-percent">{progress}%</span>
      </div>
      <div className="reg-progress" aria-hidden>
        <span style={{ width: `${progress}%` }} />
      </div>

      <form ref={formRef} action={formAction} onChange={updateProgress} className="mt-6 space-y-4" noValidate>
        <input type="hidden" name="eventSlug" value={event.slug} />

        {isTeamEvent && (
          <div className="reg-section">
            <div className="reg-legend">
              <span className="reg-legend-inner">
                <span className="reg-badge">
                  <Users size={14} aria-hidden />
                </span>
                Team name
              </span>
            </div>
            <div className="reg-grid">
              <input
                id="teamName"
                name="teamName"
                required
                className="field-input"
                placeholder="Pick a name for your team"
                aria-label="Team name"
              />
              {state.fieldErrors?.teamName && <p className="field-error">{state.fieldErrors.teamName}</p>}
            </div>
          </div>
        )}

        <ParticipantFields
          prefix="leader"
          heading={isTeamEvent ? "Team leader" : "Participant details"}
          badge={<Crown size={14} aria-hidden />}
          fieldErrors={state.fieldErrors}
        />

        {Array.from({ length: extraMembers }, (_, i) => (
          <ParticipantFields
            key={i}
            prefix={`members.${i}`}
            heading={`Team member ${i + 2}`}
            badge={i + 2}
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

        <button type="submit" disabled={isPending} className={cn("reg-submit", isPending && "is-pending")}>
          {isPending ? "Submitting..." : "Submit registration"}
          {!isPending && <ArrowRight size={16} aria-hidden />}
        </button>
      </form>
    </div>
  );
}
