import { PropertyDetail } from "@/features/properties/components/PropertyDetail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Project | MAQSED",
  description: "Project details",
};

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="flex w-full flex-col bg-white">
      <PropertyDetail propertyId={id} />
    </div>
  );
}
