"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useFaqs } from "@/features/faq/useFaqs";

export function FaqPage() {
  const { t, locale } = useLocale();
  const { items } = useFaqs();
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  const renderFaq = (faq: { id: string; question: string; answer: string }) => {
    const isOpen = openIndex === faq.id;
    return (
      <div
        key={faq.id}
        className="w-full h-max bg-[#F5F5F5] overflow-hidden rounded-3xl transition-all duration-300"
      >
        <button
          type="button"
          onClick={() => toggleFaq(faq.id)}
          aria-expanded={isOpen}
          aria-controls={`faq-page-panel-${faq.id}`}
          className="flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-8 sm:py-5"
        >
          <h2 className="flex-1 text-start text-[15px] sm:text-[17px] font-bold text-[#333]">
            {faq.question}
          </h2>
          <div
            className={`flex items-center justify-center w-7 h-7 rounded-full border flex-shrink-0 ${
              isOpen
                ? "border-[#17C3B3] bg-[#17C3B3] text-white"
                : "border-[#17C3B3] text-[#17C3B3]"
            }`}
          >
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>

        <div
          id={`faq-page-panel-${faq.id}`}
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
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative z-30 w-full overflow-hidden bg-white px-6 py-24 md:px-12 lg:px-20 min-h-screen">
        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center text-center">
          
          {/* Top Badge */}
          <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#6A2B92]">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#6A2B92] transition-colors duration-300 group-hover:bg-white" />
            <span className="text-sm font-medium tracking-wide text-[#6A2B92] transition-colors duration-300 group-hover:text-white">
              {t("faq.pill")}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-14 text-4xl font-bold leading-tight tracking-tight text-[#6A2B92] sm:text-5xl lg:text-[3.5rem]">
            <DiaTextReveal
              key={`faq-page-title-${locale}`}
              text={t("faq.title")}
              textColor="#6A2B92"
              colors={["#6A2B92"]}
            />
          </h1>

          {items.length === 0 ? (
            <p className="text-base font-medium text-[#8c8c8c]">{t("faq.empty")}</p>
          ) : (
            <div className="flex w-full flex-col lg:flex-row gap-4 lg:gap-6 text-start">
              <div className="flex flex-1 flex-col gap-4 lg:gap-6">
                {items.filter((_, i) => i % 2 === 0).map((faq) => renderFaq(faq))}
              </div>
              <div className="flex flex-1 flex-col gap-4 lg:gap-6">
                {items.filter((_, i) => i % 2 !== 0).map((faq) => renderFaq(faq))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
