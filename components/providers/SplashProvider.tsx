"use client";

import { useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <div style={{ pointerEvents: splashDone ? "auto" : "none" }}>
        {children}
      </div>
    </>
  );
}
