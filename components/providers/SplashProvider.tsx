"use client";

import { createContext, useContext, useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";

const SplashContext = createContext(false);

export function useSplashDone() {
  return useContext(SplashContext);
}

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <SplashContext.Provider value={splashDone}>
      {!splashDone && <SplashScreen onComplete={() => setSplashDone(true)} />}
      <div style={{ pointerEvents: splashDone ? "auto" : "none" }}>
        {children}
      </div>
    </SplashContext.Provider>
  );
}
