import { site } from "@/data/site";

export type TermsSection = {
  heading: string;
  body: string[];
};

export type EventTerms = {
  slug: string;
  title: string;
  preamble: string;
  sections: TermsSection[];
  closing: string;
};

const department = `${site.organizer.department}, ${site.organizer.college}`;

function opening(eventName: string): string {
  return `We, the ${department}, issue these terms for ${eventName} at ${site.name}. They bind every person who registers or competes. Submitting a registration is agreement to these terms in full.`;
}

const closing =
  "Anything and everything concerning this event, including how these terms are read, who may compete, how a result is decided, and whether a team is disqualified, is subject to the organizers' final decision and discretion. That decision is final and binding.";

export const eventTerms: EventTerms[] = [
  {
    slug: "treasure-hunt",
    title: "Treasure Hunt",
    preamble: opening("Treasure Hunt"),
    sections: [
      {
        heading: "1. Event",
        body: [
          "The hunt is an offline, campus-wide event for 16 teams. It runs for 3 hours and has 4 rounds, including the final. Teams are eliminated as follows: 16, then 8, then 4, then 2, then 1 winner.",
          "The hunt stays inside the areas the organizers designate. Each team receives a starting clue.",
        ],
      },
      {
        heading: "2. Rounds",
        body: [
          "Round 1. The 16 teams are divided into 8 pairs. Each pair receives the same set of clues. The team that reaches the checkpoint first and completes the challenge correctly qualifies.",
          "Round 2. The 8 qualified teams compete in 4 pairs, with a new set of clues and challenges. The first team in each pair to complete the challenge advances.",
          "Round 3. The remaining 4 teams compete in 2 pairs. The winner of each pair qualifies for the final.",
          "Round 4. The last 2 teams compete. The team that discovers the final treasure first is the winner.",
          "Each round has its own clues, riddles, puzzles, or mini-tasks. A team must solve the clue and complete the checkpoint challenge to receive the next clue. Checkpoints must be taken in the order given. Skipping a checkpoint, or going straight to the final destination, is prohibited. Only a team that qualifies in a round may continue.",
        ],
      },
      {
        heading: "3. Judging",
        body: [
          "Speed. The team that reaches the checkpoint first, after completing the challenge correctly, qualifies.",
          "Accuracy. Clues must be read correctly, and puzzles, riddles, and checkpoint tasks must be completed successfully.",
          "Coordination. Teams are judged on communication, collaboration, logical thinking, and problem-solving.",
          "The winner is the team that completes every round and discovers the final treasure within the allotted time.",
        ],
      },
      {
        heading: "4. Disqualification",
        body: [
          "A team may be disqualified for tampering with, damaging, or removing clues or event materials; for taking a shortcut, skipping a checkpoint, or bypassing a challenge; for following or copying another team's clues; for cheating, taking unfair assistance, or deliberately misleading another team.",
          "A team may also be disqualified for using a mobile phone, an internet search, or any outside help where the organizers have prohibited it; for entering a restricted area or leaving the hunt area without permission; for misconduct or disrespect toward organizers, volunteers, or other participants; or for failing to follow a coordinator's instructions.",
        ],
      },
      {
        heading: "5. Time and conduct",
        body: [
          "The event must be completed within 3 hours. Every team reports to the starting point before the hunt begins. A team stays together for the whole hunt. Splitting up to search for clues is not permitted.",
          "Teams must not disturb ordinary campus activity or damage college property. Participants follow the event coordinators and the volunteers at each checkpoint.",
          "If two teams arrive together, or a result is tied, the organizers decide from task accuracy and completion time.",
          "If no team discovers the final treasure within 3 hours, the organizers name the winner from the highest round completed and the recorded times.",
          "The organizers may change the procedure if necessary.",
        ],
      },
    ],
    closing,
  },
  {
    slug: "picture-to-prompt",
    title: "Picture to Prompt",
    preamble: opening("Picture to Prompt"),
    sections: [
      {
        heading: "1. The round",
        body: [
          "Each team is shown a picture and writes a prompt that describes that picture. The prompt describes the picture only. Teams are fixed at two people for the round. A member may not be swapped for someone else once the round has begun.",
        ],
      },
      {
        heading: "2. Cheating",
        body: [
          "The following are prohibited: using a phone, an AI tool, a search, or any device while writing the prompt; looking at or copying another team's paper; communicating with another team; taking help from anyone outside the team, including friends, the audience, or volunteers; and photographing or screenshotting the picture to use it outside the event.",
        ],
      },
      {
        heading: "3. The prompt",
        body: [
          "The prompt must stay within the word limit and the time limit for the round. A team that goes over a limit is penalised on its score first. Disqualification is reserved for a repeated or serious breach.",
          "The prompt is written only on the official sheet. It may not be changed after it is submitted.",
          "Hidden instructions are prohibited. That includes text that asks the generator to copy or describe a specific image, and text aimed at the scoring system. The prompt describes the picture and nothing else.",
          "The prompt may not refer to the generator's internals, and it may not use syntax the organizers have not allowed, including seed values or model parameters where those have been banned.",
        ],
      },
      {
        heading: "4. Conduct and fairness",
        body: [
          "A prompt must not contain offensive, abusive, or inappropriate content. A team must not disrupt another team, argue with the judges after a decision, or tamper with the equipment, the submissions, or the score sheets.",
          "A team that has already seen the pictures, or the answer-key prompts, before the event is not eligible.",
        ],
      },
    ],
    closing,
  },
  {
    slug: "bgmi",
    title: "BGMI",
    preamble: opening("BGMI"),
    sections: [
      {
        heading: "1. Devices",
        body: [
          "Only a handheld smartphone, on Android or iOS, may be used. Emulators, iPads, tablets, triggers, controllers, and any external peripheral are prohibited.",
          "A match is restarted only when a server-wide fault affects more than half of the lobby, and only if that fault occurs before the first circle closes or before the first elimination. No other fault restarts a match.",
        ],
      },
      {
        heading: "2. Matches",
        body: [
          "The mode is Classic, Squad, third-person. There are 4 matches: 2 on Erangel, 1 on Rondo, and 1 on Miramar.",
          "Every player downloads Erangel, Rondo, and Miramar before the tournament. A match is not delayed for a player who has not downloaded a map.",
          "The room ID and password are shared 15 minutes before the match. A team joins its assigned slot at least 5 minutes before the start time. Matches start on time. A team that is missing players plays short-handed. There is no delay for a latecomer.",
          "In room chat, spam, abuse, and sharing the room ID or password with anyone outside the room are prohibited and result in an immediate kick or disqualification.",
        ],
      },
      {
        heading: "3. Fair play",
        body: [
          "Cheating is prohibited. That includes hacks, ESP, aimbots, GFX tools, modified config files, and third-party scripts. A player or team caught cheating is disqualified and banned from this tournament.",
          "Teaming with a rival squad is prohibited. That includes sharing loot, avoiding a fight, or feeding a kill. Every team involved is disqualified.",
        ],
      },
    ],
    closing,
  },
  {
    slug: "radiant-clash",
    title: "Valorant",
    preamble: opening("Radiant Clash — Valorant Showdown"),
    sections: [
      {
        heading: "1. Tournament format",
        body: [
          "The tournament has 32 teams and uses single elimination. A team is eliminated as soon as it loses a match. Only the winning team advances.",
          "The bracket runs Round of 32, Round of 16, Quarter-Finals, Semi-Finals, and Grand Finals. A team that reaches the Grand Finals may play at most five matches in total.",
        ],
      },
      {
        heading: "2. Online matches",
        body: [
          "Every match up to and including the Quarter-Finals is played online. Players may compete from home or any suitable location with a stable connection.",
          "Each team is responsible for its own PC, peripherals, and internet. Schedules and prior information are shared with teams in advance.",
          "Opponent details, lobby information, and match instructions are provided no later than 10 minutes before the match begins. Every player must join using the Riot ID registered with the organizers.",
        ],
      },
      {
        heading: "3. Semi-finals and grand finals (offline)",
        body: [
          "Semi-Finals and Grand Finals are held on the college campus. Attendance is mandatory for every player on a qualifying team.",
          "Players bring their own laptops, chargers, and gaming peripherals. The college provides Wi-Fi and charging points. Devices must be fully charged and ready before play begins.",
          "A player or team that fails to report to the venue may be disqualified.",
        ],
      },
      {
        heading: "4. Match timing and technical issues",
        body: [
          "Teams must be ready at the scheduled match time. A grace period of up to 10 minutes applies. A team that does not join within that period forfeits the match; the opponent receives a walkover.",
          "Internet, system, or technical problems must be reported to the organizers at once. Decisions on delays or interruptions are made by the organizers.",
        ],
      },
      {
        heading: "5. Fair play and anti-cheating",
        body: [
          "Hacking, cheating, scripting, bug exploitation, and unauthorized third-party software are prohibited. Matches are monitored by the organizers; suspicious activity may be investigated.",
          "Confirmed cheating results in immediate disqualification and a ban from this tournament. The opposing team is awarded a walkover. The organizers may review recordings and gameplay evidence before deciding.",
        ],
      },
      {
        heading: "6. Conduct, roster, and general rules",
        body: [
          "Players must keep proper sportsmanship. Toxic behaviour, abusive language, harassment, deliberate match disruption, intentional bug or glitch abuse, account sharing, and unauthorized players are not tolerated.",
          "Only registered players may compete; unauthorized substitutions are not allowed. Team details and Riot IDs must be correct at registration. Teams follow the schedule and instructions from the coordinators.",
          "Players must not intentionally delay, abandon, or interfere with matches. Results are reported or confirmed to the organizers after each game. Rule violations may lead to warnings, forfeits, or disqualification.",
          "At the offline venue, participants follow all college rules and instructions from staff.",
          "Disputes are reported to the organizers immediately. The organizers may investigate gameplay, adjust schedules when unavoidable, and settle all disputes. Their decision is final and binding.",
        ],
      },
    ],
    closing,
  },
];

export function getEventTerms(slug: string): EventTerms | undefined {
  return eventTerms.find((terms) => terms.slug === slug);
}
