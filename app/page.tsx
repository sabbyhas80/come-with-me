"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Role = "Explorer" | "Creator" | "Brand";

const ROLES: Role[] = ["Explorer", "Creator", "Brand"];

const ROLE_DESCRIPTIONS: Record<Role, string> = {
  Explorer: "Discover & save places from your feed",
  Creator: "Build and share location guides",
  Brand: "Connect with place-obsessed audiences",
};

const SHARE_MESSAGE =
  "I just joined the Come With Me waitlist 🗺️ — an app that turns your TikTok & Instagram feed into a personal map. Join me:";

export default function Home() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Explorer");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => setCount(d.count))
      .catch(() => {});
  }, [success]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong. Try again.");
      return;
    }

    setSuccess(true);
  }

  function handleCopy() {
    navigator.clipboard.writeText(`${SHARE_MESSAGE} ${window.location.origin}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="min-h-screen bg-dark flex flex-col items-center justify-start px-5 py-12">
      <div className="w-full max-w-[430px] flex flex-col gap-8">
        {/* Logo / wordmark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="7" r="3" fill="#CAFF33" />
              <path
                d="M8 2C5.24 2 3 4.24 3 7c0 3.5 5 9 5 9s5-5.5 5-9c0-2.76-2.24-5-5-5z"
                stroke="#CAFF33"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
          <span className="font-bricolage font-extrabold text-white text-lg tracking-tight">
            come with me
          </span>
        </div>

        {/* Headline */}
        <div className="flex flex-col gap-3">
          <h1 className="font-bricolage font-extrabold text-[2.75rem] leading-[1.05] text-white">
            Stop Scrolling.{" "}
            <span className="text-purple">Start Exploring.</span>
          </h1>
          <p className="text-white/60 text-[1.05rem] leading-relaxed font-jakarta">
            Turn your social feed into a personal map of the world&apos;s best
            places.
          </p>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {["🧭", "📍", "🌍", "✈️"].map((emoji, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-sm"
              >
                {emoji}
              </div>
            ))}
          </div>
          {count !== null && count > 0 ? (
            <p className="text-white/50 text-sm font-jakarta">
              <span className="text-white font-semibold">
                {count.toLocaleString()}
              </span>{" "}
              explorers already on the list
            </p>
          ) : (
            <p className="text-white/50 text-sm font-jakarta">
              Be among the first to explore
            </p>
          )}
        </div>

        {/* Form or Success */}
        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Role selector */}
            <div className="flex flex-col gap-2">
              <label className="text-white/60 text-xs uppercase tracking-widest font-jakarta">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2.5 px-3 rounded-xl text-sm font-semibold font-jakarta transition-all duration-150 border ${
                      role === r
                        ? "bg-purple border-purple text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-white/40 text-xs font-jakarta">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>

            {/* Email input */}
            <div className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/30 font-jakarta text-base focus:outline-none focus:border-purple transition-colors"
              />
              {error && (
                <p className="text-red-400 text-sm font-jakarta">{error}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime text-dark font-bricolage font-extrabold text-lg py-4 rounded-xl hover:bg-lime/90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "Join the Waitlist →"}
            </button>
          </form>
        ) : (
          /* Success state */
          <div className="flex flex-col gap-5 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 rounded-full bg-lime/20 flex items-center justify-center text-2xl">
                🎉
              </div>
              <h2 className="font-bricolage font-extrabold text-2xl text-white">
                You&apos;re on the list!
              </h2>
              <p className="text-white/60 text-sm font-jakarta leading-relaxed">
                We&apos;ll reach out when it&apos;s your turn. Move up by
                sharing with friends.
              </p>
            </div>

            <div className="bg-dark border border-white/10 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-white/60 text-sm font-jakarta leading-relaxed italic">
                &ldquo;{SHARE_MESSAGE}&rdquo;
              </p>
              <button
                onClick={handleCopy}
                className="w-full bg-lime text-dark font-bricolage font-bold text-base py-3 rounded-lg hover:bg-lime/90 active:scale-95 transition-all duration-150"
              >
                {copied ? "Copied! ✓" : "Copy & Share"}
              </button>
            </div>

            {count !== null && (
              <p className="text-white/40 text-xs font-jakarta text-center">
                You&apos;re #{count.toLocaleString()} on the waitlist
              </p>
            )}
          </div>
        )}

        {/* Demo CTA */}
        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs font-jakarta">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
          <Link
            href="/app"
            className="w-full border border-white/15 text-white font-jakarta font-semibold text-base py-4 rounded-xl hover:border-white/30 hover:bg-white/5 active:scale-95 transition-all duration-150 text-center"
          >
            Try the Demo →
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="flex flex-col gap-3 pt-2">
          {[
            {
              icon: "📱",
              title: "Save from TikTok & Instagram",
              desc: "Tap share → Come With Me. We extract the place automatically.",
            },
            {
              icon: "🗺️",
              title: "Your personal place map",
              desc: "Every saved spot pinned on a beautiful interactive map, organized your way.",
            },
            {
              icon: "✈️",
              title: "Plan trips from your saves",
              desc: "Turn a folder of inspo into a real itinerary in seconds.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4"
            >
              <div className="text-2xl mt-0.5">{f.icon}</div>
              <div className="flex flex-col gap-1">
                <p className="font-bricolage font-bold text-white text-base">
                  {f.title}
                </p>
                <p className="text-white/50 text-sm font-jakarta leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-white/20 text-xs font-jakarta text-center pb-4">
          © 2025 Come With Me. Made for curious people.
        </p>
      </div>
    </main>
  );
}
