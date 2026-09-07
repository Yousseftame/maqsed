"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { useLegalItems } from "@/features/legal/useLegal";
import type { LegalPageId } from "@/features/legal/legal.service";

function LegalSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="rounded-2xl border border-gray-100 bg-white p-6">
          <div className="mb-3 h-5 w-2/3 animate-pulse rounded-full bg-[#EDE8F3]" />
          <div className="mb-2 h-4 w-full animate-pulse rounded-full bg-[#EDE8F3]" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-[#EDE8F3]" />
        </div>
      ))}
    </div>
  );
}

export function LegalDocumentPage({
  page,
  titleKey,
}: {
  page: LegalPageId;
  titleKey: "legalPages.privacyTitle" | "legalPages.termsTitle";
}) {
  const { t } = useLocale();
  const { items, isPending, isFetched } = useLegalItems(page);

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="px-6 pt-8 pb-16 md:px-12 lg:px-20 lg:pt-10 lg:pb-24">
        <div className="mx-auto w-full max-w-[1400px]">
          <h1 className="mb-10 text-3xl font-bold leading-tight tracking-tight text-[#6A2B92] sm:text-4xl">
            {t(titleKey)}
          </h1>

          {isPending ? <LegalSkeleton /> : null}

          {!isPending && isFetched && items.length === 0 ? (
            <p className="rounded-2xl border border-gray-100 bg-[#fcfcfc] px-6 py-12 text-center text-base font-medium text-[#8c8c8c]">
              {t("legalPages.empty")}
            </p>
          ) : null}

          {!isPending && items.length > 0 ? (
            <div className="flex flex-col gap-8">
              {items.map((item, index) => (
                <article key={item.id} className="text-start">
                  {item.question ? (
                    <h2 className="mb-3 text-lg font-bold leading-snug text-[#0a0f1d] sm:text-xl">
                      <span className="me-2 text-[#17C3B3]">{index + 1}.</span>
                      {item.question}
                    </h2>
                  ) : null}
                  {item.answer ? (
                    <p className="whitespace-pre-line text-base leading-[1.9] text-[#6B7280]">{item.answer}</p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
