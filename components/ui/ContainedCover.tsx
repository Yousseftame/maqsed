"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ContainedCoverProps = {
  src: string;
  alt: string;
  imageClassName?: string;
  onClick?: () => void;
  draggable?: boolean;
  loading?: "lazy" | "eager";
};

export function ContainedCover({
  src,
  alt,
  imageClassName,
  onClick,
  draggable,
  loading,
}: ContainedCoverProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className="h-full w-full bg-gray-200" />;
  }

  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden
        draggable={false}
        className="pointer-events-none absolute inset-0 h-full w-full scale-[1.25] object-cover blur-2xl brightness-90"
      />
      <img
        src={src}
        alt={alt}
        draggable={draggable}
        loading={loading}
        decoding="async"
        onClick={onClick}
        onError={() => setFailed(true)}
        className={cn(
          "relative z-[1] h-full w-full object-contain",
          onClick ? "cursor-pointer" : "",
          imageClassName
        )}
      />
    </>
  );
}
