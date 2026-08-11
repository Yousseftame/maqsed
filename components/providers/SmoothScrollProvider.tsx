"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,        // How long the scroll animation takes (higher = slower/smoother)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing = that "swimming" feel
      smoothWheel: true,    // Smooth mouse wheel scrolling
      touchMultiplier: 1.5, // Natural feel on touch devices
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
