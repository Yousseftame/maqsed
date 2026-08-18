"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";

type LightboxProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const { isRtl } = useLocale();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") isRtl ? handleNext() : handlePrevious();
      if (e.key === "ArrowRight") isRtl ? handlePrevious() : handleNext();
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isRtl, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 transition-all duration-300">
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-4 end-4 sm:top-6 sm:end-6 z-50 flex p-2 text-gray-400 transition-colors hover:text-white"
      >
        <X className="h-8 w-8 stroke-[1]" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button 
            onClick={isRtl ? handleNext : handlePrevious}
            className="absolute left-2 sm:left-8 z-50 flex p-4 text-gray-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-10 w-10 sm:h-14 sm:w-14 stroke-[1]" />
          </button>
          
          <button 
            onClick={isRtl ? handlePrevious : handleNext}
            className="absolute right-2 sm:right-8 z-50 flex p-4 text-gray-400 transition-colors hover:text-white"
          >
            <ChevronRight className="h-10 w-10 sm:h-14 sm:w-14 stroke-[1]" />
          </button>
        </>
      )}

      {/* Image Container */}
      <div className="relative h-[90vh] w-[90vw] max-w-7xl">
        <Image
          src={images[currentIndex]}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
          priority
        />
      </div>
    </div>
  );
}
