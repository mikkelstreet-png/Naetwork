import { SessionPlanWorkspace } from '@/components/SessionPlanWorkspace'

export default async function SessionPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <SessionPlanWorkspace bookingId={id} />
}
