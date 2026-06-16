export type Lang = 'da' | 'en';

export const t: Record<Lang, Record<string, string>> = {
  da: {
    // Hero
    'hero.label': 'Karrieresparring med mening.',
    'hero.h1': 'Book 60 minutter med en erfaren professionel, fra 300 kr.',
    'hero.sub': 'Få konkret og ærlig karrieresparring fra en person med reel erfaring, samtidig med at professionelle får en meningsfuld måde at styrke deres mentor-, ledelses- og rådgivningskompetencer.',
    'hero.cta_primary': 'Find en professionel',
    'hero.cta_secondary': 'Ansøg som professionel',

    // How it works
    'how.label': 'Sådan virker det',
    'how.tagline': 'Fire trin. Ingen besvær.',
    'how.step1_title': 'Vælg en professionel',
    'how.step1_body': 'Find en person med relevant erfaring fra den branche, rolle eller karrierevej, du gerne vil blive klogere på.',
    'how.step2_title': 'Book 60 minutter',
    'how.step2_body': 'Sessioner starter fra 300 kr. og tager udgangspunkt i dine spørgsmål, mål og næste skridt.',
    'how.step3_title': 'Få konkret sparring',
    'how.step3_body': 'Brug sessionen til CV-feedback, jobsamtaler, ansøgninger, case-forberedelse, karriereretning eller brancheindsigt.',
    'how.step4_title': 'Skab værdi begge veje',
    'how.step4_body': 'Kandidaten får ærlig sparring. Den professionelle udvikler sin evne til at rådgive, lytte, strukturere og hjælpe andre videre.',

    // For candidates
    'candidates.label': 'For kandidater',
    'candidates.h2': 'Få sparring fra en, der har prøvet det før.',
    'candidates.body': 'Naetwork giver dig adgang til erfarne professionelle, der kan hjælpe dig med at træffe bedre karrierevalg med mere klarhed og selvtillid.',
    'candidates.cta': 'Find en professionel',

    // For professionals
    'professionals.label': 'For professionelle',
    'professionals.h2': 'Brug din erfaring. Styrk din gennemslagskraft.',
    'professionals.body': 'Naetwork giver professionelle en enkel måde at hjælpe andre, samtidig med at de udvikler sig selv.',
    'professionals.cta': 'Ansøg som professionel',

    // About
    'about.label': 'Om Naetwork',
    'about.h2': 'Naetwork findes, fordi mange har brug for bedre adgang til reel karrieresparring.',
    'about.body': 'Ikke endnu en artikel. Ikke endnu en generisk guide. Ikke endnu et netværksarrangement. Bare én fokuseret samtale med en person, der forstår vejen, branchen eller udfordringen.',

    // Pricing
    'pricing.label': 'Priser og formål',
    'pricing.h2': 'Sessioner starter fra 300 kr.',
    'pricing.body': 'Naetwork er bygget med et ønske om at skabe meningsfuld effekt. Donations- og betalingsmodellen er under juridisk afklaring og bliver først aktiveret, når den rette opsætning er på plads.',

    // FAQ
    'faq.label': 'Ofte stillede spørgsmål',
    'faq.h2': 'Har du spørgsmål? Vi har svarene.',
    'faq.q1': 'Hvor lang tid varer en session?',
    'faq.a1': 'Hver session varer 60 minutter.',
    'faq.q2': 'Hvad kan jeg bruge en session til?',
    'faq.a2': 'Du kan bruge den til CV-feedback, jobsamtaleforberedelse, ansøgninger, case-træning, karrierespørgsmål, brancheindsigt eller generel sparring.',
    'faq.q3': 'Hvad koster det?',
    'faq.a3': 'Sessioner starter fra 300 kr. Den endelige pris afhænger af den professionelle.',
    'faq.q4': 'Hvorfor skal professionelle være med?',
    'faq.a4': 'Fordi Naetwork giver professionelle en meningsfuld måde at hjælpe andre og styrke kompetencer som mentoring, kommunikation, ledelse og struktureret feedback.',
    'faq.q5': 'Kan jeg redigere eller slette min bruger?',
    'faq.a5': 'Ja. Du kan redigere dine oplysninger, ændre notifikationsvalg og anmode om sletning af din bruger.',
    'faq.q6': 'Er Naetwork en del af Kræftens Bekæmpelse?',
    'faq.a6': 'Naetwork er et uafhængigt initiativ og kan kun beskrives som officiel partner, hvis der foreligger en skriftlig aftale.',

    // KB
    'kb.body': 'Naetwork er bygget med et ønske om at skabe meningsfuld effekt. Donations- og betalingsmodellen er under juridisk afklaring og bliver først aktiveret, når den rette opsætning er på plads.',

    // Contact
    'contact.label': 'Kontakt Naetwork',
    'contact.h2': 'Send os en besked',
    'contact.name': 'Navn',
    'contact.email': 'E-mail',
    'contact.subject': 'Emne',
    'contact.message': 'Besked',
    'contact.privacy': 'Vi bruger kun dine oplysninger til at svare på din henvendelse.',
    'contact.submit': 'Send besked',

    // Navbar
    'nav.home': 'Forside',
    'nav.how_it_works': 'Sådan virker det',
    'nav.about': 'Om Naetwork',
    'nav.candidates': 'For kandidater',
    'nav.professionals': 'For professionelle',
    'nav.pricing': 'Priser og formål',
    'nav.faq': 'FAQ',
    'nav.contact': 'Kontakt Naetwork',
    'nav.book': 'Book session',
    'nav.lang_toggle': 'EN',
    'nav.login': 'Log ind',

    // Footer
    'footer.tagline': 'Karrieresessioner med mennesker der ved det.',
    'footer.legal': 'Naetwork opkræver 15% platformsbidrag (7,5% ved donation til Kræftens Bekæmpelse). Alle betalinger behandles sikkert via Stripe.',
    'footer.terms': 'Vilkår',
    'footer.privacy_link': 'Privatlivspolitik',
    'footer.cookies': 'Cookies',
    'footer.contact_link': 'Kontakt',
    'footer.copyright': '© 2025 Naetwork. Alle rettigheder forbeholdes.',

    // Charity
    'charity.badge': 'Officiel partner',
    'charity.headline': 'Samfundsansvar',

    // Legacy keys (sections not yet migrated)
    'why.candidate.bullet1': 'Mød professionelle på din karrierevej',
    'why.candidate.bullet2': 'Forbered dig til interviews og ansøgninger',
    'why.candidate.bullet3': 'Få ærlig, konkret feedback der rykker',
    'why.candidate.bullet4': 'DKK 300–2.000 per session – ingen binding',
    'why.professional.bullet1': 'Sæt dine egne priser og tilgængelighed',
    'why.professional.bullet2': 'Hjælp unge talenter videre',
    'why.professional.bullet3': '15% provision – 7,5% hvis du donerer til Kræftens Bekæmpelse',
    'why.professional.bullet4': 'Ingen binding – pause eller stop når du vil',
    'sessions.headline': 'Vælg din session',
    'sessions.sub': 'Fire formater. Ét formål: Dit næste skridt.',
    'trust.headline': 'Transparens',
    'trust.sub': 'Du ved præcis hvad du betaler for.',
    'industries.headline': 'De industrier vi kender indefra',
    'cta.headline': 'Hvad venter du på?',
    'cta.sub': 'Bliv en del af et netværk der åbner døre.',
    'cta.button': 'Find din professionelle',
  },

  en: {
    // Hero
    'hero.label': 'Career support with purpose.',
    'hero.h1': 'Book 60 minutes with an experienced professional, starting from 300 DKK.',
    'hero.sub': 'Get practical, honest career guidance from someone with real experience, while professionals get a meaningful way to strengthen their mentoring, leadership and advisory skills.',
    'hero.cta_primary': 'Find a professional',
    'hero.cta_secondary': 'Apply as professional',

    // How it works
    'how.label': 'How it works',
    'how.tagline': 'Four steps. No hassle.',
    'how.step1_title': 'Choose a professional',
    'how.step1_body': 'Find someone with relevant experience from the industry, role or career path you are curious about.',
    'how.step2_title': 'Book 60 minutes',
    'how.step2_body': 'Sessions start from 300 DKK and are focused on your questions, goals and next step.',
    'how.step3_title': 'Get practical guidance',
    'how.step3_body': 'Use the session for CV feedback, interview preparation, applications, case practice, career direction or industry insight.',
    'how.step4_title': 'Create value both ways',
    'how.step4_body': 'The candidate gets honest guidance. The professional develops their ability to advise, listen, structure feedback and help others move forward.',

    // For candidates
    'candidates.label': 'For candidates',
    'candidates.h2': 'Get advice from someone who has been there.',
    'candidates.body': 'Naetwork gives you access to experienced professionals who can help you make better career decisions with more clarity and confidence.',
    'candidates.cta': 'Find a professional',

    // For professionals
    'professionals.label': 'For professionals',
    'professionals.h2': 'Use your experience. Strengthen your impact.',
    'professionals.body': 'Naetwork gives professionals a simple way to support others while developing themselves.',
    'professionals.cta': 'Apply as professional',

    // About
    'about.label': 'About Naetwork',
    'about.h2': 'Naetwork exists because many people need better access to real career guidance.',
    'about.body': 'Not another article. Not another generic guide. Not another networking event. Just one focused conversation with someone who understands the path, the industry or the challenge.',

    // Pricing
    'pricing.label': 'Pricing and purpose',
    'pricing.h2': 'Sessions start from 300 DKK.',
    'pricing.body': 'Naetwork is built with the ambition to create meaningful impact. The donation and payment model is under legal review and will only be activated when the correct setup is in place.',

    // FAQ
    'faq.label': 'Frequently asked questions',
    'faq.h2': 'Got questions? We have the answers.',
    'faq.q1': 'How long does a session last?',
    'faq.a1': 'Each session lasts 60 minutes.',
    'faq.q2': 'What can I use a session for?',
    'faq.a2': 'You can use it for CV feedback, interview preparation, applications, case practice, career questions, industry insight or general guidance.',
    'faq.q3': 'What does it cost?',
    'faq.a3': 'Sessions start from 300 DKK. The final price depends on the professional.',
    'faq.q4': 'Why should professionals join?',
    'faq.a4': 'Because Naetwork gives professionals a meaningful way to help others and strengthen skills such as mentoring, communication, leadership and structured feedback.',
    'faq.q5': 'Can I edit or delete my account?',
    'faq.a5': 'Yes. You can edit your information, change notification preferences and request deletion of your account.',
    'faq.q6': 'Is Naetwork part of Kræftens Bekæmpelse?',
    'faq.a6': 'Naetwork is an independent initiative and can only be described as an official partner if a written agreement is in place.',

    // KB
    'kb.body': 'Naetwork is built with the ambition to create meaningful impact. The donation and payment model is under legal review and will only be activated when the correct setup is in place.',

    // Contact
    'contact.label': 'Contact Naetwork',
    'contact.h2': 'Send us a message',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.privacy': 'We only use your information to respond to your enquiry.',
    'contact.submit': 'Send message',

    // Navbar
    'nav.home': 'Home',
    'nav.how_it_works': 'How it works',
    'nav.about': 'About Naetwork',
    'nav.candidates': 'For candidates',
    'nav.professionals': 'For professionals',
    'nav.pricing': 'Pricing and purpose',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact Naetwork',
    'nav.book': 'Book session',
    'nav.lang_toggle': 'DA',
    'nav.login': 'Log in',

    // Footer
    'footer.tagline': 'Career sessions with people who know.',
    'footer.legal': 'Naetwork charges 15% platform fee (7.5% with donation to Kræftens Bekæmpelse). All payments processed securely via Stripe.',
    'footer.terms': 'Terms',
    'footer.privacy_link': 'Privacy',
    'footer.cookies': 'Cookies',
    'footer.contact_link': 'Contact',
    'footer.copyright': '© 2025 Naetwork. All rights reserved.',

    // Charity
    'charity.badge': 'Donates to Kræftens Bekæmpelse',
    'charity.headline': 'Give back',

    // Legacy keys (sections not yet migrated)
    'why.candidate.bullet1': 'Prepare for the specific interview',
    'why.candidate.bullet2': 'Get your CV and LinkedIn reviewed by someone who screens candidates',
    'why.candidate.bullet3': 'Understand the culture and what actually counts',
    'why.candidate.bullet4': 'DKK 300–2,000 per session – no commitment',
    'why.professional.bullet1': 'You set the price: DKK 300–2,000 per session',
    'why.professional.bullet2': 'Choose your own availability and session types',
    'why.professional.bullet3': 'Option to donate to Kræftens Bekæmpelse (reduces commission to 7.5%)',
    'why.professional.bullet4': 'No commitment – pause or stop whenever you want',
    'sessions.headline': 'Choose the session you need',
    'sessions.sub': 'Four formats. One purpose: Your next step.',
    'trust.headline': 'Transparency',
    'trust.sub': 'You know exactly what you are paying for.',
    'industries.headline': 'The industries we know from the inside',
    'cta.headline': 'Ready to take the next step?',
    'cta.sub': 'Find the professional that matches exactly what you need.',
    'cta.button': 'See all professionals',
  },
};
