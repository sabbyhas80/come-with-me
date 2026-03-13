import Link from "next/link";
import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-[430px] mx-auto relative min-h-screen pb-24">
        <Link
          href="/"
          className="absolute top-4 left-4 z-50 flex items-center gap-1 text-white/30 hover:text-white/60 transition-colors text-xs font-jakarta"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Back
        </Link>
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
