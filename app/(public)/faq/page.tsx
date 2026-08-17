"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function FAQPage() {
  const { t, locale, dictionary } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Create an array of 20 items by repeating the existing FAQ items
  const baseFaqs = dictionary.faq.items;
  const faqs = Array.from({ length: 20 }, (_, i) => baseFaqs[i % baseFaqs.length]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Render a single FAQ item
  const renderFaq = (faq: { q: string, a: string }, index: number) => {
    const isOpen = openIndex === index;
    return (
      <div
        key={`${locale}-faq-${index}`}
        className="w-full h-max bg-[#F5F5F5] overflow-hidden rounded-3xl transition-all duration-300"
      >
        <button
          type="button"
          onClick={() => toggleFaq(index)}
          className="flex w-full items-center justify-between gap-6 px-6 py-4 sm:px-8 sm:py-5"
        >
          <h4 className="flex-1 text-start text-[15px] sm:text-[17px] font-bold text-[#333]">
            {faq.q}
          </h4>
          <div className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-400 flex-shrink-0 text-gray-500">
            {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </div>
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen
              ? "grid-rows-[1fr] opacity-100 pb-5 px-6 sm:px-8"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-[15px] leading-relaxed font-medium text-[#6b7280] text-start pe-10">
              {faq.a}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col bg-white">
      <section className="relative z-30 w-full overflow-hidden bg-white px-6 py-24 md:px-12 lg:px-20 min-h-screen">
        {/* Background Watermarks */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 select-none"
          aria-hidden
        >
          <Image
            src="/faq_left.png"
            alt=""
            width={600}
            height={600}
            className="h-[200px] w-auto max-w-none object-contain opacity-100 md:h-[280px]"
          />
        </div>
        <div
          className="pointer-events-none absolute bottom-0 right-0 select-none"
          aria-hidden
        >
          <Image
            src="/faq_right.png"
            alt=""
            width={600}
            height={600}
            className="h-[200px] w-auto max-w-none object-contain opacity-100 md:h-[280px]"
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center text-center">
          
          {/* Top Badge */}
          <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
            <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
              {t("faq.pill")}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-14 text-4xl font-bold leading-tight tracking-tight text-[#0a0f1d] sm:text-5xl lg:text-[3.5rem]">
            <DiaTextReveal
              key={`faq-page-title-${locale}`}
              text={t("faq.title")}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
            />
          </h1>

          {/* FAQ Accordion Layout - Independent Columns */}
          <div className="flex w-full flex-col lg:flex-row gap-4 lg:gap-6 text-start">
            {/* Left Column (Even indexes) */}
            <div className="flex flex-1 flex-col gap-4 lg:gap-6">
              {faqs
                .map((faq, idx) => ({ faq, idx }))
                .filter((_, i) => i % 2 === 0)
                .map(({ faq, idx }) => renderFaq(faq, idx))}
            </div>
            {/* Right Column (Odd indexes) */}
            <div className="flex flex-1 flex-col gap-4 lg:gap-6">
              {faqs
                .map((faq, idx) => ({ faq, idx }))
                .filter((_, i) => i % 2 !== 0)
                .map(({ faq, idx }) => renderFaq(faq, idx))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
