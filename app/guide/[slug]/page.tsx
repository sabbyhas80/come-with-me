import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import GuideClient from "./GuideClient";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data: guide } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!guide) return { title: "Guide not found" };

  return {
    title: guide.title,
    description: guide.intro,
    openGraph: {
      title: guide.title,
      description: guide.intro,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.intro,
    },
  };
}

export default async function GuidePage({ params }: { params: { slug: string } }) {
  const { data: guide } = await supabase
    .from("guides")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (!guide) notFound();

  const { data: places } = await supabase
    .from("guide_places")
    .select("*")
    .eq("guide_id", guide.id)
    .order("position");

  return <GuideClient guide={guide} places={places || []} />;
}
