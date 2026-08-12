import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#090c1b] text-white overflow-hidden">
      
      {/* Top Info Row */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pt-16 pb-10 flex flex-col lg:flex-row justify-between items-stretch gap-14">
        
        {/* Left Side: Address at top, Nav at bottom */}
        <div className="flex flex-col justify-between gap-7">
          <div>
            <p className="text-base font-extrabold uppercase text-white leading-relaxed">
              2223 Calle De Alcalá Salamanca
              <br />
              Madrid, 28028
            </p>
            <p className="text-base font-extrabold uppercase text-white mt-4">
              (+34) 123-456-789
            </p>
          </div>
          <nav className="flex items-center gap-10">
            {["Home", "About Us", "Agents", "Projects"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-base font-extrabold uppercase text-white hover:text-white/60 transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Side: Get In Touch + Email at top, Socials at bottom */}
        <div className="flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-extrabold uppercase text-white">
              Get In Touch
            </span>
            <a
              href="mailto:marketing@maqsed.com"
              className="text-2xl md:text-3xl font-bold text-white leading-tight hover:text-white/60 transition-colors duration-300 tracking-tight"
            >
              marketing@maqsed.com
            </a>
          </div>
          <div className="flex items-center gap-10">
            {["Instagram", "Facebook", "LinkedIn", "YouTube"].map((social) => (
              <Link
                key={social}
                href="#"
                className="text-base font-extrabold uppercase text-white hover:text-white/60 transition-colors duration-300"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Giant Brand Name — full bleed, centered */}
      <div className="relative z-10 w-full overflow-hidden select-none pointer-events-none flex justify-center">
        <h2
          className="font-black leading-none tracking-tighter text-white whitespace-nowrap"
          style={{ fontSize: "clamp(80px, 23vw, 340px)" }}
        >
          Maqsed
        </h2>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20 pb-10 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm font-extrabold uppercase text-white">
          @2024 Maqsed. All Rights Reserved
        </p>
        <div className="flex items-center gap-8">
          {["Privacy Police", "Term Of Use", "Legal Disclaimer", "Cookie Policy"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-extrabold uppercase text-white hover:text-white/60 transition-colors duration-300"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

    </footer>
  );
}
