"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PLACES } from "@/lib/mock-data";
import { TikTokBadge, InstagramBadge } from "@/components/PlatformBadge";

const FILTERS = ["All", "Restaurants", "Coffee", "Shopping", "Bars"];

type VibeResult = { id: string; name: string; neighborhood: string; category: string; description: string; rating: number };
type ChatMessage = { role: "user" | "assistant"; content: string };

function StarRating({ rating }: { rating: number }) {
  return <span className="text-lime text-xs font-semibold font-jakarta">★ {rating}</span>;
}

function PriceLevel({ level }: { level: number }) {
  return <span className="text-white/30 text-xs font-jakarta">{"$".repeat(level)}</span>;
}

function ScoutChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hey! I'm Scout 🧭 Ask me anything about your saved places or what to do in NYC." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    const updated: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/scout-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Oops, I lost my map! Try again." }]);
    } finally {
      setThinking(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" style={{ maxWidth: 430, left: "50%", transform: "translateX(-50%)" }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#18181b] rounded-t-3xl border-t border-white/10 flex flex-col" style={{ height: "72vh" }}>
        {/* Handle + header */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.07]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple flex items-center justify-center text-sm">🧭</div>
            <div>
              <p className="font-bricolage font-bold text-white text-sm leading-tight">Scout</p>
              <p className="text-white/40 text-[10px] font-jakarta">Your city insider</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl font-jakarta text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-white text-dark rounded-br-sm"
                    : "bg-purple/30 border border-purple/40 text-white rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="bg-purple/30 border border-purple/40 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple animate-pulse" />
                <span className="text-white/60 font-jakarta text-sm">Scout is thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 pb-8 pt-3 border-t border-white/[0.07] flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Scout anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 font-jakarta text-sm focus:outline-none focus:border-purple/60"
          />
          <button
            onClick={send}
            disabled={!input.trim() || thinking}
            className="w-11 h-11 rounded-xl bg-lime flex items-center justify-center flex-shrink-0 disabled:opacity-40 active:scale-95 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#111113" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AppHome() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [savedIds, setSavedIds] = useState<Set<string>>(
    new Set(PLACES.filter((p) => p.saved).map((p) => p.id))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [vibeResults, setVibeResults] = useState<VibeResult[] | null>(null);
  const [vibeLoading, setVibeLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const featuredPlaces = PLACES.slice(0, 4);

  const filtered =
    activeFilter === "All"
      ? PLACES
      : PLACES.filter((p) => p.category === activeFilter);

  function toggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setVibeLoading(true);
    setVibeResults(null);
    try {
      const res = await fetch("/api/vibe-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setVibeResults(data.results || []);
    } catch {
      setVibeResults([]);
    } finally {
      setVibeLoading(false);
    }
  }

  function clearSearch() {
    setSearchQuery("");
    setVibeResults(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple flex items-center justify-center text-white font-bricolage font-bold text-sm">
            S
          </div>
          <div>
            <p className="text-white/40 text-xs font-jakarta">Good morning</p>
            <p className="text-white font-bricolage font-bold text-sm leading-tight">Sabrina</p>
          </div>
        </div>
        <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 bg-lime rounded-full" />
        </button>
      </div>

      {/* City header */}
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/40 text-sm font-jakarta">📍 New York City</span>
        </div>
        <h1 className="font-bricolage font-extrabold text-4xl text-white leading-tight">
          Discover <span className="text-lime">NYC</span>
        </h1>
        <div className="flex items-center gap-4 mt-3">
          {[
            { label: "places", value: "847" },
            { label: "saved", value: "24" },
            { label: "following", value: "12" },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-1">
              <span className="text-white font-bricolage font-bold text-lg">{value}</span>
              <span className="text-white/40 text-xs font-jakarta">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vibe Search */}
      <div className="px-5 pb-4">
        <form onSubmit={handleSearch}>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-purple/50 transition-colors">
            {vibeLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-purple border-t-transparent animate-spin flex-shrink-0" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <circle cx="11" cy="11" r="7" stroke="#ffffff60" strokeWidth="2" />
                <path d="M16.5 16.5l4 4" stroke="#ffffff60" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
            <input
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); if (!e.target.value) setVibeResults(null); }}
              placeholder='Try "cozy rainy evening" or "romantic date"'
              className="flex-1 bg-transparent text-white placeholder-white/30 font-jakarta text-sm focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={clearSearch} className="text-white/30 hover:text-white/60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </form>

        {/* Vibe results */}
        {vibeResults !== null && (
          <div className="mt-3">
            <p className="text-xs font-jakarta font-semibold text-purple mb-2">✨ Scout found these for you</p>
            {vibeResults.length === 0 ? (
              <p className="text-white/40 text-sm font-jakarta">No matches found. Try a different vibe.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {vibeResults.map((place) => (
                  <div key={place.id} className="flex items-center gap-3 bg-purple/10 border border-purple/20 rounded-2xl p-3">
                    <div className="w-10 h-10 rounded-xl bg-purple/30 flex-shrink-0 flex items-center justify-center text-base">
                      {place.category === "Restaurants" ? "🍽️" : place.category === "Coffee" ? "☕" : place.category === "Shopping" ? "🛍️" : "🍸"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                      <p className="text-white/40 text-xs font-jakarta">{place.neighborhood} · {place.description}</p>
                    </div>
                    <StarRating rating={place.rating} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter chips */}
      <div className="px-5 pb-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-jakarta font-semibold transition-all duration-150 ${
                activeFilter === f
                  ? "bg-purple text-white"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Featured horizontal scroll */}
      <div className="pb-5">
        <div className="flex items-center justify-between px-5 mb-3">
          <h2 className="font-bricolage font-bold text-white text-lg">Featured</h2>
          <button className="text-purple text-sm font-jakarta font-semibold">See all</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none px-5 pb-2">
          {featuredPlaces.map((place) => (
            <div
              key={place.id}
              className={`flex-shrink-0 w-52 rounded-2xl bg-gradient-to-br ${place.gradient} border border-white/10 overflow-hidden`}
            >
              <div className="h-32 relative p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  {place.platform === "tiktok" ? <TikTokBadge /> : <InstagramBadge />}
                  <button
                    onClick={() => toggleSave(place.id)}
                    className="w-7 h-7 rounded-full bg-black/30 backdrop-blur flex items-center justify-center"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                        stroke={savedIds.has(place.id) ? "#CAFF33" : "white"}
                        strokeWidth="2"
                        fill={savedIds.has(place.id) ? "#CAFF33" : "none"}
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-white/50 text-xs font-jakarta">{place.creator}</p>
              </div>
              <div className="bg-black/30 backdrop-blur px-3 py-2.5">
                <p className="font-bricolage font-bold text-white text-sm leading-tight">{place.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white/50 text-xs font-jakarta">{place.neighborhood}</p>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={place.rating} />
                    <PriceLevel level={place.priceLevel} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Place list */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bricolage font-bold text-white text-lg">
            {activeFilter === "All" ? "All Places" : activeFilter}
          </h2>
          <span className="text-white/30 text-sm font-jakarta">{filtered.length} spots</span>
        </div>
        <div className="flex flex-col gap-2">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-3"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${place.gradient} flex-shrink-0 flex items-center justify-center`}>
                <span className="text-lg">
                  {place.category === "Restaurants" ? "🍽️" :
                   place.category === "Coffee" ? "☕" :
                   place.category === "Shopping" ? "🛍️" : "🍸"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bricolage font-bold text-white text-sm truncate">{place.name}</p>
                  <StarRating rating={place.rating} />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-white/40 text-xs font-jakarta">{place.neighborhood}</span>
                  <span className="text-white/20 text-xs">·</span>
                  <span className="text-white/40 text-xs font-jakarta">{place.creator}</span>
                </div>
              </div>
              <button
                onClick={() => toggleSave(place.id)}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"
                    stroke={savedIds.has(place.id) ? "#CAFF33" : "#ffffff60"}
                    strokeWidth="2"
                    fill={savedIds.has(place.id) ? "#CAFF33" : "none"}
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save CTA */}
      <div className="px-5 pb-6">
        <Link
          href="/app/save"
          className="flex items-center justify-center gap-2 w-full bg-purple/20 border border-purple/40 rounded-2xl py-4 text-purple font-bricolage font-bold text-base hover:bg-purple/30 transition-colors"
        >
          <span className="text-xl">+</span>
          Save a place from TikTok or Instagram
        </Link>
      </div>

      {/* Ask Scout floating button */}
      <div className="fixed bottom-24 right-4 z-40" style={{ maxWidth: "calc(430px - 2rem)", right: "max(1rem, calc(50vw - 215px + 1rem))" }}>
        <button
          onClick={() => setShowChat(true)}
          className="flex items-center gap-2 bg-purple text-white font-jakarta font-semibold text-sm px-4 py-3 rounded-2xl shadow-lg shadow-purple/40 active:scale-95 transition-all"
        >
          <span>🧭</span>
          Ask Scout
        </button>
      </div>

      {/* Scout chat sheet */}
      {showChat && <ScoutChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
