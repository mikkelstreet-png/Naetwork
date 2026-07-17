import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_admin')
    .eq('auth_user_id', user.id)
    .single();

  if (!profile || (profile.role !== 'admin' && !profile.is_admin)) redirect('/');

  return <AdminShell userEmail={user.email ?? ''}>{children}</AdminShell>;
}
