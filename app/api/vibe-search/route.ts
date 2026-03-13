import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PLACES_DATA = [
  { id: "1", name: "Sushi Nakazawa", neighborhood: "West Village", category: "Restaurants", description: "Omakase by Jiro's protégé. 20-course meal that's worth every penny.", rating: 4.9 },
  { id: "2", name: "Raoul's", neighborhood: "SoHo", category: "Restaurants", description: "Old-school French bistro. The steak au poivre is legendary.", rating: 4.7 },
  { id: "3", name: "Blank Street Coffee", neighborhood: "Williamsburg", category: "Coffee", description: "Matcha drinks and cozy vibes. The pistachio latte is unreal.", rating: 4.5 },
  { id: "4", name: "The Bar at Bemelmans", neighborhood: "Upper East Side", category: "Bars", description: "Classic New York glamour. The murals, the jazz, the martinis.", rating: 4.8 },
  { id: "5", name: "McNally Jackson", neighborhood: "Nolita", category: "Shopping", description: "The best indie bookshop in the city. Great staff picks.", rating: 4.6 },
  { id: "6", name: "Joe Coffee", neighborhood: "West Village", category: "Coffee", description: "Single origin pour overs in a neighborhood gem.", rating: 4.4 },
];

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      results: [PLACES_DATA[0], PLACES_DATA[2], PLACES_DATA[4]],
    });
  }

  const placesJson = JSON.stringify(PLACES_DATA);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `You are matching a vibe query to saved places. Return the IDs of the top 3 most matching places as a JSON array of strings, e.g. ["1","3","5"]. Return ONLY the JSON array, nothing else.

Vibe query: "${query}"

Places:
${placesJson}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
  let ids: string[] = [];
  try {
    ids = JSON.parse(raw);
  } catch {
    ids = ["1", "2", "3"];
  }

  const results = ids
    .map((id) => PLACES_DATA.find((p) => p.id === id))
    .filter(Boolean);

  return NextResponse.json({ results });
}
