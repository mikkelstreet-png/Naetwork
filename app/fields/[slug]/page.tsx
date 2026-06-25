import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FieldGuideContent } from '@/components/FieldGuideContent';
import { FIELD_GUIDES, FIELD_SLUGS } from '@/lib/fieldGuides';
import type { FieldSlug } from '@/lib/fieldGuides';

export function generateStaticParams() {
  return FIELD_SLUGS.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const field = FIELD_GUIDES[params.slug as FieldSlug];
  if (!field) return { title: 'Felt - Naetwork' };
  return {
    title: `${field.label} karrieresessioner - Naetwork`,
    description: field.description.da,
  };
}

export default function FieldPage({ params }: { params: { slug: string } }) {
  const slug = params.slug as FieldSlug;
  if (!FIELD_GUIDES[slug]) notFound();

  return <FieldGuideContent slug={slug} />;
}
