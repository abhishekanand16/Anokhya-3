import { Camera, Crosshair, Gamepad2, ImageIcon, MapPinned, ScanEye, type LucideIcon } from "lucide-react";
import type { EventDetail } from "@/data/events";

export const eventIcons: Record<string, LucideIcon> = {
  "picture-to-prompt": ImageIcon,
  "ai-or-a-lie": ScanEye,
  bgmi: Gamepad2,
  "radiant-clash": Crosshair,
  "treasure-hunt": MapPinned,
  "capture-x": Camera,
};

export const categoryColor: Record<EventDetail["category"], string> = {
  AI: "var(--color-ai)",
  Gaming: "var(--color-gaming)",
  Outdoor: "var(--color-outdoor)",
  Creative: "var(--color-creative)",
};

/** Soft, muted accent per event so cards feel distinct without being loud. */
export const eventAccents: Record<string, string> = {
  "picture-to-prompt": "#6cc3d5",
  bgmi: "#e0a458",
  "treasure-hunt": "#d9b95b",
  "radiant-clash": "#e0707a",
};

export const defaultAccent = "#e8a255";
