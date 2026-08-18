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
}

export function PageHeader({ title, breadcrumbPaths, backgroundImage }: PageHeaderProps) {
  const { isRtl } = useLocale();

  return (
    <div 
      className="relative flex h-[300px] w-full flex-col items-center justify-center bg-cover bg-center md:h-[400px]"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a0f1d]/60"></div>
      
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
                    className="text-white transition-colors hover:text-gray-300"
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
