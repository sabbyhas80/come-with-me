"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLACES } from "@/lib/mock-data";

const MAYA_PLACES = PLACES.filter((p) => p.creator === "@mayanyc").concat(
  PLACES.filter((p) => p.creator !== "@mayanyc").slice(0, 5)
);

const STATS = [
  { label: "Places", value: "142" },
  { label: "Followers", value: "48.2K" },
  { label: "Saves", value: "12.1K" },
];

export default function MayaNYCPage() {
  const router = useRouter();
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex flex-col pb-24">
      {/* Hero */}
      <div className="relative h-64 bg-gradient-to-br from-purple-900 via-purple to-indigo-900">
        <div className="absolute inset-0 bg-black/30" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-14 left-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur flex items-center justify-center z-10"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar + name */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 z-10">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-lime/30 to-purple/60 border-2 border-lime/40 flex items-center justify-center text-3xl shadow-xl shadow-purple/40">
              🗺️
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="font-bricolage font-extrabold text-white text-xl leading-tight">Maya Chen</h1>
                <span className="text-lime text-base">✓</span>
              </div>
              <p className="text-white/60 font-jakarta text-sm">@mayanyc</p>
            </div>
            <button
              onClick={() => setFollowing(!following)}
              className={`px-4 py-2 rounded-xl font-jakarta font-semibold text-sm transition-all active:scale-95 ${
                following
                  ? "bg-white/10 border border-white/20 text-white/60"
                  : "bg-lime text-dark"
              }`}
            >
              {following ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="px-5 pt-4 pb-4">
        <p className="text-white/60 font-jakarta text-sm leading-relaxed">
          NYC food & culture explorer. Omakase addict. Sharing the city&apos;s best hidden spots one video at a time. 🍣🗽
        </p>
      </div>

      {/* Stats bar */}
      <div className="mx-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl mb-5">
        <div className="flex">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 flex flex-col items-center py-4 ${
                i < STATS.length - 1 ? "border-r border-white/[0.08]" : ""
              }`}
            >
              <span className="font-bricolage font-extrabold text-lime text-xl leading-tight">
                {stat.value}
              </span>
              <span className="text-white/40 text-[11px] font-jakarta mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved places grid */}
      <div className="px-5">
        <h2 className="font-bricolage font-bold text-white text-lg mb-3">Saved Places</h2>
        <div className="grid grid-cols-2 gap-3">
          {MAYA_PLACES.map((place) => (
            <div
              key={place.id}
              className="bg-white/[0.04] border border-white/[0.07] rounded-2xl overflow-hidden"
            >
              <div className={`h-20 bg-gradient-to-br ${place.gradient} flex items-center justify-center text-3xl`}>
                {place.category === "Restaurants" ? "🍽️" :
                 place.category === "Coffee" ? "☕" :
                 place.category === "Shopping" ? "🛍️" : "🍸"}
              </div>
              <div className="p-3">
                <p className="font-bricolage font-bold text-white text-sm leading-tight truncate">
                  {place.name}
                </p>
                <p className="text-white/40 text-[11px] font-jakarta mt-0.5">{place.neighborhood}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-white/30 text-[10px] font-jakarta">{place.category}</span>
                  <span className="text-lime text-xs font-jakarta font-bold">★ {place.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
