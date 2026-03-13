"use client";

import { useState } from "react";
import { LISTS, PLACES } from "@/lib/mock-data";
import type { PlaceList } from "@/lib/mock-data";

type ItineraryItem = { time: string; place: string; note: string };

function TripPlannerModal({ onClose }: { onClose: () => void }) {
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryItem[] | null>(null);
  const [saved, setSaved] = useState(false);

  async function plan() {
    if (!request.trim() || loading) return;
    setLoading(true);
    setItinerary(null);
    try {
      const res = await fetch("/api/trip-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request }),
      });
      const data = await res.json();
      setItinerary(data.itinerary || []);
    } catch {
      setItinerary([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end" style={{ maxWidth: 430, left: "50%", transform: "translateX(-50%)" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#18181b] rounded-t-3xl border-t border-white/10 w-full max-h-[85vh] flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            <div>
              <p className="font-bricolage font-bold text-white text-sm leading-tight">Plan a Trip with Scout</p>
              <p className="text-white/40 text-[10px] font-jakarta">AI itinerary from your saved places</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Input */}
          {!itinerary && (
            <div className="flex flex-col gap-4">
              <p className="text-white/60 font-jakarta text-sm leading-relaxed">
                Tell Scout what you have in mind and it will build a custom itinerary from your saved spots.
              </p>
              <div className="flex flex-col gap-2">
                {["Saturday afternoon in Brooklyn", "Romantic evening in Manhattan", "Sunday morning coffee crawl"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setRequest(ex)}
                    className="text-left px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 font-jakarta text-xs hover:border-purple/40 hover:text-white/70 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <textarea
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                placeholder='e.g. "Saturday afternoon in Brooklyn"'
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 font-jakarta text-sm focus:outline-none focus:border-purple/60 resize-none"
              />
              <button
                onClick={plan}
                disabled={!request.trim() || loading}
                className="w-full bg-purple text-white font-bricolage font-bold text-base py-3.5 rounded-xl disabled:opacity-40 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    Scout is planning...
                  </>
                ) : (
                  "Build My Itinerary ✨"
                )}
              </button>
            </div>
          )}

          {/* Itinerary result */}
          {itinerary && itinerary.length > 0 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="font-bricolage font-bold text-white text-base">Your Itinerary</p>
                <button onClick={() => { setItinerary(null); setRequest(""); setSaved(false); }} className="text-white/40 font-jakarta text-xs hover:text-white/60">
                  ← Start over
                </button>
              </div>
              <p className="text-white/40 font-jakarta text-xs -mt-2">&ldquo;{request}&rdquo;</p>

              {/* Timeline */}
              <div className="flex flex-col gap-0">
                {itinerary.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-lime mt-1 flex-shrink-0" />
                      {i < itinerary.length - 1 && <div className="w-0.5 flex-1 bg-white/10 my-1" />}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lime text-xs font-jakarta font-bold">{item.time}</span>
                        <span className="font-bricolage font-bold text-white text-sm">{item.place}</span>
                      </div>
                      <p className="text-white/50 font-jakarta text-xs leading-relaxed">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Save as list */}
              <button
                onClick={() => setSaved(true)}
                disabled={saved}
                className={`w-full py-3.5 rounded-xl font-bricolage font-bold text-base transition-all active:scale-95 ${
                  saved ? "bg-lime/20 border border-lime/30 text-lime" : "bg-lime text-dark"
                }`}
              >
                {saved ? "✓ Saved as List!" : "Save as List"}
              </button>
            </div>
          )}

          {itinerary && itinerary.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="text-3xl">😕</span>
              <p className="text-white/50 font-jakarta text-sm text-center">Scout couldn&apos;t build an itinerary. Try a different request.</p>
              <button onClick={() => { setItinerary(null); }} className="text-purple font-jakarta font-semibold text-sm">Try again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CollabAvatars({ names }: { names: string[] }) {
  const colors = ["bg-purple", "bg-pink-500", "bg-emerald-500", "bg-amber-500"];
  return (
    <div className="flex -space-x-2">
      {names.slice(0, 3).map((n, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-full ${colors[i % colors.length]} border-2 border-dark flex items-center justify-center text-[10px] font-bold text-white`}
        >
          {n}
        </div>
      ))}
      {names.length > 3 && (
        <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-dark flex items-center justify-center text-[9px] text-white/60 font-bold">
          +{names.length - 3}
        </div>
      )}
    </div>
  );
}

function ListCard({ list, onClick }: { list: PlaceList; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden hover:border-white/20 transition-colors active:scale-[0.98]"
    >
      {/* Gradient banner */}
      <div className={`h-20 bg-gradient-to-br ${list.gradient} relative flex items-end p-3`}>
        <div className="absolute inset-0 bg-black/20" />
        <span className="text-3xl relative z-10">{list.emoji}</span>
        {list.isShared && (
          <span className="absolute top-2 right-2 text-[10px] font-jakarta font-semibold text-white/80 bg-black/40 backdrop-blur px-2 py-0.5 rounded-full">
            Shared
          </span>
        )}
      </div>
      {/* Info */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-bricolage font-bold text-white text-base">{list.name}</p>
          <p className="text-white/40 text-xs font-jakarta mt-0.5">{list.placeCount} places</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <CollabAvatars names={list.collaborators} />
          {list.isShared && (
            <button className="text-purple text-xs font-jakarta font-semibold">
              + Invite
            </button>
          )}
        </div>
      </div>
    </button>
  );
}

function ListDetail({ list, onBack }: { list: PlaceList; onBack: () => void }) {
  const listPlaces = PLACES.slice(0, Math.min(list.placeCount, PLACES.length));

  return (
    <div>
      {/* Header banner */}
      <div className={`h-48 bg-gradient-to-br ${list.gradient} relative`}>
        <div className="absolute inset-0 bg-black/30" />
        <button
          onClick={onBack}
          className="absolute top-14 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/70 text-sm font-jakarta">{list.emoji}</p>
              <h1 className="font-bricolage font-extrabold text-white text-2xl leading-tight">
                {list.name}
              </h1>
              <p className="text-white/60 text-xs font-jakarta mt-1">
                {list.placeCount} places · Updated 2 days ago
              </p>
            </div>
            <CollabAvatars names={list.collaborators} />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 px-5 py-4">
        <button className="flex-1 bg-purple text-white font-jakarta font-semibold text-sm py-2.5 rounded-xl">
          + Add Place
        </button>
        <button className="flex-1 bg-white/5 border border-white/10 text-white/60 font-jakarta font-semibold text-sm py-2.5 rounded-xl">
          Share List
        </button>
      </div>

      {/* Places */}
      <div className="px-5 flex flex-col gap-2 mb-6">
        <h2 className="font-bricolage font-bold text-white text-base mb-1">Places</h2>
        {listPlaces.map((place) => (
          <div
            key={place.id}
            className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${place.gradient} flex-shrink-0 flex items-center justify-center`}>
              <span className="text-base">
                {place.category === "Restaurants" ? "🍽️" :
                 place.category === "Coffee" ? "☕" :
                 place.category === "Shopping" ? "🛍️" : "🍸"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bricolage font-bold text-white text-sm">{place.name}</p>
              <p className="text-white/40 text-xs font-jakarta">{place.neighborhood} · {place.creator}</p>
            </div>
            <span className="text-lime text-xs font-semibold font-jakarta">★ {place.rating}</span>
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="px-5 mb-6">
        <h2 className="font-bricolage font-bold text-white text-base mb-3">Activity</h2>
        <div className="flex flex-col gap-3">
          {[
            { avatar: "M", name: "Maya", action: "added Sushi Nakazawa", time: "2h ago", color: "bg-pink-500" },
            { avatar: "S", name: "You", action: "saved Joe Coffee", time: "1d ago", color: "bg-purple" },
            { avatar: "K", name: "Kat", action: "invited 2 friends", time: "3d ago", color: "bg-emerald-500" },
          ].map((a) => (
            <div key={a.name + a.time} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full ${a.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                {a.avatar}
              </div>
              <p className="text-white/60 text-sm font-jakarta flex-1">
                <span className="text-white font-semibold">{a.name}</span> {a.action}
              </p>
              <span className="text-white/30 text-xs font-jakarta">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ListsPage() {
  const [selectedList, setSelectedList] = useState<PlaceList | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);

  if (selectedList) {
    return <ListDetail list={selectedList} onBack={() => setSelectedList(null)} />;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bricolage font-extrabold text-3xl text-white">My Lists</h1>
            <p className="text-white/40 font-jakarta text-sm mt-0.5">{LISTS.length} collections</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-purple/20 border border-purple/30 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#7B2FFF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Trip Planner CTA */}
        <button
          onClick={() => setShowPlanner(true)}
          className="mt-4 w-full flex items-center gap-3 bg-gradient-to-r from-purple/20 to-indigo-900/30 border border-purple/30 rounded-2xl px-4 py-3.5 active:scale-[0.98] transition-all"
        >
          <div className="w-9 h-9 rounded-xl bg-purple/30 border border-purple/40 flex items-center justify-center text-lg flex-shrink-0">
            🗺️
          </div>
          <div className="flex-1 text-left">
            <p className="font-bricolage font-bold text-white text-sm leading-tight">Plan a Trip with Scout</p>
            <p className="text-white/40 font-jakarta text-xs mt-0.5">AI itinerary from your saved places</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M9 18l6-6-6-6" stroke="#7B2FFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {showPlanner && <TripPlannerModal onClose={() => setShowPlanner(false)} />}

      {/* Lists grid */}
      <div className="px-5 grid grid-cols-2 gap-3 pb-6">
        {LISTS.map((list) => (
          <ListCard key={list.id} list={list} onClick={() => setSelectedList(list)} />
        ))}
      </div>

      {/* Create new */}
      <div className="px-5 pb-6">
        <button className="w-full border-2 border-dashed border-white/15 rounded-2xl py-5 flex flex-col items-center gap-2 hover:border-purple/40 transition-colors">
          <span className="text-2xl">✨</span>
          <span className="text-white/50 font-jakarta text-sm">Create a new list</span>
        </button>
      </div>
    </div>
  );
}
