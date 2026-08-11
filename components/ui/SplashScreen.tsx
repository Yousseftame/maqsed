"use client";

import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Start exit animation after drawing is done
    const exitTimer = setTimeout(() => setExiting(true), 3400);
    // Unmount after exit animation completes
    const doneTimer = setTimeout(() => onComplete(), 4400);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  // Asymmetric building silhouette:
  // Base starts at x=550, goes to 640. Center is 595.
  // The baseline is exactly at y=210 (center of 420 viewBox)
  const buildingPath = [
    "M 0,210",
    "H 550",             // left line to base
    "V 140",             // up
    "H 560",             // step in
    "V 90",              // up
    "H 570",             // step in
    "V 40",              // up to left shoulder
    "L 585,20",          // slant up to peak
    "L 620,45",          // slant down to right shoulder
    "V 90",              // straight down
    "H 630",             // step out
    "V 140",             // down
    "H 640",             // step out
    "V 210",             // down to baseline
    "H 1200",            // right line to edge
  ].join(" ");

  return (
    <>
      <style>{`
        @keyframes splash-draw {
          from { stroke-dashoffset: 1800; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes ar-premium-in {
          0% { opacity: 0; filter: blur(12px); transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0) scale(1); }
        }
        @keyframes en-wrapper-reveal {
          0% { max-width: 0; margin-left: 0; }
          100% { max-width: 200px; margin-left: 0.75rem; }
        }
        @keyframes en-text-in {
          0% { opacity: 0; transform: translateX(-30px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes splash-svg-exit {
          from { opacity: 1; transform: scale(1); filter: blur(0px); }
          to   { opacity: 0; transform: scale(1.05); filter: blur(4px); }
        }
        @keyframes splash-split-top {
          from { transform: translateY(0); }
          to   { transform: translateY(-100%); }
        }
        @keyframes splash-split-bottom {
          from { transform: translateY(0); }
          to   { transform: translateY(100%); }
        }
        .splash-path {
          stroke-dasharray: 1800;
          stroke-dashoffset: 1800;
          animation: splash-draw 2.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s forwards;
        }
        .ar-text {
          opacity: 0;
          animation: ar-premium-in 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 0.1s; 
        }
        .en-wrapper {
          overflow: hidden;
          max-width: 0;
          margin-left: 0;
          animation: en-wrapper-reveal 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 1.5s; 
        }
        .en-text {
          display: block;
          opacity: 0;
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          animation: en-text-in 2s cubic-bezier(0.19, 1, 0.22, 1) forwards;
          animation-delay: 1.5s; 
        }
        .splash-svg-exit {
          animation: splash-svg-exit 0.4s ease-out forwards;
        }
        .splash-exit-top {
          animation: splash-split-top 0.8s cubic-bezier(0.76, 0, 0.24, 1) 0.2s forwards;
        }
        .splash-exit-bottom {
          animation: splash-split-bottom 0.8s cubic-bezier(0.76, 0, 0.24, 1) 0.2s forwards;
        }
      `}</style>

      <div className="fixed inset-0 z-[9999] pointer-events-none">
        
        {/* Split Backgrounds - They meet exactly at the 62vh line */}
        <div className={`absolute inset-x-0 top-0 h-[62vh] bg-[#090c1b] ${exiting ? "splash-exit-top" : ""}`} />
        <div className={`absolute inset-x-0 bottom-0 h-[38vh] bg-[#090c1b] ${exiting ? "splash-exit-bottom" : ""}`} />

        {/* SVG container - Vertically centered exactly on the 62vh line */}
        <div className={`absolute top-[62vh] -translate-y-1/2 w-full z-10 ${exiting ? "splash-svg-exit" : ""}`}>
          <svg
            viewBox="0 0 1200 420"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            style={{ height: "auto", display: "block" }}
          >
            {/* Animated building + line path */}
            <path
              className="splash-path"
              d={buildingPath}
              fill="none"
              stroke="rgba(255,255,255,0.82)"
              strokeWidth="1.2"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </svg>
        </div>

        {/* Text overlay — Positioned relative to the 62vh line */}
        <div className={`absolute top-[62vh] left-0 w-full flex justify-center items-center mt-[15px] z-20 pointer-events-none ${exiting ? "splash-svg-exit" : ""}`}>
          <div className="flex items-center text-[22px] font-bold font-geist text-white/90">
            <span className="ar-text tracking-wide">مقصد</span>
            <span className="en-wrapper">
              <span className="en-text whitespace-nowrap overflow-hidden">Maqsed</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
