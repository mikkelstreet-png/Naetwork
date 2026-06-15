export type Lang = 'da' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  da: {
    // ── Hero (new copy) ──
    'hero.h1': 'En time med den rette person kan ændre din karriere.',
    'hero.sub': 'Naetwork forbinder ambitiøse kandidater med erfarne professionelle fra Banking, Private Equity, AI og Management Consulting — til en direkte, ærlig og personlig session.',
    'hero.cta.primary': 'Find din session →',
    'hero.cta.secondary': 'Bliv professionel på Naetwork',
    // legacy keys kept for backward compat
    'hero.cta1': 'Find din session →',
    'hero.cta2': 'Bliv professionel',
    'hero.trust': 'DKK 300–2.000 / session · 15% platformsbidrag · Støt Kræftens Bekæmpelse',

    // ── Nav ──
    'nav.find': 'Find professionelle',
    'nav.become': 'Bliv professionel',
    'nav.about': 'Om',
    'nav.login': 'Log ind',
    'nav.book': 'Book nu',

    // ── Om Naetwork ──
    'about.headline': 'Hvad er Naetwork?',
    'about.body': 'Naetwork er ikke endnu en jobplatform. Det er adgang til de samtaler, der normalt kun sker via netværk og tilfældigheder — nu struktureret, tilgængeligt og med et klart formål. Du betaler for én times fokuseret sparring med nogen, der har gjort præcis det, du forsøger at gøre.',
    'about.bullet1': 'Kun 4 industrier: Banking, Private Equity, AI og Management Consulting',
    'about.bullet2': 'Alle professionelle er verificerede med LinkedIn-profil',
    'about.bullet3': 'Du betaler kun for sessionen — ingen abonnement',

    // ── Hvorfor Naetwork ──
    'why.headline': 'Hvorfor Naetwork?',
    'why.candidate.title': 'Du er kandidat',
    'why.candidate.body': 'Du kan google alt om en branche. Det du ikke kan google er, hvad der faktisk adskiller dem der kommer ind fra dem der ikke gør. Naetwork giver dig én time med nogen der ved det — og som fortæller dig det ligeud.',
    'why.candidate.bullet1': 'Forbered dig til det specifikke interview',
    'why.candidate.bullet2': 'Få din CV og LinkedIn vurderet af nogen der screener kandidater',
    'why.candidate.bullet3': 'Forstå kulturen og hvad der reelt tæller',
    'why.candidate.bullet4': 'DKK 300–2.000 per session — ingen binding',
    'why.professional.title': 'Du er professionel',
    'why.professional.body': 'Del din erfaring på dine vilkår. Sæt din egen pris, vælg dine tidspunkter og de typer sessions, du trives i. Naetwork klarer booking og betaling — du leverer det, du er god til.',
    'why.professional.bullet1': 'Du sætter prisen: DKK 300–2.000 per session',
    'why.professional.bullet2': 'Vælg selv tilgængelighed og session-typer',
    'why.professional.bullet3': 'Mulighed for at donere til Kræftens Bekæmpelse (reducerer kommission til 7,5%)',
    'why.professional.bullet4': 'Ingen binding — pausér eller stop når du vil',

    // ── Session types ──
    'sessions.headline': 'Vælg den session, du har brug for',
    'sessions.title': 'Valg af session',
    'sessions.mock': 'Mock Interview',
    'sessions.mock.title': 'Mock Interview',
    'sessions.mock.tagline': 'Kom ind — ikke hjem for at øve dig mere',
    'sessions.mock.desc': 'Et realistisk interview med en der sidder i din målbranche. Direkte feedback, konkrete svar på hvad der virker — og hvad der ikke gør.',
    'sessions.cv': 'CV & LinkedIn Review',
    'sessions.cv.title': 'CV & LinkedIn Review',
    'sessions.cv.tagline': 'Hvad screener en hiring manager fra — og hvad holder?',
    'sessions.cv.desc': 'Én time med nogen der har screenet hundredvis af kandidater. Du får at vide, hvad der virker i din specifikke branche.',
    'sessions.chat': 'Uformel 1:1',
    'sessions.chat.title': 'Uformel 1:1',
    'sessions.chat.tagline': 'Svar på det du aldrig kan google',
    'sessions.chat.desc': 'Hvad er kulturen egentlig? Hvad kigger de på? Hvad ville du gøre anderledes? En ærlig samtale uden dagsorden.',
    'sessions.career.title': 'Karriererådgivning',
    'sessions.career.tagline': 'Ikke et kursus. En sparring med nogen der ved det.',
    'sessions.career.desc': 'Strategisk overblik over dit næste karriereskridt — branche, timing, og hvad der giver mening for dig specifikt.',
    'sessions.advice': 'Karriererådgivning',
    'sessions.advice.desc': 'Strategisk sparring om din næste karrierebeslutning',

    // ── Sådan fungerer det ──
    'how.headline': 'Sådan fungerer det',
    'how.tab.candidate': 'Jeg er kandidat',
    'how.tab.professional': 'Jeg er professionel',
    'how.candidate.step1.title': 'Find din match',
    'how.candidate.step1.desc': 'Gennemse profiler og filtrer på industri og session-type. Læs om erfaring, pris og hvad andre kandidater siger.',
    'how.candidate.step2.title': 'Book og betal',
    'how.candidate.step2.desc': 'Vælg et ledigt tidspunkt og betal sikkert via Stripe. Du modtager bekræftelse med al information til sessionen.',
    'how.candidate.step3.title': 'Mød op forberedt',
    'how.candidate.step3.desc': 'Én time, ét fokus. Reelle svar fra én der har gjort præcis det, du vil gøre.',
    'how.professional.step1.title': 'Opret din profil',
    'how.professional.step1.desc': 'Fortæl om din baggrund, sæt din pris og vælg de session-typer, du tilbyder. Det tager under 10 minutter.',
    'how.professional.step2.title': 'Modtag bookings',
    'how.professional.step2.desc': 'Kandidater finder dig og booker direkte. Du godkender og modtager alt information til sessionen.',
    'how.professional.step3.title': 'Afhold sessionen',
    'how.professional.step3.desc': 'Hold sessionen på den platform I aftaler. Naetwork sørger for betaling — du modtager din andel automatisk.',

    // ── Kræftens Bekæmpelse ──
    'charity.headline': 'Giv noget tilbage — og reducer din kommission',
    'charity.body': 'Som professionel på Naetwork kan du vælge at donere dit honorar til Kræftens Bekæmpelse. Kandidaten betaler det samme. Din platformskommission halveres fra 15% til 7,5%. Du viser det med et hjerte-badge på din profil.',
    'charity.label': 'Donerer til Kræftens Bekæmpelse',
    'charity.desc': 'Denne professionelle donerer sit honorar til Kræftens Bekæmpelse og betaler kun 7,5% i platformsbidrag.',
    'charity.toggle': 'Jeg ønsker at donere mit honorar til Kræftens Bekæmpelse',
    'charity.badge': 'Donerer til Kræftens Bekæmpelse',
    'charity.platform_fee': '7,5% platformsbidrag ved donation',

    // ── Trust signals ──
    'trust.stat1.value': '4 industrier',
    'trust.stat1.desc': 'Kun Banking, PE, AI og Consulting',
    'trust.stat2.value': 'DKK 300',
    'trust.stat2.desc': 'Laveste sessionspris — ingen skjulte gebyrer',
    'trust.stat3.value': '15% gebyr',
    'trust.stat3.desc': '7,5% ved donation til Kræftens Bekæmpelse',
    'trust.stat4.value': '1:1 altid',
    'trust.stat4.desc': 'Aldrig gruppeformater',

    // ── Final CTA ──
    'cta.headline': 'Klar til at tage næste skridt?',
    'cta.sub': 'Find den professionelle der matcher præcis det, du har brug for.',
    'cta.button': 'Se alle professionelle',

    // ── Booking ──
    'booking.title': 'Book en session',
    'booking.session_type': 'Vælg session-type',
    'booking.message': 'Besked til den professionelle (valgfri)',
    'booking.time': 'Foretrukken tid',
    'booking.time.placeholder': 'F.eks. "Mandag 16-18 eller tirsdag formiddag"',
    'booking.summary': 'Prisoversigt',
    'booking.session_price': 'Sessionspris',
    'booking.commission': 'Platformsbidrag',
    'booking.payout': 'Til professionel',
    'booking.donate': 'Til Kræftens Bekæmpelse',
    'booking.cta': 'Betal og book',
    'booking.pending_note': 'Betaling bekræftes inden for 24 timer',
    'booking.confirmed': 'Din booking er modtaget! Vi vender tilbage med bekræftelse inden for 24 timer.',

    // ── Dashboard ──
    'dashboard.candidate.title': 'Mine bookinger',
    'dashboard.professional.title': 'Mine sessioner',
    'dashboard.earnings': 'Samlet indtjening',
    'dashboard.charity_total': 'Doneret til Kræftens Bekæmpelse',
    'dashboard.upcoming': 'Kommende sessioner',
    'dashboard.no_bookings': 'Ingen bookinger endnu',

    // ── Status ──
    'status.pending': 'Afventer',
    'status.confirmed': 'Bekræftet',
    'status.completed': 'Gennemfùrt',
    'status.cancelled': 'Annulleret',

    // ── Professional profile ──
    'professional.book': 'Book en session',
    'professional.sessions_offered': 'Tilbudte sessioner',
    'professional.reviews': 'Anmeldelser',
    'professional.no_reviews': 'Ingen anmeldelser endnu',
    'professional.price': 'DKK {price} / session',
    'professional.languages': 'Sprog',

    // ── Signup professional ──
    'signup.pro.title': 'Bliv professionel på Naetwork',
    'signup.pro.step1': 'Grundlæggende oplysninger',
    'signup.pro.step2': 'Session-konfiguration',
    'signup.pro.step3': 'Donationsvalg',
    'signup.pro.step4': 'Bekræft og opret',
    'signup.pro.name': 'Fulde navn',
    'signup.pro.title_field': 'Titel / stilling',
    'signup.pro.company': 'Virksomhed',
    'signup.pro.industry': 'Branche',
    'signup.pro.bio': 'Kort bio',
    'signup.pro.linkedin': 'LinkedIn URL',
    'signup.pro.price_label': 'Pris per session (DKK)',
    'signup.pro.next': 'Næste',
    'signup.pro.back': 'Tilbage',
    'signup.pro.submit': 'Opret profil',

    // ── Settings ──
    'settings.title': 'Indstillinger',
    'settings.price': 'Pris per session',
    'settings.availability': 'Tilgængelighed',
    'settings.charity': 'Donationsindstillinger',
    'settings.save': 'Gem ændringer',
    'settings.delete': 'Slet konto',

    // ── Footer ──
    'footer.tagline': 'Karrieresessioner med mennesker der ved det.',
    'footer.legal': 'Naetwork opkræver 15% platformsbidrag (7,5% ved donation til Kræftens Bekæmpelse). Alle betalinger behandles sikkert via Stripe.',

    // ── General ──
    'general.loading': 'Indlæser...',
    'general.error': 'Noget gik galt',
    'general.back': 'Tilbage',
    'general.save': 'Gem',
    'general.cancel': 'Annuller',
    'general.dkk': 'DKK',
  },
  en: {
    // ── Hero (new copy) ──
    'hero.h1': 'One hour with the right person can change your career.',
    'hero.sub': 'Naetwork connects ambitious candidates with experienced professionals from Banking, Private Equity, AI and Management Consulting — for a direct, honest and personal session.',
    'hero.cta.primary': 'Find your session →',
    'hero.cta.secondary': 'Become a professional on Naetwork',
    // legacy keys kept for backward compat
    'hero.cta1': 'Find your session →',
    'hero.cta2': 'Become a professional',
    'hero.trust': 'DKK 300–2,000 / session · 15% platform fee · Support Kræftens Bekæmpelse',

    // ── Nav ──
    'nav.find': 'Find professionals',
    'nav.become': 'Become a professional',
    'nav.about': 'About',
    'nav.login': 'Log in',
    'nav.book': 'Book now',

    // ── About ──
    'about.headline': 'What is Naetwork?',
    'about.body': 'Naetwork is not another job platform. It is access to the conversations that normally only happen through connections and coincidences — now structured, accessible and with a clear purpose. You pay for one hour of focused sparring with someone who has done exactly what you are trying to do.',
    'about.bullet1': 'Only 4 industries: Banking, Private Equity, AI and Management Consulting',
    'about.bullet2': 'All professionals are verified with a LinkedIn profile',
    'about.bullet3': 'You only pay for the session — no subscription',

    // ── Why ──
    'why.headline': 'Why Naetwork?',
    'why.candidate.title': 'You are a candidate',
    'why.candidate.body': "You can google everything about an industry. What you cannot google is what actually separates those who get in from those who don't. Naetwork gives you one hour with someone who knows — and who will tell you straight.",
    'why.candidate.bullet1': 'Prepare for the specific interview',
    'why.candidate.bullet2': 'Get your CV and LinkedIn reviewed by someone who screens candidates',
    'why.candidate.bullet3': 'Understand the culture and what actually counts',
    'why.candidate.bullet4': 'DKK 300–2,000 per session — no commitment',
    'why.professional.title': 'You are a professional',
    'why.professional.body': 'Share your experience on your own terms. Set your own price, choose your availability and the session types you enjoy. Naetwork handles booking and payment — you deliver what you are good at.',
    'why.professional.bullet1': 'You set the price: DKK 300–2,000 per session',
    'why.professional.bullet2': 'Choose your own availability and session types',
    'why.professional.bullet3': 'Option to donate to Kræftens Bekæmpelse (reduces commission to 7.5%)',
    'why.professional.bullet4': 'No commitment — pause or stop whenever you want',

    // ── Session types ──
    'sessions.headline': 'Choose the session you need',
    'sessions.title': 'Session type',
    'sessions.mock': 'Mock Interview',
    'sessions.mock.title': 'Mock Interview',
    'sessions.mock.tagline': 'Get in — not home to practice more',
    'sessions.mock.desc': "A realistic interview with someone in your target industry. Direct feedback, concrete answers on what works — and what doesn't.",
    'sessions.cv': 'CV & LinkedIn Review',
    'sessions.cv.title': 'CV & LinkedIn Review',
    'sessions.cv.tagline': 'What does a hiring manager screen out — and what holds up?',
    'sessions.cv.desc': 'One hour with someone who has screened hundreds of candidates. You learn what works in your specific industry.',
    'sessions.chat': 'Informal 1:1',
    'sessions.chat.title': 'Informal 1:1',
    'sessions.chat.tagline': 'Answers to what you can never google',
    'sessions.chat.desc': 'What is the culture really like? What do they look at? What would you do differently? An honest conversation with no agenda.',
    'sessions.career.title': 'Career Advice',
    'sessions.career.tagline': 'Not a course. Sparring with someone who knows.',
    'sessions.career.desc': 'Strategic overview of your next career move — industry, timing, and what makes sense for you specifically.',
    'sessions.advice': 'Career advice',
    'sessions.advice.desc': 'Strategic guidance on your next career decision',

    // ── How it works ──
    'how.headline': 'How it works',
    'how.tab.candidate': 'I am a candidate',
    'how.tab.professional': 'I am a professional',
    'how.candidate.step1.title': 'Find your match',
    'how.candidate.step1.desc': 'Browse profiles and filter by industry and session type. Read about experience, price and what other candidates say.',
    'how.candidate.step2.title': 'Book and pay',
    'how.candidate.step2.desc': 'Choose an available time and pay securely via Stripe. You receive confirmation with all information for the session.',
    'how.candidate.step3.title': 'Show up prepared',
    'how.candidate.step3.desc': 'One hour, one focus. Real answers from someone who has done exactly what you want to do.',
    'how.professional.step1.title': 'Create your profile',
    'how.professional.step1.desc': 'Tell about your background, set your price and choose the session types you offer. It takes under 10 minutes.',
    'how.professional.step2.title': 'Receive bookings',
    'how.professional.step2.desc': 'Candidates find you and book directly. You approve and receive all information for the session.',
    'how.professional.step3.title': 'Hold the session',
    'how.professional.step3.desc': 'Hold the session on the platform you agree on. Naetwork handles payment — you receive your share automatically.',

    // ── Charity ──
    'charity.headline': 'Give back — and reduce your commission',
    'charity.body': 'As a professional on Naetwork, you can choose to donate your fee to Kræftens Bekæmpelse. The candidate pays the same. Your platform commission is halved from 15% to 7.5%. This is shown with a heart badge on your profile.',
    'charity.label': 'Donates to Kræftens Bekæmpelse',
    'charity.desc': 'This professional donates their fee to Kræftens Bekæmpelse and only pays 7.5% platform fee.',
    'charity.toggle': 'I want to donate my fee to Kræftens Bekæmpelse',
    'charity.badge': 'Donates to Kræftens Bekæmpelse',
    'charity.platform_fee': '7.5% platform fee with donation',

    // ── Trust signals ──
    'trust.stat1.value': '4 industries',
    'trust.stat1.desc': 'Only Banking, PE, AI and Consulting',
    'trust.stat2.value': 'DKK 300',
    'trust.stat2.desc': 'Lowest session price — no hidden fees',
    'trust.stat3.value': '15% fee',
    'trust.stat3.desc': '7.5% when donating to Kræftens Bekæmpelse',
    'trust.stat4.value': 'Always 1:1',
    'trust.stat4.desc': 'Never group formats',

    // ── Final CTA ──
    'cta.headline': 'Ready to take the next step?',
    'cta.sub': 'Find the professional that matches exactly what you need.',
    'cta.button': 'See all professionals',

    // ── Booking ──
    'booking.title': 'Book a session',
    'booking.session_type': 'Select session type',
    'booking.message': 'Message to the professional (optional)',
    'booking.time': 'Preferred time',
    'booking.time.placeholder': 'E.g. "Monday 4-6pm or Tuesday morning"',
    'booking.summary': 'Price summary',
    'booking.session_price': 'Session price',
    'booking.commission': 'Platform fee',
    'booking.payout': 'To professional',
    'booking.donate': 'To Kræftens Bekæmpelse',
    'booking.cta': 'Pay and book',
    'booking.pending_note': 'Payment confirmed within 24 hours',
    'booking.confirmed': 'Your booking is received! We will confirm within 24 hours.',

    // ── Dashboard ──
    'dashboard.candidate.title': 'My bookings',
    'dashboard.professional.title': 'My sessions',
    'dashboard.earnings': 'Total earnings',
    'dashboard.charity_total': 'Donated to Kræftens Bekæmpelse',
    'dashboard.upcoming': 'Upcoming sessions',
    'dashboard.no_bookings': 'No bookings yet',

    // ── Status ──
    'status.pending': 'Pending',
    'status.confirmed': 'Confirmed',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',

    // ── Professional profile ──
    'professional.book': 'Book a session',
    'professional.sessions_offered': 'Sessions offered',
    'professional.reviews': 'Reviews',
    'professional.no_reviews': 'No reviews yet',
    'professional.price': 'DKK {price} / session',
    'professional.languages': 'Languages',

    // ── Signup professional ──
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

    // ── Settings ──
    'settings.title': 'Settings',
    'settings.price': 'Price per session',
    'settings.availability': 'Availability',
    'settings.charity': 'Donation settings',
    'settings.save': 'Save changes',
    'settings.delete': 'Delete account',

    // ── Footer ──
    'footer.tagline': 'Career sessions with people who know.',
    'footer.legal': 'Naetwork charges 15% platform fee (7.5% with donation to Kræftens Bekæmpelse). All payments processed securely via Stripe.',

    // ── General ──
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
