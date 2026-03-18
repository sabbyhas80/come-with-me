"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { LISTS, PLACES, TOKYO_PLACES } from "@/lib/mock-data";

const MOCK_LIST_PLACES: Record<string, any[]> = {
  "1": PLACES.filter((p) => ["1","2","3","7","8","9","10","11","12"].includes(p.id)).map(p => ({
    id: p.id, name: p.name, neighborhood: p.neighborhood, category: p.category,
    description: p.description, creator_handle: p.creator, gradient: p.gradient, rating: p.rating,
  })),
  "2": TOKYO_PLACES,
  "3": PLACES.filter((p) => p.category === "Coffee").map(p => ({
    id: p.id, name: p.name, neighborhood: p.neighborhood, category: p.category,
    description: p.description, creator_handle: p.creator, gradient: p.gradient, rating: p.rating,
  })),
  "4": PLACES.filter((p) => ["1","2","10","4","5"].includes(p.id)).map(p => ({
    id: p.id, name: p.name, neighborhood: p.neighborhood, category: p.category,
    description: p.description, creator_handle: p.creator, gradient: p.gradient, rating: p.rating,
  })),
};

function categoryEmoji(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "coffee") return "☕";
  if (cat === "bar" || cat === "bars") return "🍸";
  if (cat === "shopping") return "🛍️";
  return "🍽️";
}

const RECENT_ACTIVITY: Record<string, any[]> = {
  "2": [
    { user: "Alex", action: "added Senso-ji Temple", time: "2 hours ago", source: "Instagram @tokyolife" },
    { user: "Sarah", action: "added Ace Hotel Tokyo", time: "5 hours ago", source: "Instagram @acehotels" },
  ],
};

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const list = LISTS.find((l) => l.id === id);
  const places = MOCK_LIST_PLACES[id] || [];
  const activity = RECENT_ACTIVITY[id] || [];

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white font-bricolage font-bold text-xl">List not found</p>
        <Link href="/app/lists" className="text-purple font-jakarta">← Back to lists</Link>
      </div>
    );
  }

  const isTokyoTrip = id === "2";

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className={`px-5 pt-14 pb-6 bg-gradient-to-br ${list.gradient}`}>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="font-bricolage font-extrabold text-white text-2xl">{list.name}</h1>
        </div>
        <p className="text-white/60 text-sm font-jakarta">
          {places.length} places · {list.collaborators.length} collaborators · Last updated 1h ago
        </p>
        <div className="flex gap-2 mt-4">
          <button className="flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 rounded-full px-4 py-2 text-white font-jakarta font-semibold text-sm">
            🔗 Share
          </button>
          <button className="flex items-center gap-2 bg-lime text-dark rounded-full px-4 py-2 font-jakarta font-semibold text-sm">
            + Add Place
          </button>
        </div>
      </div>

      {/* Collaborators */}
      {list.collaborators.length > 1 && (
        <div className="mx-5 mt-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex">
              {list.collaborators.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-purple flex items-center justify-center text-xs font-bold text-white -ml-1 first:ml-0 border-2 border-black">
                  {c}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white font-jakarta font-semibold text-sm">
                {id === "2" ? "You, Alex, Sarah" : list.collaborators.join(", ")}
              </p>
              <p className="text-white/40 text-xs font-jakarta">Can edit · {list.collaborators.length} collaborators</p>
            </div>
          </div>
          <button className="bg-purple text-white font-jakarta font-semibold text-xs px-4 py-2 rounded-full">
            + Invite
          </button>
        </div>
      )}

      {/* Places */}
      <div className="px-5 mt-4">
        <h2 className="font-bricolage font-bold text-white text-lg mb-3">Places</h2>
        <div className="flex flex-col gap-2">
          {places.map((place: any) => (
            <div key={place.id} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
              <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl ${place.gradient ? `bg-gradient-to-br ${place.gradient}` : "bg-purple/20"}`}>
                {place.emoji || categoryEmoji(place.category ?? "")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                <p className="text-white/40 text-xs font-jakarta">
                  {place.neighborhood}
                  {place.creator && <span className="text-purple"> · {place.creator}</span>}
                  {place.creator_handle && !place.creator && (
                    place.creator_handle.startsWith("Added by")
                      ? <span className="text-purple font-semibold"> · {place.creator_handle}</span>
                      : <span className="text-purple"> · {place.creator_handle}</span>
                  )}
                </p>
              </div>
              <span className="text-xl">{place.saved ? "❤️" : "🤍"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="px-5 mt-6">
          <h2 className="font-bricolage font-bold text-white text-lg mb-3">Recent Activity</h2>
          <div className="flex flex-col gap-2">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {item.user[0]}
                </div>
                <div>
                  <p className="text-white font-jakarta font-semibold text-sm">
                    {item.user} {item.action}
                  </p>
                  <p className="text-white/40 text-xs font-jakarta">{item.time} · from {item.source}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}