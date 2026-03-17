"use client";

import { useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

interface Guide {
  id: string;
  slug: string;
  creator_name: string;
  creator_handle: string;
  title: string;
  destination: string;
  intro: string | null;
  cover_emoji: string | null;
}

interface Place {
  id: string;
  name: string;
  category: string;
  neighborhood: string | null;
  city: string | null;
  description: string | null;
  address: string | null;
  google_maps_url: string | null;
  image_url: string | null;
  time_of_day: string | null;
  position: number;
  latitude: number | null;
  longitude: number | null;
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bg: string; label: string }> = {
  food: { emoji: "🍜", color: "#DC2626", bg: "#FEF2F2", label: "Food" },
  coffee: { emoji: "☕", color: "#92400E", bg: "#FFFBEB", label: "Coffee" },
  bar: { emoji: "🍸", color: "#6D28D9", bg: "#F5F3FF", label: "Drinks" },
  shopping: { emoji: "🛍️", color: "#065F46", bg: "#ECFDF5", label: "Shopping" },
  vintage: { emoji: "👜", color: "#9D174D", bg: "#FDF2F8", label: "Vintage" },
  hotel: { emoji: "🏨", color: "#1E40AF", bg: "#EFF6FF", label: "Stay" },
  "must-see": { emoji: "⭐", color: "#B45309", bg: "#FFFBEB", label: "Must-See" },
  "hidden-gem": { emoji: "💎", color: "#4338CA", bg: "#EEF2FF", label: "Hidden Gem" },
  default: { emoji: "📍", color: "#374151", bg: "#F9FAFB", label: "Place" },
};

function getCat(category: string) {
  return CATEGORY_CONFIG[category?.toLowerCase()] || CATEGORY_CONFIG.default;
}

const TIME_ORDER = ["morning", "afternoon", "evening", "night"];

function getBounds(places: Place[]) {
  const valid = places.filter((p) => p.latitude && p.longitude);
  if (valid.length === 0) return null;
  const lats = valid.map((p) => p.latitude!);
  const lngs = valid.map((p) => p.longitude!);
  return {
    centerLat: (Math.min(...lats) + Math.max(...lats)) / 2,
    centerLng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
  };
}

export default function GuideClient({ guide, places }: { guide: Guide; places: Place[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [email, setEmail] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ["all", ...Array.from(new Set(places.map((p) => p.category?.toLowerCase()).filter(Boolean)))];
  const filtered = activeCategory === "all" ? places : places.filter((p) => p.category?.toLowerCase() === activeCategory);

  const byTime: Record<string, Place[]> = {};
  TIME_ORDER.forEach((time) => {
    const items = filtered.filter((p) => p.time_of_day === time);
    if (items.length > 0) byTime[time] = items;
  });
  const noTime = filtered.filter((p) => !p.time_of_day || !TIME_ORDER.includes(p.time_of_day));

  const mapPlaces = places.filter((p) => p.latitude && p.longitude);
  const bounds = getBounds(mapPlaces);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: "explorer" }),
    });
    setUnlocked(true);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF8", fontFamily: "var(--font-jakarta)" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a0533 0%, #0f0f1a 60%, #1a1a0f 100%)" }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7B2FFF 0%, transparent 50%), radial-gradient(circle at 80% 20%, #CAFF33 0%, transparent 40%)" }} />
        <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-16">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="7" r="3" fill="#CAFF33" />
                <path d="M8 2C5.24 2 3 4.24 3 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5z" stroke="#CAFF33" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">Come With Me</span>
          </div>
          <div className="flex items-start gap-4 mb-6">
            <div className="text-5xl mt-1">{guide.cover_emoji || "✈️"}</div>
            <div>
              <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-2">{guide.destination} · Travel Guide</p>
              <h1 style={{ fontFamily: "var(--font-bricolage)", fontWeight: 800, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", lineHeight: 1.1 }} className="text-white">
                {guide.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #7B2FFF, #CAFF33)" }}>
              {guide.creator_name[0]}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{guide.creator_name}</p>
              <p className="text-white/40 text-xs">{guide.creator_handle}</p>
            </div>
          </div>
          {guide.intro && (
            <p className="text-white/70 text-base leading-relaxed" style={{ fontStyle: "italic" }}>
              &ldquo;{guide.intro}&rdquo;
            </p>
          )}
          <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
            {[
              { label: "Places", value: places.length },
              { label: "Cities", value: new Set(places.map(p => p.city)).size },
              { label: "Categories", value: categories.length - 1 },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-white font-bold text-xl" style={{ fontFamily: "var(--font-bricolage)" }}>{value}</p>
                <p className="text-white/40 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="max-w-2xl mx-auto px-6 -mt-6 relative z-10">
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ height: 300, border: "1px solid #e5e7eb" }}>
          {bounds && (
            <Map
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              initialViewState={{ longitude: 136.5, latitude: 36.5, zoom: 5 }}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/light-v11"
              attributionControl={false}
            >
              <NavigationControl position="bottom-right" />
              {mapPlaces.map((place) => {
                const cat = getCat(place.category);
                const isSelected = place.id === selectedId;
                return (
                  <Marker
                    key={place.id}
                    longitude={place.longitude!}
                    latitude={place.latitude!}
                    anchor="bottom"
                    onClick={() => setSelectedId(place.id === selectedId ? null : place.id)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}>
                      <div style={{
                        background: isSelected ? cat.color : "white",
                        borderRadius: 20,
                        padding: "4px 10px",
                        marginBottom: 3,
                        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        border: `1.5px solid ${isSelected ? cat.color : "#e5e7eb"}`,
                        transform: isSelected ? "scale(1.08)" : "scale(1)",
                        transition: "all 0.2s ease",
                      }}>
                        <span style={{ fontSize: 11 }}>{cat.emoji}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: isSelected ? "white" : "#111827", whiteSpace: "nowrap", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {place.name}
                        </span>
                      </div>
                      <div style={{ width: isSelected ? 10 : 7, height: isSelected ? 10 : 7, borderRadius: "50%", background: cat.color, border: "2px solid white", transition: "all 0.2s ease" }} />
                    </div>
                  </Marker>
                );
              })}
            </Map>
          )}
        </div>
        {selectedId && (() => {
          const place = places.find(p => p.id === selectedId);
          if (!place) return null;
          const cat = getCat(place.category);
          return (
            <div className="mt-3 rounded-2xl p-4 flex gap-3 items-start" style={{ background: "white", border: "1px solid #e5e7eb", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: cat.bg }}>{cat.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm" style={{ fontFamily: "var(--font-bricolage)" }}>{place.name}</p>
                <p className="text-gray-400 text-xs mt-0.5">{place.neighborhood}{place.city ? `, ${place.city}` : ""}</p>
                {place.description && <p className="text-gray-600 text-xs mt-1.5 leading-relaxed line-clamp-2">{place.description}</p>}
              </div>
              <button onClick={() => setSelectedId(null)} className="text-gray-300 hover:text-gray-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
          );
        })()}
      </div>

      {/* Category filters */}
      <div className="max-w-2xl mx-auto px-6 mt-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => {
            const config = cat === "all" ? { emoji: "✨", label: "All" } : getCat(cat);
            const isActive = activeCategory === cat;
            return (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{ background: isActive ? "#111827" : "white", color: isActive ? "white" : "#6B7280", border: `1px solid ${isActive ? "#111827" : "#E5E7EB"}` }}>
                <span>{config.emoji}</span>
                <span>{cat === "all" ? "All" : config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Places with email wall */}
      <div className="relative">
        <div className="max-w-2xl mx-auto px-6 mt-6" style={{ maxHeight: unlocked ? "none" : 500, overflow: "hidden" }}>
          {Object.entries(byTime).map(([time, timePlaces]) => (
            <div key={time} className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{time === "morning" ? "🌅" : time === "afternoon" ? "☀️" : time === "evening" ? "🌆" : "🌙"}</span>
                <h2 className="text-gray-900 font-bold text-lg capitalize" style={{ fontFamily: "var(--font-bricolage)" }}>{time}</h2>
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 text-xs">{timePlaces.length} places</span>
              </div>
              <div className="flex flex-col gap-3">
                {timePlaces.map((place, i) => (
                  <PlaceCard key={place.id} place={place} index={i} isSelected={selectedId === place.id} onSelect={() => setSelectedId(place.id === selectedId ? null : place.id)} />
                ))}
              </div>
            </div>
          ))}
          {noTime.length > 0 && (
            <div className="flex flex-col gap-3 mb-10">
              {noTime.map((place, i) => (
                <PlaceCard key={place.id} place={place} index={i} isSelected={selectedId === place.id} onSelect={() => setSelectedId(place.id === selectedId ? null : place.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Email wall */}
        {!unlocked && (
          <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center px-6 pb-10" style={{ background: "linear-gradient(to top, #FAFAF8 55%, transparent)", paddingTop: 140 }}>
            <div className="w-full max-w-md text-center">
              <p className="font-bold text-gray-900 text-xl mb-1" style={{ fontFamily: "var(--font-bricolage)" }}>
                Unlock the full guide
              </p>
              <p className="text-gray-500 text-sm mb-5">
                {places.length} places across {new Set(places.map(p => p.city)).size} cities — free, no spam
              </p>
              <form onSubmit={handleUnlock} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 rounded-xl px-4 py-3.5 text-gray-900 text-base focus:outline-none"
                  style={{ background: "white", border: "1.5px solid #E5E7EB" }}
                />
                <button type="submit" className="px-5 py-3.5 rounded-xl font-bold whitespace-nowrap"
                  style={{ background: "#111827", color: "white", fontFamily: "var(--font-bricolage)" }}>
                  Unlock →
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bottom padding when unlocked */}
      {unlocked && <div className="h-20" />}

    </div>
  );
}

function PlaceCard({ place, index, isSelected, onSelect }: { place: Place; index: number; isSelected: boolean; onSelect: () => void }) {
  const cat = getCat(place.category);
  return (
    <div onClick={onSelect} className="rounded-2xl transition-all cursor-pointer"
      style={{ background: "white", border: `1.5px solid ${isSelected ? cat.color : "#F3F4F6"}`, boxShadow: isSelected ? `0 4px 20px ${cat.color}20` : "0 1px 4px rgba(0,0,0,0.04)", transform: isSelected ? "scale(1.01)" : "scale(1)", transition: "all 0.2s ease" }}>
      <div className="p-4 flex gap-4">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: cat.bg }}>{cat.emoji}</div>
          <span className="text-xs font-bold" style={{ color: "#9CA3AF" }}>#{index + 1}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="font-bold text-gray-900 text-base leading-tight" style={{ fontFamily: "var(--font-bricolage)" }}>{place.name}</p>
            <span className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: cat.bg, color: cat.color }}>{cat.label}</span>
          </div>
          <p className="text-gray-400 text-xs mb-2">{place.neighborhood}{place.city && place.neighborhood ? ` · ${place.city}` : place.city}</p>
          {place.description && <p className="text-gray-600 text-sm leading-relaxed">{place.description}</p>}
          {place.google_maps_url && (
            <a href={place.google_maps_url} target="_blank" rel="noopener noreferrer"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold rounded-lg px-3 py-1.5"
              style={{ background: "#F3F4F6", color: "#374151" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" />
              </svg>
              Open in Maps
            </a>
          )}
        </div>
      </div>
    </div>
  );
}