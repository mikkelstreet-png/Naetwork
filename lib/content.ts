export type Dict = {
  footer: {
    blurb: string;
    columns: Array<{
      title: string;
      links: Array<{ label: string; href: string }>;
    }>;
    legal: string;
  };
};

export const site = {
  name: 'Naetwork',
};

export const defaultFooter: Dict['footer'] = {
  blurb: 'Et gratis, uafhængigt initiativ der forbinder virksomheder med AI-specialister — uden mellemled eller kommission.',
  columns: [
    {
      title: 'Platform',
      links: [
        { label: 'Opret projekt', href: '/signup' },
        { label: 'Projekter', href: '/projekter' },
        { label: 'Bliv specialist', href: '/specialist' },
      ],
    },
    {
      title: 'Juridisk',
      links: [
        { label: 'Privatlivspolitik', href: '/privatlivspolitik' },
        { label: 'Vilkår', href: '/vilkaar' },
        { label: 'Ansvarsfraskrivelse', href: '/ansvarsfraskrivelse' },
      ],
    },
  ],
  legal: 'Naetwork er en gratis platform. Vi er ikke part i aftaler mellem virksomheder og specialister.',
};
