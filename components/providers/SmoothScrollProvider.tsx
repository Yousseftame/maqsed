"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ScrollToTopButton } from "@/components/layout/ScrollToTopButton";

function syncLenisToPage(instance: Lenis, { toTop }: { toTop: boolean }) {
  instance.resize();

  if (toTop) {
    instance.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    return;
  }

  if (instance.animatedScroll > instance.limit) {
    instance.scrollTo(instance.limit, { immediate: true });
  }
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
      autoResize: true,
      naiveDimensions: true,
      stopInertiaOnNavigate: true,
    });

    lenisRef.current = instance;
    setLenis(instance);

    let frame = 0;
    function raf(time: number) {
      instance.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    const resizeObserver = new ResizeObserver(() => {
      syncLenisToPage(instance, { toTop: false });
    });
    resizeObserver.observe(document.body);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    const instance = lenisRef.current;
    if (!instance) return;

    syncLenisToPage(instance, { toTop: true });

    const frame = requestAnimationFrame(() => {
      syncLenisToPage(instance, { toTop: true });
    });
    const timeout = window.setTimeout(() => {
      syncLenisToPage(instance, { toTop: false });
    }, 300);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <>
      {children}
      <ScrollToTopButton lenis={lenis} />
    </>
  );
}
