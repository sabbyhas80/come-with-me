"use client";

import { useState } from "react";

const CHALLENGES = [
  {
    id: "1",
    brand: "Resy",
    title: "Omakase Tour NYC",
    description: "Visit 5 omakase restaurants saved from Resy-featured creators",
    reward: "Priority reservation access + $75 dining credit",
    progress: 3,
    total: 5,
    started: true,
    badgeEmoji: "🍣",
    daysLeft: 4,
  },
  {
    id: "2",
    brand: "Bluestone Lane",
    title: "Best Coffee in Brooklyn",
    description: "Check in at 4 top-rated coffee spots across Brooklyn",
    reward: "Free week of flat whites",
    progress: 1,
    total: 4,
    started: true,
    badgeEmoji: "☕",
    daysLeft: 7,
  },
  {
    id: "3",
    brand: "Depop",
    title: "Thrift Tour East Village",
    description: "Save 6 vintage & thrift spots in the East Village",
    reward: "0% selling fees for 30 days",
    progress: 0,
    total: 6,
    started: false,
    badgeEmoji: "🛍️",
    daysLeft: 10,
  },
];

const EARNED_BADGES = [
  { emoji: "🌍", label: "Explorer", color: "from-purple-700 to-indigo-700" },
  { emoji: "📍", label: "Pioneer", color: "from-rose-700 to-pink-700" },
  { emoji: "☕", label: "Caffeine", color: "from-amber-700 to-orange-700" },
];

export default function ChallengesPage() {
  const [activeId, setActiveId] = useState("1");

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <p className="text-lime text-xs font-jakarta font-semibold uppercase tracking-widest mb-1">
          LIVE · 3 ACTIVE CHALLENGES
        </p>
        <h1 className="font-bricolage font-extrabold text-3xl text-white leading-tight">
          Explore &{" "}
          <span className="italic text-lime">Earn</span>
        </h1>
      </div>

      {/* Challenge cards */}
      <div className="px-5 flex flex-col gap-3 pb-6">
        {CHALLENGES.map((c) => {
          const isActive = activeId === c.id;
          const pct = c.total > 0 ? Math.round((c.progress / c.total) * 100) : 0;

          return (
            <div
              key={c.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isActive ? "border-lime/30 bg-white/[0.05]" : "border-white/[0.07] bg-white/[0.03]"
              }`}
            >
              <button
                className="w-full text-left p-4"
                onClick={() => setActiveId(isActive ? "" : c.id)}
              >
                {/* Brand */}
                <p className="text-white/30 text-[10px] font-jakarta uppercase tracking-widest mb-2">
                  {c.brand}
                </p>

                {/* Title row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center text-xl flex-shrink-0">
                    {c.badgeEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bricolage font-bold text-white text-base leading-tight">
                        {c.title}
                      </p>
                      <span className="flex-shrink-0 text-[10px] font-jakarta font-semibold text-lime/70 bg-lime/10 border border-lime/20 px-2 py-0.5 rounded-full">
                        {c.daysLeft}d left
                      </span>
                    </div>
                    <p className="text-white/40 text-xs font-jakarta mt-0.5">
                      {c.started ? `${c.progress} / ${c.total} completed` : "Not started"}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                {c.started && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-lime rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-lime text-xs font-jakarta font-bold">{pct}%</span>
                  </div>
                )}
              </button>

              {/* Expanded */}
              {isActive && (
                <div className="px-4 pb-4 pt-1 border-t border-white/[0.06] flex flex-col gap-3">
                  <p className="text-white/55 font-jakarta text-sm leading-relaxed">
                    {c.description}
                  </p>
                  <div className="flex items-center gap-3 bg-lime/[0.07] border border-lime/20 rounded-xl px-4 py-3">
                    <span className="text-lg">🎁</span>
                    <div>
                      <p className="text-white/40 text-[10px] font-jakarta uppercase tracking-wide">Reward</p>
                      <p className="font-jakarta font-semibold text-white text-sm">{c.reward}</p>
                    </div>
                  </div>
                  {c.started ? (
                    <button className="w-full bg-lime text-dark font-bricolage font-bold text-base py-3 rounded-xl active:scale-95 transition-all">
                      View Map →
                    </button>
                  ) : (
                    <button className="w-full bg-purple text-white font-bricolage font-bold text-base py-3 rounded-xl active:scale-95 transition-all">
                      Join
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Badge shelf */}
      <div className="px-5">
        <p className="text-white/40 text-xs font-jakarta uppercase tracking-widest mb-3">Your Badges</p>
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
          <div className="flex gap-4">
            {EARNED_BADGES.map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl shadow-lg shadow-black/40`}>
                  {badge.emoji}
                </div>
                <span className="text-white/50 text-[10px] font-jakarta">{badge.label}</span>
              </div>
            ))}
            {["🏆", "💎"].map((emoji) => (
              <div key={emoji} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-dashed border-white/15 flex items-center justify-center opacity-20 text-2xl">
                  {emoji}
                </div>
                <span className="text-white/20 text-[10px] font-jakarta">Locked</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
