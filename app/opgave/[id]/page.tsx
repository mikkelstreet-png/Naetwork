import { CustomerTaskDetail } from "@/components/CustomerTaskDetail";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function CustomerTaskPage({ params, searchParams }: Props) {
  const routeParams = await params;
  const query = await searchParams;
  const access = query.access || query.token || "";

  return <CustomerTaskDetail taskId={routeParams.id} token={access} />;
}
