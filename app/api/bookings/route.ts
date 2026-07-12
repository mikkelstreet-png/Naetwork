import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { BOOKING_FOCUS_AREAS, focusLabel, sessionEconomics } from '@/lib/platform';

const BOOKING_FOCUS_IDS = new Set<string>(BOOKING_FOCUS_AREAS);

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength) : '';
}

function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  return origin === new URL(request.url).origin;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Log ind for at se bookinger.' }, { status: 401 });

    const admin = createAdminClient();
    const { data: actor } = await admin.from('profiles').select('id, role').eq('auth_user_id', user.id).single();
    if (!actor) return NextResponse.json({ bookings: [] });

    const { data: ownProfessional } = await admin
      .from('professional_profiles')
      .select('id')
      .eq('profile_id', actor.id)
      .maybeSingle();
    const filters = [`candidate_profile_id.eq.${actor.id}`];
    if (ownProfessional?.id) filters.push(`professional_profile_id.eq.${ownProfessional.id}`);

    const { data: bookings, error } = await admin
      .from('bookings')
      .select('id, candidate_profile_id, professional_profile_id, starts_at, ends_at, status, payment_status, refund_status, price_dkk, price_ex_vat_dkk, vat_dkk, contribution_percent, contribution_dkk, platform_fee_dkk, professional_payout_dkk, focus_area, goal, material_url, time_zone, meeting_mode, meeting_url, message_to_professional, created_at')
      .or(filters.join(','))
      .order('starts_at', { ascending: false });
    if (error) throw error;

    const rows = bookings ?? [];
    const bookingIds = rows.map((row) => row.id);
    const { data: reviews } = bookingIds.length
      ? await admin.from('reviews').select('booking_id').in('booking_id', bookingIds)
      : { data: [] };
    const reviewedBookingIds = new Set((reviews ?? []).map((review) => review.booking_id));
    const candidateIds = Array.from(new Set(rows.map((row) => row.candidate_profile_id).filter(Boolean)));
    const professionalIds = Array.from(new Set(rows.map((row) => row.professional_profile_id).filter(Boolean)));
    const [{ data: candidates }, { data: professionals }] = await Promise.all([
      candidateIds.length ? admin.from('profiles').select('id, name').in('id', candidateIds) : Promise.resolve({ data: [] }),
      professionalIds.length ? admin.from('professional_profiles').select('id, profile_id, title, company').in('id', professionalIds) : Promise.resolve({ data: [] }),
    ]);
    const ownerIds = Array.from(new Set((professionals ?? []).map((row) => row.profile_id).filter(Boolean)));
    const { data: owners } = ownerIds.length
      ? await admin.from('profiles').select('id, name').in('id', ownerIds)
      : { data: [] };

    const candidateNames = new Map((candidates ?? []).map((row) => [row.id, row.name || 'Kandidat']));
    const ownerNames = new Map((owners ?? []).map((row) => [row.id, row.name || 'Professionel']));
    const professionalMap = new Map((professionals ?? []).map((row) => [row.id, row]));

    return NextResponse.json({
      accountRole: actor.role,
      bookings: rows.map((booking) => {
        const viewerRole = booking.candidate_profile_id === actor.id ? 'candidate' : 'professional';
        const professional = professionalMap.get(booking.professional_profile_id);
        return {
          ...booking,
          viewer_role: viewerRole,
          counterpart_name: viewerRole === 'candidate'
            ? ownerNames.get(professional?.profile_id) ?? 'Professionel'
            : candidateNames.get(booking.candidate_profile_id) ?? 'Kandidat',
          counterpart_title: viewerRole === 'candidate'
            ? [professional?.title, professional?.company].filter(Boolean).join(' · ')
            : 'Kandidat',
          reviewed: reviewedBookingIds.has(booking.id),
        };
      }),
    });
  } catch (error) {
    console.error('[bookings:list]', error);
    return NextResponse.json({ error: 'Bookingerne kunne ikke indlæses.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Log ind for at booke.' }, { status: 401 });

    const body = await request.json();
    const professionalId = cleanText(body.professionalId, 64);
    const slotId = cleanText(body.slotId, 64);
    const focus = cleanText(body.focus, 48);
    const goal = cleanText(body.goal, 260);
    const material = cleanText(body.material, 180);

    if (!professionalId || !slotId || !BOOKING_FOCUS_IDS.has(focus)) {
      return NextResponse.json({ error: 'Vælg en ledig tid, en professionel og et gyldigt fokus.' }, { status: 400 });
    }
    if (goal.length < 20) {
      return NextResponse.json({ error: 'Beskriv dit ønskede resultat med mindst 20 tegn.' }, { status: 400 });
    }

    if (material) {
      try {
        const url = new URL(material);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        return NextResponse.json({ error: 'Materialelinket skal være en gyldig http- eller https-adresse.' }, { status: 400 });
      }
    }

    const now = Date.now();
    const admin = createAdminClient();
    const { data: candidate, error: candidateError } = await admin
      .from('profiles')
      .select('id, name')
      .eq('auth_user_id', user.id)
      .single();
    if (candidateError || !candidate) {
      return NextResponse.json({ error: 'Din kandidatprofil kunne ikke findes.' }, { status: 409 });
    }

    const { data: professional, error: professionalError } = await admin
      .from('professional_profiles')
      .select('id, profile_id, title, company, price_dkk, contribution_percent, visibility, review_status')
      .eq('id', professionalId)
      .eq('visibility', 'published')
      .eq('review_status', 'approved')
      .single();
    if (professionalError || !professional) {
      return NextResponse.json({ error: 'Profilen er ikke tilgængelig for booking.' }, { status: 404 });
    }

    const { data: slot, error: slotError } = await admin
      .from('availability_slots')
      .select('id, professional_profile_id, starts_at, ends_at, time_zone, meeting_mode, is_available')
      .eq('id', slotId)
      .eq('professional_profile_id', professional.id)
      .eq('is_available', true)
      .single();
    if (slotError || !slot) {
      return NextResponse.json({ error: 'Tiden er ikke længere ledig. Vælg en anden.' }, { status: 409 });
    }
    const startsAt = new Date(slot.starts_at);
    const endsAt = new Date(slot.ends_at);
    if (startsAt.getTime() < now + 2 * 60 * 60 * 1000 || startsAt.getTime() > now + 90 * 24 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Tiden er uden for bookingperioden.' }, { status: 400 });
    }

    const tenMinutesAgo = new Date(now - 10 * 60 * 1000).toISOString();
    const { count: recentCount } = await admin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('candidate_profile_id', candidate.id)
      .gte('created_at', tenMinutesAgo);
    if ((recentCount ?? 0) >= 3) {
      return NextResponse.json({ error: 'Du har sendt flere anmodninger på kort tid. Prøv igen senere.' }, { status: 429 });
    }

    const { data: overlaps } = await admin
      .from('bookings')
      .select('id')
      .eq('professional_profile_id', professional.id)
      .in('status', ['requested', 'pending', 'confirmed', 'rescheduled'])
      .lt('starts_at', endsAt.toISOString())
      .gt('ends_at', startsAt.toISOString())
      .limit(1);
    if (overlaps?.length) {
      return NextResponse.json({ error: 'Tidspunktet er netop blevet optaget. Vælg et andet.' }, { status: 409 });
    }

    const { data: owner, error: ownerError } = await admin
      .from('profiles')
      .select('id, auth_user_id, name')
      .eq('id', professional.profile_id)
      .single();
    if (ownerError || !owner) {
      return NextResponse.json({ error: 'Den professionelle konto kunne ikke findes.' }, { status: 409 });
    }

    const selectedFocusLabel = focusLabel(focus, 'da');
    const brief = [
      `Fokus: ${selectedFocusLabel}`,
      goal ? `Mål: ${goal}` : null,
      material ? `Materiale/link: ${material}` : null,
    ].filter(Boolean).join('\n');

    const economics = sessionEconomics(professional.price_dkk, professional.contribution_percent);

    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .insert({
        candidate_profile_id: candidate.id,
        professional_profile_id: professional.id,
        slot_id: slot.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        price_dkk: economics.candidatePrice,
        price_ex_vat_dkk: economics.netPrice,
        vat_dkk: economics.vat,
        contribution_percent: economics.contributionPercent,
        contribution_dkk: economics.contribution,
        platform_fee_dkk: economics.platformFee,
        professional_payout_dkk: economics.professionalPayout,
        focus_area: focus,
        goal,
        material_url: material || null,
        time_zone: slot.time_zone || 'Europe/Copenhagen',
        meeting_mode: slot.meeting_mode || 'video',
        message_to_professional: brief,
        reminder_requested: true,
        status: 'requested',
        payment_status: 'pending',
      })
      .select('id, status')
      .single();
    if (bookingError?.code === '23505' || bookingError?.code === '23P01') {
      return NextResponse.json({ error: 'Tiden er netop blevet reserveret. Vælg en anden.' }, { status: 409 });
    }
    if (bookingError || !booking) throw bookingError ?? new Error('Booking insert failed.');

    await admin.from('availability_slots').update({ is_available: false, updated_at: new Date().toISOString() }).eq('id', slot.id);

    await admin.from('booking_events').insert({
      booking_id: booking.id,
      event_type: 'requested',
      triggered_by: candidate.id,
      notes: 'Booking request created. Payment is not active.',
    });

    const formattedDate = formatSessionDate(startsAt);
    const professionalName = owner.name || professional.title || 'din professionelle';
    const candidateName = candidate.name || user.email || 'Kandidat';
    const { data: professionalUser } = await admin.auth.admin.getUserById(owner.auth_user_id);

    const notifications = await Promise.allSettled([
      user.email ? sendTransactionalEmail({
        to: user.email,
        subject: `Din bookinganmodning til ${professionalName} er modtaget`,
        title: 'Bookinganmodning modtaget',
        intro: `Hej ${candidateName}. Din anmodning er gemt, og ${professionalName} kan nu bekræfte eller afvise tidspunktet.`,
        rows: [
          { label: 'Ønsket tidspunkt', value: formattedDate },
          { label: 'Fokus', value: selectedFocusLabel },
          { label: 'Pris inkl. moms', value: `DKK ${economics.candidatePrice.toLocaleString('da-DK')}` },
          { label: 'Bidrag', value: `DKK ${economics.contribution.toLocaleString('da-DK')} (${economics.contributionPercent}% af pris ekskl. moms)` },
        ],
        note: 'Betaling er ikke aktiveret endnu, og der trækkes ikke noget beløb ved bookinganmodningen.',
        cta: { label: 'Se mine bookinger', href: appUrl('/profil/bookings') },
      }) : Promise.resolve(),
      professionalUser.user?.email ? sendTransactionalEmail({
        to: professionalUser.user.email,
        subject: `Ny bookinganmodning fra ${candidateName}`,
        title: 'Ny bookinganmodning',
        intro: `${candidateName} ønsker 60 minutters karrieresparring med dig. Log ind for at bekræfte eller afvise tidspunktet.`,
        rows: [
          { label: 'Ønsket tidspunkt', value: formattedDate },
          { label: 'Fokus', value: selectedFocusLabel },
          { label: 'Sessionpris inkl. moms', value: `DKK ${economics.candidatePrice.toLocaleString('da-DK')}` },
          { label: 'Forventet udbetaling', value: `DKK ${economics.professionalPayout.toLocaleString('da-DK')} før skat` },
        ],
        note: goal || 'Kandidaten har ikke tilføjet et ekstra mål.',
        cta: { label: 'Behandl anmodningen', href: appUrl('/profil/bookings') },
      }) : Promise.resolve(),
    ]);

    const notificationSent = notifications.every((result) => result.status === 'fulfilled');
    if (!notificationSent) {
      await admin.from('booking_events').insert({
        booking_id: booking.id,
        event_type: 'notification_failed',
        notes: 'One or more booking emails could not be sent.',
      });
    }

    return NextResponse.json({ ok: true, bookingId: booking.id, notificationSent }, { status: 201 });
  } catch (error) {
    console.error('[bookings:create]', error);
    return NextResponse.json({ error: 'Bookingen kunne ikke oprettes. Prøv igen.' }, { status: 500 });
  }
}
