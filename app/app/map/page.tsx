"use client";

import { useState } from "react";
import MapView from "@/components/MapView";
import { PLACES } from "@/lib/mock-data";

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const selected = PLACES.find((p) => p.id === selectedPlace);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Map — top 60% */}
      <div style={{ height: "60%", position: "relative" }}>
        <MapView onSelectPlace={setSelectedPlace} />

        {/* Floating search */}
        <div className="absolute top-12 left-4 right-4 z-10">
          <div className="flex items-center gap-3 bg-dark/90 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#ffffff60" strokeWidth="2" />
              <path d="M16.5 16.5l4 4" stroke="#ffffff60" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-white/30 font-jakarta text-sm flex-1">Search saved places...</span>
            <div className="flex items-center gap-1.5 bg-purple/20 border border-purple/30 rounded-full px-2.5 py-1">
              <span className="text-purple text-xs font-jakarta font-semibold">NYC</span>
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {["All", "Restaurants", "Coffee", "Bars", "Shopping"].map((f, i) => (
              <button
                key={f}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-jakarta font-semibold border ${
                  i === 0
                    ? "bg-purple border-purple text-white"
                    : "bg-dark/80 backdrop-blur border-white/20 text-white/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sheet — bottom 40% */}
      <div style={{ height: "40%" }} className="bg-dark border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <div>
            <h2 className="font-bricolage font-bold text-white text-lg">Nearby Places</h2>
            <p className="text-white/40 text-xs font-jakarta">
              {selected ? selected.name : "6 saved spots in this area"}
            </p>
          </div>
          <button className="text-purple font-jakarta font-semibold text-sm">Filter</button>
        </div>

        {/* Places list */}
        <div className="flex-1 overflow-y-auto pb-24">
          {PLACES.map((place, i) => (
            <button
              key={place.id}
              onClick={() => setSelectedPlace(place.id === selectedPlace ? null : place.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                place.id === selectedPlace ? "bg-purple/10" : i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${place.gradient} flex-shrink-0 flex items-center justify-center`}>
                <span className="text-base">
                  {place.category === "Restaurants" ? "🍽️" :
                   place.category === "Coffee" ? "☕" :
                   place.category === "Shopping" ? "🛍️" : "🍸"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                <p className="text-white/40 text-xs font-jakarta">{place.neighborhood} · {place.creator}</p>
              </div>
              <span className="text-lime text-xs font-jakarta font-semibold">★ {place.rating}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
