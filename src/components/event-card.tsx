"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Camera, Lock } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { defaultAccent, eventAccents, eventIcons } from "@/lib/event-visuals";
import { SlotsBadge, useEventSlot } from "@/components/slots-badge";

export function EventCard({ event }: { event: EventDetail }) {
  const slot = useEventSlot(event.slug);
  const Icon = eventIcons[event.slug] ?? Camera;
  const accent = eventAccents[event.slug] ?? defaultAccent;
  const teamLabel =
    event.teamSize.max === 1 ? "Solo" : `Team of ${event.teamSize.max}`;

  // Full, or closed by the organizers: black the card out and make it unclickable.
  const unavailable = slot !== null && !slot.open;
  const blockedLabel = slot?.slotsLeft === 0 ? "Registrations full" : "Registrations closed";

  const body = (
    <>
      <div className="flex items-center justify-between">
        <div className="event-icon">
          <Icon size={22} strokeWidth={1.6} aria-hidden />
        </div>
        <span className="event-category">{event.category}</span>
      </div>

      <div>
        <h3 className="text-xl font-semibold tracking-tight text-[var(--color-foreground)]">
          {event.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
          {event.eventType}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="flex flex-col gap-0.5">
          <span className="text-xs font-medium tracking-wide text-[var(--color-muted-foreground)]">
            {teamLabel} · Prize pool {event.prizePool}
          </span>
          <SlotsBadge slug={event.slug} />
        </span>
        <span className="event-cta">
          Register
          <span className="event-arrow">
            <ArrowRight size={14} aria-hidden />
          </span>
        </span>
      </div>
    </>
  );

  if (unavailable) {
    return (
      <div
        data-enter="reveal"
        aria-disabled="true"
        className="event-card relative flex cursor-not-allowed flex-col gap-5 p-7"
        // inline transform cancels the hover lift from .event-card:hover
        style={{ "--accent": accent, transform: "none" } as CSSProperties}
      >
        {body}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/85 text-center">
          <Lock size={22} strokeWidth={1.6} className="text-[#f28b82]" aria-hidden />
          <span className="text-sm font-semibold tracking-wide text-[#f28b82]">{blockedLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/events/${event.slug}`}
      data-enter="reveal"
      className="event-card group flex flex-col gap-5 p-7"
      style={{ "--accent": accent } as CSSProperties}
    >
      {body}
    </Link>
  );
}