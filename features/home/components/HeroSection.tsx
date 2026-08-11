import Image from "next/image";

export function HeroSection() {
  return (
    <section className="sticky top-16 w-full h-[calc(100vh-64px)] min-h-[700px] flex flex-col justify-end overflow-hidden bg-white">
      
      {/* Background Huge Text */}
      <div className="absolute top-[8%] sm:top-[12%] left-0 w-full flex justify-center z-0 px-4">
        <h1 
          className="text-[#0a0f1d] font-bold leading-none tracking-tighter select-none"
          style={{ fontSize: "clamp(120px, 22vw, 400px)" }}
        >
          MAQSED
        </h1>
      </div>

      {/* Hero Image overlapping the text */}
      <div className="absolute left-0 top-[22%] sm:top-[26%] w-full h-[100%] z-10">
        <Image
          src="/herosectionimg.avif"
          alt="Modern House Architecture"
          fill
          priority
          className="object-cover object-top pointer-events-none mix-blend-darken"
          sizes="100vw"
        />
      </div>
      
      {/* Subtle gradient at the bottom to ensure white text is readable */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />

      {/* Content Overlays */}
      <div className="absolute bottom-12 sm:bottom-16 left-0 right-0 w-full px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 z-20">
        
        {/* Bottom Left Text */}
        <div className="max-w-[320px] sm:max-w-md text-white">
          <p className="text-base sm:text-lg font-medium leading-relaxed drop-shadow-md">
            Discover meticulously crafted homes and properties, blending contemporary aesthetics with sustainable living.
          </p>
        </div>

        {/* Bottom Right Info */}
        <div className="flex flex-col items-start sm:items-end text-white text-left sm:text-right">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight drop-shadow-md">
            Silverstone Residence
          </h3>
          <p className="text-sm sm:text-base text-gray-200 mt-1 font-medium drop-shadow-md">
            1234 Sunflower Lane
          </p>
        </div>
        
      </div>
    </section>
  );
}
