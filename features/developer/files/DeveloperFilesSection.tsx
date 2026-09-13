"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Loader2, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useAuth } from "@/features/auth/AuthProvider";
import { offersService, type OfferData } from "@/features/admin/offers/offers.service";
import { downloadOfferPDF } from "@/features/admin/offers/offer-pdf";
import { developerOwnerUid } from "@/features/developer/dashboard-owner";

export function DeveloperFilesSection() {
  const { isRtl } = useLocale();
  const { user, userData } = useAuth();
  const ownerUid = developerOwnerUid(user, userData);
  const [queryStr, setQueryStr] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { data: files = [], refetch, isRefetching, isError, isLoading } = useQuery({
    queryKey: ["offers", "developer", ownerUid],
    queryFn: () => offersService.getOffersByDeveloper(ownerUid),
    enabled: Boolean(ownerUid),
  });

  const filtered = useMemo(() => {
    const q = queryStr.trim().toLowerCase();
    if (!q) return files;
    return files.filter(
      (row) =>
        (row.offerNumber || "").toLowerCase().includes(q) ||
        (row.title || "").toLowerCase().includes(q) ||
        (row.projectName || "").toLowerCase().includes(q) ||
        (row.unitNumber || "").toLowerCase().includes(q)
    );
  }, [files, queryStr]);

  async function handleDownload(offer: OfferData) {
    if (downloadingId) return;
    setDownloadingId(offer.id);
    try {
      await downloadOfferPDF(offer);
    } catch (error) {
      console.error("Failed to download offer PDF", error);
      toast.error(isRtl ? "تعذر تحميل الملف." : "Could not download the file.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <section className="rounded-[24px] bg-white p-5 sm:p-7">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8c8c8c]" />
          <input
            type="search"
            value={queryStr}
            onChange={(event) => setQueryStr(event.target.value)}
            placeholder={isRtl ? "البحث في الملفات..." : "Search files..."}
            className="h-12 w-full rounded-full bg-[#F4F4F4] pe-4 ps-11 text-sm font-medium text-[#0a0f1d] outline-none placeholder:text-[#8c8c8c]"
          />
        </label>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isRefetching || !ownerUid}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0a0f1d] transition-colors hover:bg-[#E5E5E5] disabled:opacity-50"
          title={isRtl ? "تحديث" : "Refresh"}
        >
          <RefreshCw className={`h-5 w-5 ${isRefetching ? "animate-spin" : ""}`} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex min-h-40 items-center justify-center rounded-[20px] bg-[#F4F4F4] text-sm font-medium text-[#8c8c8c]">
          {isRtl ? "جاري التحميل..." : "Loading..."}
        </div>
      ) : isError ? (
        <div className="flex min-h-40 items-center justify-center rounded-[20px] bg-[#F4F4F4] text-sm font-medium text-[#8c8c8c]">
          {isRtl ? "تعذر تحميل الملفات." : "Could not load files."}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex min-h-40 flex-col items-center justify-center rounded-[20px] bg-[#F4F4F4] px-4 text-center">
          <FileText className="mb-3 h-8 w-8 text-[#0a0f1d]/20" />
          <p className="text-sm font-medium text-[#8c8c8c]">
            {isRtl
              ? "لا توجد ملفات بعد. ستظهر هنا بعد إضافة العرض للوحة."
              : "No files yet. They appear after an offer is added to the dashboard."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((offer) => {
            const busy = downloadingId === offer.id;
            return (
              <div
                key={offer.id}
                className="flex items-center gap-4 rounded-[20px] bg-[#F4F4F4] px-4 py-3.5 sm:px-5"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0a0f1d] text-white">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#0a0f1d]">
                    {offer.offerNumber ? `#${offer.offerNumber}` : "—"}
                    {offer.title ? ` · ${offer.title}` : ""}
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-[#8c8c8c]">
                    {isRtl ? "عرض PDF" : "Offer PDF"}
                    {offer.projectName ? ` · ${offer.projectName}` : ""}
                    {offer.unitNumber ? ` · ${offer.unitNumber}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownload(offer)}
                  disabled={Boolean(downloadingId)}
                  className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#0a0f1d] px-4 text-sm font-bold text-white transition-colors hover:bg-[#161c2d] disabled:opacity-60 sm:px-5"
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isRtl ? "تحميل" : "Download"}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
