import Link from "next/link";

export default function AppDemo() {
  return (
    <main className="min-h-screen bg-dark flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-[430px] flex flex-col gap-6 items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-purple/20 border border-purple/30 flex items-center justify-center text-3xl">
          🗺️
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bricolage font-extrabold text-3xl text-white">
            Demo coming soon
          </h1>
          <p className="text-white/50 font-jakarta text-base leading-relaxed">
            The full map experience is in development. Join the waitlist to get
            early access.
          </p>
        </div>
        <Link
          href="/"
          className="bg-lime text-dark font-bricolage font-extrabold text-base py-3 px-8 rounded-xl hover:bg-lime/90 active:scale-95 transition-all duration-150"
        >
          ← Back to Waitlist
        </Link>
      </div>
    </main>
  );
}
