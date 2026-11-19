import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, Camera } from "lucide-react";
import type { EventDetail } from "@/data/events";
import { defaultAccent, eventAccents, eventIcons } from "@/lib/event-visuals";

export function EventCard({ event }: { event: EventDetail }) {
  const Icon = eventIcons[event.slug] ?? Camera;
  const accent = eventAccents[event.slug] ?? defaultAccent;
  const teamLabel =
    event.teamSize.max === 1 ? "Solo" : `Team of ${event.teamSize.max}`;

  return (
    <Link
      href={`/events/${event.slug}`}
      data-enter="reveal"
      className="event-card group flex flex-col gap-5 p-7"
      style={{ "--accent": accent } as CSSProperties}
    >
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
        <span className="text-xs font-medium tracking-wide text-[var(--color-muted-foreground)]">
          {teamLabel}
        </span>
        <span className="event-cta">
          Register
          <span className="event-arrow">
            <ArrowRight size={14} aria-hidden />
          </span>
        </span>
      </div>
    </Link>
  );
}
