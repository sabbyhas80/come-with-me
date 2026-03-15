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

export default function MapPage() {
  const { user, loading: authLoading } = useUser();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [places, setPlaces] = useState<SavedPlaceRow["places"][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }

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
    }));

  const selected = places.find((p) => p?.id === selectedId);

  if (!authLoading && !user) {
    return (
      <div
        style={{ height: "100vh" }}
        className="flex flex-col items-center justify-center gap-5 px-8"
      >
        <div className="text-5xl">🗺️</div>
        <h2 className="font-bricolage font-extrabold text-white text-2xl text-center">
          Your personal map
        </h2>
        <p className="text-white/40 font-jakarta text-sm text-center leading-relaxed">
          Sign in to see your saved places pinned on a live map.
        </p>
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-3 bg-white text-gray-900 font-jakarta font-semibold text-base px-6 py-3 rounded-xl"
        >
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.806.54-1.8368.859-3.0477.859-2.3446 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.2818-1.1168-.2818-1.71s.1018-1.17.2818-1.71V4.9582H.9574C.3477 6.1732 0 7.5482 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
            <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4627.8918 11.4255 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1632 6.6554 3.5795 9 3.5795z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Map — top 60% */}
      <div style={{ height: "60%", position: "relative" }}>
        {loading ? (
          <div className="w-full h-full bg-[#0d0d0f] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-purple border-t-transparent animate-spin" />
          </div>
        ) : (
          <MapView onSelectPlace={setSelectedId} places={mapPins} />
        )}

        {/* Floating search */}
        <div className="absolute top-12 left-4 right-4 z-10">
          <div className="flex items-center gap-3 bg-dark/90 backdrop-blur border border-white/15 rounded-2xl px-4 py-3 shadow-lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#ffffff60" strokeWidth="2" />
              <path
                d="M16.5 16.5l4 4"
                stroke="#ffffff60"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-white/30 font-jakarta text-sm flex-1">
              Search saved places...
            </span>
            <div className="flex items-center gap-1.5 bg-purple/20 border border-purple/30 rounded-full px-2.5 py-1">
              <span className="text-purple text-xs font-jakarta font-semibold">
                NYC
              </span>
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="absolute bottom-3 left-4 right-4 z-10">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {["All", "Restaurants", "Coffee", "Bars", "Shopping"].map(
              (f, i) => (
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
              )
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet — bottom 40% */}
      <div
        style={{ height: "40%" }}
        className="bg-dark border-t border-white/10 rounded-t-3xl overflow-hidden flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <div>
            <h2 className="font-bricolage font-bold text-white text-lg">
              {selected ? selected.name : "My Saved Places"}
            </h2>
            <p className="text-white/40 text-xs font-jakarta">
              {loading
                ? "Loading..."
                : places.length === 0
                ? "No places saved yet — go add some!"
                : `${places.length} saved spot${places.length === 1 ? "" : "s"}`}
            </p>
          </div>
        </div>

        {/* Places list */}
        <div className="flex-1 overflow-y-auto pb-24">
          {!loading && places.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-10 px-5 text-center">
              <span className="text-4xl">📍</span>
              <p className="text-white/40 font-jakarta text-sm">
                Save your first place to see it here.
              </p>
            </div>
          )}
          {places.map((place, i) => {
            if (!place) return null;
            const emoji =
              (place.category || "").toLowerCase() === "coffee"
                ? "☕"
                : (place.category || "").toLowerCase() === "bar" ||
                  (place.category || "").toLowerCase() === "bars"
                ? "🍸"
                : (place.category || "").toLowerCase() === "shopping"
                ? "🛍️"
                : (place.category || "").toLowerCase() === "attraction"
                ? "🎭"
                : "🍽️";

            return (
              <button
                key={place.id}
                onClick={() =>
                  setSelectedId(place.id === selectedId ? null : place.id)
                }
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  place.id === selectedId
                    ? "bg-purple/10"
                    : i % 2 === 0
                    ? "bg-transparent"
                    : "bg-white/[0.02]"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-purple/20 flex-shrink-0 flex items-center justify-center">
                  <span className="text-base">{emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bricolage font-bold text-white text-sm truncate">
                    {place.name}
                  </p>
                  <p className="text-white/40 text-xs font-jakarta">
                    {place.neighborhood}
                    {place.creator_handle ? ` · ${place.creator_handle}` : ""}
                  </p>
                </div>
                <span className="text-white/20 text-xs font-jakarta capitalize">
                  {place.source}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
