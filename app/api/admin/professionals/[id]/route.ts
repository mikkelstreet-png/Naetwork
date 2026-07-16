import { NextResponse } from 'next/server';
import { appUrl, sendTransactionalEmail } from '@/lib/server/email';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

type ReviewStatus = 'pending' | 'approved' | 'rejected';
type Visibility = 'hidden' | 'published';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: 'Ugyldig forespørgsel.' }, { status: 403 });
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Ikke logget ind.' }, { status: 401 });
    const { data: actor } = await supabase.from('profiles').select('id, role').eq('auth_user_id', user.id).maybeSingle();
    if (actor?.role !== 'admin') return NextResponse.json({ error: 'Ingen adgang.' }, { status: 403 });

    const { id } = await context.params;
    const body = await request.json();
    const reviewStatus = body.reviewStatus as ReviewStatus;
    const visibility = body.visibility as Visibility;
    if (!['pending', 'approved', 'rejected'].includes(reviewStatus) || !['hidden', 'published'].includes(visibility)) {
      return NextResponse.json({ error: 'Ugyldig profilstatus.' }, { status: 400 });
    }
    if (reviewStatus !== 'approved' && visibility !== 'hidden') {
      return NextResponse.json({ error: 'Kun godkendte profiler kan publiceres.' }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: professional, error: loadError } = await admin.from('professional_profiles')
      .select('id, profile_id, review_status, visibility, updated_at')
      .eq('id', id).single();
    if (loadError || !professional) return NextResponse.json({ error: 'Profilen blev ikke fundet.' }, { status: 404 });

    const { error: updateError } = await admin.from('professional_profiles').update({
      review_status: reviewStatus,
      visibility,
      approved_at: reviewStatus === 'approved' ? new Date().toISOString() : null,
    }).eq('id', id);
    if (updateError) throw updateError;

    await admin.from('admin_audit_log').insert({
      admin_user_id: actor.id,
      action: `professional_${reviewStatus}`,
      target_table: 'professional_profiles',
      target_id: id,
      notes: `Review status: ${reviewStatus}; visibility: ${visibility}`,
    });

    let notificationSent = true;
    if (professional.review_status !== reviewStatus && ['approved', 'rejected'].includes(reviewStatus)) {
      const { data: owner } = await admin.from('profiles').select('id, name, auth_user_id').eq('id', professional.profile_id).maybeSingle();
      const ownerUser = owner ? await admin.auth.admin.getUserById(owner.auth_user_id) : null;
      if (ownerUser?.data.user?.email) {
        const approved = reviewStatus === 'approved';
        await sendTransactionalEmail({
          to: ownerUser.data.user.email,
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
            : 'Log ind, gennemgå profilens oplysninger og kontakt Naetwork, hvis du har brug for den konkrete begrundelse.',
          cta: { label: approved ? 'Åbn ledige tider' : 'Rediger profil', href: appUrl('/profil/professionel') },
        }).catch((error) => {
          notificationSent = false;
          console.error('[admin:professional-email]', error);
        });
      }
    }

    return NextResponse.json({ ok: true, notificationSent });
  } catch (error) {
    console.error('[admin:professional-review]', error);
    return NextResponse.json({ error: 'Profilstatus kunne ikke opdateres.' }, { status: 500 });
  }
}
