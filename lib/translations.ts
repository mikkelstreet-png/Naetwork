export type Lang = 'da' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  da: {
    // Hero
    'hero.h1': 'Book en session med en erfaren professionel. Paa en time.',
    'hero.sub': 'Naetwork forbinder studerende og jobsogende med erfarne professionelle til mock interviews, CV-gennemgang og karriereraadgivning.',
    'hero.cta1': 'Find en professionel',
    'hero.cta2': 'Bliv professionel',
    'hero.trust': 'DKK 300–2.000 / session · 15% platformsbidrag · Stoet Kraeftens Bekaempelse',

    // Nav
    'nav.find': 'Find professionelle',
    'nav.become': 'Bliv professionel',
    'nav.about': 'Om',
    'nav.login': 'Log ind',
    'nav.book': 'Book nu',

    // Sessions
    'sessions.title': 'Valg af session',
    'sessions.mock': 'Mock Interview',
    'sessions.mock.desc': 'Oev dig til det interview der betyder noget',
    'sessions.cv': 'CV & LinkedIn',
    'sessions.cv.desc': 'Faa professionel feedback paa dit CV og profil',
    'sessions.chat': 'Uformel 1:1',
    'sessions.chat.desc': 'En aaben snak med en der er naaet dertil',
    'sessions.advice': 'Karriereraadgivning',
    'sessions.advice.desc': 'Strategisk sparring om din naeste karrierebeslutning',

    // Charity
    'charity.label': 'Donerer til Kraeftens Bekaempelse',
    'charity.desc': 'Denne professionelle donerer sit honorar til Kraeftens Bekaempelse og betaler kun 7,5% i platformsbidrag.',
    'charity.toggle': 'Jeg oensker at donere mit honorar til Kraeftens Bekaempelse',
    'charity.badge': 'Donerer til Kraeftens Bekaempelse',
    'charity.platform_fee': '7,5% platformsbidrag ved donation',

    // Booking
    'booking.title': 'Book en session',
    'booking.session_type': 'Valg session-type',
    'booking.message': 'Besked til den professionelle (valgfri)',
    'booking.time': 'Foretrukken tid',
    'booking.time.placeholder': 'F.eks. "Mandag 16-18 eller tirsdag formiddag"',
    'booking.summary': 'Prisoversigt',
    'booking.session_price': 'Sessionspris',
    'booking.commission': 'Platformsbidrag',
    'booking.payout': 'Til professionel',
    'booking.donate': 'Til Kraeftens Bekaempelse',
    'booking.cta': 'Betal og book',
    'booking.pending_note': 'Betaling bekraeftes inden for 24 timer',
    'booking.confirmed': 'Din booking er modtaget! Vi vender tilbage med bekraeftelse inden for 24 timer.',

    // Dashboard
    'dashboard.candidate.title': 'Mine bookinger',
    'dashboard.professional.title': 'Mine sessioner',
    'dashboard.earnings': 'Samlet indtjening',
    'dashboard.charity_total': 'Doneret til Kraeftens Bekaempelse',
    'dashboard.upcoming': 'Kommende sessioner',
    'dashboard.no_bookings': 'Ingen bookinger endnu',

    // Status
    'status.pending': 'Afventer',
    'status.confirmed': 'Bekraeftet',
    'status.completed': 'Gennemfoert',
    'status.cancelled': 'Annulleret',

    // Professional profile
    'professional.book': 'Book en session',
    'professional.sessions_offered': 'Tilbudte sessioner',
    'professional.reviews': 'Anmeldelser',
    'professional.no_reviews': 'Ingen anmeldelser endnu',
    'professional.price': 'DKK {price} / session',
    'professional.languages': 'Sprog',

    // Signup professional
    'signup.pro.title': 'Bliv professionel paa Naetwork',
    'signup.pro.step1': 'Grundlaeggede oplysninger',
    'signup.pro.step2': 'Session-konfiguration',
    'signup.pro.step3': 'Donationsvalg',
    'signup.pro.step4': 'Bekraeft og opret',
    'signup.pro.name': 'Fulde navn',
    'signup.pro.title_field': 'Titel / stilling',
    'signup.pro.company': 'Virksomhed',
    'signup.pro.industry': 'Branche',
    'signup.pro.bio': 'Kort bio',
    'signup.pro.linkedin': 'LinkedIn URL',
    'signup.pro.price_label': 'Pris per session (DKK)',
    'signup.pro.next': 'Naeste',
    'signup.pro.back': 'Tilbage',
    'signup.pro.submit': 'Opret profil',

    // Settings
    'settings.title': 'Indstillinger',
    'settings.price': 'Pris per session',
    'settings.availability': 'Tilgaengelighed',
    'settings.charity': 'Donationsindstillinger',
    'settings.save': 'Gem aendringer',
    'settings.delete': 'Slet konto',

    // Footer
    'footer.tagline': 'Karrieresessioner med mennesker der ved det.',
    'footer.legal': 'Naetwork opkraever 15% platformsbidrag (7,5% ved donation til Kraeftens Bekaempelse). Alle betalinger behandles sikkert via Stripe.',

    // General
    'general.loading': 'Indlaeser...',
    'general.error': 'Noget gik galt',
    'general.back': 'Tilbage',
    'general.save': 'Gem',
    'general.cancel': 'Annuller',
    'general.dkk': 'DKK',
  },
  en: {
    // Hero
    'hero.h1': 'Book a session with an experienced professional. In one hour.',
    'hero.sub': 'Naetwork connects students and job seekers with experienced professionals for mock interviews, CV reviews, and career guidance.',
    'hero.cta1': 'Find a professional',
    'hero.cta2': 'Become a professional',
    'hero.trust': 'DKK 300–2,000 / session · 15% platform fee · Support Kraeftens Bekaempelse',

    // Nav
    'nav.find': 'Find professionals',
    'nav.become': 'Become a professional',
    'nav.about': 'About',
    'nav.login': 'Log in',
    'nav.book': 'Book now',

    // Sessions
    'sessions.title': 'Session type',
    'sessions.mock': 'Mock Interview',
    'sessions.mock.desc': 'Practice for the interview that matters',
    'sessions.cv': 'CV & LinkedIn',
    'sessions.cv.desc': 'Get professional feedback on your CV and profile',
    'sessions.chat': 'Informal 1:1',
    'sessions.chat.desc': 'An open conversation with someone who has been there',
    'sessions.advice': 'Career advice',
    'sessions.advice.desc': 'Strategic guidance on your next career decision',

    // Charity
    'charity.label': 'Donates to Kraeftens Bekaempelse',
    'charity.desc': 'This professional donates their fee to Kraeftens Bekaempelse and only pays 7.5% platform fee.',
    'charity.toggle': 'I want to donate my fee to Kraeftens Bekaempelse',
    'charity.badge': 'Donates to Kraeftens Bekaempelse',
    'charity.platform_fee': '7.5% platform fee with donation',

    // Booking
    'booking.title': 'Book a session',
    'booking.session_type': 'Select session type',
    'booking.message': 'Message to the professional (optional)',
    'booking.time': 'Preferred time',
    'booking.time.placeholder': 'E.g. "Monday 4-6pm or Tuesday morning"',
    'booking.summary': 'Price summary',
    'booking.session_price': 'Session price',
    'booking.commission': 'Platform fee',
    'booking.payout': 'To professional',
    'booking.donate': 'To Kraeftens Bekaempelse',
    'booking.cta': 'Pay and book',
    'booking.pending_note': 'Payment confirmed within 24 hours',
    'booking.confirmed': 'Your booking is received! We will confirm within 24 hours.',

    // Dashboard
    'dashboard.candidate.title': 'My bookings',
    'dashboard.professional.title': 'My sessions',
    'dashboard.earnings': 'Total earnings',
    'dashboard.charity_total': 'Donated to Kraeftens Bekaempelse',
    'dashboard.upcoming': 'Upcoming sessions',
    'dashboard.no_bookings': 'No bookings yet',

    // Status
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',

    // Professional profile
    'professional.book': 'Book a session',
    'professional.sessions_offered': 'Sessions offered',
    'professional.reviews': 'Reviews',
    'professional.no_reviews': 'No reviews yet',
    'professional.price': 'DKK {price} / session',
    'professional.languages': 'Languages',

    // Signup professional
    'signup.pro.title': 'Become a professional on Naetwork',
    'signup.pro.step1': 'Basic information',
    'signup.pro.step2': 'Session configuration',
    'signup.pro.step3': 'Donation preference',
    'signup.pro.step4': 'Confirm and create',
    'signup.pro.name': 'Full name',
    'signup.pro.title_field': 'Title / position',
    'signup.pro.company': 'Company',
    'signup.pro.industry': 'Industry',
    'signup.pro.bio': 'Short bio',
    'signup.pro.linkedin': 'LinkedIn URL',
    'signup.pro.price_label': 'Price per session (DKK)',
    'signup.pro.next': 'Next',
    'signup.pro.back': 'Back',
    'signup.pro.submit': 'Create profile',

    // Settings
    'settings.title': 'Settings',
    'settings.price': 'Price per session',
    'settings.availability': 'Availability',
    'settings.charity': 'Donation settings',
    'settings.save': 'Save changes',
    'settings.delete': 'Delete account',

    // Footer
    'footer.tagline': 'Career sessions with people who know.',
    'footer.legal': 'Naetwork charges 15% platform fee (7.5% with donation to Kraeftens Bekaempelse). All payments processed securely via Stripe.',

    // General
    'general.loading': 'Loading...',
    'general.error': 'Something went wrong',
    'general.back': 'Back',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.dkk': 'DKK',
  },
};

export function t(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let str = translations[lang][key] ?? translations['da'][key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}
