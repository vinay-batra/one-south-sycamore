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
      "He loved it, and he did it for years.",
    ],
  },
  {
    label: "Newtown",
    heading: "Same job, quieter corner.",
    body: [
      "After years of stands and corners, what he wanted was somewhere permanent: an actual store, in an actual building, with his name on the door and the same address every morning.",
      "He found it on the corner of Washington and Sycamore, across from the Lukoil, in the center of town.",
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
 * The art. Confirmed at the second visit: Vince paints all of it himself,
 * spray paint on canvas, at a setup behind the shop, and sells it off the
 * walls inside. It is not a separate business. Nothing is priced ahead,
 * same as the flowers.
 */
export const ART_PARAGRAPHS = [
  "The canvases around the shop are Vince's. He spray paints them himself at a setup behind the building, then hangs them out front in among the buckets and the cooler.",
  "It is not a second business with its own door, just one of the things he does. The work is for sale, and like the flowers nothing is priced ahead of time, so ask him about a piece while you are in.",
];

/** Where the flowers actually come from, the part most shops don't tell you. */
export const SOURCING_PARAGRAPHS = [
  "The flowers in the cooler have been on a longer trip than most people expect. New Zealand. Japan. South America. Kenya.",
  "They're grown and field-cut where the growing is best, cut fresh, and shipped straight through to get here, so what you're looking at on Sycamore Street was standing in a field on the other side of the world a few days ago.",
];

/**
 * How an order actually happens.
 *
 * This replaced a numbered, restaurant-style board. Vince did ask for one
 * at the intake, but a fixed list of combinations contradicts the only
 * thing that makes the shop what it is: nothing is made ahead and nothing
 * is priced ahead. Confirm the change with him at the in-person review.
 */
export type OrderStep = {
  label: string;
  heading: string;
  body: string;
};

export const ORDER_STEPS: OrderStep[] = [
  {
    label: "First",
    heading: "Work out the occasion, not the product.",
    body: "Who it is for, when you need it, and roughly what you want to spend. That is the entire brief, and it is all Vince needs.",
  },
  {
    label: "Then",
    heading: "Call, text, or walk in.",
    body: "The phone is quickest. If you come by, you can look through the cooler and see exactly what arrived that morning.",
  },
  {
    label: "After that",
    heading: "He builds it in front of you.",
    body: "Vince pulls the stems with you, suggests what goes with what, and puts the arrangement together while you are standing there.",
  },
  {
    label: "Last",
    heading: "It gets priced once it exists.",
    body: "Never before. Tell him a number you want to stay under and he will work to it. Cash, card, Apple Pay or Venmo.",
  },
];

/**
 * The board. Vince asked for a numbered board like a restaurant's.
 * Kept only so the decision above is reversible; nothing renders it.
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
