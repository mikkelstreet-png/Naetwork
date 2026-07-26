import { NextResponse } from 'next/server';
import { formatSessionDate } from '@/lib/dateTime';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { isSameSiteRequest } from '@/lib/server/requestSecurity';
import { recordProductEvent } from '@/lib/server/productAnalytics';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { sessionEconomics } from '@/lib/platform';
import { normalizePayoutPreference } from '@/lib/payoutPreference';
import { isSessionTypeId, sessionType, sessionTypesForFocusAreas } from '@/lib/sessionTypes';

function cleanText(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().replace(/\r\n/g, '\n').slice(0, maxLength) : '';
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Log ind for at se bookinger.' }, { status: 401 });

    const admin = createAdminClient();
    const { data: actor } = await admin
      .from('profiles')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
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
      .select('id, candidate_profile_id, professional_profile_id, starts_at, ends_at, status, payment_status, refund_status, price_dkk, price_ex_vat_dkk, vat_dkk, contribution_percent, contribution_dkk, minimum_contribution_dkk, professional_donation_dkk, payout_preference, platform_share_percent, platform_fee_dkk, professional_share_percent, professional_payout_dkk, session_type, focus_area, goal, material_url, time_zone, meeting_mode, meeting_url, message_to_professional, created_at')
      .or(filters.join(','))
      .order('starts_at', { ascending: false });
    if (error) throw error;

    const rows = bookings ?? [];
    const bookingIds = rows.map((row) => row.id);
    const [{ data: reviews }, { data: outcomes }, { data: plans }] = bookingIds.length
      ? await Promise.all([
          admin.from('reviews').select('booking_id').in('booking_id', bookingIds),
          admin.from('session_outcomes').select('id, booking_id, summary, priorities, next_action, next_action_due_at, candidate_completed_at, result_status, published_at, updated_at').in('booking_id', bookingIds),
          admin
            .from('session_plans')
            .select('booking_id, problem, desired_outcome, definition_of_done, preparation_status, prepared_at, updated_at')
            .in('booking_id', bookingIds),
        ])
      : [{ data: [] }, { data: [] }, { data: [] }];
    const reviewedBookingIds = new Set((reviews ?? []).map((review) => review.booking_id));
    const outcomeMap = new Map((outcomes ?? []).map((outcome) => [outcome.booking_id, outcome]));
    const planMap = new Map((plans ?? []).map((plan) => [plan.booking_id, plan]));
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
        const outcome = outcomeMap.get(booking.id) ?? null;
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
          session_plan: planMap.get(booking.id) ?? null,
          outcome: viewerRole === 'candidate' && outcome?.result_status !== 'published' ? null : outcome,
        };
      }),
    });
  } catch (error) {
    console.error('[bookings:list]', error);
    return NextResponse.json({ error: 'Bookingerne kunne ikke indlæses.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Log ind for at booke.' }, { status: 401 });

    const body = await request.json();
    const professionalId = cleanText(body.professionalId, 64);
    const slotId = cleanText(body.slotId, 64);
    const requestedSessionType = cleanText(body.sessionType, 64);
    const goal = cleanText(body.goal, 260);
    const material = cleanText(body.material, 180);

    if (!professionalId || !slotId || !isSessionTypeId(requestedSessionType)) {
      return NextResponse.json({ error: 'Vælg en ledig tid, en fagperson og en gyldig sessionstype.' }, { status: 400 });
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
      .eq('status', 'active')
      .maybeSingle();
    if (candidateError || !candidate) {
      return NextResponse.json({ error: 'Din kandidatprofil kunne ikke findes.' }, { status: 409 });
    }

    const { data: professional, error: professionalError } = await admin
      .from('professional_profiles')
      .select('id, profile_id, title, company, price_dkk, focus_areas, payout_preference, visibility, review_status')
      .eq('id', professionalId)
      .eq('visibility', 'published')
      .eq('review_status', 'approved')
      .single();
    if (professionalError || !professional) {
      return NextResponse.json({ error: 'Profilen er ikke tilgængelig for booking.' }, { status: 404 });
    }
    if (professional.profile_id === candidate.id) {
      return NextResponse.json({ error: 'Du kan ikke booke en session hos dig selv.' }, { status: 400 });
    }
    if (!sessionTypesForFocusAreas(professional.focus_areas ?? []).some((session) => session.id === requestedSessionType)) {
      return NextResponse.json({ error: 'Fagpersonen tilbyder ikke den valgte sessionstype.' }, { status: 400 });
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
      .eq('status', 'active')
      .maybeSingle();
    if (ownerError || !owner) {
      return NextResponse.json({ error: 'Den professionelle konto kunne ikke findes.' }, { status: 409 });
    }

    const selectedSession = sessionType(requestedSessionType);
    const selectedSessionLabel = selectedSession.title.da;
    const focus = selectedSession.focusArea;
    const brief = [
      `Sessionstype: ${selectedSessionLabel}`,
      goal ? `Mål: ${goal}` : null,
      material ? `Materiale/link: ${material}` : null,
    ].filter(Boolean).join('\n');

    const economics = sessionEconomics(professional.price_dkk);
    const payoutPreference = normalizePayoutPreference(professional.payout_preference);
    const professionalDonation = payoutPreference === 'donate' ? economics.professionalPayout : 0;
    const totalContribution = economics.contribution + professionalDonation;
    const professionalPayout = payoutPreference === 'donate' ? 0 : economics.professionalPayout;

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
        contribution_dkk: totalContribution,
        minimum_contribution_dkk: economics.contribution,
        professional_donation_dkk: professionalDonation,
        payout_preference: payoutPreference,
        platform_fee_dkk: economics.platformShare,
        professional_payout_dkk: professionalPayout,
        contribution_percent: economics.contributionPercent,
        platform_share_percent: economics.platformSharePercent,
        professional_share_percent: economics.professionalSharePercent,
        session_type: selectedSession.id,
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
    await recordProductEvent(admin, {
      eventName: 'booking_requested',
      profileId: candidate.id,
      professionalProfileId: professional.id,
      bookingId: booking.id,
      properties: { sessionType: selectedSession.id },
    });

    const formattedDate = formatSessionDate(startsAt);
    const professionalName = owner.name || professional.title || 'din professionelle';
    const candidateName = candidate.name || user.email || 'Kandidat';
    const { data: professionalUser } = await admin.auth.admin.getUserById(owner.auth_user_id);

    const notifications = await Promise.allSettled([
      user.email ? sendTransactionalEmail({
        to: user.email,
        templateKey: 'booking_requested_candidate',
        bookingId: booking.id,
        recipientProfileId: candidate.id,
        dedupeKey: `booking-requested-candidate-${booking.id}`,
        subject: `Din bookinganmodning til ${professionalName} er modtaget`,
        title: 'Bookinganmodning modtaget',
        intro: `Hej ${candidateName}. Din anmodning er gemt, og ${professionalName} kan nu bekræfte eller afvise tidspunktet.`,
        rows: [
          { label: 'Ønsket tidspunkt', value: formattedDate },
          { label: 'Sessionstype', value: selectedSessionLabel },
          { label: 'Pris inkl. moms', value: `DKK ${economics.candidatePrice.toLocaleString('da-DK')}` },
          { label: 'Naetwork', value: `DKK ${economics.platformShare.toLocaleString('da-DK')} (${economics.platformSharePercent}% af nettoprisen)` },
          { label: 'Kræftens Bekæmpelse', value: `DKK ${totalContribution.toLocaleString('da-DK')} (${payoutPreference === 'donate' ? 80 : economics.contributionPercent}% af nettoprisen)` },
          { label: 'Den professionelle', value: payoutPreference === 'donate' ? 'DKK 0 · 70%-andelen doneres' : `DKK ${professionalPayout.toLocaleString('da-DK')} (${economics.professionalSharePercent}% af nettoprisen)` },
        ],
        note: 'Betaling er ikke aktiveret endnu, og der trækkes ikke noget beløb ved bookinganmodningen.',
        cta: { label: 'Forbered din Session Plan', href: appUrl(`/profil/bookings/${booking.id}`) },
      }) : Promise.resolve(),
      professionalUser.user?.email ? sendTransactionalEmail({
        to: professionalUser.user.email,
        templateKey: 'booking_requested_professional',
        bookingId: booking.id,
        recipientProfileId: owner.id,
        dedupeKey: `booking-requested-professional-${booking.id}`,
        subject: `Ny bookinganmodning fra ${candidateName}`,
        title: 'Ny bookinganmodning',
        intro: `${candidateName} ønsker en 60-minutters karrieresession med dig. Log ind for at bekræfte eller afvise tidspunktet.`,
        rows: [
          { label: 'Ønsket tidspunkt', value: formattedDate },
          { label: 'Sessionstype', value: selectedSessionLabel },
          { label: 'Sessionpris inkl. moms', value: `DKK ${economics.candidatePrice.toLocaleString('da-DK')}` },
          { label: 'Kræftens Bekæmpelse', value: `DKK ${totalContribution.toLocaleString('da-DK')} (${payoutPreference === 'donate' ? 80 : economics.contributionPercent}% af nettoprisen)` },
          { label: 'Forventet udbetaling', value: payoutPreference === 'donate' ? 'DKK 0 · din 70%-andel doneres' : `DKK ${professionalPayout.toLocaleString('da-DK')} før skat` },
        ],
        note: goal || 'Kandidaten har ikke tilføjet et ekstra mål.',
        cta: { label: 'Se booking og Session Plan', href: appUrl(`/profil/bookings/${booking.id}`) },
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
