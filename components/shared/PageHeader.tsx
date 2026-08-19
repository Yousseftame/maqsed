"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/LocaleProvider";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

interface PageHeaderProps {
  title: string;
  breadcrumbPaths: { name: string; url?: string }[];
  backgroundImage: string;
  isPattern?: boolean;
}

export function PageHeader({ title, breadcrumbPaths, backgroundImage, isPattern = false }: PageHeaderProps) {
  const { isRtl } = useLocale();

  return (
    <div className={cn("relative flex h-[300px] w-full flex-col items-center justify-center overflow-hidden md:h-[400px]", isPattern ? "bg-[#3E1854]" : "")}>
      
      {/* Background Graphic */}
      <div 
        className={cn(
          "absolute inset-0 w-full h-full z-0",
          isPattern 
            ? `opacity-15 mix-blend-overlay pointer-events-none ${!isRtl ? "scale-x-[-1]" : ""}` 
            : "bg-cover bg-center"
        )}
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: isPattern ? "70%" : undefined,
          backgroundRepeat: isPattern ? "repeat" : undefined,
          backgroundPosition: isPattern ? "left top" : undefined
        }}
      />

      {/* Dark overlay for non-pattern photos */}
      {!isPattern && <div className="absolute inset-0 bg-[#0a0f1d]/60 z-0"></div>}
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-4 px-4 text-center mt-12 md:mt-16">
        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          <DiaTextReveal text={title} textColor="white" colors={["white"]} />
        </h1>
        
        <div className="flex items-center gap-2 text-lg sm:text-xl font-medium mt-4">
          {breadcrumbPaths.map((path, index) => {
            const isLast = index === breadcrumbPaths.length - 1;
            
            return (
              <div key={path.name} className="flex items-center gap-2">
                {path.url && !isLast ? (
                  <Link 
                    href={path.url} 
                    className="text-white transition-colors hover:text-[#17C3B3]"
                  >
                    {path.name}
                  </Link>
                ) : (
                  <span className="text-white">{path.name}</span>
                )}
                
                {!isLast && (
                  <span className="text-white mt-[2px]">
                    <ChevronRight className={cn("h-5 w-5", isRtl && "rotate-180")} strokeWidth={2.5} />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
