"use client";

const CHALLENGES = [
  {
    id: "1",
    brand: "RESY x COME WITH ME",
    title: "Omakase Tour NYC",
    reward: "🎁 $50 Resy Credit + Explorer Badge",
    progress: 3,
    total: 5,
    pct: 60,
    started: true,
    daysLeft: 12,
    participants: "843",
    barColor: "bg-lime",
  },
  {
    id: "2",
    brand: "BLUESTONE LANE",
    title: "Best Coffee in Brooklyn",
    reward: "🎁 Free coffee for a month",
    progress: 1,
    total: 5,
    pct: 20,
    started: true,
    daysLeft: 30,
    participants: "2.1K",
    barColor: "bg-purple",
  },
  {
    id: "3",
    brand: "DEPOP x COME WITH ME",
    title: "Thrift Tour: East Village",
    reward: "🎁 $25 Depop Voucher",
    progress: 0,
    total: 5,
    pct: 0,
    started: false,
    daysLeft: 45,
    participants: null,
    barColor: "bg-purple",
  },
];

const BADGES = [
  { emoji: "🏅", title: "Explorer", sub: "+50 XP", earned: true },
  { emoji: "🗺️", title: "Cartographer", sub: "10 saves", earned: false },
  { emoji: "🍣", title: "Omakase Pro", sub: "+100 XP", earned: true },
  { emoji: "☕", title: "Coffee Snob", sub: "5 cafés", earned: false },
];

export default function ChallengesPage() {
  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="px-5 pt-14 pb-5">
        <p className="text-lime text-xs font-jakarta font-semibold uppercase tracking-widest mb-1">
          LIVE · 3 ACTIVE CHALLENGES
        </p>
        <h1 className="font-bricolage font-extrabold text-3xl text-white leading-tight">
          Explore &amp;{" "}
          <span className="italic text-lime">Earn</span>
        </h1>
      </div>

      {/* Challenge cards */}
      <div className="px-5 flex flex-col gap-3 pb-6">
        {CHALLENGES.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.04] overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-3">
              {/* Brand */}
              <p className="text-white/30 text-[10px] font-jakarta uppercase tracking-widest">
                {c.brand}
              </p>

              {/* Title */}
              <p className="font-bricolage font-bold text-white text-lg leading-tight -mt-1">
                {c.title}
              </p>

              {/* Reward */}
              <p className="text-lime text-sm font-jakarta font-semibold">
                {c.reward}
              </p>

              {/* Progress bar (started only) */}
              {c.started && (
                <>
                  <div className="h-2 bg-white/[0.08] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between -mt-1">
                    <span className="text-white/40 text-xs font-jakarta">
                      {c.progress} of {c.total} visited
                    </span>
                    <span className="text-white/60 text-xs font-jakarta font-semibold">
                      {c.pct}%
                    </span>
                  </div>
                </>
              )}

              {/* Not started row */}
              {!c.started && (
                <div className="flex items-center justify-between">
                  <span className="text-white/30 text-xs font-jakarta">Not started</span>
                  <span className="text-white/30 text-xs font-jakarta">{c.daysLeft} days left</span>
                </div>
              )}

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                {c.started ? (
                  <span className="text-white/30 text-xs font-jakarta">
                    {c.daysLeft} days left · {c.participants} participants
                  </span>
                ) : (
                  <span />
                )}

                {c.started && c.id === "1" ? (
                  <button className="bg-lime text-dark font-jakarta font-bold text-xs px-4 py-1.5 rounded-full active:scale-95 transition-all">
                    View Map →
                  </button>
                ) : (
                  <button className="bg-purple text-white font-jakarta font-bold text-xs px-4 py-1.5 rounded-full active:scale-95 transition-all">
                    Join
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Badges section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bricolage font-bold text-white text-lg">Your Badges</p>
          <button className="text-purple text-sm font-jakarta font-semibold">View all →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
          {BADGES.map((badge) => (
            <div
              key={badge.title}
              className={`flex-shrink-0 w-24 flex flex-col items-center gap-2 rounded-2xl border p-4 ${
                badge.earned
                  ? "bg-white/[0.05] border-white/[0.10]"
                  : "bg-white/[0.02] border-white/[0.05]"
              }`}
            >
              <span className={`text-3xl ${!badge.earned ? "opacity-40 grayscale" : ""}`}>
                {badge.emoji}
              </span>
              <p className={`font-jakarta font-semibold text-xs text-center leading-tight ${badge.earned ? "text-white" : "text-white/30"}`}>
                {badge.title}
              </p>
              <span className={`text-[10px] font-jakarta font-bold ${badge.earned ? "text-lime" : "text-white/20"}`}>
                {badge.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
