export type EventCategory = "AI" | "Gaming" | "Outdoor" | "Creative";

export type EventDetail = {
  slug: string;
  name: string;
  category: EventCategory;
  eventType: string;
  format: string;
  rules?: string;
  /** Shown on the event page as an extra info card (e.g. match maps). */
  maps?: string;
  judging?: string;
  task?: string;
  /** Exact team size required. 1 means solo. */
  teamSize: { min: number; max: number };
  /** Extra constraint shown alongside team size, e.g. a cap on slots. */
  capacityNote?: string;
  /** Prize pool for this event, display-ready. */
  prizePool: string;
};

/**
 * All 4 Anokhya 3.0 events.
 */
export const events: EventDetail[] = [
  {
    slug: "picture-to-prompt",
    name: "Picture to Prompt",
    category: "AI",
    eventType: "AI-powered image-to-text prompt generation competition.",
    format:
      "Participants are shown an image and must create a prompt that accurately describes or recreates it using AI tools.",
    judging:
      "Based on prompt accuracy, creativity, clarity, and how closely the AI-generated output matches the given image.",
    rules:
      "Limited to 15 teams of 2. Registrations are on a first-come, first-served (FCFS) basis.",
    teamSize: { min: 2, max: 2 },
    capacityNote: "Limited to 15 teams (FCFS)",
    prizePool: "₹3,000",
  },

  {
    slug: "bgmi",
    name: "BGMI",
    category: "Gaming",
    eventType: "Mobile-only BGMI tournament.",
    format:
      "An offline battle royale tournament featuring 16 teams of 4 players competing against each other.",
    rules:
      "Limited to 16 squads of 4 players. All matches will be conducted offline on the day of the event. Strict fair-play rules apply.",
    maps:
      "Four Classic Squad matches (TPP): 2 on Erangel, 1 on Miramar, and 1 on Rondo — Match 1 Erangel, Match 2 Erangel, Match 3 Miramar, Match 4 Rondo. Download Erangel, Miramar, and Rondo before the tournament.",
    teamSize: { min: 4, max: 4 },
    capacityNote: "16 teams — Offline tournament",
    prizePool: "₹6,000",
  },

  {
    slug: "treasure-hunt",
    name: "Treasure Hunt",
    category: "Outdoor",
    eventType: "Campus-wide puzzle and clue-solving hunt.",
    format:
      "Teams participate in multiple qualification rounds, solving puzzles and deciphering clues to uncover a hidden treasure. Only the top-performing teams from each round advance to the subsequent round.",
    task:
      "Follow clues, solve puzzles, and complete challenges to progress through the qualification rounds.",
    judging:
      "Based on problem-solving abilities, strategy, accuracy, and teamwork throughout the qualification rounds.",
    rules:
      "Limited to 16 teams of 4–5 members. Registrations are on a first-come, first-served (FCFS) basis. Teams will compete in qualification rounds, with only selected top-performing teams advancing to the next round.",
    teamSize: { min: 4, max: 5 },
    capacityNote: "Limited to 16 teams (FCFS)",
    prizePool: "₹6,000",
  },

  {
    slug: "radiant-clash",
    name: "Radiant Clash — Valorant Showdown",
    category: "Gaming",
    eventType: "PC-based Valorant tournament for competitive gaming enthusiasts.",
    format:
      "32 teams of 5 players compete in online qualification rounds. The top 4 teams qualify for the offline Semi-Finals and Grand Finals on event day.",
    rules:
      "Limited to 32 teams of 5. Online qualification round dates will be announced soon. The top 4 teams advance to the offline campus finals. Strict fair-play rules apply.",
    teamSize: { min: 5, max: 5 },
    capacityNote: "32 teams — Top 4 offline finals",
    prizePool: "₹6,000",
  },
];

export function getEventBySlug(slug: string): EventDetail | undefined {
  return events.find((event) => event.slug === slug);
}

/** Human-readable team size for chips and event headers. */
export function formatTeamSizeLabel(
  teamSize: EventDetail["teamSize"],
  style: "short" | "page" = "short",
): string {
  if (teamSize.max === 1) {
    return style === "page" ? "Solo participation" : "Solo";
  }
  if (teamSize.min === teamSize.max) {
    const n = teamSize.max;
    return style === "page" ? `Teams of ${n}` : `Team of ${n}`;
  }
  const range = `Teams of ${teamSize.min}–${teamSize.max}`;
  return style === "page" ? range : range.replace("Teams", "Team");
}