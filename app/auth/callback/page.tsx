"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.replace("/?error=auth");
        } else {
          router.replace("/app/home");
        }
      });
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? "/app/home" : "/");
      });
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-purple border-t-transparent animate-spin" />
        <p className="text-white font-jakarta">Signing you in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-dark flex items-center justify-center">
          <p className="text-white font-jakarta">Loading...</p>
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
