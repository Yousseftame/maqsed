"use client";

import { useEffect, useState } from "react";

export function ProjectDeveloperOverlay({
  name,
  logo,
}: {
  name?: string;
  logo?: string;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const displayName = String(name || "").trim();
  const logoSrc = String(logo || "").trim();
  const showLogo = Boolean(logoSrc) && !logoFailed;

  useEffect(() => {
    setLogoFailed(false);
  }, [logoSrc]);

  if (!displayName && !showLogo) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-10">
      <div className="flex min-w-0 items-center gap-2.5">
        {showLogo ? (
          <img
            src={logoSrc}
            alt=""
            className="h-11 w-11 shrink-0 rounded-lg bg-white/90 object-contain p-0.5"
            onError={() => setLogoFailed(true)}
          />
        ) : null}
        {displayName ? (
          <span className="min-w-0 truncate text-[15px] font-semibold tracking-wide text-white/95">
            {displayName}
          </span>
        ) : null}
      </div>
    </div>
  );
}
