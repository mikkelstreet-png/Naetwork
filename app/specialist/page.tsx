import { SpecialistDashboard } from "@/components/SpecialistDashboard";

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function SpecialistAreaPage({ searchParams }: Props) {
  const params = await searchParams;
  const access = params.access || params.t || params.token || "";

  return <SpecialistDashboard token={access} />;
}
