"use client";

import { useState, useEffect } from "react";
import MapView, { MapPlace } from "@/components/MapView";
import { supabase } from "@/lib/supabase";
import { useUser, signInWithGoogle } from "@/lib/auth";

interface SavedPlaceRow {
  places: {
    id: string;
    name: string;
    neighborhood: string | null;
    city: string | null;
    category: string | null;
    description: string | null;
    creator_handle: string | null;
    source: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
}

function categoryEmoji(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "coffee") return "☕";
  if (cat === "bar" || cat === "bars") return "🍸";
  if (cat === "shopping") return "🛍️";
  if (cat === "attraction") return "🎭";
  return "🍽️";
}

function categoryColor(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "restaurant" || cat === "restaurants") return "#FF6B6B";
  if (cat === "coffee") return "#C8956C";
  if (cat === "bar" || cat === "bars") return "#A78BFA";
  if (cat === "shopping") return "#34D399";
  if (cat === "attraction") return "#60A5FA";
  return "#7B2FFF";
}

export default function MapPage() {
  const { user, loading: authLoading } = useUser();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [places, setPlaces] = useState<SavedPlaceRow["places"][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    supabase
      .from("saved_places")
      .select("places(*)")
      .eq("user_id", user.id)
      .then(({ data, error }) => {
        if (!error && data) {
          const flat = (data as unknown as SavedPlaceRow[])
            .map((row) => row.places)
            .filter(Boolean);
          setPlaces(flat as SavedPlaceRow["places"][]);
        }
        setLoading(false);
      });
  }, [user, authLoading]);

  const mapPins: MapPlace[] = places
    .filter((p) => p && p.latitude != null && p.longitude != null)
    .map((p) => ({
      id: p!.id,
      name: p!.name,
      category: p!.category ?? "",
      latitude: p!.latitude!,
      longitude: p!.longitude!,
      creator_handle: p!.creator_handle ?? undefined,
    }));

  const selected = places.find((p) => p?.id === selectedId);

  if (!authLoading && !user) {
    return (
      <div style={{ height: "100vh" }} className="flex flex-col items-center justify-center gap-5 px-8">
        <div className="text-5xl">🗺️</div>
        <h2 className="font-bricolage font-extrabold text-white text-2xl text-center">Your personal map</h2>
        <p className="text-white/40 font-jakarta text-sm text-center leading-relaxed">Sign in to see your saved places pinned on a live map.</p>
        <button onClick={signInWithGoogle} className="flex items-center gap-3 bg-white text-gray-900 font-jakarta font-semibold text-base px-6 py-3 rounded-xl">
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Map */}
      <div style={{ height: "60%", position: "relative" }}>
        {loading ? (
          <div className="w-full h-full bg-[#0d0d0f] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple border-t-transparent animate-spin" />
          </div>
        ) : (
          <MapView onSelectPlace={setSelectedId} places={mapPins} selectedId={selectedId} />
        )}

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

        {/* Selected place popup */}
        {selected && (
          <div className="absolute bottom-16 left-4 right-4 z-20">
            <div
              className="bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ border: `2px solid ${categoryColor(selected.category ?? "")}` }}
            >
              <div className="flex items-center gap-3 p-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${categoryColor(selected.category ?? "")}20` }}
                >
                  {categoryEmoji(selected.category ?? "")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-extrabold text-gray-900 text-base truncate">{selected.name}</p>
                  <p className="text-gray-500 text-xs font-jakarta">{selected.neighborhood}{selected.city ? `, ${selected.city}` : ""}</p>
                  {selected.creator_handle && (
                    <p className="text-purple text-xs font-jakarta font-semibold mt-0.5">{selected.creator_handle}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="#666" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {selected.description && (
                <div className="px-4 pb-3">
                  <p className="text-gray-500 text-xs font-jakarta leading-relaxed">{selected.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filter pills */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {["All", "Restaurants", "Coffee", "Bars", "Shopping"].map((f, i) => (
              <button
                key={f}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-jakarta font-semibold border ${
                  i === 0 ? "bg-purple border-purple text-white" : "bg-dark/80 backdrop-blur border-white/20 text-white/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div style={{ height: "40%" }} className="bg-dark border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-2">
          <div>
            <h2 className="font-bricolage font-bold text-white text-lg">My Saved Places</h2>
            <p className="text-white/40 text-xs font-jakarta">
              {loading ? "Loading..." : places.length === 0 ? "No places saved yet!" : `${places.length} saved spot${places.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pb-24">
          {!loading && places.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 px-5 text-center">
              <span className="text-4xl">📍</span>
              <p className="text-white/40 font-jakarta text-sm">Save your first place to see it here.</p>
            </div>
          )}
          {places.map((place, i) => {
            if (!place) return null;
            return (
              <button
                key={place.id}
                onClick={() => setSelectedId(place.id === selectedId ? null : place.id)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  place.id === selectedId ? "bg-purple/10" : i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-base">{categoryEmoji(place.category ?? "")}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                  <p className="text-white/40 text-xs font-jakarta">
                    {place.neighborhood}{place.creator_handle ? ` · ${place.creator_handle}` : ""}
                  </p>
                </div>
                <span className="text-white/20 text-xs font-jakarta capitalize">{place.source}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}