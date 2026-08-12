"use client";

import { useState } from "react";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

export function FAQSection() {
  const { t, locale, dictionary } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const faqs = dictionary.faq.items;

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F5F5F5] px-6 py-24 md:px-12 lg:px-20">
      <div
        className="pointer-events-none absolute top-10 start-6 mix-blend-multiply select-none md:top-14 md:start-10"
        aria-hidden
      >
        <Image
          src="/bgicon.png"
          alt=""
          width={160}
          height={160}
          className="h-[120px] w-[120px] max-w-none object-contain opacity-40 md:h-[160px] md:w-[160px]"
        />
      </div>
      <div
        className="pointer-events-none absolute bottom-10 end-6 mix-blend-multiply select-none md:bottom-14 md:end-10"
        aria-hidden
      >
        <Image
          src="/bgicon.png"
          alt=""
          width={160}
          height={160}
          className="h-[120px] w-[120px] max-w-none object-contain opacity-40 md:h-[160px] md:w-[160px]"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col-reverse items-start gap-16 lg:flex-row lg:gap-24">
        <div className="flex w-full flex-col lg:w-1/2">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={`${locale}-${index}`}
                className="border-b-2 border-gray-200 py-8 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="group flex w-full items-center justify-between gap-6 text-start"
                >
                  <h4 className="pe-4 text-xl font-semibold text-[#0a0f1d] transition-colors duration-300">
                    {faq.q}
                  </h4>
                  <div
                    className="flex-shrink-0 text-[#0a0f1d]"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <ChevronDown className="h-6 w-6 stroke-[1.5]" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "mt-5 grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pe-8 text-[1.15rem] leading-relaxed font-medium text-[#6b7280]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-start pt-4 text-start lg:w-1/2 lg:items-end lg:text-end">
          <div className="group mb-6 inline-flex cursor-default items-center gap-2 rounded-full border border-gray-200 px-3.5 py-1.5 transition-colors duration-300 hover:bg-[#0a0f1d]">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-[#0a0f1d] transition-colors duration-300 group-hover:bg-white" />
            <span className="text-sm font-medium tracking-wide text-[#0a0f1d] transition-colors duration-300 group-hover:text-white">
              {t("faq.pill")}
            </span>
          </div>

          <h2 className="mb-6 flex flex-col items-start text-5xl leading-[1.1] font-bold tracking-tight text-[#0a0f1d] lg:items-end lg:text-[4.5rem]">
            <DiaTextReveal
              key={`faq-1-${locale}`}
              text={t("faq.titleLine1")}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
            />
            <DiaTextReveal
              key={`faq-2-${locale}`}
              text={t("faq.titleLine2")}
              textColor="#0a0f1d"
              colors={["#0a0f1d"]}
            />
          </h2>

          <p className="max-w-lg text-base leading-relaxed text-[#8c8c8c]">
            {t("faq.intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
