import { site } from "@/data/site";

export function AboutSection() {
  return (
    <section className="section py-20 sm:py-28">
      <div data-enter="reveal" className="grid gap-10 sm:grid-cols-3 sm:items-start">
        <div>
          <p className="eyebrow mb-3">About the fest</p>
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Four events. One day. Zero limits.
          </h2>
        </div>

        <p className="text-balance text-lg leading-relaxed text-[var(--color-muted-foreground)] sm:col-span-2">
         Get ready to showcase your skills and creativity at {site.name}, the prestigious tech fest organized by the {site.organizer.department} Department of {site.organizer.college} Featuring four exciting technical events open to group participation, it's your chance to compete, collaborate, tackle challenges, and win exciting cash prizes. Gather your team and be part of an unforgettable tech experience!
        </p>
      </div>

      <dl className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {[
          { label: "Events", value: "4" },
          { label: "Prize pool", value: site.prizePool },
          { label: "Expected footfall", value: site.expectedFootfall },
          { label: "Venue", value: site.venue.name },
        ].map((stat) => (
          <div key={stat.label} data-enter="reveal" className="glass-panel p-5">
            <dd className="text-2xl font-semibold text-[var(--color-foreground)] sm:text-3xl">{stat.value}</dd>
            <dt className="mt-1 text-sm text-[var(--color-muted-foreground)]">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
