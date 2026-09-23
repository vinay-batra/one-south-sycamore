/**
 * Editorial copy, drafted from Vince's intake answers (Sep 5 2026).
 * Everything here is reviewable with him before launch.
 */

export type Service = {
  slug: string;
  name: string;
  blurb: string;
};

export const SERVICES: Service[] = [
  {
    slug: "everyday",
    name: "Everyday Arrangements",
    blurb:
      "Something for the kitchen table, a birthday, an apology, a Tuesday. Built from whatever came in that morning.",
  },
  {
    slug: "custom",
    name: "Custom Work",
    blurb:
      "Tell Vince the occasion and the person. He'll walk you through the cooler and build it in front of you.",
  },
  {
    slug: "weddings",
    name: "Weddings",
    blurb:
      "Bouquets, ceremony pieces, centerpieces. Planned around the season and what's coming in fresh that week.",
  },
  {
    slug: "sympathy",
    name: "Funerals & Sympathy",
    blurb:
      "Standing sprays, casket pieces, and arrangements for the home. Handled quickly and quietly when timing matters.",
  },
  {
    slug: "plants",
    name: "Plants",
    blurb: "Green plants and blooming plants for the house, the office, or a gift that keeps going.",
  },
  {
    slug: "succulents",
    name: "Succulents",
    blurb: "A deep bench of succulents, from single pots to arranged dish gardens.",
  },
  {
    slug: "gift-baskets",
    name: "Gift Baskets",
    blurb: "Put together on the spot for the occasion you're shopping for.",
  },
  {
    slug: "corporate",
    name: "Corporate",
    blurb:
      "Standing weekly arrangements for lobbies, offices, restaurants, and events. Set up an account and it just shows up.",
  },
];

/**
 * The story as chapters. Sequence is Vince's own, and no dates are invented:
 * the only number he gave was twenty-five years.
 */
export type Chapter = {
  label: string;
  heading: string;
  body: string[];
};

export const STORY_CHAPTERS: Chapter[] = [
  {
    label: "Out of school",
    heading: "He knew one thing for certain.",
    body: [
      "Vince started right out of school, and the only part of the plan he was sure about was that he didn't want to work for anybody.",
      "What he didn't plan on was meeting a guy with an unbelievable flower connection. He started picking up flowers from him. He never stopped.",
    ],
  },
  {
    label: "Brooklyn",
    heading: "The trade, learned from the pavement up.",
    body: [
      "A store in Brooklyn. Stands on the corner. Brooklyn and Manhattan, on the road and on the street, for years, selling flowers to people walking past, which is the fastest way there is to learn what people actually want.",
      "He loved it. That part comes up more than once when he talks about it.",
    ],
  },
  {
    label: "Newtown",
    heading: "Same job, quieter corner.",
    body: [
      "These days the shop sits on the corner of Washington and Sycamore, across from the Lukoil, in the center of town.",
      "The job hasn't really changed. The flowers come in, and Vince figures out what to do with them.",
    ],
  },
];

/** Vince's story, in his voice, from the intake. */
export const STORY_PARAGRAPHS = [
  "Vince started right out of school. He didn't want to work for anybody. That part he knew. What he didn't know was that he'd meet a guy with an unbelievable flower connection, start picking up flowers from him, and never stop.",
  "That was twenty-five years ago. Since then it's been Brooklyn and Manhattan, on the road and on the street: a store in Brooklyn, stands on the corner, learning the trade from the pavement up. He loved it. Every day was a new day, and a new inventory.",
  "These days the shop is on the corner of Washington and Sycamore in Newtown, and the job hasn't really changed. The flowers come in, and Vince figures out what to do with them.",
];

/**
 * The art.
 *
 * Written only from what the photographs actually show: painted canvases
 * and tall panels through the shop, a rack of spray cans behind the
 * counter, and an ART sign standing out front. It deliberately does not
 * say who painted them or that they are for sale, because nobody has told
 * us either of those things yet. Sharpen this once Vince answers.
 */
export const ART_PARAGRAPHS = [
  "There is more than flowers in the building. Canvases lean along the walls and hang from the rafters, spray-painted in heavy reds and pinks, figures and blooms worked over wood and board.",
  "It is not a separate business with its own door. The work sits in among the buckets and the cooler, which is the whole character of the place: a corner shop that fills up with whatever Vince has going on.",
];

/** Where the flowers actually come from, the part most shops don't tell you. */
export const SOURCING_PARAGRAPHS = [
  "The flowers in the cooler have been on a longer trip than most people expect. New Zealand. Japan. South America. Kenya.",
  "They're grown and field-cut where the growing is best, cut fresh, and shipped straight through to get here, so what you're looking at on Sycamore Street was standing in a field on the other side of the world a few days ago.",
];

/**
 * The board. Vince asked for a numbered board like a restaurant's.
 * These are defaults; he can change them from /admin whenever the
 * inventory turns over, which is most days.
 */
export type BoardItem = {
  number: number;
  name: string;
  description: string;
};

export const DEFAULT_BOARD: BoardItem[] = [
  {
    number: 1,
    name: "The Everyday",
    description: "A hand-tied bunch of whatever came in best that morning. Wrapped and ready to go.",
  },
  {
    number: 2,
    name: "The Table",
    description: "A low arrangement in a vase, built to sit in the middle of a table and stay out of the way.",
  },
  {
    number: 3,
    name: "The Occasion",
    description: "Bigger, taller, and built to be noticed. Anniversaries, birthdays, big news.",
  },
  {
    number: 4,
    name: "The Roses",
    description: "Straightforward and classic. Count and color are up to you.",
  },
  {
    number: 5,
    name: "Succulent Dish",
    description: "An arranged dish garden of succulents. Nearly impossible to kill.",
  },
  {
    number: 6,
    name: "Dealer's Choice",
    description:
      "You tell Vince the person and the occasion. He walks the cooler and builds it in front of you. Most people order this one.",
  },
];

/** Photo categories used by the gallery and the admin uploader. */
export const GALLERY_CATEGORIES = [
  "Arrangements",
  "Weddings",
  "Sympathy",
  "Plants",
  "Succulents",
  "Gift Baskets",
  "Art",
  "The Shop",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
