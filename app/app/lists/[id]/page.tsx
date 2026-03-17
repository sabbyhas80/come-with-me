"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/auth";

interface Place {
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
}

interface List {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  cover_emoji: string | null;
  is_public: boolean;
  slug: string | null;
  user_id: string;
}

function categoryEmoji(category: string) {
  const cat = (category || "").toLowerCase();
  if (cat === "coffee") return "☕";
  if (cat === "bar" || cat === "bars") return "🍸";
  if (cat === "shopping") return "🛍️";
  if (cat === "attraction") return "🎭";
  return "🍽️";
}

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const [list, setList] = useState<List | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPlaces, setShowAddPlaces] = useState(false);
  const [adding, setAdding] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchList();
  }, [id]);

  useEffect(() => {
    if (user && showAddPlaces) fetchSavedPlaces();
  }, [user, showAddPlaces]);

  async function fetchList() {
    const { data: listData } = await supabase
      .from("lists")
      .select("*")
      .eq("id", id)
      .single();
    if (listData) setList(listData);

    const { data: placesData } = await supabase
      .from("list_places")
      .select("place_id, position, places(*)")
      .eq("list_id", id)
      .order("position");

    if (placesData) {
      const flat = placesData.map((row: any) => row.places).filter(Boolean);
      setPlaces(flat);
    }
    setLoading(false);
  }

  async function fetchSavedPlaces() {
    const { data } = await supabase
      .from("saved_places")
      .select("places(*)")
      .eq("user_id", user!.id);
    if (data) {
      const flat = data.map((row: any) => row.places).filter(Boolean);
      setSavedPlaces(flat);
    }
  }

  async function addPlaceToList(placeId: string) {
    setAdding(placeId);
    await supabase.from("list_places").insert({
      list_id: id,
      place_id: placeId,
      position: places.length,
    });
    await fetchList();
    setAdding(null);
  }

  async function removePlaceFromList(placeId: string) {
    await supabase
      .from("list_places")
      .delete()
      .eq("list_id", id)
      .eq("place_id", placeId);
    await fetchList();
  }

  function copyShareLink() {
    const url = `${window.location.origin}/list/${list?.slug || id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const placesInList = new Set(places.map((p) => p.id));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-2 border-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-white font-bricolage font-bold text-xl">List not found</p>
        <Link href="/app/lists" className="text-purple font-jakarta">← Back to lists</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <Link href="/app/lists" className="flex items-center gap-2 text-white/40 font-jakarta text-sm mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          My Lists
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple/20 flex items-center justify-center text-3xl flex-shrink-0">
            {list.cover_emoji || "📍"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bricolage font-extrabold text-white text-2xl leading-tight">{list.title}</h1>
            {list.description && (
              <p className="text-white/40 text-sm font-jakarta mt-1">{list.description}</p>
            )}
            <p className="text-white/30 text-xs font-jakarta mt-1">{places.length} place{places.length !== 1 ? "s" : ""} · {list.city || "New York"}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={copyShareLink}
            className="flex-1 flex items-center justify-center gap-2 bg-purple/20 border border-purple/40 rounded-xl py-3 text-purple font-jakarta font-semibold text-sm"
          >
            {copied ? "✓ Copied!" : "🔗 Share List"}
          </button>
          {user && list.user_id === user.id && (
            <button
              onClick={() => setShowAddPlaces(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-lime/20 border border-lime/40 rounded-xl py-3 text-lime font-jakarta font-semibold text-sm"
            >
              + Add Places
            </button>
          )}
        </div>
      </div>

      {/* Places */}
      <div className="px-5 flex flex-col gap-2">
        {places.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <span className="text-4xl">📍</span>
            <p className="font-bricolage font-bold text-white">No places yet</p>
            <p className="text-white/40 font-jakarta text-sm">Add your saved places to this list!</p>
            <button
              onClick={() => setShowAddPlaces(true)}
              className="bg-purple text-white font-jakarta font-semibold px-6 py-3 rounded-xl mt-2"
            >
              Add Places
            </button>
          </div>
        )}
        {places.map((place, i) => (
          <div key={place.id} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
            <div className="w-10 h-10 rounded-xl bg-purple/20 flex-shrink-0 flex items-center justify-center">
              <span className="text-base">{categoryEmoji(place.category ?? "")}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
              <p className="text-white/40 text-xs font-jakarta">{place.neighborhood}{place.creator_handle ? ` · ${place.creator_handle}` : ""}</p>
            </div>
            {user && list.user_id === user.id && (
              <button
                onClick={() => removePlaceFromList(place.id)}
                className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff40" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add places modal */}
      {showAddPlaces && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, left: "50%", transform: "translateX(-50%)" }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddPlaces(false)} />
          <div className="relative bg-[#18181b] rounded-t-3xl border-t border-white/10 flex flex-col" style={{ height: "70vh" }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
              <h2 className="font-bricolage font-bold text-white text-lg">Add Places</h2>
              <button onClick={() => setShowAddPlaces(false)} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2">
              {savedPlaces.length === 0 && (
                <p className="text-white/40 font-jakarta text-sm text-center py-8">No saved places yet. Save some places first!</p>
              )}
              {savedPlaces.map((place) => {
                const inList = placesInList.has(place.id);
                return (
                  <div key={place.id} className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-3">
                    <div className="w-10 h-10 rounded-xl bg-purple/20 flex-shrink-0 flex items-center justify-center">
                      <span className="text-base">{categoryEmoji(place.category ?? "")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                      <p className="text-white/40 text-xs font-jakarta">{place.neighborhood}</p>
                    </div>
                    <button
                      onClick={() => !inList && addPlaceToList(place.id)}
                      disabled={inList || adding === place.id}
                      className={`px-3 py-1.5 rounded-lg text-xs font-jakarta font-semibold transition-all ${
                        inList ? "bg-lime/20 text-lime border border-lime/30" : "bg-purple text-white"
                      }`}
                    >
                      {inList ? "✓ Added" : adding === place.id ? "..." : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}