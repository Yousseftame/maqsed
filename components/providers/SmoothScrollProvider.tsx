"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

const SmoothScrollContext = createContext<{
  lock: () => void;
  unlock: () => void;
}>({
  lock: () => {},
  unlock: () => {},
});

export function useLockPageScroll(locked: boolean) {
  const { lock, unlock } = useContext(SmoothScrollContext);

  useEffect(() => {
    if (!locked) return;
    lock();
    return unlock;
  }, [locked, lock, unlock]);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const disableSmooth =
    pathname.startsWith("/admin") || pathname.startsWith("/developer");
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  const lock = useCallback(() => {
    lenisRef.current?.stop();
  }, []);

  const unlock = useCallback(() => {
    lenisRef.current?.start();
  }, []);

  useEffect(() => {
    if (disableSmooth) return;

    let cancelled = false;
    let frame = 0;
    let resizeObserver: ResizeObserver | null = null;

    const start = () => {
      if (cancelled) return;
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

      function raf(time: number) {
        instance.raf(time);
        frame = requestAnimationFrame(raf);
      }

      frame = requestAnimationFrame(raf);

      resizeObserver = new ResizeObserver(() => {
        syncLenisToPage(instance, { toTop: false });
      });
      resizeObserver.observe(document.body);
    };

    const timer = window.setTimeout(start, 1800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      lenisRef.current?.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [disableSmooth]);

  useEffect(() => {
    const instance = lenisRef.current;
    if (!instance) return;

    const hash = window.location.hash.replace(/^#/, "");
    const scrollToHash = () => {
      if (!hash) return false;
      const target = document.getElementById(hash);
      if (!target) return false;
      instance.resize();
      instance.scrollTo(target, { immediate: true, offset: -8 });
      return true;
    };

    if (hash) {
      if (scrollToHash()) return;
      const frame = requestAnimationFrame(scrollToHash);
      const timeout = window.setTimeout(scrollToHash, 400);
      return () => {
        cancelAnimationFrame(frame);
        window.clearTimeout(timeout);
      };
    }

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
    <SmoothScrollContext.Provider value={{ lock, unlock }}>
      {children}
      {/* {disableSmooth ? null : <ScrollToTopButton lenis={lenis} />} */}
    </SmoothScrollContext.Provider>
  );
}
