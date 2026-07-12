import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FieldGuideContent } from '@/components/FieldGuideContent';
import { FIELD_GUIDES, FIELD_SLUGS } from '@/lib/fieldGuides';
import type { FieldSlug } from '@/lib/fieldGuides';

export function generateStaticParams() {
  return FIELD_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const field = FIELD_GUIDES[slug as FieldSlug];
  if (!field) return { title: 'Field - Naetwork' };
  return {
    title: `${field.label} Career Access - Naetwork`,
    description: field.description.en,
    alternates: { canonical: `/fields/${slug}` },
  };
}

export default async function FieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug as FieldSlug;
  if (!FIELD_GUIDES[slug]) notFound();

  return <FieldGuideContent slug={slug} />;
}
