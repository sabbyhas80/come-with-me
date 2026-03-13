export type Platform = "tiktok" | "instagram";

export interface Place {
  id: string;
  name: string;
  neighborhood: string;
  category: string;
  creator: string;
  platform: Platform;
  saved: boolean;
  rating: number;
  priceLevel: number;
  description: string;
  gradient: string;
}

export interface PlaceList {
  id: string;
  name: string;
  emoji: string;
  placeCount: number;
  gradient: string;
  collaborators: string[];
  isShared: boolean;
}

export interface Challenge {
  id: string;
  brand: string;
  title: string;
  description: string;
  reward: string;
  progress: number;
  total: number;
  color: string;
  badgeEmoji: string;
  daysLeft: number;
}

export const PLACES: Place[] = [
  {
    id: "1",
    name: "Sushi Nakazawa",
    neighborhood: "West Village",
    category: "Restaurants",
    creator: "@mayanyc",
    platform: "tiktok",
    saved: true,
    rating: 4.9,
    priceLevel: 4,
    description: "Omakase by Jiro's protégé. 20-course meal that's worth every penny.",
    gradient: "from-indigo-900 to-purple-900",
  },
  {
    id: "2",
    name: "Raoul's",
    neighborhood: "SoHo",
    category: "Restaurants",
    creator: "@nycfoodtours",
    platform: "instagram",
    saved: false,
    rating: 4.7,
    priceLevel: 3,
    description: "Old-school French bistro. The steak au poivre is legendary.",
    gradient: "from-rose-900 to-pink-900",
  },
  {
    id: "3",
    name: "Blank Street Coffee",
    neighborhood: "Williamsburg",
    category: "Coffee",
    creator: "@morningnyc",
    platform: "tiktok",
    saved: true,
    rating: 4.5,
    priceLevel: 2,
    description: "Matcha drinks and cozy vibes. The pistachio latte is unreal.",
    gradient: "from-green-900 to-emerald-900",
  },
  {
    id: "4",
    name: "The Bar at Bemelmans",
    neighborhood: "Upper East Side",
    category: "Bars",
    creator: "@luxurynyc",
    platform: "instagram",
    saved: false,
    rating: 4.8,
    priceLevel: 4,
    description: "Classic New York glamour. The murals, the jazz, the martinis.",
    gradient: "from-amber-900 to-yellow-900",
  },
  {
    id: "5",
    name: "McNally Jackson",
    neighborhood: "Nolita",
    category: "Shopping",
    creator: "@bookwormnyc",
    platform: "instagram",
    saved: true,
    rating: 4.6,
    priceLevel: 2,
    description: "The best indie bookshop in the city. Great staff picks.",
    gradient: "from-sky-900 to-blue-900",
  },
  {
    id: "6",
    name: "Joe Coffee",
    neighborhood: "West Village",
    category: "Coffee",
    creator: "@coffeecritic",
    platform: "tiktok",
    saved: false,
    rating: 4.4,
    priceLevel: 2,
    description: "Single origin pour overs in a neighborhood gem.",
    gradient: "from-orange-900 to-red-900",
  },
];

export const LISTS: PlaceList[] = [
  {
    id: "1",
    name: "Date Night NYC",
    emoji: "🕯️",
    placeCount: 12,
    gradient: "from-purple-600 to-pink-600",
    collaborators: ["S", "M"],
    isShared: true,
  },
  {
    id: "2",
    name: "Weekend Brunch",
    emoji: "🥂",
    placeCount: 8,
    gradient: "from-amber-500 to-orange-600",
    collaborators: ["S", "J", "K"],
    isShared: true,
  },
  {
    id: "3",
    name: "Tokyo Trip 🇯🇵",
    emoji: "✈️",
    placeCount: 24,
    gradient: "from-red-600 to-rose-700",
    collaborators: ["S", "M", "K"],
    isShared: true,
  },
  {
    id: "4",
    name: "Coffee Run",
    emoji: "☕",
    placeCount: 6,
    gradient: "from-stone-600 to-zinc-700",
    collaborators: ["S", "A"],
    isShared: true,
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: "1",
    brand: "Resy × Come With Me",
    title: "NYCs Best Tables",
    description: "Save 5 Resy-listed restaurants to your map and get priority access to impossible reservations.",
    reward: "🎁 Priority Resy access + $50 dining credit",
    progress: 3,
    total: 5,
    color: "#CAFF33",
    badgeEmoji: "🍽️",
    daysLeft: 4,
  },
  {
    id: "2",
    brand: "Bluestone Lane",
    title: "The Morning Ritual",
    description: "Check in at 3 Bluestone Lane cafés across NYC and discover your new go-to morning spot.",
    reward: "🎁 Free week of flat whites",
    progress: 1,
    total: 3,
    color: "#CAFF33",
    badgeEmoji: "☕",
    daysLeft: 7,
  },
  {
    id: "3",
    brand: "Depop × Come With Me",
    title: "Vintage NYC Trail",
    description: "Save 8 vintage & thrift spots in NYC to unlock exclusive Depop seller perks.",
    reward: "🎁 0% selling fees for 30 days",
    progress: 5,
    total: 8,
    color: "#CAFF33",
    badgeEmoji: "🛍️",
    daysLeft: 10,
  },
];
