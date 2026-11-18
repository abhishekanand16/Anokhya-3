
import {
  dayEndMinutes,
  dayStartMinutes,
  scheduleItems,
  type ScheduleItem,
} from "@/data/schedule";

import { site } from "@/data/site";
import { formatMinutes, cn } from "@/lib/utils";

const laneColor: Record<ScheduleItem["lane"], string> = {
  general: "var(--color-muted-foreground)",
  ai: "var(--color-ai)",
  gaming: "var(--color-gaming)",
  outdoor: "var(--color-outdoor)",
  creative: "var(--color-creative)",
};

const totalMinutes = dayEndMinutes - dayStartMinutes;

const hourTicks = Array.from(
  { length: (dayEndMinutes - dayStartMinutes) / 60 + 1 },
  (_, i) => dayStartMinutes + i * 60,
);

export function ScheduleSection() {
  return (
    <section id="schedule" className="section py-20 sm:py-28">
      <div
        data-enter="reveal"
        className="mb-10 flex flex-wrap items-end justify-between gap-4"
      >
        <div className="max-w-xl">
          <p className="eyebrow mb-3">Schedule</p>

          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Day-of timeline
          </h2>

          <p className="mt-3 text-[var(--color-muted-foreground)]">
            {site.date.display} · {site.venue.name}
          </p>
        </div>

        <span className="chip">
          Tentative — final timings announced closer to the event
        </span>
      </div>

      <div
        data-enter="reveal"
        className="glass-panel overflow-x-auto p-4 sm:p-6"
      >
        <div className="min-w-[760px]">
          {/* Timeline hour labels */}
          <div className="flex pl-44">
            {hourTicks.map((minute) => (
              <div
                key={minute}
                className="flex-1 text-center text-xs font-medium text-[var(--color-muted-foreground)] first:text-left last:text-right"
              >
                {formatMinutes(minute)}
              </div>
            ))}
          </div>

          {/* Event rows */}
          <div className="mt-3 flex flex-col gap-2">
            {scheduleItems.map((item) => {
              const leftPct =
                ((item.start - dayStartMinutes) / totalMinutes) * 100;

              const widthPct =
                ((item.end - item.start) / totalMinutes) * 100;

              const color = laneColor[item.lane];

              return (
                <div key={item.slug} className="flex items-center">
                  {/* Event name */}
                  <div className="w-44 shrink-0 pr-3 text-sm font-medium text-[var(--color-foreground)]">
                    {item.label}
                  </div>

                  {/* Timeline bar */}
                  <div
                    className="relative h-11 flex-1 rounded-lg"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, var(--color-border) 0 1px, transparent 1px calc(100% / 9))",
                    }}
                  >
                    <div
                      className="absolute inset-y-1.5 flex items-center overflow-hidden rounded-md px-3 text-xs font-semibold whitespace-nowrap"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: `color-mix(in srgb, ${color} 22%, transparent)`,
                        color,
                        border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`,
                      }}
                    >
                      <span className={cn(widthPct < 14 && "hidden sm:inline")}>
                        {formatMinutes(item.start)} – {formatMinutes(item.end)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
