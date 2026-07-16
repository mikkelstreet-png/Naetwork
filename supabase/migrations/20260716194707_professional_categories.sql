BEGIN;

-- Map every legacy profile to one primary category and one or more of its
-- supported related areas. The column name is retained for API compatibility,
-- but its values now represent related areas rather than top-level categories.
UPDATE public.professional_profiles
SET industries = CASE
  WHEN industries && ARRAY[
    'Legal', 'Law', 'Corporate Law', 'M&A', 'Commercial Law',
    'Compliance', 'Regulatory', 'Governance'
  ]::TEXT[] THEN
    CASE
      WHEN cardinality(array_remove(ARRAY[
        CASE WHEN industries && ARRAY['Legal', 'Law', 'Corporate Law']::TEXT[] THEN 'Corporate Law' END,
        CASE WHEN industries @> ARRAY['M&A']::TEXT[] THEN 'M&A' END,
        CASE WHEN industries @> ARRAY['Commercial Law']::TEXT[] THEN 'Commercial Law' END,
        CASE WHEN industries @> ARRAY['Compliance']::TEXT[] THEN 'Compliance' END,
        CASE WHEN industries @> ARRAY['Regulatory']::TEXT[] THEN 'Regulatory' END,
        CASE WHEN industries @> ARRAY['Governance']::TEXT[] THEN 'Governance' END
      ], NULL)) > 0 THEN array_remove(ARRAY[
        CASE WHEN industries && ARRAY['Legal', 'Law', 'Corporate Law']::TEXT[] THEN 'Corporate Law' END,
        CASE WHEN industries @> ARRAY['M&A']::TEXT[] THEN 'M&A' END,
        CASE WHEN industries @> ARRAY['Commercial Law']::TEXT[] THEN 'Commercial Law' END,
        CASE WHEN industries @> ARRAY['Compliance']::TEXT[] THEN 'Compliance' END,
        CASE WHEN industries @> ARRAY['Regulatory']::TEXT[] THEN 'Regulatory' END,
        CASE WHEN industries @> ARRAY['Governance']::TEXT[] THEN 'Governance' END
      ], NULL)
      ELSE ARRAY['Corporate Law']::TEXT[]
    END
  WHEN industries && ARRAY[
    'Finance', 'Banking', 'Investment Banking', 'Private Equity',
    'Asset Management', 'Corporate Finance', 'Commercial Banking',
    'Capital Markets', 'Markets', 'Investments'
  ]::TEXT[] THEN
    CASE
      WHEN cardinality(array_remove(ARRAY[
        CASE WHEN industries @> ARRAY['Investment Banking']::TEXT[] THEN 'Investment Banking' END,
        CASE WHEN industries @> ARRAY['Private Equity']::TEXT[] THEN 'Private Equity' END,
        CASE WHEN industries @> ARRAY['Asset Management']::TEXT[] THEN 'Asset Management' END,
        CASE WHEN industries && ARRAY['Finance', 'Corporate Finance']::TEXT[] THEN 'Corporate Finance' END,
        CASE WHEN industries && ARRAY['Banking', 'Commercial Banking']::TEXT[] THEN 'Commercial Banking' END,
        CASE WHEN industries && ARRAY['Capital Markets', 'Markets']::TEXT[] THEN 'Markets' END,
        CASE WHEN industries @> ARRAY['Investments']::TEXT[] THEN 'Investments' END
      ], NULL)) > 0 THEN array_remove(ARRAY[
        CASE WHEN industries @> ARRAY['Investment Banking']::TEXT[] THEN 'Investment Banking' END,
        CASE WHEN industries @> ARRAY['Private Equity']::TEXT[] THEN 'Private Equity' END,
        CASE WHEN industries @> ARRAY['Asset Management']::TEXT[] THEN 'Asset Management' END,
        CASE WHEN industries && ARRAY['Finance', 'Corporate Finance']::TEXT[] THEN 'Corporate Finance' END,
        CASE WHEN industries && ARRAY['Banking', 'Commercial Banking']::TEXT[] THEN 'Commercial Banking' END,
        CASE WHEN industries && ARRAY['Capital Markets', 'Markets']::TEXT[] THEN 'Markets' END,
        CASE WHEN industries @> ARRAY['Investments']::TEXT[] THEN 'Investments' END
      ], NULL)
      ELSE ARRAY['Corporate Finance']::TEXT[]
    END
  ELSE
    CASE
      WHEN cardinality(array_remove(ARRAY[
        CASE WHEN industries && ARRAY['Consulting', 'Management Consulting']::TEXT[] THEN 'Management Consulting' END,
        CASE WHEN industries @> ARRAY['Strategy']::TEXT[] THEN 'Strategy' END,
        CASE WHEN industries && ARRAY['AI', 'Transformation']::TEXT[] THEN 'Transformation' END,
        CASE WHEN industries @> ARRAY['Business Development']::TEXT[] THEN 'Business Development' END,
        CASE WHEN industries @> ARRAY['Operations']::TEXT[] THEN 'Operations' END,
        CASE WHEN industries @> ARRAY['PMO']::TEXT[] THEN 'PMO' END
      ], NULL)) > 0 THEN array_remove(ARRAY[
        CASE WHEN industries && ARRAY['Consulting', 'Management Consulting']::TEXT[] THEN 'Management Consulting' END,
        CASE WHEN industries @> ARRAY['Strategy']::TEXT[] THEN 'Strategy' END,
        CASE WHEN industries && ARRAY['AI', 'Transformation']::TEXT[] THEN 'Transformation' END,
        CASE WHEN industries @> ARRAY['Business Development']::TEXT[] THEN 'Business Development' END,
        CASE WHEN industries @> ARRAY['Operations']::TEXT[] THEN 'Operations' END,
        CASE WHEN industries @> ARRAY['PMO']::TEXT[] THEN 'PMO' END
      ], NULL)
      ELSE ARRAY['Business Development']::TEXT[]
    END
END;

ALTER TABLE public.professional_profiles
  DROP CONSTRAINT IF EXISTS professional_profiles_category_areas_check;

ALTER TABLE public.professional_profiles
  ADD CONSTRAINT professional_profiles_category_areas_check
  CHECK (
    cardinality(industries) > 0
    AND (
      industries <@ ARRAY[
        'Management Consulting', 'Strategy', 'Transformation',
        'Business Development', 'Operations', 'PMO'
      ]::TEXT[]
      OR industries <@ ARRAY[
        'Investment Banking', 'Private Equity', 'Asset Management',
        'Corporate Finance', 'Commercial Banking', 'Markets', 'Investments'
      ]::TEXT[]
      OR industries <@ ARRAY[
        'Corporate Law', 'M&A', 'Commercial Law',
        'Compliance', 'Regulatory', 'Governance'
      ]::TEXT[]
    )
  );

COMMENT ON COLUMN public.professional_profiles.industries IS
  'Related professional areas. Values must belong to exactly one of the Consulting, Finance or Legal category sets.';

COMMIT;
