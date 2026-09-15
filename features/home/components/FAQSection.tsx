"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFaqs } from "@/features/faq/useFaqs";

export function FAQSection() {
  const { t, locale } = useLocale();
  const { featured, isFetched } = useFaqs();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  if (isFetched && featured.length === 0) return null;

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section className="relative z-30 w-full overflow-hidden bg-white px-6 pt-4 pb-16 md:px-12 md:pt-8 md:pb-20 lg:px-20">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        
        {/* Top Badge */}
        <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
          <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
          <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
            {t("faq.pill")}
          </span>
        </div>

        {/* Title */}
        <h2 className="mb-14 text-4xl font-bold leading-tight tracking-tight text-[#6A2B92] sm:text-5xl lg:text-[3.5rem]">
          <DiaTextReveal
            key={`faq-title-${locale}`}
            text={t("faq.title")}
            textColor="#6A2B92"
            colors={["#6A2B92"]}
          />
        </h2>

        {/* FAQ Accordion List */}
        <div className="flex w-full flex-col gap-4">
          {featured.map((faq) => {
            const isOpen = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className="w-full bg-[#F5F5F5] overflow-hidden rounded-3xl transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${faq.id}`}
                  className="flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-8 sm:py-5"
                >
                  <h3 className="flex-1 text-start text-[15px] sm:text-[17px] font-bold text-[#333]">
                    {faq.question}
                  </h3>
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border ${
                      isOpen
                        ? "border-[#17C3B3] bg-[#17C3B3] text-white"
                        : "border-[#17C3B3] text-[#17C3B3]"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </div>
                </button>

                <div
                  id={`faq-panel-${faq.id}`}
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "grid-rows-[1fr] opacity-100 pb-5 px-6 sm:px-8"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[15px] leading-relaxed font-medium text-[#6b7280] text-start pe-10">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
