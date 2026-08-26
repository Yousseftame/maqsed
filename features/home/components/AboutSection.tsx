"use client";

import Image from "next/image";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Sparkles, ShieldCheck, Target, Users, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { allProperties } from "@/features/properties/data/listings";

export function AboutSection() {
  const { isRtl } = useLocale();

  return (
    <section className="relative z-30 w-full overflow-hidden bg-[#F9FAFB] px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-[1400px]">
        <div className={cn(
          "flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden",
          isRtl ? "lg:flex-row-reverse" : "lg:flex-row"
        )}>
          
          {/* Text Content Side */}
          <div className="flex-1 flex flex-col justify-center p-10 lg:p-16 text-start">
            <div className="mb-6 rounded-full bg-[#17C3B3]/10 px-5 py-2 text-sm font-bold text-[#17C3B3] border border-[#17C3B3]/20 w-fit">
              {isRtl ? "من نحن" : "About Us"}
            </div>
            
            <h2 className="mb-3 text-4xl font-extrabold text-[#6A2B92] sm:text-5xl">
              {isRtl ? "مقصد العقارية" : "MAQSED Real Estate"}
            </h2>
            
            <h3 className="mb-8 text-2xl font-bold text-[#0a0f1d] sm:text-3xl">
              {isRtl ? "رؤية واعدة للمستقبل" : "A Promising Vision for the Future"}
            </h3>
            
            <p className="mb-12 text-base leading-relaxed text-gray-500 font-medium max-w-2xl">
              {isRtl 
                ? "تأسست شركة مقصد لتكون الخيار الأول في عالم التطوير العقاري، حيث نهدف إلى بناء مجتمعات سكنية عصرية تدمج بين الابتكار في التصميم وأعلى معايير الجودة. نحن نلتزم بتطوير وجهات عمرانية تلهم الأجيال القادمة وتحقق أعلى درجات الاستدامة والرفاهية لعملائنا، تماشياً مع الطموحات المستقبلية للمملكة." 
                : "MAQSED was established to be the premier choice in real estate development, aiming to build modern residential communities that blend innovative design with the highest quality standards. We are committed to developing urban destinations that inspire future generations and achieve maximum sustainability and luxury for our clients, in line with the Kingdom's future aspirations."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white transition-colors hover:border-[#17C3B3] hover:shadow-sm">
                <Sparkles className="h-5 w-5 text-[#17C3B3]" />
                <span className="text-sm font-bold text-gray-700">
                  {isRtl ? "خدمات عقارية احترافية" : "Professional Real Estate Services"}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white transition-colors hover:border-[#17C3B3] hover:shadow-sm">
                <ShieldCheck className="h-5 w-5 text-[#17C3B3]" />
                <span className="text-sm font-bold text-gray-700">
                  {isRtl ? "جودة التشييد والتنفيذ" : "Quality Construction & Execution"}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white transition-colors hover:border-[#17C3B3] hover:shadow-sm">
                <Target className="h-5 w-5 text-[#17C3B3]" />
                <span className="text-sm font-bold text-gray-700">
                  {isRtl ? "مواكبة رؤية 2030" : "Aligned with Vision 2030"}
                </span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 bg-white transition-colors hover:border-[#17C3B3] hover:shadow-sm">
                <Users className="h-5 w-5 text-[#17C3B3]" />
                <span className="text-sm font-bold text-gray-700">
                  {isRtl ? "تلبية متطلبات العصر" : "Meeting Modern Needs"}
                </span>
              </div>
            </div>

            <div className="mt-10 flex">
              <a
                href="/بروفايل مقصد V2.pdf"
                download
                className="inline-flex items-center gap-2 rounded-xl bg-[#6A2B92] px-8 py-3.5 text-base font-bold text-white transition-all hover:bg-[#522070] hover:scale-105 shadow-md hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>{isRtl ? "تحميل بروفايل الشركة" : "Download Company Profile"}</span>
              </a>
            </div>
          </div>

          {/* Image Side */}
          <div className="flex-1 relative min-h-[400px] lg:min-h-[auto] p-4 lg:p-6">
            <div className="relative h-full w-full rounded-2xl overflow-hidden min-h-[400px]">
              <Image
                src={allProperties[0]?.image || "/images/placeholder.jpg"}
                alt="Wabl Real Estate Building"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
