export function AdvertisementInfoCard({
  items,
  title,
}: {
  items?: string[];
  title: string;
}) {
  const lines = (items || []).map((item) => item.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <div className="w-full rounded-[28px] bg-[#f4f4f4] px-8 py-8 text-start md:px-10">
      <h3 className="mb-6 text-2xl font-black text-[#2e2e2e]">{title}</h3>
      <div className="flex flex-col gap-3">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className="text-base font-semibold leading-relaxed text-[#2e2e2e] md:text-lg"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export function AdvertisementInfoAdminBlock({ items }: { items?: string[] }) {
  const lines = (items || []).map((item) => item.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <div>
      <h3 className="mb-5 text-lg font-bold tracking-tight text-[#0a0f1d]">معلومات الاعلان</h3>
      <div className="rounded-[20px] bg-white px-6 py-5 shadow-sm border border-[#0a0f1d]/5">
        <div className="flex flex-col gap-3">
          {lines.map((line, index) => (
            <p key={`${line}-${index}`} className="text-base font-semibold text-[#0a0f1d]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
