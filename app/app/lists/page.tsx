
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUser, signInWithGoogle } from "@/lib/auth";

interface List {
  id: string;
  title: string;
  description: string | null;
  city: string | null;
  cover_emoji: string | null;
  is_public: boolean;
  slug: string | null;
  created_at: string;
}

export default function ListsPage() {
  const { user, loading: authLoading } = useUser();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emoji, setEmoji] = useState("📍");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    fetchLists();
  }, [user, authLoading]);

  async function fetchLists() {
    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (!error && data) setLists(data);
    setLoading(false);
  }

  async function createList(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !title.trim()) return;
    setCreating(true);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    const { error } = await supabase.from("lists").insert({
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
      cover_emoji: emoji,
      slug,
    });
    if (!error) {
      setTitle("");
      setDescription("");
      setEmoji("📍");
      setShowCreate(false);
      fetchLists();
    }
    setCreating(false);
  }

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 px-8 py-20">
        <div className="text-5xl">📋</div>
        <h2 className="font-bricolage font-extrabold text-white text-2xl text-center">Your Lists</h2>
        <p className="text-white/40 font-jakarta text-sm text-center">Sign in to create and share curated place lists.</p>
        <button onClick={signInWithGoogle} className="flex items-center gap-3 bg-white text-gray-900 font-jakarta font-semibold text-base px-6 py-3 rounded-xl">
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-bricolage font-extrabold text-white text-2xl">My Lists</h1>
          <p className="text-white/40 text-xs font-jakarta">Curate & share your favorite spots</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-purple text-white font-jakarta font-semibold text-sm px-4 py-2.5 rounded-xl"
        >
          <span className="text-lg leading-none">+</span> New List
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, left: "50%", transform: "translateX(-50%)" }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-[#18181b] rounded-t-3xl border-t border-white/10 flex flex-col" style={{ maxHeight: "85vh", overflowY: "auto" }}>
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>
            <div className="p-6 flex flex-col gap-4 pb-16">
              <h2 className="font-bricolage font-extrabold text-white text-xl">Create a List</h2>
              <form onSubmit={createList} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-white/60 text-xs uppercase tracking-widest font-jakarta">Cover Emoji</label>
                  <div className="flex gap-2 flex-wrap">
                    {["📍", "🍽️", "☕", "🍸", "🛍️", "🗺️", "✈️", "🌆", "🎭", "🌿"].map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                          emoji === e ? "bg-purple border-2 border-purple" : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs uppercase tracking-widest font-jakarta">List Name *</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My West Village Faves"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 font-jakarta text-base focus:outline-none focus:border-purple transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/60 text-xs uppercase tracking-widest font-jakarta">Description (optional)</label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What's this list about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 font-jakarta text-base focus:outline-none focus:border-purple transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={creating || !title.trim()}
                  className="w-full bg-lime text-dark font-bricolage font-extrabold text-lg py-4 rounded-xl disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create List →"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 flex flex-col gap-3">
        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-2 border-purple border-t-transparent animate-spin" />
          </div>
        )}
        {!loading && lists.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="text-5xl">✨</div>
            <p className="font-bricolage font-bold text-white text-lg">No lists yet</p>
            <p className="text-white/40 font-jakarta text-sm leading-relaxed">Create your first list and share it with your community!</p>
            <button onClick={() => setShowCreate(true)} className="bg-purple text-white font-jakarta font-semibold px-6 py-3 rounded-xl">
              Create your first list
            </button>
          </div>
        )}
        {lists.map((list) => (
          <Link
            key={list.id}
            href={`/app/lists/${list.id}`}
            className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 active:scale-[0.98] transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple/20 flex items-center justify-center text-3xl flex-shrink-0">
              {list.cover_emoji || "📍"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bricolage font-bold text-white text-base truncate">{list.title}</p>
              {list.description && (
                <p className="text-white/40 text-xs font-jakarta mt-0.5 truncate">{list.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white/20 text-xs font-jakarta">{list.city || "New York"}</span>
                {list.is_public && <span className="text-xs font-jakarta font-semibold text-lime/70">· Public</span>}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#ffffff30" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
