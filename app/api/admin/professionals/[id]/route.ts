import { NextResponse } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { isSameSiteRequest } from '@/lib/server/requestSecurity';
import {
  REVIEW_FEEDBACK_MAX_LENGTH,
  cleanProfileText,
  professionalProfileMissing,
} from '@/lib/professionalProfile';
import { createClient } from '@/lib/supabase/server';

type ReviewStatus = 'pending' | 'approved' | 'rejected';
type Visibility = 'hidden' | 'published';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isSameSiteRequest(request)) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });
    const { data: actor } = await supabase
      .from('profiles')
      .select('id, role, is_admin')
      .eq('auth_user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    if (!actor || (actor.role !== 'admin' && !actor.is_admin)) return NextResponse.json({ error: 'Ingen adgang.' }, { status: 403 });

    const { id } = await context.params;
    const body = await request.json();
    const reviewStatus = body.reviewStatus as ReviewStatus;
    const visibility = body.visibility as Visibility;
    const reviewFeedback = cleanProfileText(body.reviewFeedback, REVIEW_FEEDBACK_MAX_LENGTH);
    if (!['pending', 'approved', 'rejected'].includes(reviewStatus) || !['hidden', 'published'].includes(visibility)) {
      return NextResponse.json({ error: 'Ugyldig profilstatus.' }, { status: 400 });
    }
    if (reviewStatus !== 'approved' && visibility !== 'hidden') {
      return NextResponse.json({ error: 'Kun godkendte profiler kan publiceres.' }, { status: 400 });
    }
    if (reviewStatus === 'rejected' && reviewFeedback.length < 10) {
      return NextResponse.json({ error: 'Skriv en konkret begrundelse på mindst 10 tegn, så den professionelle ved, hvad der skal rettes.' }, { status: 400 });
    }

    // Keep the review path on the authenticated admin session. The database
    // policies already grant active admins the required reads and writes, so
    // profile approval does not need a service-role client.
    const { data: professional, error: loadError } = await supabase.from('professional_profiles')
      .select('id, profile_id, title, company, bio, industries, focus_areas, languages, years_experience, price_dkk, linkedin_url, experience_summary, relevant_situations, expected_outcomes, review_status, visibility, approved_at, updated_at')
      .eq('id', id).single();
    if (loadError || !professional) return NextResponse.json({ error: 'Profilen blev ikke fundet.' }, { status: 404 });

    const { data: owner, error: ownerError } = await supabase.from('profiles')
      .select('id, name, email, role, status')
      .eq('id', professional.profile_id)
      .maybeSingle();
    if (ownerError || !owner) return NextResponse.json({ error: 'Profilejeren blev ikke fundet.' }, { status: 404 });
    if (owner.role !== 'professional') {
      return NextResponse.json({ error: 'Profilen kan ikke godkendes, fordi ejeren ikke har en professionel konto.' }, { status: 409 });
    }
    if (visibility === 'published' && owner.status !== 'active') {
      return NextResponse.json({ error: 'Profilen kan ikke publiceres, fordi brugeren ikke er aktiv.' }, { status: 409 });
    }
    if (reviewStatus === 'approved') {
      if (professional.review_status !== 'approved' && professional.visibility !== 'published') {
        return NextResponse.json({ error: 'Profilen er stadig en kladde og er ikke sendt til gennemgang.' }, { status: 409 });
      }
      const missing = professionalProfileMissing({ ...professional, name: owner.name });
      if (missing.length > 0) {
        return NextResponse.json({
          error: `Profilen kan ikke godkendes endnu. Mangler: ${missing.join(', ')}.`,
          missing,
        }, { status: 422 });
      }
    }

    const approvedAt = reviewStatus === 'approved'
      ? professional.review_status === 'approved' && professional.approved_at
        ? professional.approved_at
        : new Date().toISOString()
      : null;

    // Run the status change with the authenticated admin client. The database
    // review trigger relies on the current user's JWT to distinguish an admin
    // decision from a professional editing their own profile.
    const { data: updatedProfessional, error: updateError } = await supabase.from('professional_profiles').update({
      review_status: reviewStatus,
      visibility,
      approved_at: approvedAt,
      review_feedback: reviewStatus === 'rejected' ? reviewFeedback : null,
    }).eq('id', id)
      .eq('updated_at', professional.updated_at)
      .eq('review_status', professional.review_status)
      .eq('visibility', professional.visibility)
      .select('id, review_status, visibility, approved_at, review_feedback')
      .maybeSingle();
    if (updateError) throw updateError;

    if (!updatedProfessional) {
      return NextResponse.json({
        error: 'Profilen blev ændret, mens du gennemgik den. Genindlæs reviewet, før du træffer en beslutning.',
      }, { status: 409 });
    }

    if (
      updatedProfessional.review_status !== reviewStatus
      || updatedProfessional.visibility !== visibility
      || (reviewStatus === 'approved' && !updatedProfessional.approved_at)
      || (reviewStatus === 'rejected' && updatedProfessional.review_feedback !== reviewFeedback)
    ) {
      console.error('[admin:professional-review-mismatch]', {
        id,
        requested: { reviewStatus, visibility },
        persisted: updatedProfessional,
      });
      return NextResponse.json({
        error: 'Status blev ikke gemt korrekt. Genindlæs siden og prøv igen.',
      }, { status: 409 });
    }

    const { error: auditError } = await supabase.from('admin_audit_log').insert({
      admin_user_id: actor.id,
      action: `professional_${reviewStatus}`,
      target_table: 'professional_profiles',
      target_id: id,
      notes: `Review status: ${reviewStatus}; visibility: ${visibility}`,
    });
    const auditLogged = !auditError;
    if (auditError) console.error('[admin:professional-audit]', auditError);

    let notificationSent: boolean | null = null;
    if (professional.review_status !== reviewStatus && ['approved', 'rejected'].includes(reviewStatus)) {
      notificationSent = false;
      if (owner.email) {
        const approved = reviewStatus === 'approved';
        await sendTransactionalEmail({
          to: owner.email,
          templateKey: approved ? 'professional_approved' : 'professional_rejected',
          recipientProfileId: owner?.id,
          dedupeKey: `professional-review-${id}-${reviewStatus}-${professional.updated_at}`,
          subject: approved ? 'Din Naetwork-profil er godkendt' : 'Din Naetwork-profil kræver ændringer',
          title: approved ? 'Din profil er godkendt' : 'Profilen er ikke godkendt endnu',
          intro: approved
            ? `Hej ${owner?.name || 'der'}. Din professionelle profil er godkendt og kan nu vises for kandidater.`
            : `Hej ${owner?.name || 'der'}. Din professionelle profil kræver ændringer, før den kan publiceres.`,
          note: approved
            ? 'Tilføj og vedligehold dine ledige tider, så kandidater kan sende bookinganmodninger.'
            : `Naetworks feedback: ${reviewFeedback}`,
          cta: { label: approved ? 'Åbn ledige tider' : 'Rediger profil', href: appUrl('/profil/professionel') },
        }).then(() => {
          notificationSent = true;
        }).catch((error) => {
          console.error('[admin:professional-email]', error);
        });
      }
    }

    return NextResponse.json({
      ok: true,
      auditLogged,
      notificationSent,
      publiclyVisible: reviewStatus === 'approved' && visibility === 'published' && owner.status === 'active',
      professional: updatedProfessional,
    });
  } catch (error) {
    console.error('[admin:professional-review]', error);
    return NextResponse.json({ error: 'Profilstatus kunne ikke opdateres.' }, { status: 500 });
  }
}
