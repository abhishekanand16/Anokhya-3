import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getEventBySlug } from "@/data/events";
import { eventTerms, getEventTerms } from "@/data/terms";
import { EventTermsBody } from "@/components/event-terms";

export function generateStaticParams() {
  return eventTerms.map((terms) => ({ slug: terms.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const terms = getEventTerms(slug);
  if (!terms) return {};
  return { title: `${terms.title} terms` };
}

export default async function EventTermsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  const terms = getEventTerms(slug);
  if (!event || !terms) notFound();

  return (
    <section className="section py-14 sm:py-20">
      <Link
        href={`/events/${event.slug}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to {event.name}
      </Link>
      <p className="eyebrow">Terms and conditions</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{terms.title}</h1>
      <div className="terms-page mt-8">
        <EventTermsBody terms={terms} />
      </div>
    </section>
  );
}
