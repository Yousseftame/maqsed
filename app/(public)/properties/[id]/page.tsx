import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  allProperties,
  getPropertyById,
} from "@/features/properties/data/listings";
import { PropertyDetail } from "@/features/properties/components/PropertyDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return allProperties.map((property) => ({
    id: String(property.id),
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(Number(id));

  if (!property) {
    return { title: "Property | MAQSED" };
  }

  return {
    title: `${property.title} | MAQSED`,
    description: property.description,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = getPropertyById(Number(id));

  if (!property) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col bg-white">
      <PropertyDetail property={property} />
    </div>
  );
}
