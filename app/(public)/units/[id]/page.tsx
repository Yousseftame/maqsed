import { UnitDetail } from "@/features/units/components/UnitDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Unit | MAQSED",
  description: "Unit details",
};

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col bg-white">
      <UnitDetail unitId={id} />
    </div>
  );
}
