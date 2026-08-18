import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allUnits, getUnitById } from "@/features/units/data/units";
import { UnitDetail } from "@/features/units/components/UnitDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return allUnits.map((unit) => ({
    id: unit.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const unit = getUnitById(id);

  if (!unit) {
    return { title: "Unit | MAQSED" };
  }

  return {
    title: `Unit ${unit.id} | MAQSED`,
    description: unit.descriptionEn,
  };
}

export default async function UnitDetailPage({ params }: PageProps) {
  const { id } = await params;
  const unit = getUnitById(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col bg-white">
      <UnitDetail unit={unit} />
    </div>
  );
}
