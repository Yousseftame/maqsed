"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function canOptimize(src: string) {
  if (!src || src.startsWith("blob:") || src.startsWith("data:")) return false;
  return src.startsWith("/") || /^https?:\/\//i.test(src);
}

type OptimizedCoverImageProps = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  onClick?: () => void;
  onError?: () => void;
};

export function OptimizedCoverImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  quality = 75,
  onClick,
  onError,
}: OptimizedCoverImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className="h-full w-full bg-gray-200" />;
  }

  const handleError = () => {
    setFailed(true);
    onError?.();
  };

  if (!canOptimize(src)) {
    return (
      <img
        src={src}
        alt={alt}
        draggable={false}
        onClick={onClick}
        onError={handleError}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        draggable={false}
        onClick={onClick}
        onError={handleError}
        className={cn("object-cover", className)}
      />
    </div>
  );
}
