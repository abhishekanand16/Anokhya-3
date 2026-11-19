"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Slot = {
  slug: string;
  capacity: number | null;
  registered: number;
  slotsLeft: number | null;
  open: boolean;
};

// One shared request for all badges on a page, reused for a few seconds.
let cached: { at: number; promise: Promise<Slot[]> } | null = null;

function loadSlots(): Promise<Slot[]> {
  if (!cached || Date.now() - cached.at > 15_000) {
    const promise = fetch("/api/events/slots", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("slots unavailable"))))
      .then((data) => data.events as Slot[])
      .catch(() => {
        cached = null;
        return [] as Slot[];
      });
    cached = { at: Date.now(), promise };
  }
  return cached.promise;
}

/** Live availability for one event, or null until loaded / if unavailable. */
export function useEventSlot(slug: string): Slot | null {
  const [slot, setSlot] = useState<Slot | null>(null);

  useEffect(() => {
    let active = true;
    loadSlots().then((slots) => {
      if (active) setSlot(slots.find((s) => s.slug === slug) ?? null);
    });
    return () => {
      active = false;
    };
  }, [slug]);

  return slot;
}

/**
 * Live "X of N spots left" for one event. Renders nothing for events without a
 * capacity (e.g. Treasure Hunt) or if the backend isn't reachable.
 */
export function SlotsBadge({ slug, variant = "text" }: { slug: string; variant?: "text" | "chip" }) {
  const slot = useEventSlot(slug);

  if (!slot) return null;

  const full = slot.slotsLeft === 0;
  const closed = !slot.open && !full;

  // Unlimited events only need a badge once they are closed.
  if (slot.capacity === null && !closed) return null;

  const label = full
    ? "Full"
    : closed
      ? "Registrations closed"
      : `${slot.slotsLeft} of ${slot.capacity} spots left`;

  return (
    <span
      className={cn(
        variant === "chip" ? "reg-chip" : "text-xs font-semibold",
        full || closed ? "text-[#f28b82]" : "text-[var(--accent)]",
      )}
    >
      {label}
    </span>
  );
}
