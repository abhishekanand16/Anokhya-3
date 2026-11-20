import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Camera, Trophy, Users } from "lucide-react";
import { events, getEventBySlug } from "@/data/events";
import { eventIcons } from "@/lib/event-visuals";
import { RegisterGate } from "@/components/register-gate";
import { SlotsBadge } from "@/components/slots-badge";

const accents: Record<string, string> = {
  "picture-to-prompt": "#6cc3d5",
  bgmi: "#e0a458",
  "treasure-hunt": "#d9b95b",
  "radiant-clash": "#e0707a",
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: event.name,
    description: event.eventType,
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const Icon = eventIcons[event.slug] ?? Camera;
  const accent = accents[event.slug] ?? "#e8a255";
  const teamLabel = event.teamSize.max === 1 ? "Solo participation" : `Teams of ${event.teamSize.max}`;

  const details: { label: string; value: string }[] = [
    { label: "Format", value: event.format },
    ...(event.task ? [{ label: "Task", value: event.task }] : []),
    ...(event.rules ? [{ label: "Rules", value: event.rules }] : []),
    ...(event.judging ? [{ label: "Judging criteria", value: event.judging }] : []),
  ];

  return (
    <section className="section py-14 sm:py-20" style={{ "--accent": accent } as CSSProperties}>
      <Link
        href="/#events"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={16} aria-hidden />
        All events
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <div className="reg-hero-icon">
            <Icon size={26} strokeWidth={1.6} aria-hidden />
          </div>

          <p className="reg-kicker mt-6">{event.category}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{event.name}</h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-muted-foreground)]">{event.eventType}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="reg-chip">
              <Users size={14} aria-hidden />
              {teamLabel}
            </span>
            <span className="reg-chip">
              <Trophy size={14} aria-hidden />
              Prize pool {event.prizePool}
            </span>
            {event.capacityNote && <span className="reg-chip reg-chip-muted">{event.capacityNote}</span>}
            <SlotsBadge slug={event.slug} variant="chip" />
          </div>

          <div className="mt-8 space-y-3">
            {details.map((detail) => (
              <div key={detail.label} className="reg-info">
                <p className="reg-info-label">{detail.label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-foreground)]/90">{detail.value}</p>
              </div>
            ))}
          </div>
        </div>

        <RegisterGate event={event} />
      </div>
    </section>
  );
}