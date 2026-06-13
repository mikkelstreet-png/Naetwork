import { CustomerTaskList } from "@/components/CustomerTaskList";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function OpgaveOverviewPage({ searchParams }: Props) {
  const params = await searchParams;
  const access = params.access || params.token || "";

  return <CustomerTaskList token={access} />;
}
