
export type EventCategory = "AI" | "Gaming" | "Outdoor" | "Creative";

export type EventDetail = {
  slug: string;
  name: string;
  category: EventCategory;
  eventType: string;
  format: string;
  rules?: string;
  judging?: string;
  task?: string;
  /** Exact team size required. 1 means solo. */
  teamSize: { min: number; max: number };
  /** Extra constraint shown alongside team size, e.g. a cap on slots. */
  capacityNote?: string;
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
      "Limited to 15 teams. Registrations are on a first-come, first-served (FCFS) basis.",
    teamSize: { min: 2, max: 2 },
    capacityNote: "Limited to 15 teams (FCFS)",
  },

  {
    slug: "bgmi",
    name: "BGMI",
    category: "Gaming",
    eventType: "Mobile-only BGMI tournament.",
    format:
      "An offline battle royale tournament featuring 16 teams of 4 players competing against each other.",
    rules:
      "Limited to 16 teams. All matches will be conducted offline on the day of the event. Strict fair-play rules apply.",
    teamSize: { min: 4, max: 4 },
    capacityNote: "16 teams — Offline tournament",
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
      "There is no restriction on the number of participating teams. Teams will compete in qualification rounds, with only selected top-performing teams advancing to the next round.",
    teamSize: { min: 4, max: 5 },
  },

  {
    slug: "radiant-clash",
    name: "Radiant Clash — Valorant Showdown",
    category: "Gaming",
    eventType: "PC-based Valorant tournament for competitive gaming enthusiasts.",
    format:
      "32 teams of 5 players compete in online qualification rounds. The top 8 teams will qualify for the offline finals conducted on the day of the event.",
    rules:
      "Limited to 32 teams. Online qualification round dates will be announced soon. The selected teams will advance to the offline finals. Strict fair-play rules apply.",
    teamSize: { min: 5, max: 5 },
    capacityNote: "32 teams — Online qualifiers, offline finals",
  },
];

export function getEventBySlug(slug: string): EventDetail | undefined {
  return events.find((event) => event.slug === slug);
}
