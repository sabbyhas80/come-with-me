"use client";

import { useState } from "react";
import MapView, { MapPlace } from "@/components/MapView";
import { PLACES } from "@/lib/mock-data";

function categoryEmoji(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "coffee") return "☕";
  if (cat === "bar" || cat === "bars") return "🍸";
  if (cat === "shopping") return "🛍️";
  return "🍽️";
}

function categoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "restaurant" || cat === "restaurants") return "#FF6B6B";
  if (cat === "coffee") return "#C8956C";
  if (cat === "bar" || cat === "bars") return "#A78BFA";
  if (cat === "shopping") return "#34D399";
  return "#7B2FFF";
}

const FILTERS = ["All", "Restaurants", "Coffee", "Bars", "Shopping"];

export default function MapPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? PLACES
    : PLACES.filter((p) => p.category === activeFilter);

  const mapPins: MapPlace[] = filtered
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      latitude: p.lat,
      longitude: p.lng,
      creator_handle: p.creator,
    }));

  const selected = PLACES.find((p) => p.id === selectedId);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "60%", position: "relative" }}>
        <MapView onSelectPlace={setSelectedId} places={mapPins} selectedId={selectedId} />

        <div className="absolute top-12 left-4 right-4 z-10">
          <div className="flex items-center gap-3 bg-dark/90 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#ffffff60" strokeWidth="2" />
              <path d="M16.5 16.5l4 4" stroke="#ffffff60" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-white/30 font-jakarta text-sm flex-1">Search this area...</span>
            <div className="flex items-center gap-1.5 bg-purple/20 border border-purple/30 rounded-full px-2.5 py-1">
              <span className="text-purple text-xs font-jakarta font-semibold">NYC</span>
            </div>
          </div>
        </div>

        {selected && (
          <div className="absolute bottom-16 left-4 right-4 z-20">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ border: `2px solid ${categoryColor(selected.category)}` }}>
              <div className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `${categoryColor(selected.category)}20` }}>
                  {categoryEmoji(selected.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-extrabold text-gray-900 text-base truncate">{selected.name}</p>
                  <p className="text-gray-500 text-xs font-jakarta">{selected.neighborhood}</p>
                  <p className="text-purple text-xs font-jakarta font-semibold mt-0.5">{selected.creator}</p>
                </div>
                <button onClick={() => setSelectedId(null)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="px-4 pb-3">
                <p className="text-gray-500 text-xs font-jakarta leading-relaxed">{selected.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-jakarta font-semibold border ${
                  activeFilter === f ? "bg-purple border-purple text-white" : "bg-dark/80 backdrop-blur border-white/20 text-white/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: "40%" }} className="bg-dark border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <h2 className="font-bricolage font-bold text-white text-lg">
            <span className="text-lime font-extrabold">{filtered.length}</span> places nearby
          </h2>
          <button className="text-purple text-sm font-jakarta font-semibold">Filter</button>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          {filtered.map((place) => (
            <button
              key={place.id}
              onClick={() => setSelectedId(place.id === selectedId ? null : place.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                place.id === selectedId ? "bg-purple/10" : "bg-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${place.gradient} flex-shrink-0 flex items-center justify-center`}>
                <span className="text-base">{categoryEmoji(place.category)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                <p className="text-white/40 text-xs font-jakarta">
                  {place.neighborhood} · <span className="text-purple">{place.creator}</span>
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-lg">{place.saved ? "❤️" : "🤍"}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}