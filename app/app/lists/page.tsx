"use client";

import { useState } from "react";
import { LISTS } from "@/lib/mock-data";

export default function ListsPage() {
  const [lists] = useState(LISTS);

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-bricolage font-extrabold text-white text-2xl">My Lists</h1>
          <p className="text-white/40 text-xs font-jakarta">24 places saved across 6 lists</p>
        </div>
        <button className="flex items-center gap-2 bg-purple text-white font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl">
          <span className="text-lg leading-none">+</span> New List
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 pb-4">
        <div className="flex gap-6 border-b border-white/10">
          {["MINE", "SHARED", "FOLLOWING"].map((tab, i) => (
            <button
              key={tab}
              className={`pb-3 text-xs font-jakarta font-bold tracking-widest ${
                i === 0 ? "text-white border-b-2 border-purple" : "text-white/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 flex flex-col gap-3">
        {lists.map((list) => (
          <div
            key={list.id}
            className="rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08]"
          >
            <div className={`h-28 bg-gradient-to-br ${list.gradient} flex items-center justify-end pr-4`}>
              <span className="text-white/20 font-bricolage font-extrabold text-6xl">{list.placeCount}</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex-1">
                <p className="font-bricolage font-bold text-white text-base">{list.name}</p>
                <p className="text-white/40 text-xs font-jakarta mt-0.5">
                  {list.placeCount} places
                  {list.collaborators.length > 1 ? ` · ${list.collaborators.length} collaborators` : ""}
                  {list.id === "1" ? " · Updated 2 days ago" : ""}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {list.isPrivate && (
                    <span className="text-xs font-jakarta font-bold text-white/40 bg-white/10 px-2 py-0.5 rounded-full">
                      🔒 PRIVATE
                    </span>
                  )}
                  {list.collaborators.length > 1 && (
                    <div className="flex items-center gap-1">
                      {list.collaborators.map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full bg-purple flex items-center justify-center text-[9px] font-bold text-white -ml-1 first:ml-0 border border-black"
                        >
                          {c}
                        </div>
                      ))}
                      <button className="text-purple text-xs font-jakarta font-semibold ml-2">+ Invite</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#ffffff30" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
