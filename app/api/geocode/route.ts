import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) return NextResponse.json({ error: "No query" }, { status: 400 });

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=geometry&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.candidates?.length > 0) {
      const { lat, lng } = data.candidates[0].geometry.location;
      return NextResponse.json({ lat, lng });
    }
  } catch {}

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
