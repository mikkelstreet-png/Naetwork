import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FieldGuideContent } from '@/components/FieldGuideContent';
import { FIELD_GUIDES, FIELD_SLUGS, FieldSlug } from '@/lib/fieldGuides';

export function generateStaticParams() {
  return FIELD_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const field = FIELD_GUIDES[params.slug as FieldSlug];
  if (!field) return { title: 'Field - Naetwork' };
  return {
    title: `${field.label} career sessions - Naetwork`,
    description: field.description.en,
  };
}

export default function FieldPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as FieldSlug;
  if (!FIELD_GUIDES[slug]) notFound();

  return <FieldGuideContent slug={slug} />;
}
