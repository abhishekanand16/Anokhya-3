"use client";

import { Lock } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { RegisterForm } from "@/components/register-form";
import { useEventSlot } from "@/components/slots-badge";
import { site } from "@/data/site";

/**
 * Shows the registration form, or a "closed" / "full" notice when organizers have
 * closed the event (admin dashboard) or every slot is taken. While availability is
 * loading the form is shown; the database still rejects submissions to a closed or
 * full event, so this is only the friendly front door.
 */
export function RegisterGate({ event }: { event: EventDetail }) {
  const slot = useEventSlot(event.slug);

  if (slot && !slot.open) {
    const full = slot.slotsLeft === 0;

    return (
      <div className="reg-shell flex flex-col items-center gap-3 py-14 text-center">
        <div className="reg-hero-icon">
          <Lock size={26} strokeWidth={1.6} aria-hidden />
        </div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          {full ? "Registrations are full" : "Registrations are closed"}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {full
            ? `All spots for ${event.name} have been taken.`
            : `${event.name} is no longer accepting registrations.`}{" "}
          Follow {site.instagramHandle} on Instagram for updates.
        </p>
      </div>
    );
  }

  return <RegisterForm event={event} />;
}
