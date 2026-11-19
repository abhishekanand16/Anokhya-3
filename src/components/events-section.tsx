import { events } from "@/data/events";
import { EventCard } from "@/components/event-card";

export function EventsSection() {
  return (
    <section id="events" className="section py-20 sm:py-28">
      <div data-enter="reveal" className="mb-10 max-w-xl">
        <p className="eyebrow mb-3">Events</p>
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pick an event, lock your spot
        </h2>
        <p className="mt-3 text-[var(--color-muted-foreground)]">
          Each event has its own format and team size. Tap one to see full rules and register.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {events.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </section>
  );
}
