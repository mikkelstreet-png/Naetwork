import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { FieldGuideContent } from '@/components/FieldGuideContent';
import { FIELD_GUIDES, FIELD_SLUGS, LEGACY_FIELD_REDIRECTS } from '@/lib/fieldGuides';
import type { FieldSlug } from '@/lib/fieldGuides';

export function generateStaticParams() {
  return FIELD_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = LEGACY_FIELD_REDIRECTS[slug] ?? slug;
  const field = FIELD_GUIDES[canonicalSlug as FieldSlug];
  if (!field) return { title: 'Category - Naetwork' };
  return {
    title: `${field.label} karrieresessioner - Naetwork`,
    description: field.description.en,
    alternates: { canonical: `/fields/${canonicalSlug}` },
  };
}

export default async function FieldPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const redirectSlug = LEGACY_FIELD_REDIRECTS[rawSlug];
  if (redirectSlug) permanentRedirect(`/fields/${redirectSlug}`);
  const slug = rawSlug as FieldSlug;
  if (!FIELD_GUIDES[slug]) notFound();

  return <FieldGuideContent slug={slug} />;
}
