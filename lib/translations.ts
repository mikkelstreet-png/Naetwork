export type Lang = 'da' | 'en'

export const t: Record<Lang, Record<string, string>> = {
  da: {
    'nav.login': 'Log ind',
    'nav.dashboard': 'Overblik',
    'nav.logout': 'Log ud',
    'footer.privacy_link': 'Privatlivspolitik',
    'footer.terms': 'Vilkår',
    'footer.cookies': 'Cookies',
    'footer.legal': 'Naetwork er et uafhængigt initiativ. Bidrag gælder kun for betalte sessioner. Betaling er endnu ikke aktiveret.',
    'footer.copyright': '© 2026 Naetwork. Alle rettigheder forbeholdes.',
  },
  en: {
    'nav.login': 'Log in',
    'nav.dashboard': 'Overview',
    'nav.logout': 'Log out',
    'footer.privacy_link': 'Privacy policy',
    'footer.terms': 'Terms',
    'footer.cookies': 'Cookies',
    'footer.legal': 'Naetwork is an independent initiative. Contributions apply only to paid sessions. Payments are not enabled yet.',
    'footer.copyright': '© 2026 Naetwork. All rights reserved.',
  },
}
