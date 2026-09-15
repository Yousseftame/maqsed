"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

export function AosProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    void import("aos/dist/aos.css").then(() => {
      if (cancelled) return;
      AOS.init({
        once: true,
        duration: 800,
        offset: 100,
        easing: "ease-in-out",
        disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return <>{children}</>;
}
