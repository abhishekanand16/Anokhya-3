"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { FormEvent, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Crown, Users } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { getEventTerms } from "@/data/terms";
import { registerForEvent } from "@/app/events/[slug]/actions";
import { EventTermsBody } from "@/components/event-terms";
import { initialRegisterState } from "@/lib/register-state";
import { termsAccepted } from "@/lib/terms-gate";
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
  const [agreed, setAgreed] = useState(false);
  const extraMembers = event.teamSize.max - 1;
  const requiredExtraMembers = event.teamSize.min - 1;
  const isTeamEvent = extraMembers > 0;
  const terms = getEventTerms(event.slug);

  const updateProgress = () => {
    const form = formRef.current;
    if (!form) return;
    const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input[required]"));
    const filled = inputs.filter((input) => (input.type === "checkbox" ? input.checked : input.value.trim() !== "")).length;
    setProgress(inputs.length ? Math.round((filled / inputs.length) * 100) : 0);
  };

  // After a failed submit, jump to the first field with an error.
  useEffect(() => {
    if (state.status !== "error" || !state.fieldErrors) return;
    formRef.current?.querySelector(".field-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [state]);

  // Submit by hand instead of `<form action={...}>`. React 19 clears every field after a
  // form action finishes — even when the server returned errors — which would wipe a
  // 4-5 person team's details. Calling the action ourselves keeps whatever was typed.
  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const formData = new FormData(submitEvent.currentTarget);
    if (terms && !termsAccepted(formData.get("agreeTerms"))) return;
    startTransition(() => {
      formAction(formData);
    });
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

      <form ref={formRef} onSubmit={handleSubmit} onChange={updateProgress} className="mt-6 space-y-4" noValidate>
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
            heading={
              i >= requiredExtraMembers
                ? `Team member ${i + 2} (optional)`
                : `Team member ${i + 2}`
            }
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

        {terms && (
          <div className="reg-section">
            <details className="reg-terms-details">
              <summary>
                Terms and conditions
                <ChevronDown size={16} aria-hidden />
              </summary>
              <div className="reg-terms">
                <EventTermsBody terms={terms} />
              </div>
            </details>
            <label className="reg-agree">
              <input
                name="agreeTerms"
                type="checkbox"
                value="on"
                required
                checked={agreed}
                onChange={(change) => setAgreed(change.target.checked)}
              />
              <span>
                I agree to the{" "}
                <Link href={`/events/${event.slug}/terms`} className="reg-agree-link">
                  terms and conditions
                </Link>
              </span>
            </label>
            {state.fieldErrors?.agreeTerms && <p className="field-error">{state.fieldErrors.agreeTerms}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || (Boolean(terms) && !agreed)}
          className={cn("reg-submit", isPending && "is-pending")}
        >
          {isPending ? "Submitting..." : "Submit registration"}
          {!isPending && <ArrowRight size={16} aria-hidden />}
        </button>
      </form>
    </div>
  );
}