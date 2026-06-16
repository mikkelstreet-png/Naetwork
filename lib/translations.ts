export type Lang = 'da' | 'en';

export const t: Record<Lang, Record<string, string>> = {
  da: {
    // Hero
    'hero.label': 'Karrieresparring med mening.',
    'hero.h1': 'Din adgang til meningsfuld karrieresparring',
    'hero.sub': 'FÃÂ¥ konkret og ÃÂ¦rlig karrieresparring fra en person med reel erfaring, samtidig med at professionelle fÃÂ¥r en meningsfuld mÃÂ¥de at styrke deres mentor-, ledelses- og rÃÂ¥dgivningskompetencer.',
    'hero.cta_primary': 'Find en professionel',
    'hero.cta_secondary': 'AnsÃÂ¸g som professionel',

    // How it works
    'how.label': 'SÃÂ¥dan virker det',
    'how.tagline': 'Fire trin. Ingen besvÃÂ¦r.',
    'how.step1_title': 'VÃÂ¦lg en professionel',
    'how.step1_body': 'Find en person med relevant erfaring fra den branche, rolle eller karrierevej, du gerne vil blive klogere pÃÂ¥.',
    'how.step2_title': 'Book 60 minutter',
    'how.step2_body': 'Sessioner starter fra 300 kr. og tager udgangspunkt i dine spÃÂ¸rgsmÃÂ¥l, mÃÂ¥l og nÃÂ¦ste skridt.',
    'how.step3_title': 'FÃÂ¥ konkret sparring',
    'how.step3_body': 'Brug sessionen til CV-feedback, jobsamtaler, ansÃÂ¸gninger, case-forberedelse, karriereretning eller brancheindsigt.',
    'how.step4_title': 'Skab vÃÂ¦rdi begge veje',
    'how.step4_body': 'Kandidaten fÃÂ¥r ÃÂ¦rlig sparring. Den professionelle udvikler sin evne til at rÃÂ¥dgive, lytte, strukturere og hjÃÂ¦lpe andre videre.',

    // For candidates
    'candidates.label': 'For kandidater',
    'candidates.h2': 'FÃÂ¥ sparring fra en, der har prÃÂ¸vet det fÃÂ¸r.',
    'candidates.body': 'Naetwork giver dig adgang til erfarne professionelle, der kan hjÃÂ¦lpe dig med at trÃÂ¦ffe bedre karrierevalg med mere klarhed og selvtillid.',
    'candidates.cta': 'Find en professionel',

    // For professionals
    'professionals.label': 'For professionelle',
    'professionals.h2': 'Brug din erfaring. Styrk din gennemslagskraft.',
    'professionals.body': 'Naetwork giver professionelle en enkel mÃÂ¥de at hjÃÂ¦lpe andre, samtidig med at de udvikler sig selv.',
    'professionals.cta': 'AnsÃÂ¸g som professionel',

    // About
    'about.label': 'Om Naetwork',
    'about.h2': 'Naetwork findes, fordi mange har brug for bedre adgang til reel karrieresparring.',
    'about.body': 'Ikke endnu en artikel. Ikke endnu en generisk guide. Ikke endnu et netvÃÂ¦rksarrangement. Bare ÃÂ©n fokuseret samtale med en person, der forstÃÂ¥r vejen, branchen eller udfordringen.',

    // Pricing
    'pricing.label': 'Priser og donation',
    'pricing.intro': 'Naetwork bygger pÃ¥ en enkel model: Kandidaten betaler for sessionen, og den professionelle vÃ¦lger selv, hvor stor en del af belÃ¸bet der skal doneres.',
    'pricing.model1_title': '1. DonÃ©r halvdelen',
    'pricing.model1_body': 'Kandidaten betaler det fulde belÃ¸b for sessionen. Den professionelle beholder halvdelen af belÃ¸bet, mens den anden halvdel doneres til det velgÃ¸rende formÃ¥l. Ved denne model tager Naetwork et platform fee pÃ¥ 20%.',
    'pricing.model2_title': '2. DonÃ©r hele belÃ¸bet',
    'pricing.model2_body': 'Kandidaten betaler det fulde belÃ¸b for sessionen. Den professionelle donerer hele belÃ¸bet til det velgÃ¸rende formÃ¥l. Ved denne model tager Naetwork et reduceret platform fee pÃ¥ 10%.',
    'pricing.why_title': 'Hvorfor denne model?',
    'pricing.why_body': 'Modellen gÃ¸r det muligt for kandidater at fÃ¥ konkret sparring fra dygtige professionelle, samtidig med at en betydelig del af belÃ¸bet gÃ¥r til et godt formÃ¥l. Naetworks platform fee bruges til at dÃ¦kke drift, betalingshÃ¥ndtering, teknisk vedligeholdelse og administration.',
    'pricing.gated_notice': 'Betalingsintegration er under opsÃ¦tning.',

    // FAQ
    'faq.label': 'Ofte stillede spÃÂ¸rgsmÃÂ¥l',
    'faq.h2': 'Har du spÃÂ¸rgsmÃÂ¥l? Vi har svarene.',
    'faq.q1': 'Hvor lang tid varer en session?',
    'faq.a1': 'Hver session varer 60 minutter.',
    'faq.q2': 'Hvad kan jeg bruge en session til?',
    'faq.a2': 'Du kan bruge den til CV-feedback, jobsamtaleforberedelse, ansÃÂ¸gninger, case-trÃÂ¦ning, karrierespÃÂ¸rgsmÃÂ¥l, brancheindsigt eller generel sparring.',
    'faq.q3': 'Hvad koster det?',
    'faq.a3': 'Sessioner starter fra 300 kr. Den endelige pris afhÃÂ¦nger af den professionelle.',
    'faq.q4': 'Hvorfor skal professionelle vÃÂ¦re med?',
    'faq.a4': 'Fordi Naetwork giver professionelle en meningsfuld mÃÂ¥de at hjÃÂ¦lpe andre og styrke kompetencer som mentoring, kommunikation, ledelse og struktureret feedback.',
    'faq.q5': 'Kan jeg redigere eller slette min bruger?',
    'faq.a5': 'Ja. Du kan redigere dine oplysninger, ÃÂ¦ndre notifikationsvalg og anmode om sletning af din bruger.',
    'faq.q6': 'Er Naetwork en del af KrÃÂ¦ftens BekÃÂ¦mpelse?',
    'faq.a6': 'Naetwork er et uafhÃÂ¦ngigt initiativ og kan kun beskrives som officiel partner, hvis der foreligger en skriftlig aftale.',

    // KB
    'kb.body': 'Naetwork er bygget med et ÃÂ¸nske om at skabe meningsfuld effekt. Donations- og betalingsmodellen er under juridisk afklaring og bliver fÃÂ¸rst aktiveret, nÃÂ¥r den rette opsÃÂ¦tning er pÃÂ¥ plads.',

    // Contact
    'contact.label': 'Kontakt Naetwork',
    'contact.h2': 'Send os en besked',
    'contact.name': 'Navn',
    'contact.email': 'E-mail',
    'contact.subject': 'Emne',
    'contact.message': 'Besked',
    'contact.privacy': 'Vi bruger kun dine oplysninger til at svare pÃÂ¥ din henvendelse.',
    'contact.submit': 'Send besked',

    // Navbar
    'nav.home': 'Forside',
    'nav.how_it_works': 'SÃÂ¥dan virker det',
    'nav.about': 'Om Naetwork',
    'nav.candidates': 'For kandidater',
    'nav.professionals': 'For professionelle',
    'nav.pricing': 'Priser og formÃÂ¥l',
    'nav.faq': 'FAQ',
    'nav.contact': 'Kontakt Naetwork',
    'nav.book': 'Book session',
    'nav.lang_toggle': 'EN',
    'nav.login': 'Log ind',

    // Footer
    'footer.tagline': 'Karrieresessioner med mennesker der ved det.',
    'footer.legal': 'Naetwork opkrÃÂ¦ver 15% platformsbidrag (7,5% ved donation til KrÃÂ¦ftens BekÃÂ¦mpelse). Alle betalinger behandles sikkert via Stripe.',
    'footer.terms': 'VilkÃÂ¥r',
    'footer.privacy_link': 'Privatlivspolitik',
    'footer.cookies': 'Cookies',
    'footer.contact_link': 'Kontakt',
    'footer.copyright': 'ÃÂ© 2025 Naetwork. Alle rettigheder forbeholdes.',

    // Charity
    'charity.badge': 'Officiel partner',
    'charity.headline': 'Samfundsansvar',

    // Legacy keys (sections not yet migrated)
    'why.candidate.bullet1': 'MÃÂ¸d professionelle pÃÂ¥ din karrierevej',
    'why.candidate.bullet2': 'Forbered dig til interviews og ansÃÂ¸gninger',
    'why.candidate.bullet3': 'FÃÂ¥ ÃÂ¦rlig, konkret feedback der rykker',
    'why.candidate.bullet4': 'DKK 300Ã¢ÂÂ2.000 per session Ã¢ÂÂ ingen binding',
    'why.professional.bullet1': 'SÃÂ¦t dine egne priser og tilgÃÂ¦ngelighed',
    'why.professional.bullet2': 'HjÃÂ¦lp unge talenter videre',
    'why.professional.bullet3': '15% provision Ã¢ÂÂ 7,5% hvis du donerer til KrÃÂ¦ftens BekÃÂ¦mpelse',
    'why.professional.bullet4': 'Ingen binding Ã¢ÂÂ pause eller stop nÃÂ¥r du vil',
    'sessions.headline': 'VÃÂ¦lg din session',
    'sessions.sub': 'Fire formater. ÃÂt formÃÂ¥l: Dit nÃÂ¦ste skridt.',
    'trust.headline': 'Transparens',
    'trust.sub': 'Du ved prÃÂ¦cis hvad du betaler for.',
    'industries.headline': 'De industrier vi kender indefra',
    'cta.headline': 'Hvad venter du pÃÂ¥?',
    'cta.sub': 'Bliv en del af et netvÃÂ¦rk der ÃÂ¥bner dÃÂ¸re.',
    'cta.button': 'Find din professionelle',

    // Impact / Pricing
    'impact.label': 'En prismodel med reel impact',
    'impact.intro': 'På Naetwork betaler kandidaten for en personlig session med en erfaren professionel.',
    'impact.sub': 'Som professionel vælger du selv, hvordan værdien af din tid skal fordeles.',
    'impact.both': 'Begge modeller skaber reel værdi: kandidaten får konkret sparring, du deler din erfaring, og en betydelig del af betalingen går til Kræftens Bekæmpelse.',
    'impact.shared_name': 'Shared Impact',
    'impact.shared_tag': 'For professionelle, der ønsker at kombinere donation med fair betaling for deres tid og ekspertise.',
    'impact.shared_body': 'Med Shared Impact donerer du 50% af sessionens værdi til Kræftens Bekæmpelse og beholder 50% selv.',
    'impact.shared_note': 'En enkel og balanceret måde at gøre en forskel på, uden at værdien af din tid forsvinder.',
    'impact.shared_fee': 'Naetwork platform fee: 20%',
    'impact.shared_keep': 'Til dig',
    'impact.allin_name': 'All-In Impact',
    'impact.allin_tag': 'For professionelle, der ønsker at give hele sessionens værdi videre.',
    'impact.allin_body': 'Med All-In Impact donerer du 100% af sessionens værdi til Kræftens Bekæmpelse.',
    'impact.allin_note': 'Den mest direkte måde at omsætte din erfaring til donation og impact.',
    'impact.allin_fee': 'Naetwork platform fee: 10%',
    'impact.kb_legal': 'Donationsmodel afventer juridisk og regnskabsmæssig afklaring.',

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
    'pricing.label': 'Pricing and donation',
    'pricing.intro': 'Naetwork is built on a simple model: The candidate pays for the session, and the professional chooses how much of the amount should be donated.',
    'pricing.model1_title': '1. Donate half',
    'pricing.model1_body': 'The candidate pays the full session amount. The professional keeps half of the amount, while the other half is donated to the charitable cause. Under this model, Naetwork charges a 20% platform fee.',
    'pricing.model2_title': '2. Donate the full amount',
    'pricing.model2_body': 'The candidate pays the full session amount. The professional donates the full amount to the charitable cause. Under this model, Naetwork charges a reduced 10% platform fee.',
    'pricing.why_title': 'Why this model?',
    'pricing.why_body': "Naetwork's platform fee is used to cover operations, payment handling, technical maintenance and administration.",
    'pricing.gated_notice': 'Payment integration is being set up.',

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
    'faq.q6': 'Is Naetwork part of KrÃÂ¦ftens BekÃÂ¦mpelse?',
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
    'footer.legal': 'Naetwork charges 15% platform fee (7.5% with donation to KrÃÂ¦ftens BekÃÂ¦mpelse). All payments processed securely via Stripe.',
    'footer.terms': 'Terms',
    'footer.privacy_link': 'Privacy',
    'footer.cookies': 'Cookies',
    'footer.contact_link': 'Contact',
    'footer.copyright': 'ÃÂ© 2025 Naetwork. All rights reserved.',

    // Charity
    'charity.badge': 'Donates to KrÃÂ¦ftens BekÃÂ¦mpelse',
    'charity.headline': 'Give back',

    // Legacy keys (sections not yet migrated)
    'why.candidate.bullet1': 'Prepare for the specific interview',
    'why.candidate.bullet2': 'Get your CV and LinkedIn reviewed by someone who screens candidates',
    'why.candidate.bullet3': 'Understand the culture and what actually counts',
    'why.candidate.bullet4': 'DKK 300Ã¢ÂÂ2,000 per session Ã¢ÂÂ no commitment',
    'why.professional.bullet1': 'You set the price: DKK 300Ã¢ÂÂ2,000 per session',
    'why.professional.bullet2': 'Choose your own availability and session types',
    'why.professional.bullet3': 'Option to donate to KrÃÂ¦ftens BekÃÂ¦mpelse (reduces commission to 7.5%)',
    'why.professional.bullet4': 'No commitment Ã¢ÂÂ pause or stop whenever you want',
    'sessions.headline': 'Choose the session you need',
    'sessions.sub': 'Four formats. One purpose: Your next step.',
    'trust.headline': 'Transparency',
    'trust.sub': 'You know exactly what you are paying for.',
    'industries.headline': 'The industries we know from the inside',
    'cta.headline': 'Ready to take the next step?',
    'cta.sub': 'Find the professional that matches exactly what you need.',
    'cta.button': 'See all professionals',

    // Impact / Pricing
    'impact.label': 'A pricing model with real impact',
    'impact.intro': 'On Naetwork, candidates pay for a personal session with an experienced professional.',
    'impact.sub': 'As a professional, you choose how the value of your time is shared.',
    'impact.both': 'Both models create real value: the candidate receives practical career support, you share your experience, and a meaningful part of the payment goes to The Danish Cancer Society.',
    'impact.shared_name': 'Shared Impact',
    'impact.shared_tag': 'For professionals who want to combine contribution with fair compensation for their time and expertise.',
    'impact.shared_body': 'With Shared Impact, you donate 50% of the session value to The Danish Cancer Society and keep 50%.',
    'impact.shared_note': 'A simple and balanced way to make a difference, while still recognising the value of your time.',
    'impact.shared_fee': 'Naetwork platform fee: 20%',
    'impact.shared_keep': 'To you',
    'impact.allin_name': 'All-In Impact',
    'impact.allin_tag': 'For professionals who want to pass on the full value of their session.',
    'impact.allin_body': 'With All-In Impact, you donate 100% of the session value to The Danish Cancer Society.',
    'impact.allin_note': 'The most direct way to turn your experience into donation and impact.',
    'impact.allin_fee': 'Naetwork platform fee: 10%',
    'impact.kb_legal': 'Donation model pending legal and accounting confirmation.',

  },
};
