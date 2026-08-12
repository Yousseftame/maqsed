import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-white">

      {/* ── Left: Form side ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        
        {/* Logo */}
        <div className="px-8 pt-8 pb-0 flex-shrink-0">
          <Link href="/" className="inline-flex items-center">
            <Image src="/lgoogg.png" alt="Maqsed" width={110} height={28} className="object-contain" />
          </Link>
        </div>

        {/* Page content (the form) */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          {children}
        </div>

        {/* Footer note */}
        <p className="px-8 pb-6 text-[11px] font-mono uppercase tracking-widest text-gray-300 text-center flex-shrink-0">
          © 2026 Maqsed. All Rights Reserved
        </p>
      </div>

      {/* ── Right: Image side ── */}
      <div className="hidden lg:flex relative w-[52%] flex-shrink-0 bg-[#0a0f1d] overflow-hidden items-center justify-center p-12">
        {/* Main image with creative clipping/framing */}
        <div className="absolute inset-0">
           <Image
            src="/herosectionimg.avif"
            alt="Luxury property"
            fill
            className="object-cover opacity-50 mix-blend-luminosity"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-[#0a0f1d]/20 to-transparent" />
        </div>

        {/* Dynamic Abstract Shapes / Gradients */}
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-lg">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Premium Real Estate</span>
          </div>

          <h2 className="text-white text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-8">
            Redefining <br/>
            luxury living.
          </h2>

          {/* Glassmorphism Testimonial Card */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 overflow-hidden group">
            {/* Animated Glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-white/10 to-transparent" />
            
            <p className="text-white/90 text-lg leading-relaxed mb-8 relative z-10">
              "Our vision has always been to elevate the standard of living. Maqsed is built on trust, innovation, and an unwavering commitment to excellence."
            </p>

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 relative bg-white/10 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Chairman</p>
                  <p className="text-white/50 text-xs">Maqsed Group</p>
                </div>
              </div>

              {/* Decorative Quote Mark */}
              <div className="text-white/10 font-serif text-8xl leading-none absolute bottom-0 right-4 translate-y-4 select-none">
                "
              </div>
            </div>
          </div>
        </div>

        {/* Huge Watermark Typography */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[40%] -rotate-90 select-none pointer-events-none origin-center">
          <h2 className="text-[18vh] font-black text-white/5 tracking-tighter leading-none whitespace-nowrap">
            MAQSED
          </h2>
        </div>
      </div>

    </div>
  );
}