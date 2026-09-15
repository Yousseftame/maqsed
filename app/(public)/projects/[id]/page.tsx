import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  permanentRedirect(`/properties/${encodeURIComponent(id)}`);
}
